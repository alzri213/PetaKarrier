"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function TechSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-28 pt-12 sm:px-6 lg:px-8">
      {/* Dark mode ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 hidden dark:block">
        <div className="absolute bottom-0 left-1/2 h-[26rem] w-[50rem] -translate-x-1/2 animate-blob rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 animate-blob rounded-full bg-green-400/10 blur-[110px] [animation-delay:-6s]" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          {/* ── CTA Banner — adapts to light & dark mode ── */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl
            dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 dark:shadow-2xl
            p-10 sm:p-14">

            {/* Dot grid overlay — subtle in light, visible in dark */}
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.07] dark:opacity-20" />

            {/* Light mode ambient */}
            <div className="pointer-events-none absolute inset-0 hidden sm:block">
              <div className="absolute -top-20 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[100px] dark:hidden" />
            </div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl dark:text-white"
              >
                Mulai Perjalanan{" "}
                <span className="text-emerald-600 dark:text-emerald-400">Wirausahamu</span>{" "}
                Hari Ini
              </motion.h2>

              <p className="mx-auto mt-4 max-w-xl text-slate-600 leading-relaxed text-sm sm:text-base font-normal dark:text-slate-300">
                Simulasi finansial objektif, roadmap 90 hari, dan dokumen rencana bisnis otomatis — selaras dengan target pembangunan ekonomi berkelanjutan SDG 8.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link
                  href="/analisis"
                  className="btn-shine group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-400 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/25 transition hover:scale-105"
                >
                  Mulai Analisis Gratis
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/sdg-impact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-50 px-8 py-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100
                    dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20 dark:hover:text-white"
                >
                  Lihat Dashboard SDG 8
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
