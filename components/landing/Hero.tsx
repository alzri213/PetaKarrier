"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  TrendingUp,
  LineChart,
  Scale,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Coins,
  ChevronRight,
  Zap,
  BarChart3,
  Award,
  BookOpen,
  Globe2,
  Navigation,
  Eye,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils/formatCurrency";

const KOTA_MAP = [
  {
    id: "jakarta",
    nama: "DKI Jakarta",
    provinsi: "DKI Jakarta",
    umr: 5067381,
    umkmAktif: "4.200+",
    topUsaha: "Kedai Kopi & Jasa Kreatif",
    x: 28, // % from left
    y: 65, // % from top
  },
  {
    id: "bandung",
    nama: "Bandung",
    provinsi: "Jawa Barat",
    umr: 4209389,
    umkmAktif: "2.850+",
    topUsaha: "Distro & Kuliner Kekinian",
    x: 32,
    y: 69,
  },
  {
    id: "surabaya",
    nama: "Surabaya",
    provinsi: "Jawa Timur",
    umr: 4725479,
    umkmAktif: "3.100+",
    topUsaha: "Katering & Logistik Usaha",
    x: 41,
    y: 71,
  },
  {
    id: "yogyakarta",
    nama: "Yogyakarta",
    provinsi: "DI Yogyakarta",
    umr: 2159000,
    umkmAktif: "2.400+",
    topUsaha: "Studio Desain & Kerajinan",
    x: 35,
    y: 73,
  },
  {
    id: "medan",
    nama: "Medan",
    provinsi: "Sumatera Utara",
    umr: 3769000,
    umkmAktif: "1.950+",
    topUsaha: "Olahan Makanan & Perdagangan",
    x: 13,
    y: 26,
  },
  {
    id: "makassar",
    nama: "Makassar",
    provinsi: "Sulawesi Selatan",
    umr: 3650000,
    umkmAktif: "1.700+",
    topUsaha: "Jasa Boga & Kuliner Lokal",
    x: 58,
    y: 57,
  },
  {
    id: "bali",
    nama: "Denpasar",
    provinsi: "Bali",
    umr: 3200000,
    umkmAktif: "1.600+",
    topUsaha: "Souvenir & Hospitality",
    x: 46,
    y: 74,
  },
];

const SIMULASI_USAHA = [
  {
    id: "kuliner",
    nama: "Kedai Kopi & Toast",
    kategori: "Kuliner Kekinian",
    emoji: "☕",
    modal: 18500000,
    labaBulan: 6500000,
    bep: "4,5 Bulan",
    umr: "Rp 4.209.389 (Bandung)",
    skor: 94,
    serapan: "3 Orang Pemuda",
  },
  {
    id: "katering",
    nama: "Katering Nasi Box Rumahan",
    kategori: "Jasa Boga",
    emoji: "🍱",
    modal: 8500000,
    labaBulan: 4200000,
    bep: "3,8 Bulan",
    umr: "Rp 3.527.000 (Semarang)",
    skor: 91,
    serapan: "2–3 Orang",
  },
  {
    id: "desain",
    nama: "Studio Desain & Printing",
    kategori: "Kreatif & Digital",
    emoji: "🎨",
    modal: 11000000,
    labaBulan: 6800000,
    bep: "3,2 Bulan",
    umr: "Rp 2.159.000 (Yogyakarta)",
    skor: 96,
    serapan: "2 Orang",
  },
];

export default function Hero() {
  const [selectedSim, setSelectedSim] = useState(SIMULASI_USAHA[0]);
  const [hoveredKota, setHoveredKota] = useState<(typeof KOTA_MAP)[0] | null>(KOTA_MAP[0]);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section
      onMouseEnter={() => setIsHeroHovered(true)}
      onMouseLeave={() => setIsHeroHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative isolate pt-28 pb-20 overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-white transition-colors duration-700"
    >
      {/* Smooth White Gradient & Blur Fade Overlay at Top & Bottom of Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent via-white/80 to-white backdrop-blur-[1px] z-10" />

      {/* ══════════════════════════════════════════════════════════════════
          DYNAMIC HOVER REVEAL: REAL SATELLITE MAP OF INDONESIA BACKGROUND
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-all duration-1000 ease-out ${
          isHeroHovered ? "opacity-95 scale-100" : "opacity-0 scale-105"
        }`}
      >
        <Image
          src="/indonesia-real-map.jpg"
          alt="Foto Asli Peta Indonesia PetaKarier"
          fill
          className="object-cover brightness-95 contrast-105"
          priority
        />
        {/* Dark Spotlight Gradient Overlay for readability of white text */}
        <div
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, rgba(15,23,42,0.65) 0%, rgba(2,6,23,0.92) 100%)`,
          }}
        />
      </div>

      {/* Default Subtle Background Glow Blobs (when not hovered) */}
      <div
        className={`pointer-events-none absolute left-1/2 top-10 -z-20 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-[140px] transition-opacity duration-700 ${
          isHeroHovered ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        {/* ── Top Pill Badge ── */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2.5 rounded-full border-2 px-5 py-2 shadow-md backdrop-blur-md transition-all duration-500 ${
              isHeroHovered
                ? "border-emerald-400/50 bg-slate-900/90 text-white shadow-emerald-500/20"
                : "border-emerald-200 bg-white/90 text-slate-800"
            }`}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-extrabold">
              Platform Akselerator Wirausaha Muda & UMKM Indonesia
            </span>
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white border border-emerald-300">
              {isHeroHovered ? "🗺️ Peta Riil Aktif" : "SDG 8 Ready"}
            </span>
          </motion.div>
        </div>

        {/* ── Hero Main Headline ── */}
        <div className="mt-8 text-center max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] transition-colors duration-500 ${
              isHeroHovered ? "text-white drop-shadow-md" : "text-slate-900"
            }`}
          >
            Akselerasi Karier Wirausahamu dengan Validasi Data Riil Bersama{" "}
            <span className="inline-block rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-500 px-5 py-1.5 text-white shadow-xl shadow-emerald-500/40 border-2 border-white/40 align-middle">
              PetaKarier
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal transition-colors duration-500 ${
              isHeroHovered ? "text-slate-200" : "text-slate-600"
            }`}
          >
            Petakan peluang usaha cerdas, hitung simulasi modal berbasis UMR 18 kota, dan terbitkan dokumen rencana bisnis otomatis yang akuntabel untuk KUR & investor.
          </motion.p>

          {/* Hover Status Trigger Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold transition-all duration-500">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 border transition-all ${
              isHeroHovered
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              <Eye className="h-3.5 w-3.5 animate-pulse" />
              <span>{isHeroHovered ? "✨ Peta Asli Indonesia Muncul (Arahkan Kursor)" : "💡 Dekatkan kursor mouse untuk memunculkan Foto Peta Asli Indonesia"}</span>
            </span>
          </div>

          {/* ── Dual CTA Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/analisis"
              className="btn-shine group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 border-2 border-white/30"
            >
              <Sparkles className="h-5 w-5 text-emerald-100" />
              <span>Mulai Analisis Potensi Usaha</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/kalkulator"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border-2 px-8 py-4 text-base font-bold shadow-md transition-all duration-300 ${
                isHeroHovered
                  ? "border-emerald-400/60 bg-slate-900/80 text-white hover:bg-emerald-600 hover:border-emerald-400"
                  : "border-slate-300 bg-white text-slate-800 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <LineChart className="h-5 w-5 text-emerald-400" />
              <span>Kalkulator Modal & UMR</span>
            </Link>
          </motion.div>

          {/* ── Trust Indicators Bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs sm:text-sm font-semibold transition-colors duration-500 ${
              isHeroHovered ? "text-slate-300" : "text-slate-600"
            }`}
          >
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Data UMR 18 Kota 2026
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Proyeksi BEP 12 Bulan
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Standar Matriks 4 Bappenas
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PETA INTERAKTIF INDONESIA MAP EXPLORER SHOWCASE
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className={`mt-14 relative mx-auto max-w-6xl rounded-[2.5rem] border-2 shadow-2xl overflow-hidden p-6 sm:p-8 transition-all duration-500 ${
            isHeroHovered
              ? "border-emerald-400/50 bg-slate-950/90 text-white shadow-emerald-500/20 backdrop-blur-xl"
              : "border-emerald-200 bg-white text-slate-900 shadow-slate-300/60"
          }`}
        >
          {/* Header Map Section */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-5 transition-colors duration-500 ${
            isHeroHovered ? "border-slate-800" : "border-slate-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 border border-white/30">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  Peta Interaktif UMR & Ekosistem UMKM
                </span>
                <h3 className={`text-base sm:text-lg font-extrabold leading-snug transition-colors duration-500 ${
                  isHeroHovered ? "text-white" : "text-slate-900"
                }`}>
                  Eksplorasi Parameter Wilayah Indonesia
                </h3>
              </div>
            </div>
            <div className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
              isHeroHovered
                ? "bg-slate-900 text-emerald-300 border-slate-700"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}>
              <Navigation className="h-3.5 w-3.5 text-emerald-400 animate-bounce" />
              <span>Sentuh / arahkan kursor ke titik kota pada peta</span>
            </div>
          </div>

          {/* Interactive Map Visual Container */}
          <div className="relative mt-6 min-h-[360px] sm:min-h-[420px] w-full rounded-3xl border-2 border-slate-700 overflow-hidden bg-slate-950 shadow-2xl">
            {/* Real Map Image Background */}
            <Image
              src="/indonesia-real-map.jpg"
              alt="Interactive Indonesia Map PetaKarier"
              fill
              className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Interactive City Pins Layer */}
            {KOTA_MAP.map((k) => {
              const isHovered = hoveredKota?.id === k.id;
              return (
                <div
                  key={k.id}
                  style={{ top: `${k.y}%`, left: `${k.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  onMouseEnter={() => setHoveredKota(k)}
                  onClick={() => setHoveredKota(k)}
                >
                  {/* Glowing Radar Pulse */}
                  <span className={`absolute -inset-3 rounded-full animate-ping opacity-75 ${isHovered ? "bg-emerald-400" : "bg-teal-400/50"}`} />

                  {/* City Pin Marker */}
                  <motion.div
                    animate={{ scale: isHovered ? 1.35 : 1 }}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-xl transition-all ${
                      isHovered
                        ? "bg-emerald-500 text-white border-white ring-4 ring-emerald-400/60"
                        : "bg-white text-emerald-700 border-emerald-400 hover:bg-emerald-50"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                  </motion.div>

                  {/* Pin City Label */}
                  <span className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-extrabold transition-all shadow-md ${
                    isHovered
                      ? "bg-emerald-500 text-white border border-emerald-300"
                      : "bg-slate-900/90 text-slate-200 border border-slate-700 group-hover:bg-emerald-600 group-hover:text-white"
                  }`}>
                    {k.nama}
                  </span>
                </div>
              );
            })}

            {/* Glassmorphism City Popover Insight Card (Overlay) */}
            <AnimatePresence mode="wait">
              {hoveredKota && (
                <motion.div
                  key={hoveredKota.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 rounded-2xl border-2 border-emerald-400/50 bg-slate-950/95 p-5 backdrop-blur-2xl text-white shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="text-base font-extrabold text-white leading-none">
                          {hoveredKota.nama}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold">{hoveredKota.provinsi}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      Terverifikasi 2026
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-white/5 p-2.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Standar UMR Resmi</span>
                      <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                        {formatRupiah(hoveredKota.umr)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-white/5 p-2.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Potensi UMKM Aktif</span>
                      <p className="text-sm font-extrabold text-white mt-0.5">
                        {hoveredKota.umkmAktif} Unit
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300">
                      Sektor Favorit: <strong className="text-white">{hoveredKota.topUsaha}</strong>
                    </span>
                    <Link
                      href={`/kalkulator?kota=${hoveredKota.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Simulasi Modal</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
