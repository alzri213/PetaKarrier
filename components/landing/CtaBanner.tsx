"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Calculator } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 px-6 py-14 text-center text-white shadow-2xl sm:px-12 sm:py-16">
            {/* Background Pattern / Glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-emerald-200" />
                <span>Mulai Tanpa Hambatan</span>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                Siap Memulai Langkah Wirausaha yang Terukur?
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-emerald-100 sm:text-base">
                Temukan potensi bisnismu, uji kelayakan modal sebelum berinvestasi, dan susun proposal rencana usaha profesional sekarang.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
                <Link
                  href="/analisis"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 text-sm font-extrabold text-emerald-800 shadow-lg transition-all duration-200 hover:bg-emerald-50 hover:scale-105 sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Mulai Analisis Profil</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/kalkulator"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-transparent px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:border-white hover:bg-white/10 sm:w-auto"
                >
                  <Calculator className="h-4 w-4" />
                  <span>Kalkulator Modal & BEP</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
