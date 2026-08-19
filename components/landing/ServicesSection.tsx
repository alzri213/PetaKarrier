"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  {
    title: "Analisis Potensi Usaha",
    desc: "Kecocokan profil dengan 14 jenis usaha berdasarkan skill, minat, dan budget Anda.",
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M20 6 L20 10" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M20 30 L20 34" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M6 20 L10 20" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M30 20 L34 20" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="20" cy="20" r="5" fill="currentColor"/>
    </svg>`,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Kalkulator Modal & BEP",
    desc: "Simulasi modal awal dan BEP berdasarkan data UMR 18 kota di Indonesia.",
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="11" width="28" height="23" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M11 16 L29 16" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M11 21 L22 21" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M11 26 L16 26" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M6 11 L6 6 L11 6" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    </svg>`,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Komparasi Usaha vs UMR",
    desc: "Bandingkan potensi laba usaha dengan standar upah minimum di kota Anda.",
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 30 L6 15 L20 20 L34 10 L34 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M6 15 L6 10 L20 15 L34 5" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="34" cy="10" r="4" fill="currentColor"/>
    </svg>`,
    color: "from-amber-500 to-yellow-500",
  },
  {
    title: "Generator Rencana Bisnis",
    desc: "Dokumen proposal lengkap dengan analisis SWOT dan strategi 90 hari.",
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="6" width="22" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M14 14 L26 14" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M14 20 L26 20" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M14 26 L19 26" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M9 11 L6 11" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M9 17 L6 17" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M9 23 L6 23" stroke="currentColor" strokeWidth="2.5"/>
    </svg>`,
    color: "from-yellow-400 to-amber-400",
  },
  {
    title: "Dashboard Dampak SDG 8",
    desc: "Pantau kontribusi Anda terhadap target pembangunan berkelanjutan.",
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M20 6 C20 6 24 10 24 14 C24 18 20 22 20 22 C20 22 16 18 16 14 C16 10 20 6 20 6" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M20 22 L20 32" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M16 27 L24 27" stroke="currentColor" strokeWidth="2.5"/>
    </svg>`,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Resource Hub & Komunitas",
    desc: "Akses panduan legalitas, sertifikasi, dan komunitas wirausaha.",
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M14 14 L26 14" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M14 20 L24 20" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M14 26 L19 26" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M20 6 L20 9" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="20" cy="5" r="2.5" fill="currentColor"/>
    </svg>`,
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
                  rotateX: 2,
                  rotateY: 2
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-full rounded-[2rem] border-2 border-slate-200 bg-white p-10 shadow-lg transition-all duration-500 hover:shadow-2xl overflow-hidden"
              >
                {/* Background gradient overlay for hover effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
                
                {/* Decorative unroll effect */}
                <motion.div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${service.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  initial={false}
                  whileHover={{ opacity: 0.2, scale: 1.5 }}
                />
                
                {/* Icon container with enhanced hover effect */}
                <motion.div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-xl border-2 border-white/30 relative z-10`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  dangerouslySetInnerHTML={{ __html: service.icon }}
                />
                
                {/* Content with unroll animation */}
                <motion.div
                  className="relative z-10"
                  initial={{ height: "auto" }}
                  whileHover={{ height: "auto" }}
                >
                  <motion.h3 
                    className="mt-8 text-2xl font-extrabold text-slate-900 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-green-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500"
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p 
                    className="mt-4 text-base leading-relaxed text-slate-600"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {service.desc}
                  </motion.p>
                  
                  {/* Expandable content that reveals on hover */}
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    whileHover={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="pt-4 border-t border-slate-200 mt-4">
                      <p className="text-sm text-slate-500 mb-3">
                        Fitur premium untuk mengoptimalkan hasil analisis Anda.
                      </p>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center gap-2 text-emerald-700 font-semibold cursor-pointer"
                      >
                        Pelajari lebih lanjut
                        <motion.svg
                          width="20" 
                          height="20" 
                          viewBox="0 0 20 20" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <path d="M4 10 L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M10 4 L16 10 L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </motion.svg>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Decorative scroll/unroll indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  animate={{ scale: 0 }}
                  whileInView={{ scale: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8 L13 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 3 L13 8 L8 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
