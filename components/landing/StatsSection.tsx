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
      label: "TOTAL USAHA DIANALISIS",
      value: stats?.totalAnalisis ?? 1420,
      icon: "solar:magic-stick-3-bold",
      textColor: "text-[#16a34a]",
      desc: "Simulasi kecocokan potensi wirausaha",
      targetBadge: "Target 8.3",
    },
    {
      label: "PROYEKSI SERAPAN KERJA",
      value: stats?.totalEstimasiKerja ?? 1680,
      icon: "solar:users-group-two-rounded-bold",
      textColor: "text-emerald-600",
      desc: "Dukungan SDG 8.5 lapangan kerja inklusif",
      targetBadge: "Target 8.5",
    },
    {
      label: "RENCANA BISNIS DITERBITKAN",
      value: stats?.totalRencanaBisnis ?? 890,
      icon: "solar:document-add-bold",
      textColor: "text-sky-600",
      desc: "Dokumen terstruktur siap eksekusi",
      targetBadge: "Target 8.6",
    },
    {
      label: "PROVINSI TERJANGKAU",
      value: stats?.totalKotaAktif ?? 38,
      suffix: " Provinsi",
      icon: "solar:city-bold",
      textColor: "text-amber-500",
      desc: "Standar upah minimum terverifikasi 2026",
      targetBadge: "Pilar Daerah",
    },
  ];

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
            Dampak Nyata Platform
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Statistik Pemberdayaan Ekosistem PetaKarier
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, idx) => (
            <Reveal key={item.label} delay={idx * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-7 shadow-md transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Standalone Icon & Target Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Icon
                      icon={item.icon}
                      className={`h-9 w-9 ${item.textColor} transition-transform duration-300 group-hover:scale-110`}
                    />
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-extrabold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.targetBadge}
                    </span>
                  </div>

                  {/* Big Counter Number */}
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    <AnimatedCounter
                      value={item.value}
                      format={(n) => `${n.toLocaleString("id-ID")}${item.suffix ?? "+"}`}
                    />
                  </p>

                  {/* Label */}
                  <h3 className="mt-2 text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
