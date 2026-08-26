"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  link: string;
  badge?: string;
  graphic: "analisis" | "kalkulator" | "komparasi" | "rencana" | "komunitas";
}

const SERVICES: ServiceItem[] = [
  {
    id: "analisis",
    title: "Analisis Potensi Usaha",
    desc: "Kuesioner interaktif minat, skill & budget — cocokkan profil dengan 14 jenis usaha terkurasi.",
    link: "/analisis",
    badge: "Fitur AI #1",
    graphic: "analisis",
  },
  {
    id: "kalkulator",
    title: "Kalkulator Modal & BEP",
    desc: "Hitung simulasi modal berbasis UMR 18 kota dengan proyeksi arus kas 12 bulan.",
    link: "/kalkulator",
    badge: "Simulasi UMR",
    graphic: "kalkulator",
  },
  {
    id: "komparasi",
    title: "Komparasi Usaha vs UMR",
    desc: "Bandingkan estimasi laba usaha dengan Upah Minimum Regional kota domisili.",
    link: "/perbandingan",
    badge: "Komparasi Laba",
    graphic: "komparasi",
  },
  {
    id: "rencana",
    title: "Generator Rencana Bisnis",
    desc: "Dokumen proposal terstruktur lengkap dengan analisis SWOT dan strategi 90 hari.",
    link: "/rencana-bisnis",
    badge: "Export PDF",
    graphic: "rencana",
  },
  {
    id: "komunitas",
    title: "Komunitas & Impact SDG 8",
    desc: "Akses panduan legalitas NIB/PIRT dan direktori jejaring wirausaha lokal.",
    link: "/komunitas",
    badge: "Networking",
    graphic: "komunitas",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to middle card (Kalkulator)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : SERVICES.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < SERVICES.length - 1 ? prev + 1 : 0));
  };

  // Determine which 3 services to show based on activeIndex
  const getVisibleServices = () => {
    let start = activeIndex - 1;
    if (start < 0) start = 0;
    if (start + 3 > SERVICES.length) start = SERVICES.length - 3;
    return SERVICES.slice(start, start + 3).map((service) => ({
      service,
      originalIndex: SERVICES.findIndex((s) => s.id === service.id),
    }));
  };

  const visibleItems = getVisibleServices();

  return (
    <section className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-950 px-4 py-20 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Header Section matching Gambar 2 layout */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a] dark:text-emerald-400">
              LAYANAN KAMI
            </p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Our Services
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400 md:text-right">
            Temukan berbagai peluang dan layanan lengkap untuk membangun bisnis UMKM yang berkelanjutan.
          </p>
        </div>

        {/* 3 Cards Grid Layout matching Gambar 2 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          {visibleItems.map(({ service, originalIndex }) => {
            const isActive = originalIndex === activeIndex;

            return (
              <motion.div
                key={service.id}
                onClick={() => setActiveIndex(originalIndex)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`group relative flex flex-col justify-between rounded-[2.2rem] p-7 cursor-pointer transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-b from-[#16a34a] to-[#15803d] text-white shadow-2xl shadow-[#16a34a]/30 scale-[1.02] ring-4 ring-[#16a34a]/20 z-10"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-emerald-100/90 dark:border-slate-800 hover:border-[#16a34a]/50 dark:hover:border-emerald-500 shadow-md hover:shadow-xl hover:scale-[1.01]"
                }`}
              >
                {/* Top Section */}
                <div>
                  {/* Title & Top-Right Button */}
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={`text-2xl font-bold tracking-tight leading-snug ${
                        isActive ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {service.title}
                    </h3>

                    {/* Top-Right Arrow Circle Button (ONLY on Inactive Cards) */}
                    {!isActive && (
                      <Link
                        href={service.link}
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#15803d]"
                      >
                        <Icon icon="solar:arrow-right-up-linear" className="h-6 w-6" />
                      </Link>
                    )}
                  </div>

                  {/* Divider Line matching Gambar 2 */}
                  <div
                    className={`my-4 h-px w-full ${
                      isActive ? "bg-white/20" : "bg-slate-100"
                    }`}
                  />

                  {/* Description Text */}
                  <p
                    className={`text-sm leading-relaxed font-medium ${
                      isActive ? "text-emerald-50" : "text-slate-500"
                    }`}
                  >
                    {service.desc}
                  </p>
                </div>

                {/* Bottom Illustration Container */}
                <div className="relative mt-8">
                  <div
                    className={`relative h-52 w-full overflow-hidden rounded-[1.6rem] transition-all duration-500 flex items-center justify-center p-4 ${
                      isActive
                        ? "bg-[#14532d]/40 border border-white/20 shadow-inner"
                        : "bg-gradient-to-br from-[#16a34a] to-[#15803d]"
                    }`}
                  >
                    {/* Render Graphic per Service */}
                    {service.graphic === "analisis" && (
                      <div className="relative flex h-full w-full items-center justify-center gap-4">
                        {/* Target Circle Mockup */}
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 shadow-lg">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-white/20">
                            <Icon icon="solar:target-bold-duotone" className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        {/* Questionnaire Card Mockup */}
                        <div className="flex h-32 w-28 flex-col justify-between rounded-xl border border-white/30 bg-white/20 p-3 backdrop-blur-md shadow-lg">
                          <div className="flex items-center gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-white" />
                            <div className="h-2 w-14 rounded bg-white/60" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-2.5 w-full rounded bg-white/40" />
                            <div className="h-2.5 w-3/4 rounded bg-white/40" />
                            <div className="h-2.5 w-1/2 rounded bg-white/40" />
                          </div>
                          <div className="h-5 w-full rounded-lg bg-white/40 flex items-center justify-center">
                            <div className="h-1.5 w-10 rounded bg-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {service.graphic === "kalkulator" && (
                      <div className="relative flex h-full w-full items-center justify-center">
                        {/* Calculator Card Mockup */}
                        <div className="relative flex w-36 flex-col items-center rounded-2xl border border-white/30 bg-white/20 p-3.5 backdrop-blur-md shadow-xl">
                          {/* Floating Badge */}
                          <div className="absolute -top-3 -right-2 rounded-full border border-white/40 bg-white/30 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                            UMR 2026
                          </div>
                          {/* Calculator Screen */}
                          <div className="mb-3 w-full rounded-xl bg-white px-3 py-2 text-center shadow-inner">
                            <p className="text-[10px] font-bold text-slate-400">Total Modal Awal</p>
                            <p className="text-sm font-black text-[#16a34a]">Rp 14.500.000</p>
                          </div>
                          {/* Keypad Grid */}
                          <div className="grid w-full grid-cols-3 gap-1.5">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-4 rounded-md bg-white/40 transition-colors hover:bg-white/60"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {service.graphic === "komparasi" && (
                      <div className="relative flex h-full w-full flex-col items-center justify-center">
                        {/* Scale graphic */}
                        <div className="relative flex w-48 items-center justify-between px-2">
                          {/* Left Dish UMR */}
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="rounded-md border border-white/30 bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                              UMR
                            </span>
                            <div className="h-2 w-14 rounded-full bg-white/40" />
                          </div>

                          {/* Center Scale Beam */}
                          <div className="flex flex-col items-center">
                            <div className="h-4 w-4 rounded-full border-2 border-white bg-white/30" />
                            <div className="h-12 w-1.5 bg-white/70" />
                            <div className="h-3 w-20 rounded-t-lg bg-white/50" />
                          </div>

                          {/* Right Dish Laba */}
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="rounded-md border border-white/30 bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                              Laba
                            </span>
                            <div className="h-2 w-14 rounded-full bg-white/40" />
                          </div>
                        </div>
                      </div>
                    )}

                    {service.graphic === "rencana" && (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <div className="flex h-32 w-44 flex-col justify-between rounded-xl border border-white/30 bg-white/20 p-3.5 backdrop-blur-md shadow-lg">
                          <div className="flex items-center justify-between">
                            <div className="h-3.5 w-20 rounded bg-white/60" />
                            <span className="rounded bg-white/40 px-1.5 py-0.5 text-[9px] font-black text-white">
                              SWOT
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-2 w-full rounded bg-white/40" />
                            <div className="h-2 w-4/5 rounded bg-white/40" />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="h-6 rounded bg-white/30 p-1 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-white">Strategi 90h</span>
                            </div>
                            <div className="h-6 rounded bg-white/30 p-1 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-white">Proyeksi Laba</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {service.graphic === "komunitas" && (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <div className="flex items-center -space-x-3">
                          {[
                            { name: "Kuliner", color: "bg-emerald-600" },
                            { name: "Fashion", color: "bg-green-600" },
                            { name: "Kreatif", color: "bg-teal-600" },
                            { name: "Digital", color: "bg-emerald-700" },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-white ${item.color} font-bold text-[10px] text-white shadow-lg`}
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Overlapping Bottom-Left White Circular Arrow Button (ONLY for ACTIVE Card) matching Gambar 2 */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="absolute -bottom-3 -left-3 z-30"
                    >
                      <Link
                        href={service.link}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Buka ${service.title}`}
                        className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#16a34a] bg-white text-[#16a34a] shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 dark:bg-slate-900"
                      >
                        <Icon icon="solar:arrow-right-up-linear" className="h-8 w-8 text-[#16a34a]" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Controls matching Gambar 2 */}
        <div className="mt-10 flex items-center justify-between px-2">
          {/* Left / Right Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous service"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-[#16a34a] hover:bg-[#16a34a]/10 hover:text-[#16a34a] active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next service"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-[#16a34a] hover:bg-[#16a34a]/10 hover:text-[#16a34a] active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Icon icon="solar:alt-arrow-right-linear" className="h-5 w-5" />
            </button>
          </div>

          {/* Pagination Indicators matching Gambar 2 */}
          <div className="flex items-center gap-2">
            {SERVICES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-10 bg-[#16a34a]"
                    : "w-3 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
