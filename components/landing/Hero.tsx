"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Globe2,
  TrendingUp,
  LineChart,
  Scale,
  FileText,
  CheckCircle2,
  Zap,
  ChevronRight,
  Store,
  Coins,
  BarChart3,
  Star,
  Building2,
  ShoppingCart,
  Users,
  MousePointer2,
  ArrowUpRight,
  Play,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { formatRupiah, formatRupiahSingkat } from "@/lib/utils/formatCurrency";

interface HeroProps {
  stats?: {
    totalAnalisis: number;
    totalRencanaBisnis: number;
    totalEstimasiUMKM: number;
    totalKotaAktif: number;
  };
}

const BUSINESSES = [
  { id: "makanan", nama: "Makanan Rumahan", emoji: "🍱", modal: 8500000,  laba: 4200000, bep: 4, margin: "38%", serapan: "2–3 Orang", umr: 4209389 },
  { id: "kopi",    nama: "Kedai Kopi",      emoji: "☕", modal: 18500000, laba: 6500000, bep: 5, margin: "42%", serapan: "3 Orang",   umr: 4209389 },
  { id: "desain",  nama: "Studio Desain",   emoji: "🎨", modal: 11000000, laba: 6800000, bep: 3, margin: "55%", serapan: "2 Orang",   umr: 4209389 },
  { id: "laundry", nama: "Laundry Kiloan",  emoji: "🧺", modal: 19000000, laba: 5400000, bep: 6, margin: "34%", serapan: "2 Orang",   umr: 4209389 },
];

const CHART = [
  { b: "Bln 1", o: 5200000,  l: 1800000 },
  { b: "Bln 2", o: 6800000,  l: 3000000 },
  { b: "Bln 3", o: 8500000,  l: 4200000 },
  { b: "Bln 4", o: 9600000,  l: 4800000 },
  { b: "Bln 5", o: 11200000, l: 6000000 },
  { b: "Bln 6", o: 12500000, l: 6900000 },
];

const PIE = [
  { name: "Peralatan & Aset", value: 3800000, color: "#10b981" },
  { name: "Sewa Tempat",      value: 2400000, color: "#16a34a" },
  { name: "Bahan Baku",       value: 1500000, color: "#f59e0b" },
  { name: "Legalitas NIB",    value: 500000,  color: "#eab308" },
  { name: "Promosi Awal",     value: 300000,  color: "#059669" },
];

const TABS = [
  { id: "financial", label: "Kalkulator",     icon: LineChart },
  { id: "benchmark", label: "vs UMR",         icon: Scale },
  { id: "matching",  label: "Pencocokan",     icon: Sparkles },
  { id: "plan",      label: "Rencana Bisnis", icon: FileText },
] as const;
type TabId = (typeof TABS)[number]["id"];

const TIP: React.CSSProperties = {
  background: "#0d1226",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  fontSize: 11,
  color: "#fff",
};

/* ── Decorative slanted elements matching reference design ── */
function SlantedDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Slanted lines - top left */}
      <motion.div 
        animate={{ x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute left-0 top-[10%] w-1 h-32 bg-gradient-to-b from-emerald-400 to-transparent -rotate-12 origin-top"
      />
      <motion.div 
        animate={{ x: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute left-8 top-[15%] w-1 h-24 bg-gradient-to-b from-orange-400 to-transparent -rotate-6 origin-top"
      />
      
      {/* Slanted lines - top right */}
      <motion.div 
        animate={{ x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute right-0 top-[12%] w-1 h-28 bg-gradient-to-b from-green-400 to-transparent rotate-12 origin-top"
      />
      <motion.div 
        animate={{ x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        className="absolute right-12 top-[18%] w-1 h-20 bg-gradient-to-b from-yellow-400 to-transparent rotate-6 origin-top"
      />

      {/* Cursor pointer elements - SVG graphics */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute left-[15%] top-[25%]"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4 L16 28" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
          <path d="M10 10 L16 4 L22 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="16" cy="28" r="3" fill="#16a34a"/>
        </svg>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute right-[20%] top-[30%]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 20 L20 4" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
          <path d="M20 4 L20 12" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
          <path d="M20 4 L12 4" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </motion.div>

      {/* Decorative dots pattern */}
      <div className="absolute left-[5%] bottom-[30%] grid grid-cols-3 gap-2 opacity-40">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
            className="w-2 h-2 rounded-full bg-emerald-400"
          />
        ))}
      </div>
      <div className="absolute right-[8%] bottom-[25%] grid grid-cols-2 gap-2 opacity-40">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.15 }}
            className="w-2 h-2 rounded-full bg-amber-400"
          />
        ))}
      </div>

      {/* Background gradient blobs */}
      <div className="absolute -left-32 top-[20%] h-64 w-64 rounded-full bg-emerald-200 blur-3xl opacity-30" />
      <div className="absolute -right-32 top-[15%] h-72 w-72 rounded-full bg-amber-200 blur-3xl opacity-25" />
      <div className="absolute bottom-[15%] left-[30%] h-48 w-48 rounded-full bg-green-200 blur-3xl opacity-20" />
    </div>
  );
}

export default function Hero({ stats }: HeroProps) {
  const [tab, setTab] = useState<TabId>("financial");
  const [biz, setBiz] = useState(BUSINESSES[0]);

  return (
    <section className="relative isolate flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          HERO HEAD — REFERENCE DESIGN WITH UMKM THEME
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-emerald-50/50 to-white pt-28 pb-16">
        <SlantedDecor />

        {/* Left decorative graphic */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pointer-events-none absolute left-8 top-[15%] hidden lg:block"
        >
          <div className="relative h-64 w-56 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-500 shadow-2xl shadow-emerald-500/40 border-4 border-white/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                {/* Storefront building illustration */}
                <svg width="120" height="110" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Building body */}
                  <rect x="20" y="35" width="80" height="65" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  {/* Roof/Awning */}
                  <path d="M10 38 L60 10 L110 38" stroke="rgba(255,255,255,0.6)" strokeWidth="3" fill="rgba(255,255,255,0.15)" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Awning stripes */}
                  <path d="M15 38 L60 14 L105 38" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
                  {/* Door */}
                  <rect x="45" y="60" width="30" height="40" rx="3" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                  <circle cx="70" cy="82" r="2.5" fill="rgba(255,255,255,0.7)"/>
                  {/* Windows */}
                  <rect x="25" y="45" width="16" height="14" rx="2" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                  <line x1="33" y1="45" x2="33" y2="59" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  <line x1="25" y1="52" x2="41" y2="52" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  <rect x="79" y="45" width="16" height="14" rx="2" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                  <line x1="87" y1="45" x2="87" y2="59" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  <line x1="79" y1="52" x2="95" y2="52" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  {/* Sign board */}
                  <rect x="35" y="20" width="50" height="12" rx="6" fill="rgba(255,255,255,0.35)"/>
                  <text x="60" y="29" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="7" fontWeight="bold">TOKO</text>
                  {/* Sparkle */}
                  <circle cx="95" cy="15" r="3" fill="rgba(255,255,255,0.6)"/>
                  <path d="M95 10 L95 20 M90 15 L100 15" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                </svg>
              </motion.div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="rounded-2xl bg-white/30 backdrop-blur-md px-4 py-3 border-2 border-white/40">
                <p className="text-[10px] font-bold text-white/90">UMKM aktif</p>
                <p className="text-2xl font-extrabold text-white">12.000+</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right decorative graphic */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pointer-events-none absolute right-8 top-[18%] hidden lg:block"
        >
          <div className="relative h-60 w-52 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 shadow-2xl shadow-orange-400/40 border-4 border-white/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              >
                {/* Growth chart illustration */}
                <svg width="110" height="100" viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Chart background */}
                  <rect x="10" y="10" width="90" height="65" rx="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  {/* Grid lines */}
                  <line x1="20" y1="25" x2="90" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
                  <line x1="20" y1="40" x2="90" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
                  <line x1="20" y1="55" x2="90" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
                  {/* Bar chart */}
                  <rect x="22" y="48" width="10" height="22" rx="2" fill="rgba(255,255,255,0.4)"/>
                  <rect x="37" y="38" width="10" height="32" rx="2" fill="rgba(255,255,255,0.5)"/>
                  <rect x="52" y="30" width="10" height="40" rx="2" fill="rgba(255,255,255,0.6)"/>
                  <rect x="67" y="22" width="10" height="48" rx="2" fill="rgba(255,255,255,0.8)"/>
                  {/* Trend line */}
                  <path d="M27 46 L42 36 L57 28 L72 18" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="27" cy="46" r="3" fill="white"/>
                  <circle cx="42" cy="36" r="3" fill="white"/>
                  <circle cx="57" cy="28" r="3" fill="white"/>
                  <circle cx="72" cy="18" r="3.5" fill="white" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                  {/* Arrow up */}
                  <path d="M82 14 L82 6 M78 10 L82 6 L86 10" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Coins */}
                  <circle cx="30" cy="85" r="8" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                  <text x="30" y="88" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontWeight="bold">Rp</text>
                  <circle cx="50" cy="88" r="6" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  <circle cx="65" cy="85" r="7" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
                </svg>
              </motion.div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="rounded-2xl bg-white/30 backdrop-blur-md px-4 py-3 border-2 border-white/40">
                <p className="text-[10px] font-bold text-white/90">Total Modal</p>
                <p className="text-2xl font-extrabold text-white">Rp 14JT</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Main Content ── */}
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 text-center">

          {/* Sub-label */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-2 border border-emerald-200"
          >
            <span className="text-xs font-semibold text-emerald-700">✨ Platform Akselerator UMKM</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
            className="font-extrabold tracking-tight text-slate-900 leading-[1.15]
                       text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <motion.span className="inline-block" variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring" } } }}>
              Petakan{" "}
            </motion.span>
            <motion.span className="inline-block" variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring" } } }}>
              Peluang{" "}
            </motion.span>
            <motion.span
              className="inline-flex items-center gap-3"
              variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring" } } }}
            >
              Usaha{" "}
              <motion.span 
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 shadow-xl shadow-emerald-500/40 border-2 border-white/30"
              >
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 24 L8 12 L16 16 L24 8 L24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M8 12 L8 8 L16 12 L24 4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="24" cy="8" r="3" fill="white"/>
                </svg>
              </motion.span>
              {" "}dengan{" "}
            </motion.span>
            <br />
            <motion.span
              className="inline-block rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 px-6 py-2.5 text-white shadow-xl shadow-emerald-500/40 border-2 border-white/30"
              variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring" } } }}
            >
              KonekUMKM
            </motion.span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 font-extrabold tracking-tight text-slate-900
                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Bangun Bisnis{" "}
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-block rounded-2xl bg-gradient-to-r from-orange-200 to-amber-200 px-4 py-2 text-orange-700 border-2 border-orange-300"
            >
              Mandiri
            </motion.span>{" "}
            Berkelanjutan
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            Platform akselerator digital untuk menganalisis kecocokan profil, menghitung
            simulasi modal berbasis UMR 18 kota, dan menyusun{" "}
            <span className="font-bold text-slate-800">rencana bisnis</span> yang siap
            dieksekusi — selaras SDG 8.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/analisis"
                className="btn-shine group inline-flex items-center gap-3 rounded-full
                           bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 px-8 py-4
                           text-base font-extrabold text-white shadow-xl shadow-emerald-500/40
                           transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/50 border-2 border-white/30"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2 L13 7 L18 8 L13 9 L12 14 L11 9 L6 8 L11 7 Z" fill="white"/>
                    <circle cx="18" cy="5" r="2" fill="rgba(255,255,255,0.8)"/>
                    <circle cx="6" cy="18" r="1.5" fill="rgba(255,255,255,0.6)"/>
                  </svg>
                </motion.div>
                Mulai Analisis Gratis
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12 L19 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M12 5 L19 12 L12 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/sdg-impact"
                className="inline-flex items-center gap-3 rounded-full border-2 border-slate-300
                           bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-lg
                           transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-xl"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 3 C12 3 15 6 15 9 C15 12 12 15 12 15 C12 15 9 12 9 9 C9 6 12 3 12 3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 15 L12 21" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 18 L15 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Lihat Dampak SDG 8
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {[
              { c: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", label: "18 Kota UMR Riil" },
              { c: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", label: "BEP 12-Bulan" },
              { c: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200", label: "Dokumen Siap KUR" },
              { c: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200", label: "Gratis & Tanpa Registrasi" },
            ].map(({ c, bg, border, label }) => (
              <motion.span
                key={label}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${bg} ${border} border text-sm font-semibold text-slate-600 shadow-sm`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2 L9 5 L13 6 L9 7 L8 10 L7 7 L3 6 L7 5 Z" fill="currentColor"/>
                </svg>
                {label}
              </motion.span>
            ))}
          </motion.div>

          {/* Lihat Demo Live */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#demo"
                className="inline-flex items-center gap-3 rounded-full border-2 border-slate-300
                           bg-white px-8 py-3 text-xs font-extrabold uppercase tracking-widest
                           text-slate-500 transition-all duration-300 shadow-md
                           hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-lg"
              >
                Lihat Demo Live
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8 L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 3 L13 8 L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mt-3 h-6 w-6 rounded-full border-2 border-emerald-300 flex items-center justify-center bg-emerald-50"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3 L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 10 L8 13 L11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURE SHOWCASE SECTION (below the fold)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-b from-white to-emerald-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-50 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto max-w-6xl"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-2 border border-emerald-200"
            >
              <span className="text-xs font-semibold text-emerald-700">✨ Fitur Unggulan</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4"
            >
              Solusi Lengkap untuk UMKM
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Platform all-in-one untuk memulai dan mengembangkan bisnis Anda dengan data yang akurat dan strategi yang terukur.
            </motion.p>
          </div>

          {/* Feature cards grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Analisis Potensi",
                desc: "Kecocokan profil dengan 14 jenis usaha berdasarkan skill, minat, dan budget Anda.",
                icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 5 L16 8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 24 L16 27" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 16 L8 16" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 16 L27 16" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="4" fill="currentColor"/>
                </svg>`,
                color: "from-emerald-500 to-emerald-600",
              },
              {
                title: "Kalkulator Modal",
                desc: "Simulasi modal awal dan BEP berdasarkan data UMR 18 kota di Indonesia.",
                icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="9" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M9 13 L23 13" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 17 L18 17" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 21 L13 21" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 9 L5 5 L9 5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>`,
                color: "from-green-500 to-green-600",
              },
              {
                title: "Komparasi UMR",
                desc: "Bandingkan potensi laba usaha dengan standar upah minimum di kota Anda.",
                icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 24 L5 12 L16 16 L27 8 L27 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M5 12 L5 8 L16 12 L27 4" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="27" cy="8" r="3" fill="currentColor"/>
                </svg>`,
                color: "from-amber-500 to-amber-600",
              },
              {
                title: "Rencana Bisnis",
                desc: "Dokumen proposal lengkap dengan analisis SWOT dan strategi 90 hari.",
                icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="5" width="18" height="22" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M11 11 L21 11" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11 16 L21 16" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11 21 L15 21" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 9 L5 9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 14 L5 14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 19 L5 19" stroke="currentColor" strokeWidth="2"/>
                </svg>`,
                color: "from-yellow-500 to-orange-500",
              },
              {
                title: "Dampak SDG 8",
                desc: "Pantau kontribusi Anda terhadap target pembangunan berkelanjutan.",
                icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 5 C16 5 19 8 19 11 C19 14 16 17 16 17 C16 17 13 14 13 11 C13 8 16 5 16 5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M16 17 L16 25" stroke="currentColor" strokeWidth="2"/>
                  <path d="M13 21 L19 21" stroke="currentColor" strokeWidth="2"/>
                </svg>`,
                color: "from-teal-500 to-emerald-600",
              },
              {
                title: "Resource Hub",
                desc: "Akses panduan legalitas, sertifikasi, dan komunitas wirausaha.",
                icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="7" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M11 11 L21 11" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11 16 L19 16" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11 21 L15 21" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 5 L16 7" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="4" r="2" fill="currentColor"/>
                </svg>`,
                color: "from-green-400 to-emerald-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg border-2 border-white/30`}
                  dangerouslySetInnerHTML={{ __html: feature.icon }}
                />
                <h3 className="mt-6 text-xl font-extrabold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
