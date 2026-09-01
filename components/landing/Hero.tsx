"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  LineChart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import InteractiveUMRMap from "@/components/landing/InteractiveUMRMap";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 45 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative isolate overflow-hidden bg-slate-900 dark:bg-slate-950 pt-24 pb-16 sm:pt-28 sm:pb-24 transition-colors duration-300"
    >
      {/* Smooth Gradient Fade Overlay at Top & Bottom (Adapts to Light & Dark Theme) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-transparent dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-slate-950/80 dark:to-[#030712]" />

      {/* ══════════════════════════════════════════════════════════════════
          DYNAMIC BACKGROUND: SATELLITE MAP WITH INTERACTIVE SPOTLIGHT REVEAL
      ══════════════════════════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Base Satellite Map Image */}
        <Image
          src="/indonesia-map-satellite.jpg"
          alt="Peta Indonesia PetaKarier"
          fill
          sizes="100vw"
          unoptimized
          className={`object-cover object-center transition-all duration-700 ${
            isHovered
              ? "brightness-100 contrast-110 opacity-90 scale-100"
              : "brightness-75 contrast-100 opacity-40 scale-[1.02]"
          }`}
          priority
        />

        {/* Dynamic Interactive Spotlight / Torchlight Mask Overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle 500px at ${mousePos.x}% ${mousePos.y}%, rgba(2, 6, 23, 0.05) 0%, rgba(2, 6, 23, 0.45) 45%, rgba(2, 6, 23, 0.94) 85%)`
              : `radial-gradient(circle 600px at 50% 50%, rgba(2, 6, 23, 0.65) 0%, rgba(2, 6, 23, 0.95) 100%)`,
          }}
        />

        {/* Luminous Emerald Cursor Glow Beam */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, rgba(0, 223, 130, 0.18) 0%, rgba(0, 223, 130, 0.04) 55%, transparent 75%)`,
          }}
        />
      </div>

      {/* Background Decorative Glow Blobs */}
      <div className="pointer-events-none absolute left-1/2 top-10 -z-20 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px] hidden dark:block" />

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Hero Main Headline ── */}
        <div className="mx-auto max-w-4xl space-y-5 text-center sm:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-5xl md:text-6xl"
          >
            Akselerasi Karier Wirausahamu dengan Validasi Data Riil Bersama{" "}
            <span className="inline-block rounded-2xl bg-[#00df82] px-5 py-1.5 text-slate-950 shadow-lg align-middle font-black">
              PetaKarier
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium text-slate-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
          >
            Petakan peluang usaha cerdas, hitung simulasi modal berbasis standar UMR resmi 38 provinsi tahun 2026, dan susun rencana bisnis otomatis yang akuntabel.
          </motion.p>

          {/* ── Dual CTA Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/analisis"
              className="btn-shine group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#00df82] px-8 py-4 text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:bg-[#00c975]"
            >
              <Sparkles className="h-5 w-5 text-slate-950" />
              <span>Mulai Analisis Potensi Usaha</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/kalkulator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-400/60 bg-slate-900/70 backdrop-blur-sm px-8 py-4 text-base font-bold text-white shadow-md transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-400"
            >
              <LineChart className="h-5 w-5 text-emerald-400" />
              <span>Kalkulator Modal & UMR</span>
            </Link>
          </motion.div>

          {/* ── Trust Indicators (High-Contrast Badges for Light & Dark Theme) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md dark:border-emerald-500/30 dark:bg-slate-900/85 dark:text-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#00df82]" />
              <span>Data UMR 38 Provinsi 2026</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md dark:border-emerald-500/30 dark:bg-slate-900/85 dark:text-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#00df82]" />
              <span>Upah Per Jam Kerja Bappenas</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md dark:border-emerald-500/30 dark:bg-slate-900/85 dark:text-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#00df82]" />
              <span>Standar RAN TPB Matriks 4</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
