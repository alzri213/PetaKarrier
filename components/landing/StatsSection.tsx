"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Reveal from "@/components/ui/Reveal";

interface StatsSectionProps {
  stats?: {
    totalAnalisis: number;
    totalRencanaBisnis: number;
    totalEstimasiUMKM: number;
    totalEstimasiKerja: number;
    totalKotaAktif: number;
  };
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const data = [
    {
      label: "Analisis Usaha Dijalankan",
      value: stats?.totalAnalisis ?? 1420,
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 L13 7 L18 8 L13 9 L12 14 L11 9 L6 8 L11 7 Z" fill="white"/>
        <circle cx="18" cy="5" r="2" fill="rgba(255,255,255,0.8)"/>
        <circle cx="6" cy="18" r="1.5" fill="rgba(255,255,255,0.6)"/>
      </svg>`,
      color: "from-emerald-500 to-emerald-600",
      desc: "Simulasi kecocokan potensi wirausaha",
    },
    {
      label: "Rencana Bisnis Terbit",
      value: stats?.totalRencanaBisnis ?? 890,
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="white" strokeWidth="2" fill="none"/>
        <path d="M9 8 L15 8" stroke="white" strokeWidth="2"/>
        <path d="M9 12 L15 12" stroke="white" strokeWidth="2"/>
        <path d="M9 16 L12 16" stroke="white" strokeWidth="2"/>
        <path d="M5 6 L3 6" stroke="white" strokeWidth="2"/>
        <path d="M5 10 L3 10" stroke="white" strokeWidth="2"/>
        <path d="M5 14 L3 14" stroke="white" strokeWidth="2"/>
      </svg>`,
      color: "from-green-500 to-emerald-500",
      desc: "Dokumen terstruktur siap eksekusi",
    },
    {
      label: "Proyeksi Serapan Tenaga Kerja",
      value: stats?.totalEstimasiKerja ?? 1680,
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" fill="none"/>
        <path d="M6 20 C6 16 9 14 12 14 C15 14 18 16 18 20" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="18" cy="6" r="2" fill="rgba(255,255,255,0.8)"/>
        <circle cx="6" cy="10" r="1.5" fill="rgba(255,255,255,0.6)"/>
      </svg>`,
      color: "from-amber-500 to-yellow-500",
      desc: "Dukungan SDG 8.5 lapangan kerja inklusif",
    },
    {
      label: "Kota Terintegrasi UMR",
      value: stats?.totalKotaAktif ?? 18,
      suffix: " Kota",
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 C7 2 3 6 3 11 C3 16 12 22 12 22 C12 22 21 16 21 11 C21 6 17 2 12 2" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="11" r="4" fill="white"/>
        <circle cx="18" cy="5" r="1.5" fill="rgba(255,255,255,0.8)"/>
      </svg>`,
      color: "from-yellow-400 to-amber-400",
      desc: "Standar upah minimum terverifikasi 2026",
    },
  ];

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
            Dampak Nyata Platform
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Statistik Pemberdayaan Ekosistem KonekUMKM
          </h2>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, idx) => (
            <Reveal key={item.label} delay={idx * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl"
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-3xl`}
                />
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl border-2 border-white/30`}
                  dangerouslySetInnerHTML={{ __html: item.svg }}
                />
                <p className="mt-6 text-4xl font-extrabold text-slate-900">
                  <AnimatedCounter
                    value={item.value}
                    format={(n) => `${n.toLocaleString("id-ID")}${item.suffix ?? "+"}`}
                  />
                </p>
                <h3 className="mt-2 text-base font-bold text-slate-800">{item.label}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
