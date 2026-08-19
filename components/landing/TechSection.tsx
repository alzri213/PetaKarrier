"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu, Zap, Palette, ChartColumn, Globe, Database, Layers } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const TEKNOLOGI = [
  { icon: Cpu, nama: "Next.js 15 (App Router)", desc: "Server Actions & SSR Cepat" },
  { icon: Database, nama: "Neon (PostgreSQL)", desc: "Serverless Cloud Database" },
  { icon: Layers, nama: "Prisma ORM", desc: "Type-safe Data Access" },
  { icon: Zap, nama: "Tailwind CSS + Shadcn/ui", desc: "UI Modern & Konsisten" },
  { icon: Palette, nama: "Framer Motion", desc: "Micro-interactions Berkelas" },
  { icon: ChartColumn, nama: "Recharts", desc: "Visualisasi Data Interaktif" },
];

export default function TechSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96">
        <div className="absolute bottom-0 left-1/2 h-[26rem] w-[50rem] -translate-x-1/2 animate-blob rounded-full bg-emerald-600/15 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 animate-blob rounded-full bg-emerald-400/15 blur-[110px] [animation-delay:-6s]" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
            Arsitektur & Teknologi
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Full-Stack Modern, Andal, dan <span className="text-gradient">Scalable</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TEKNOLOGI.map((t, i) => (
            <Reveal key={t.nama} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-xl transition-colors duration-300 hover:border-emerald-400/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-green-400/30 text-emerald-700 ring-1 ring-white/10">
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-white">{t.nama}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4} className="mt-16">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-emerald-600/15 via-green-500/10 to-emerald-400/15 p-10 backdrop-blur-2xl sm:p-14">
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
            <div className="relative">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl"
              >
                Mulai Perjalanan <span className="text-gradient">Wirausahamu</span> Hari Ini
              </motion.h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-200 leading-relaxed text-sm sm:text-base">
                Simulasi finansial objektif, roadmap 90 hari, dan dokumen rencana bisnis otomatis — selaras dengan target pembangunan ekonomi berkelanjutan SDG 8.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link
                  href="/analisis"
                  className="btn-shine group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-400 px-8 py-4 text-sm font-extrabold text-white shadow-xl transition hover:scale-105"
                >
                  Mulai Analisis Gratis
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/sdg-impact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
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
