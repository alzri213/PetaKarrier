"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  ChevronRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  Globe2,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  Lock,
  Compass,
  Loader2,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils/formatCurrency";

export interface ProvinceMapItem {
  id: string;
  name: string;
  wilayah: string;
  avgUmr: number;
  minUmr: number;
  maxUmr: number;
  cityCount: number;
  topSector: string;
  path: string;
  centroid: [number, number];
}

const REGION_CATEGORIES = [
  "Semua",
  "Jawa",
  "Sumatera",
  "Kalimantan",
  "Sulawesi",
  "Nusa Tenggara",
  "Maluku",
  "Papua",
];

// Color palette by geographic island region
const REGION_COLORS: Record<string, { base: string; border: string; label: string }> = {
  Jawa: {
    base: "#0f2e24",
    border: "#195c47",
    label: "text-emerald-400",
  },
  Sumatera: {
    base: "#0e2438",
    border: "#1d476f",
    label: "text-sky-400",
  },
  Kalimantan: {
    base: "#241e12",
    border: "#544223",
    label: "text-amber-400",
  },
  Sulawesi: {
    base: "#1a1633",
    border: "#3a3070",
    label: "text-violet-400",
  },
  "Nusa Tenggara": {
    base: "#27162b",
    border: "#5c3365",
    label: "text-fuchsia-400",
  },
  Maluku: {
    base: "#112726",
    border: "#255c5a",
    label: "text-teal-400",
  },
  Papua: {
    base: "#16233b",
    border: "#2b4676",
    label: "text-blue-400",
  },
};

export default function InteractiveUMRMap() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const router = useRouter();

  const [hoveredProvince, setHoveredProvince] = useState<ProvinceMapItem | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceMapItem | null>(null);
  const [provinces, setProvinces] = useState<ProvinceMapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeRegion, setActiveRegion] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Ambil data peta 38 provinsi langsung dari database PostgreSQL
  useEffect(() => {
    let isMounted = true;
    async function loadProvincesFromDB() {
      try {
        const res = await fetch("/api/wilayah/peta");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.provinces)) {
            setProvinces(data.provinces);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data peta dari database:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProvincesFromDB();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter provinces based on region and search query
  const filteredProvinces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return provinces.filter((p) => {
      const matchRegion = activeRegion === "Semua" || p.wilayah === activeRegion;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.wilayah.toLowerCase().includes(q) ||
        p.topSector.toLowerCase().includes(q);
      return matchRegion && matchSearch;
    });
  }, [activeRegion, searchQuery, provinces]);

  // Set of matched IDs for fast lookup
  const matchedIds = useMemo(() => {
    return new Set(filteredProvinces.map((p) => p.id));
  }, [filteredProvinces]);

  // Zoom controls (zoom bebas hingga 30x agar provinsi kecil seperti DKI Jakarta, Bali, DIY sangat mudah disentuh)
  const MAX_ZOOM = 30;
  const MIN_ZOOM = 1;

  // Batas geser (clamp) dinamis agar gugusan pulau Indonesia tidak bisa terlempar keluar canvas
  const clampPan = (newX: number, newY: number, targetZoom: number) => {
    if (!containerRef.current) return { x: newX, y: newY };
    const w = containerRef.current.clientWidth || 800;
    const h = containerRef.current.clientHeight || 400;

    // Rasio viewBox SVG adalah 1000 : 380 (~2.63)
    const SVG_RATIO = 1000 / 380;
    const isWider = w / h > SVG_RATIO;
    const svgW = (isWider ? h * SVG_RATIO : w) * targetZoom;
    const svgH = (isWider ? h : w / SVG_RATIO) * targetZoom;

    // Buffer margin agar pulau terluar (Sabang, Merauke, Talaud, Rote) tetap dapat digeser ke tengah layar
    const bufferX = w * 0.12;
    const bufferY = h * 0.15;

    const maxX = Math.max(bufferX, (svgW - w) / 2 + bufferX);
    const maxY = Math.max(bufferY, (svgH - h) / 2 + bufferY);

    return {
      x: Math.min(Math.max(newX, -maxX), maxX),
      y: Math.min(Math.max(newY, -maxY), maxY),
    };
  };

  const handleZoomIn = () => {
    setZoom((z) => {
      const next = Math.min(Number((z * 1.5).toFixed(2)), MAX_ZOOM);
      setPan((prev) => clampPan(prev.x, prev.y, next));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(Number((z / 1.5).toFixed(2)), MIN_ZOOM);
      if (next <= 1.05) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      setPan((prev) => clampPan(prev.x, prev.y, next));
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartTimeRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    isDraggingRef.current = false;
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    if (!isPanning) return;
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    if (Math.hypot(rawX - pan.x, rawY - pan.y) > 6) {
      isDraggingRef.current = true;
    }
    const clamped = clampPan(rawX, rawY, zoom);
    // Sinkronkan drag start agar respon instan saat arah geser dibalik (tanpa dead-zone)
    dragStartRef.current = {
      x: e.clientX - clamped.x,
      y: e.clientY - clamped.y,
    };
    setPan(clamped);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (zoom <= 1.05) {
      setPan({ x: 0, y: 0 });
    }
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 60);
  };

  // Touch pan & pinch-to-zoom handlers for mobile screens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartTimeRef.current = Date.now();
      touchStartPosRef.current = { x: t.clientX, y: t.clientY };
      setIsPanning(true);
      isDraggingRef.current = false;
      dragStartRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y };
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      isDraggingRef.current = true;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const t = e.touches[0];
      const dx = t.clientX - touchStartPosRef.current.x;
      const dy = t.clientY - touchStartPosRef.current.y;
      if (Math.hypot(dx, dy) > 10) {
        isDraggingRef.current = true;
      }
      const rawX = t.clientX - dragStartRef.current.x;
      const rawY = t.clientY - dragStartRef.current.y;
      const clamped = clampPan(rawX, rawY, zoom);
      dragStartRef.current = {
        x: t.clientX - clamped.x,
        y: t.clientY - clamped.y,
      };
      setPan(clamped);
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / touchStartDistRef.current;
      const nextZoom = Math.min(
        Math.max(Number((touchStartZoomRef.current * scale).toFixed(2)), MIN_ZOOM),
        MAX_ZOOM
      );
      setZoom(nextZoom);
      setPan((prev) => (nextZoom <= 1.05 ? { x: 0, y: 0 } : clampPan(prev.x, prev.y, nextZoom)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsPanning(false);
      touchStartDistRef.current = null;
      if (zoom <= 1.05) {
        setPan({ x: 0, y: 0 });
      }
      const duration = Date.now() - touchStartTimeRef.current;
      if (duration < 250) {
        isDraggingRef.current = false;
      } else {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 80);
      }
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsPanning(true);
      dragStartRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y };
      touchStartDistRef.current = null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* ══════════════════════════════════════════════════════════════════
          TOP HEADER: TITLE, SUBTITLE & SEARCH INPUT
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-extrabold text-[#00df82]">
              <Compass className="h-3.5 w-3.5" />
              <span>Peta Vektor 38 Provinsi Nusantara</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Eksplorasi Parameter Wilayah & Potensi Usaha
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-normal">
            Batas wilayah resmi 38 provinsi di Indonesia. Arahkan kursor atau sentuh provinsi pada peta untuk melihat standar UMR resmi dan sektor bisnis unggulan.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-80 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Cari Provinsi / Wilayah
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Jawa Barat, Bali, Papua..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white"
            />
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          REGION QUICK FILTER TABS
      ══════════════════════════════════════════════════════════════════ */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {REGION_CATEGORIES.map((region) => {
          const isActive = activeRegion === region;
          return (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-[#00df82] text-slate-950 shadow-md shadow-emerald-500/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {region === "Semua" ? "Semua (38 Provinsi)" : region}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN VECTOR MAP CONTAINER
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 bg-slate-950 p-3.5 sm:p-6 shadow-2xl dark:border-slate-800/90 dark:bg-[#060a14] overflow-hidden">
        {/* Subtle Oceanic Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Status Banner */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-[#0c1424]/90 px-3.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
              <Globe2 className="h-3.5 w-3.5 text-[#00df82]" />
              <span>Data Kemnaker 2026</span>
            </span>

            {selectedProvince && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-extrabold text-[#00df82]">
                <Sparkles className="h-3 w-3" />
                <span>
                  {selectedProvince.name} • {formatRupiah(selectedProvince.avgUmr)}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Hover untuk nama provinsi • Klik untuk rincian insight
            </span>
            <span className="text-[11px] text-[#00df82] font-semibold inline sm:hidden">
              Geser peta • Ketuk untuk detail
            </span>
          </div>
        </div>

        {/* SVG Map Canvas Frame */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-full h-[280px] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden select-none cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          {/* ── TOOLTIP HOVER KECIL: HANYA MENAMPILKAN NAMA PROVINSI DI ATAS KURSOR ── */}
          {hoveredProvince && (
            <div
              className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-xl border border-emerald-500/50 bg-[#060a14]/95 px-3 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-2 select-none"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
              }}
            >
              <span className="h-2 w-2 rounded-full bg-[#00df82] animate-pulse" />
              <span className="text-xs font-black tracking-tight text-white">
                {hoveredProvince.name}
              </span>
              <span className="text-[10px] font-bold text-[#00df82] border-l border-slate-700 pl-2">
                {hoveredProvince.wilayah}
              </span>
            </div>
          )}

          <div
            className={`w-full h-full flex items-center justify-center ${
              isPanning ? "transition-none" : "transition-transform duration-150 ease-out"
            }`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            {isLoading ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-[#00df82]" />
                <span className="text-xs font-semibold">Memuat peta wilayah dari database...</span>
              </div>
            ) : (
              <svg
                viewBox="0 0 1000 380"
                className="w-full h-full max-h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
              >
                <defs>
                  {/* Glow filter for active/hovered province */}
                  <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00df82" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Render each of the 38 provinces as pure vector path directly from DB */}
                {provinces.map((prov) => {
                const isSelected = selectedProvince?.id === prov.id;
                const isHovered = hoveredProvince?.id === prov.id;
                const isMatched = matchedIds.has(prov.id);
                const regionStyle = REGION_COLORS[prov.wilayah] || {
                  base: "#0f172a",
                  border: "#334155",
                  label: "text-slate-300",
                };

                const isSmallProvince =
                  prov.name === "DKI Jakarta" ||
                  prov.name === "DI Yogyakarta" ||
                  prov.name === "Bali" ||
                  prov.name === "Kepulauan Riau" ||
                  prov.name === "Kepulauan Bangka Belitung" ||
                  prov.name === "Gorontalo";

                let fillColor = regionStyle.base;
                let strokeColor = regionStyle.border;
                let strokeWidth = isSmallProvince ? 1.4 : 0.8;
                let filter = "none";
                let opacity = 1;

                if (isSelected) {
                  fillColor = "#00df82";
                  strokeColor = "#ffffff";
                  strokeWidth = isSmallProvince ? 2.8 : 2;
                  filter = "url(#emerald-glow)";
                } else if (isHovered) {
                  fillColor = "#00df82";
                  strokeColor = "#ffffff";
                  strokeWidth = isSmallProvince ? 2.4 : 1.6;
                  filter = "url(#emerald-glow)";
                } else if (!isMatched) {
                  opacity = 0.25;
                }

                return (
                  <path
                    key={prov.id}
                    d={prov.path}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    filter={filter}
                    pointerEvents="all"
                    onMouseEnter={(e) => {
                      setHoveredProvince(prov);
                      if (containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        setMousePos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        setMousePos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDraggingRef.current) return;
                      setSelectedProvince((prev) => (prev?.id === prov.id ? null : prov));
                    }}
                    className="transition-all duration-150 cursor-pointer ease-out"
                  >
                    <title>{`${prov.name} (${prov.wilayah}) - UMR: ${formatRupiah(prov.avgUmr)}`}</title>
                  </path>
                );
              })}
            </svg>
          )}
          </div>

          {/* ── CARD DETAIL DESKTOP (HANYA MUNCUL DI DESKTOP: sm:block) ── */}
          <AnimatePresence>
            {selectedProvince && (
              <motion.div
                key={`desktop-${selectedProvince.id}`}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:block absolute bottom-4 left-4 z-30 max-w-sm rounded-2xl border border-slate-800 bg-[#0c1424]/95 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#0b2b24] border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-[#00df82]">
                        {selectedProvince.wilayah}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedProvince.cityCount} Daerah Terdata
                      </span>
                    </div>

                    <h4 className="mt-1 text-base font-extrabold text-white tracking-tight">
                      {selectedProvince.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Rata-Rata UMR
                      </span>
                      <span className="text-sm font-black text-[#00df82] block">
                        {formatRupiah(selectedProvince.avgUmr)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProvince(null);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:border-slate-500 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                      title="Tutup Insight (X)"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 rounded-xl border border-slate-800 bg-[#070b14] px-3 py-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Sektor Unggulan Wilayah
                  </span>
                  <p className="mt-0.5 font-bold text-slate-200 truncate">
                    {selectedProvince.topSector}
                  </p>
                </div>

                <Link
                  href={`/perbandingan?provinsi=${encodeURIComponent(selectedProvince.name)}`}
                  className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#00df82] px-3.5 py-2 text-xs font-black text-slate-950 shadow-md transition hover:bg-[#00c975] active:scale-[0.98]"
                >
                  <span>Bandingkan UMR {selectedProvince.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Controls (+, -, Reset) */}
          <div className="absolute top-3 right-3 z-30 flex flex-col rounded-xl border border-slate-800 bg-[#0c1424]/90 shadow-xl backdrop-blur-md overflow-hidden">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="Perbesar Peta (Zoom In)"
            >
              <Plus className="h-4 w-4" />
            </button>

            {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
              <>
                <div className="h-px bg-slate-800" />
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-2 text-[#00df82] hover:bg-slate-800 transition cursor-pointer"
                  title="Reset Posisi Peta (100%)"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            )}

            <div className="h-px bg-slate-800" />
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="Perkecil Peta (Zoom Out)"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── CARD DETAIL MOBILE: SEPENUHNYA DI LUAR CONTAINER PETA ── */}
      <AnimatePresence>
        {selectedProvince && (
          <motion.div
            key={`mobile-${selectedProvince.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-6 block sm:hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-[#0c1424]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-700 dark:bg-[#0b2b24] dark:border-emerald-500/30 dark:text-[#00df82]">
                    {selectedProvince.wilayah}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {selectedProvince.cityCount} Daerah Terdata
                  </span>
                </div>

                <h4 className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {selectedProvince.name}
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Rata-Rata UMR
                  </span>
                  <span className="text-base font-black text-emerald-600 dark:text-[#00df82] block">
                    {formatRupiah(selectedProvince.avgUmr)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProvince(null);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-white transition cursor-pointer"
                  title="Tutup Insight (X)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-xs dark:border-slate-800 dark:bg-[#070b14]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Sektor Unggulan Wilayah
              </span>
              <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                {selectedProvince.topSector}
              </p>
            </div>

            <Link
              href={`/perbandingan?provinsi=${encodeURIComponent(selectedProvince.name)}`}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#00df82] px-4 py-3 text-xs font-black text-slate-950 shadow-md transition hover:bg-[#00c975] active:scale-[0.98]"
            >
              <span>Bandingkan UMR {selectedProvince.name}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM 3 SUMMARY METRIC CARDS (INTERACTIVE CLICK FOCUS)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: UMR TERTINGGI (DKI Jakarta) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            const jkt = provinces.find((p) => p.name === "DKI Jakarta");
            if (jkt) setSelectedProvince(jkt);
          }}
          className={`cursor-pointer rounded-[2rem] border-2 bg-white p-6 sm:p-7 shadow-xl transition-all duration-300 flex flex-col justify-between select-none ${
            selectedProvince?.name === "DKI Jakarta"
              ? "border-[#00df82] ring-4 ring-emerald-400/30 shadow-emerald-500/25 dark:bg-[#051d14]"
              : "border-slate-200 hover:border-emerald-400 hover:shadow-emerald-500/20 dark:border-slate-800 dark:bg-[#0a0f1d] dark:hover:border-emerald-400"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-[#00df82]">
                UMR TERTINGGI
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-300 px-3 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-[#051d14] dark:border-[#00df82]/40 dark:text-[#00df82]">
                DKI Jakarta
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Rp 5.067.381
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rata-rata pendapatan minimum bulanan pekerja formal.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-[#00df82]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Data resmi Kemenaker 2026</span>
            </div>
            <span className="text-[10px] font-bold opacity-75 group-hover:opacity-100">
              Lihat di peta →
            </span>
          </div>
        </motion.div>

        {/* Card 2: UMR PALING EFISIEN (DI Yogyakarta) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            const yogya = provinces.find((p) => p.name === "DI Yogyakarta");
            if (yogya) setSelectedProvince(yogya);
          }}
          className={`cursor-pointer rounded-[2rem] border-2 bg-white p-6 sm:p-7 shadow-xl transition-all duration-300 flex flex-col justify-between select-none ${
            selectedProvince?.name === "DI Yogyakarta"
              ? "border-[#f59e0b] ring-4 ring-amber-400/30 shadow-amber-500/25 dark:bg-[#1e1706]"
              : "border-slate-200 hover:border-amber-400 hover:shadow-amber-500/20 dark:border-slate-800 dark:bg-[#0a0f1d] dark:hover:border-amber-400"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-[#f59e0b]">
                UMR PALING EFISIEN
              </span>
              <span className="rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-[#1e1706] dark:border-[#f59e0b]/40 dark:text-[#f59e0b]">
                DI Yogyakarta
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Rp 2.159.000
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Biaya operasional modal awal terjangkau bagi perintis usaha.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-[#f59e0b]">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Optimal inkubasi bisnis kreatif</span>
            </div>
            <span className="text-[10px] font-bold opacity-75 group-hover:opacity-100">
              Lihat di peta →
            </span>
          </div>
        </motion.div>

        {/* Card 3: HUB EKONOMI TIMUR (Sulawesi Selatan) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            const sulsel = provinces.find((p) => p.name === "Sulawesi Selatan");
            if (sulsel) setSelectedProvince(sulsel);
          }}
          className={`cursor-pointer rounded-[2rem] border-2 bg-white p-6 sm:p-7 shadow-xl transition-all duration-300 flex flex-col justify-between select-none ${
            selectedProvince?.name === "Sulawesi Selatan"
              ? "border-[#38bdf8] ring-4 ring-sky-400/30 shadow-sky-500/25 dark:bg-[#081a2e]"
              : "border-slate-200 hover:border-sky-400 hover:shadow-sky-500/20 dark:border-slate-800 dark:bg-[#0a0f1d] dark:hover:border-sky-400"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-[#38bdf8]">
                HUB EKONOMI TIMUR
              </span>
              <span className="rounded-full bg-sky-50 border border-sky-300 px-3 py-0.5 text-[11px] font-bold text-sky-700 dark:bg-[#081a2e] dark:border-[#38bdf8]/40 dark:text-[#38bdf8]">
                Sulawesi Selatan
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Rp 3.650.000
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pusat logistik dan pertumbuhan UMKM maritim Indonesia Timur.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-sky-600 dark:text-[#38bdf8]">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Konektivitas maritim strategis</span>
            </div>
            <span className="text-[10px] font-bold opacity-75 group-hover:opacity-100">
              Lihat di peta →
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
