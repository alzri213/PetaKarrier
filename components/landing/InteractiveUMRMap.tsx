"use client";

import { useState, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  MapPin,
  ChevronRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  Navigation,
  Globe2,
  X,
  RotateCcw,
  Hand,
  Lock,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils/formatCurrency";

interface KotaPin {
  id: string;
  nama: string;
  provinsi: string;
  umr: number;
  umkmAktif: string;
  topUsaha: string;
  rasioUMR: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

const KOTA_PINS: KotaPin[] = [
  // ── JAWA & BALI ──
  {
    id: "jakarta",
    nama: "DKI Jakarta",
    provinsi: "DKI Jakarta",
    umr: 5067381,
    umkmAktif: "4.200+",
    topUsaha: "Kedai Kopi & Jasa Kreatif",
    rasioUMR: "Tertinggi Nasional",
    x: 29.5,
    y: 62.5,
  },
  {
    id: "bandung",
    nama: "Bandung",
    provinsi: "Jawa Barat",
    umr: 4209389,
    umkmAktif: "2.850+",
    topUsaha: "Distro & Kuliner Kekinian",
    rasioUMR: "1.25x Rata-rata",
    x: 30.8,
    y: 66.5,
  },
  {
    id: "semarang",
    nama: "Semarang",
    provinsi: "Jawa Tengah",
    umr: 3527000,
    umkmAktif: "2.100+",
    topUsaha: "Manufaktur & Olahan Pangan",
    rasioUMR: "1.10x Rata-rata",
    x: 35.5,
    y: 66.0,
  },
  {
    id: "yogyakarta",
    nama: "Yogyakarta",
    provinsi: "DI Yogyakarta",
    umr: 2159000,
    umkmAktif: "2.400+",
    topUsaha: "Studio Desain & Kerajinan",
    rasioUMR: "Paling Efisien",
    x: 35.0,
    y: 70.0,
  },
  {
    id: "surabaya",
    nama: "Surabaya",
    provinsi: "Jawa Timur",
    umr: 4725479,
    umkmAktif: "3.100+",
    topUsaha: "Katering & Logistik Usaha",
    rasioUMR: "1.45x Rata-rata",
    x: 40.5,
    y: 67.0,
  },
  {
    id: "denpasar",
    nama: "Denpasar",
    provinsi: "Bali",
    umr: 3200000,
    umkmAktif: "1.600+",
    topUsaha: "Hospitality & Souvenir",
    rasioUMR: "Pusat Wisata Global",
    x: 45.0,
    y: 71.5,
  },
  {
    id: "mataram",
    nama: "Mataram",
    provinsi: "Nusa Tenggara Barat",
    umr: 2688000,
    umkmAktif: "1.200+",
    topUsaha: "Pariwisata & Agribisnis",
    rasioUMR: "Potensi Berkembang",
    x: 48.0,
    y: 72.0,
  },

  // ── SUMATERA ──
  {
    id: "medan",
    nama: "Medan",
    provinsi: "Sumatera Utara",
    umr: 3769000,
    umkmAktif: "1.950+",
    topUsaha: "Olahan Makanan & Perdagangan",
    rasioUMR: "Sentra Ekonomi Barat",
    x: 13.0,
    y: 24.5,
  },
  {
    id: "aceh",
    nama: "Banda Aceh",
    provinsi: "Aceh",
    umr: 3932552,
    umkmAktif: "980+",
    topUsaha: "Kopi Gayo & Jasa Niaga",
    rasioUMR: "1.18x Rata-rata",
    x: 7.5,
    y: 14.5,
  },
  {
    id: "padang",
    nama: "Padang",
    provinsi: "Sumatera Barat",
    umr: 3254580,
    umkmAktif: "1.400+",
    topUsaha: "Rumah Makan & Komoditas",
    rasioUMR: "1.02x Rata-rata",
    x: 14.5,
    y: 42.0,
  },
  {
    id: "pekanbaru",
    nama: "Pekanbaru",
    provinsi: "Riau",
    umr: 3788746,
    umkmAktif: "1.750+",
    topUsaha: "Retail & Jasa Pendukung Sawit",
    rasioUMR: "1.15x Rata-rata",
    x: 18.0,
    y: 35.0,
  },
  {
    id: "palembang",
    nama: "Palembang",
    provinsi: "Sumatera Selatan",
    umr: 3942963,
    umkmAktif: "1.850+",
    topUsaha: "Kuliner Pempek & Tekstil Songket",
    rasioUMR: "1.20x Rata-rata",
    x: 23.5,
    y: 53.0,
  },

  // ── KALIMANTAN ──
  {
    id: "pontianak",
    nama: "Pontianak",
    provinsi: "Kalimantan Barat",
    umr: 3088000,
    umkmAktif: "1.300+",
    topUsaha: "Olahan Lidah Buaya & Perdagangan",
    rasioUMR: "0.96x Rata-rata",
    x: 32.5,
    y: 39.0,
  },
  {
    id: "balikpapan",
    nama: "Balikpapan",
    provinsi: "Kalimantan Timur",
    umr: 3758000,
    umkmAktif: "2.100+",
    topUsaha: "Jasa Logistik & Mitra IKN",
    rasioUMR: "Koridor IKN Nusantara",
    x: 43.5,
    y: 42.5,
  },
  {
    id: "banjarmasin",
    nama: "Banjarmasin",
    provinsi: "Kalimantan Selatan",
    umr: 3682000,
    umkmAktif: "1.450+",
    topUsaha: "Perdagangan Sungai & Kerajinan",
    rasioUMR: "1.12x Rata-rata",
    x: 41.0,
    y: 51.5,
  },

  // ── SULAWESI & MALUKU ──
  {
    id: "makassar",
    nama: "Makassar",
    provinsi: "Sulawesi Selatan",
    umr: 3650000,
    umkmAktif: "2.300+",
    topUsaha: "Logistik Maritim & Boga Bahari",
    rasioUMR: "Hub Indonesia Timur",
    x: 54.0,
    y: 57.5,
  },
  {
    id: "manado",
    nama: "Manado",
    provinsi: "Sulawesi Utara",
    umr: 4002630,
    umkmAktif: "1.250+",
    topUsaha: "Wisata Bahari & F&B Lokal",
    rasioUMR: "1.24x Rata-rata",
    x: 57.5,
    y: 28.0,
  },
  {
    id: "ambon",
    nama: "Ambon",
    provinsi: "Maluku",
    umr: 3278000,
    umkmAktif: "850+",
    topUsaha: "Perikanan & Rempah-Rempah",
    rasioUMR: "1.01x Rata-rata",
    x: 69.5,
    y: 52.0,
  },

  // ── PAPUA ──
  {
    id: "jayapura",
    nama: "Jayapura",
    provinsi: "Papua",
    umr: 4436283,
    umkmAktif: "950+",
    topUsaha: "Ekraf Papua & Jasa Perdagangan",
    rasioUMR: "1.38x Rata-rata",
    x: 91.0,
    y: 52.0,
  },
];

export default function InteractiveUMRMap() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKota, setSelectedKota] = useState<KotaPin | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const mapControls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute drag constraints dynamically from container size
  const getDragConstraints = (z: number) => {
    const el = containerRef.current;
    if (!el || z <= 1) return { left: 0, right: 0, top: 0, bottom: 0 };
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const extra = z - 1;
    return {
      left:   -(w * extra * 0.5),
      right:   (w * extra * 0.5),
      top:    -(h * extra * 0.5),
      bottom:  (h * extra * 0.5),
    };
  };

  const handleResetView = () => {
    setZoom(1);
    mapControls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 28 } });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2.0));
    mapControls.start({ scale: Math.min(zoom + 0.25, 2.0), transition: { type: "spring", stiffness: 300, damping: 25 } });
  };

  const handleZoomOut = () => {
    const next = Math.max(zoom - 0.25, 1.0);
    setZoom(next);
    if (next <= 1) {
      mapControls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 28 } });
    } else {
      mapControls.start({ scale: next, transition: { type: "spring", stiffness: 300, damping: 25 } });
    }
  };

  const filteredPins = useMemo(() => {
    if (!searchQuery.trim()) return KOTA_PINS;
    const q = searchQuery.toLowerCase();
    return KOTA_PINS.filter(
      (k) =>
        k.nama.toLowerCase().includes(q) ||
        k.provinsi.toLowerCase().includes(q) ||
        k.topUsaha.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* ══════════════════════════════════════════════════════════════════
          TOP HEADER: BADGE, TITLE, SUBTITLE & SEARCH INPUT
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="space-y-2 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Eksplorasi Parameter Wilayah & Potensi Usaha
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-normal">
            Bandingkan standar upah minimum resmi dan potensi sektor unggulan di setiap titik kota nusantara. {isLoggedIn ? "Klik pin wilayah pada peta untuk menampilkan rincian insight." : "Masuk ke akun Anda untuk membuka seluruh data pin interaktif."}
          </p>
        </div>

        {/* Right Search Input */}
        <div className="w-full lg:w-72 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Cari Kota / Provinsi
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isLoggedIn ? "Cari Jakarta, Surabaya, Bali..." : "🔒 Masuk untuk mencari..."}
              disabled={!isLoggedIn}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00df82] disabled:opacity-60 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900/90 dark:text-white"
            />
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN SATELLITE MAP CONTAINER (BOUNDED & DRAGGABLE/PANNABLE)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-[2.5rem] border border-slate-200 bg-slate-950 p-4 sm:p-6 shadow-2xl dark:border-slate-800/90 overflow-hidden min-h-[540px]">
        {/* Top Floating Badge */}
        <div className="absolute top-6 right-8 z-30 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/90 px-4 py-1.5 text-xs font-extrabold text-white shadow-lg backdrop-blur-md">
            <Globe2 className="h-3.5 w-3.5 text-[#00df82]" />
            <span>Peta Nusantara • Data Resmi 2026</span>
          </span>
        </div>

        {/* Instruction Badge */}
        <div className="absolute top-6 left-8 z-30 hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900/80 px-3.5 py-1.5 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
          {!isLoggedIn ? (
            <>
              <Lock className="h-3.5 w-3.5 text-[#00df82]" />
              <span>Peta Satelit • Masuk untuk membuka data UMR & pin lokasi</span>
            </>
          ) : zoom > 1 ? (
            <>
              <Hand className="h-3.5 w-3.5 text-[#00df82]" />
              <span>Geser peta untuk navigasi • Klik pin untuk insight</span>
            </>
          ) : (
            <>
              <Navigation className="h-3 w-3 text-[#00df82] animate-bounce" />
              <span>Klik pin kota pada peta untuk melihat insight</span>
            </>
          )}
        </div>

        {/* Interactive Map Visual Area (Strictly Bounded Frame) */}
        <div ref={containerRef} className="relative w-full h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950">
          {/* Framer Motion Draggable & Zoomable Canvas */}
          <motion.div
            drag={zoom > 1}
            dragConstraints={getDragConstraints(zoom)}
            dragElastic={0.05}
            animate={mapControls}
            initial={{ x: 0, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute inset-0 origin-center select-none ${
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            }`}
          >
            {/* Real Satellite Map Image */}
            <Image
              src="/indonesia-map-satellite.jpg"
              alt="Peta Satelit Indonesia Interaktif PetaKarier"
              fill
              sizes="100vw"
              unoptimized
              className="object-cover object-center brightness-95 contrast-105 pointer-events-none"
              priority
            />

            {/* Subtle Gradient Vignette for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

            {/* ── INTERACTIVE CITY PIN MARKERS (ONLY WHEN LOGGED IN) ── */}
            {isLoggedIn &&
              filteredPins.map((k) => {
                const isSelected = selectedKota?.id === k.id;
                return (
                  <div
                    key={k.id}
                    style={{ top: `${k.y}%`, left: `${k.x}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKota(k);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group select-none"
                  >
                    {/* Radar Pulse Rings */}
                    <span
                      className={`absolute -inset-3 rounded-full animate-ping opacity-75 ${
                        isSelected ? "bg-[#00df82]" : "bg-emerald-400/40"
                      }`}
                    />

                    {/* Pin Dot / Icon Marker */}
                    <motion.div
                      animate={{ scale: isSelected ? 1.35 : 1 }}
                      whileHover={{ scale: 1.25 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-2xl transition-all ${
                        isSelected
                          ? "bg-[#00df82] text-slate-950 border-white ring-4 ring-emerald-400/60 shadow-emerald-500/50"
                          : "bg-slate-950/90 text-[#00df82] border-emerald-400/80 hover:bg-emerald-500 hover:text-slate-950"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                    </motion.div>

                    {/* City Label Badge */}
                    <span
                      className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold transition-all shadow-xl backdrop-blur-md ${
                        isSelected
                          ? "bg-[#00df82] text-slate-950 border border-white"
                          : "bg-slate-950/90 text-slate-100 border border-slate-700/80 group-hover:bg-emerald-500 group-hover:text-slate-950"
                      }`}
                    >
                      {k.nama}
                    </span>
                  </div>
                );
              })}
          </motion.div>


          {/* ── FLOATING GLASS INSIGHT CARD (ONLY APPEARS AFTER CLICK AND WHEN LOGGED IN) ── */}
          <AnimatePresence mode="wait">
            {isLoggedIn && selectedKota && (
              <motion.div
                key={selectedKota.id}
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.92 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-40 rounded-2xl border-2 border-emerald-400/80 bg-slate-950/95 p-5 backdrop-blur-2xl text-white shadow-2xl shadow-emerald-500/15"
              >
                {/* Header with Close (X) Button */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-[#00df82] border border-emerald-500/40 shadow-sm">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-base font-extrabold text-white leading-tight">
                        {selectedKota.nama}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        {selectedKota.provinsi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300">
                      2026
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedKota(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                      title="Tutup Insight"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs">
                  <div className="rounded-xl border border-slate-800 bg-white/5 p-2.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Standar UMR Resmi
                    </span>
                    <p className="text-sm font-extrabold text-[#00df82] mt-0.5">
                      {formatRupiah(selectedKota.umr)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-white/5 p-2.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Potensi UMKM Aktif
                    </span>
                    <p className="text-sm font-extrabold text-white mt-0.5">
                      {selectedKota.umkmAktif} Unit
                    </p>
                  </div>
                </div>

                {/* Sektor Favorit */}
                <div className="mt-3 rounded-xl border border-slate-800/80 bg-white/5 px-3 py-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Sektor Usaha Favorit
                  </span>
                  <span className="font-extrabold text-white block mt-0.5">
                    {selectedKota.topUsaha}
                  </span>
                </div>

                {/* Action Link */}
                <Link
                  href={`/kalkulator?kota=${selectedKota.id}`}
                  className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#00df82] px-4 py-2.5 text-xs font-black text-slate-950 shadow-md transition hover:bg-[#00c975] hover:scale-[1.02] active:scale-95"
                >
                  <span>Simulasi Modal di {selectedKota.nama}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zoom & Pan Controls */}
          <div className="absolute bottom-4 right-4 z-30 flex flex-col rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              title="Perbesar Peta (Zoom In)"
            >
              <Plus className="h-4 w-4" />
            </button>

            {zoom > 1 && (
              <>
                <div className="h-px bg-slate-800" />
                <button
                  type="button"
                  onClick={handleResetView}
                  className="p-2.5 text-emerald-400 hover:bg-slate-800 transition"
                  title="Reset Tampilan (100%)"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            )}

            <div className="h-px bg-slate-800" />
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              title="Perkecil Peta (Zoom Out)"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM 3 SUMMARY METRIC CARDS (INTERACTIVE HOVER & CLICK TO FOCUS MAP)
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
            if (!isLoggedIn) {
              router.push("/login");
              return;
            }
            const jkt = KOTA_PINS.find((k) => k.id === "jakarta");
            if (jkt) setSelectedKota(jkt);
          }}
          className={`cursor-pointer rounded-[2rem] border-2 bg-white p-6 sm:p-7 shadow-xl transition-all duration-300 flex flex-col justify-between select-none ${
            selectedKota?.id === "jakarta"
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
            <span className="text-[10px] font-bold opacity-75 group-hover:opacity-100">{isLoggedIn ? "Klik lihat peta →" : "🔒 Masuk →"}</span>
          </div>
        </motion.div>

        {/* Card 2: UMR PALING EFISIEN (Yogyakarta) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            if (!isLoggedIn) {
              router.push("/login");
              return;
            }
            const yogya = KOTA_PINS.find((k) => k.id === "yogyakarta");
            if (yogya) setSelectedKota(yogya);
          }}
          className={`cursor-pointer rounded-[2rem] border-2 bg-white p-6 sm:p-7 shadow-xl transition-all duration-300 flex flex-col justify-between select-none ${
            selectedKota?.id === "yogyakarta"
              ? "border-[#f59e0b] ring-4 ring-amber-400/30 shadow-amber-500/25 dark:bg-[#1e1706]"
              : "border-slate-200 hover:border-amber-400 hover:shadow-amber-500/20 dark:border-slate-800 dark:bg-[#0a0f1d] dark:hover:border-amber-400"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f59e0b]">
                UMR PALING EFISIEN
              </span>
              <span className="rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/40 dark:border-amber-500/40 dark:text-amber-400">
                Yogyakarta
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Rp 2.159.000
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Biaya operasional modal awal terjangkau bagi perintis usaha.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Optimal inkubasi bisnis kreatif</span>
            </div>
            <span className="text-[10px] font-bold opacity-75">{isLoggedIn ? "Klik lihat peta →" : "🔒 Masuk →"}</span>
          </div>
        </motion.div>

        {/* Card 3: SENTRA EKONOMI TIMUR (Makassar) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            if (!isLoggedIn) {
              router.push("/login");
              return;
            }
            const mks = KOTA_PINS.find((k) => k.id === "makassar");
            if (mks) setSelectedKota(mks);
          }}
          className={`cursor-pointer rounded-[2rem] border-2 bg-white p-6 sm:p-7 shadow-xl transition-all duration-300 flex flex-col justify-between select-none ${
            selectedKota?.id === "makassar"
              ? "border-[#00df82] ring-4 ring-emerald-400/30 shadow-emerald-500/25 dark:bg-[#051d14]"
              : "border-slate-200 hover:border-emerald-400 hover:shadow-emerald-500/20 dark:border-slate-800 dark:bg-[#0a0f1d] dark:hover:border-emerald-400"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                HUB EKONOMI TIMUR
              </span>
              <span className="rounded-full bg-slate-100 border border-slate-300 px-3 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                Makassar
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Rp 3.650.000
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pusat logistik dan pertumbuhan UMKM maritim Indonesia Timur.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Konektivitas maritim strategis</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-[#00df82] opacity-75">{isLoggedIn ? "Klik lihat peta →" : "🔒 Masuk →"}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
