"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  {
    title: "Analisis Potensi Usaha",
    desc: "Kecocokan profil dengan 14 jenis usaha berdasarkan skill, minat, dan budget Anda.",
    icon: "solar:target-bold-duotone",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Kalkulator Modal & BEP",
    desc: "Simulasi modal awal dan BEP berdasarkan data UMR 18 kota di Indonesia.",
    icon: "solar:calculator-minimalistic-bold-duotone",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Komparasi Usaha vs UMR",
    desc: "Bandingkan potensi laba usaha dengan standar upah minimum di kota Anda.",
    icon: "solar:chart-square-bold-duotone",
    color: "from-amber-500 to-yellow-500",
  },
  {
    title: "Generator Rencana Bisnis",
    desc: "Dokumen proposal lengkap dengan analisis SWOT dan strategi 90 hari.",
    icon: "solar:document-text-bold-duotone",
    color: "from-yellow-400 to-amber-400",
  },
  {
    title: "Dashboard Dampak SDG 8",
    desc: "Pantau kontribusi Anda terhadap target pembangunan berkelanjutan.",
    icon: "solar:pie-chart-bold-duotone",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Resource Hub & Komunitas",
    desc: "Akses panduan legalitas, sertifikasi, dan komunitas wirausaha.",
    icon: "solar:users-group-rounded-bold-duotone",
    color: "from-cyan-500 to-blue-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-2 border border-emerald-200"
          >
            <span className="text-xs font-semibold text-emerald-700">✨ Our Services</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4"
          >
            Layanan Kami
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Solusi komprehensif untuk mendukung perjalanan bisnis Anda dari awal hingga sukses.
          </motion.p>
        </Reveal>

        {/* Services grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-full rounded-[2rem] border-2 border-slate-200 bg-white p-10 shadow-lg transition-all duration-500 hover:shadow-2xl overflow-hidden"
              >
                {/* Icon container */}
                <motion.div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-xl border-2 border-white/30 relative z-10`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon icon={service.icon} className="h-10 w-10 text-white" />
                </motion.div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="mt-8 text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    {service.desc}
                  </p>
                  
                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <span>Eksplor Layanan</span>
                    <Icon icon="solar:arrow-right-linear" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
