"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader2 } from "lucide-react";

const LOADING_TIPS = [
  "Tips: Siapkan estimasi modal awal usahamu sebelum melanjutkan ke kalkulator BEP.",
  "Tips: Bandingkan laba potensial usahamu dengan standar UMR resmi 2026.",
  "Tips: Rencana bisnis otomatis siap diekspor menjadi proposal PDF resmi.",
];

export default function InitialPageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<1 | 2>(1);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Check if session has already loaded
    const hasLoaded = sessionStorage.getItem("petakarier_loaded");
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    // Step 1: Switch from Phase 1 (Radar & Tips) to Phase 2 (Chart Skeleton Preview) after 2.3s
    const phaseTimer = setTimeout(() => {
      setPhase(2);
    }, 2300);

    // Step 2: Complete loading and reveal website after 4.5s
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("petakarier_loaded", "true");
    }, 4500);

    // Rotating tips
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 1500);

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(completeTimer);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050914] text-white select-none px-4"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00df82]/[0.06] blur-[150px]" />
          </div>

          <div className="relative z-10 flex w-full max-w-xl flex-col items-center justify-center text-center">
            {/* ══════════════════════════════════════════════════════════════════
                PHASE 1: BRAND LOGO + CIRCULAR SPINNER + CONTEXT & TIPS
            ══════════════════════════════════════════════════════════════════ */}
            {phase === 1 && (
              <motion.div
                key="phase1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center"
              >
                {/* Brand Text Logo */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                >
                  <span className="text-white">Peta </span>
                  <span className="text-[#00df82] font-black drop-shadow-[0_0_20px_rgba(0,223,130,0.4)]">
                    Karier
                  </span>
                </motion.div>

                {/* Precision Circular Spinner with Organic Glowing Arc (Zero Square Clipping) */}
                <div className="relative my-10 flex h-20 w-20 items-center justify-center">
                  {/* Soft Organic Radial Glow */}
                  <div className="pointer-events-none absolute h-16 w-16 rounded-full bg-[#00df82]/20 blur-xl" />

                  {/* Static Background Ring */}
                  <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#0d2222"
                      strokeWidth="4.5"
                      fill="transparent"
                    />
                  </svg>

                  {/* Rotating Glowing Arc */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="relative h-full w-full"
                  >
                    <svg className="h-full w-full overflow-visible -rotate-90 transform" viewBox="0 0 100 100">
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#00df82"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray="240"
                        strokeDashoffset="160"
                        animate={{
                          strokeDashoffset: [170, 60, 170],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.8,
                          ease: "easeInOut",
                        }}
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* Subtitle Headlines */}
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Menyiapkan rekomendasi usaha untuk kamu...
                </h2>
                <p className="mt-1.5 text-xs sm:text-[13px] text-slate-400 max-w-md leading-relaxed">
                  Menganalisis potensi regional, tren pasar, dan kesesuaian modal
                </p>

                {/* Bottom Pill Tips Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-10 flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-[#0a1120]/80 px-5 py-3.5 shadow-xl backdrop-blur-md max-w-lg text-left"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#00df82]/10 border border-[#00df82]/20 text-[#00df82]">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <motion.p
                    key={tipIndex}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-slate-300 leading-snug"
                  >
                    {LOADING_TIPS[tipIndex]}
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                PHASE 2: GLASS SKELETON CARD PREVIEW WITH BAR GRAPH ANIMATION
            ══════════════════════════════════════════════════════════════════ */}
            {phase === 2 && (
              <motion.div
                key="phase2"
                initial={{ opacity: 0, scale: 0.93, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-lg rounded-3xl border border-slate-800/80 bg-[#070e1c]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl"
              >
                {/* Header Skeleton Mockup */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-800/80 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-32 rounded-full bg-slate-800 animate-pulse" />
                      <div className="h-2.5 w-20 rounded-full bg-slate-800/60 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 w-16 rounded-full bg-emerald-950/80 border border-emerald-500/30" />
                </div>

                {/* Subtitle Placeholder Lines */}
                <div className="mt-5 space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-slate-800/60 animate-pulse" />
                  <div className="h-2.5 w-4/5 rounded-full bg-slate-800/50 animate-pulse" />
                  <div className="h-2.5 w-2/3 rounded-full bg-slate-800/40 animate-pulse" />
                </div>

                {/* Bar Graph Skeleton Container */}
                <div className="mt-6 flex h-36 w-full items-end justify-center gap-3 rounded-2xl border border-slate-800/60 bg-[#050a14]/90 p-4 pb-3">
                  {[28, 45, 62, 90, 100, 75, 40].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: "12%" }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`w-7 rounded-t-lg transition-colors ${
                        height >= 90
                          ? "bg-gradient-to-t from-emerald-600 to-[#00df82] shadow-lg shadow-emerald-500/30"
                          : "bg-slate-800/70"
                      }`}
                    />
                  ))}
                </div>

                {/* Bottom Actions Skeleton + Spinner Indicator */}
                <div className="mt-5 flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-16 rounded-xl bg-slate-800/70 animate-pulse" />
                    <div className="h-7 w-16 rounded-xl bg-slate-800/50 animate-pulse" />
                  </div>

                  {/* Star Spinner + Text */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    >
                      <Loader2 className="h-3.5 w-3.5 text-[#00df82]" />
                    </motion.div>
                    <span className="text-[11px] text-slate-300">Memuat platform...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
