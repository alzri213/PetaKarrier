"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, Palette, ChartColumn, Database, Layers } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const TEKNOLOGI = [
  { icon: Cpu, nama: "Mesin Pemetaan Terpadu", desc: "Kalkulasi Presisi Real-time" },
  { icon: Database, nama: "Basis Data Terverifikasi", desc: "Data UMR 18 Kota Resmi 2026" },
  { icon: Layers, nama: "Matriks RAN TPB Bappenas", desc: "Indikator Dampak Inklusif SDG 8" },
  { icon: Zap, nama: "Antarmuka Responsif", desc: "Pengalaman Akses Cepat & Tajam" },
  { icon: Palette, nama: "Micro-interactions Berkelas", desc: "Navigasi Interaktif & Intuitif" },
  { icon: ChartColumn, nama: "Visualisasi Grafik Finansial", desc: "Proyeksi BEP 12 Bulan Transparan" },
];

export default function TechSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-28 pt-12 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96">
        <div className="absolute bottom-0 left-1/2 h-[26rem] w-[50rem] -translate-x-1/2 animate-blob rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 animate-blob rounded-full bg-green-400/10 blur-[110px] [animation-delay:-6s]" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Full-Stack Modern, Handal, dan <span className="text-gradient">Scalable</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TEKNOLOGI.map((t, i) => (
            <Reveal key={t.nama} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-center gap-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 text-left shadow-sm transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200/60 dark:ring-emerald-500/40 shadow-inner">
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{t.nama}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4} className="mt-16">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-10 shadow-2xl sm:p-14 text-white">
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl"
              >
                Mulai Perjalanan <span className="text-emerald-400">Wirausahamu</span> Hari Ini
              </motion.h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
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
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-8 py-4 text-sm font-bold text-emerald-300 backdrop-blur transition hover:bg-emerald-500/20 hover:text-white"
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
