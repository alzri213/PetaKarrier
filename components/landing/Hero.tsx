"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  LineChart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 45 });
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Overlay colours adapt to theme
  const overlayBase = isDark
    ? "rgba(2, 6, 23, 0.95)"
    : "rgba(248, 250, 252, 0.80)";
  const overlayMid = isDark
    ? "rgba(2, 6, 23, 0.45)"
    : "rgba(248, 250, 252, 0.30)";
  const overlayLight = isDark
    ? "rgba(2, 6, 23, 0.05)"
    : "rgba(248, 250, 252, 0.00)";

  const spotlightOverlay = isHovered
    ? `radial-gradient(circle 500px at ${mousePos.x}% ${mousePos.y}%, ${overlayLight} 0%, ${overlayMid} 45%, ${overlayBase} 85%)`
    : `radial-gradient(circle 600px at 50% 50%, ${isDark ? "rgba(2,6,23,0.65)" : "rgba(248,250,252,0.55)"} 0%, ${overlayBase} 100%)`;

  // Cursor glow: dark in light mode, emerald in dark mode
  const cursorGlowColor = isDark
    ? `rgba(0, 223, 130, 0.18)`
    : `rgba(0, 0, 0, 0.12)`;
  const cursorGlowFade = isDark
    ? `rgba(0, 223, 130, 0.04)`
    : `rgba(0, 0, 0, 0.03)`;

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative isolate overflow-hidden bg-white dark:bg-slate-950 pt-24 pb-16 sm:pt-28 sm:pb-24 transition-colors duration-300"
    >
      {/* Top & bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24
        bg-gradient-to-b from-white/80 via-white/20 to-transparent
        dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44
        bg-gradient-to-b from-transparent via-white/80 to-white
        dark:via-slate-950/80 dark:to-[#030712]" />

      {/* ── Background: satellite map + interactive spotlight ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Satellite map image — dimmer in light mode */}
        <Image
          src="/indonesia-map-satellite.jpg"
          alt="Peta Indonesia PetaKarier"
          fill
          sizes="100vw"
          unoptimized
          className={`object-cover object-center transition-all duration-700 ${
            isHovered
              ? isDark
                ? "brightness-100 contrast-110 opacity-90 scale-100"
                : "brightness-105 contrast-115 opacity-55 scale-100"
              : isDark
              ? "brightness-80 contrast-105 opacity-52 scale-[1.02]"
              : "brightness-95 contrast-110 opacity-45 scale-[1.02]"
          }`}
          priority
        />

        {/* Dynamic spotlight mask */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{ background: spotlightOverlay }}
        />

        {/* Cursor glow beam — dark circle in light mode, emerald in dark */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, ${cursorGlowColor} 0%, ${cursorGlowFade} 55%, transparent 75%)`,
          }}
        />

        {/* Lightweight circular spotlight for touch devices without cursor tracking */}
        <div className="mobile-light-spotlight pointer-events-none absolute left-0 top-0 z-[2] h-[95vw] w-[95vw] max-h-[34rem] max-w-[34rem] rounded-full md:hidden" />
      </div>

      {/* Decorative glow blob — dark mode only */}
      <div className="pointer-events-none absolute left-1/2 top-10 -z-20 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px] hidden dark:block" />

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-5 text-center sm:space-y-6">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold leading-[1.15] tracking-tight
              text-slate-900 dark:text-white
              drop-shadow-[0_2px_12px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]
              sm:text-5xl md:text-6xl"
          >
            Akselerasi Karier Wirausahamu dengan Validasi Data Riil Bersama{" "}
            <span className="inline-block rounded-2xl bg-[#00df82] px-5 py-1.5 text-slate-950 shadow-lg align-middle font-black">
              PetaKarier
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium
              text-slate-700 dark:text-slate-100
              drop-shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
          >
            Petakan peluang usaha cerdas, hitung simulasi modal berbasis standar UMR resmi 38 provinsi tahun 2026, dan susun rencana bisnis otomatis yang akuntabel.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
          >
            <Link
              href="/analisis"
              className="btn-shine group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-[#00df82] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:bg-[#00c975]"
            >
              <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-slate-950" />
              <span>Mulai Analisis Potensi Usaha</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/kalkulator"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl
                border border-slate-300 bg-white/80 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-slate-800 shadow-md
                transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700
                dark:border-emerald-400/60 dark:bg-slate-900/70 dark:text-white dark:hover:bg-emerald-600 dark:hover:border-emerald-400 dark:hover:text-white"
            >
              <LineChart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 dark:group-hover:text-white" />
              <span>Kalkulator Modal & UMR</span>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-5"
          >
            {[
              "Data UMR 38 Provinsi 2026",
              "Upah Per Jam Kerja Bappenas",
              "Standar RAN TPB Matriks 4",
            ].map((label) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full
                  border border-slate-200 bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md
                  dark:border-emerald-500/30 dark:bg-slate-900/85 dark:text-slate-100"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#00df82]" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
