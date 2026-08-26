"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Reveal from "@/components/ui/Reveal";
import ScrollSpeedMarquee from "@/components/ui/ScrollSpeedMarquee";

const POIN = [
  {
    icon: "solar:map-point-bold",
    title: "Data Riil 18 Kota Indonesia",
    desc: "Basis data standar UMR, sewa tempat, dan utilitas dikurasi per kota dari sumber kredibel, menghindari jebakan estimasi modal fiktif.",
    color: "text-[#16a34a]",
  },
  {
    icon: "solar:bolt-bold",
    title: "Satu Alur Terintegrasi",
    desc: "Hasil analisis profil mengalir langsung ke kalkulator modal, komparasi UMR, hingga terbitnya dokumen rencana bisnis otomatis.",
    color: "text-emerald-600",
  },
  {
    icon: "solar:chart-2-bold",
    title: "Keputusan Berbasis Data",
    desc: "Perbandingan laba vs UMR dan kurva break-even 12 bulan memberikan kepastian objektif sebelum Anda berkomitmen menginvestasikan modal.",
    color: "text-amber-500",
  },
  {
    icon: "solar:target-bold",
    title: "Keselarasan SDG 8 & RAN TPB",
    desc: "Mendukung target nasional penciptaan lapangan kerja produktif dan inklusif bagi generasi muda sesuai Matriks 4 Bappenas RI.",
    color: "text-[#16a34a]",
  },
];

export default function WhySection() {
  return (
    <>
      {/* Interactive 2-Row Scroll-Speed Marquee */}
      <ScrollSpeedMarquee />

      <section className="relative bg-white px-4 py-24 transition-colors duration-500 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Jawaban Nyata untuk <span className="text-emerald-700 dark:text-emerald-400">Tantangan Wirausaha</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Jutaan generasi muda Indonesia memiliki impian membuka usaha namun terkendala validasi finansial, perizinan, dan kepastian pasar. PetaKarier hadir memberikan solusi berbasis data.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {POIN.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group flex h-full flex-col justify-between rounded-[2rem] border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-start">
                      <Icon
                        icon={p.icon}
                        className={`h-11 w-11 ${p.color} transition-transform duration-300 group-hover:scale-110`}
                      />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
