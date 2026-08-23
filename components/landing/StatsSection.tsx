"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
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
      icon: "solar:magic-stick-3-bold",
      color: "from-emerald-500 to-emerald-600",
      desc: "Simulasi kecocokan potensi wirausaha",
    },
    {
      label: "Rencana Bisnis Terbit",
      value: stats?.totalRencanaBisnis ?? 890,
      icon: "solar:document-add-bold",
      color: "from-green-500 to-emerald-500",
      desc: "Dokumen terstruktur siap eksekusi",
    },
    {
      label: "Proyeksi Serapan Tenaga Kerja",
      value: stats?.totalEstimasiKerja ?? 1680,
      icon: "solar:users-group-two-rounded-bold",
      color: "from-amber-500 to-yellow-500",
      desc: "Dukungan SDG 8.5 lapangan kerja inklusif",
    },
    {
      label: "Kota Terintegrasi UMR",
      value: stats?.totalKotaAktif ?? 18,
      suffix: " Kota",
      icon: "solar:city-bold",
      color: "from-yellow-500 to-amber-500",
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
            Statistik Pemberdayaan Ekosistem PetaKarier
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
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl border-2 border-white/30`}>
                  <Icon icon={item.icon} className="h-7 w-7" />
                </div>
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
