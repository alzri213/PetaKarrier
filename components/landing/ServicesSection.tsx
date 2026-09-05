"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    desc: "Hitung simulasi modal berbasis UMR 38 provinsi dengan proyeksi arus kas 12 bulan.",
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
  const [activeIndex, setActiveIndex] = useState(0); // Start from first card for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : SERVICES.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < SERVICES.length - 1 ? prev + 1 : 0));
  };

  // Handle touch swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // For desktop: show 3 cards centered around active
  const getVisibleServicesDesktop = () => {
    let start = activeIndex - 1;
    if (start < 0) start = 0;
    if (start + 3 > SERVICES.length) start = SERVICES.length - 3;
    return SERVICES.slice(start, start + 3).map((service) => ({
      service,
      originalIndex: SERVICES.findIndex((s) => s.id === service.id),
    }));
  };

  const visibleItemsDesktop = getVisibleServicesDesktop();
  const currentService = SERVICES[activeIndex];

  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section matching Gambar 2 layout */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
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

        {/* Mobile: Single Card Carousel with absolute positioning */}
        <div 
          className="relative h-[530px] overflow-hidden md:hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentService.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-[1.5rem] bg-gradient-to-b from-[#16a34a] to-[#15803d] p-5 text-white shadow-2xl shadow-[#16a34a]/30 sm:p-6"
            >
            {/* Top Section */}
            <div>
              {/* Badge */}
              {currentService.badge && (
                <span className="inline-block rounded-full bg-white/20 border border-white/30 px-3 py-1 text-xs font-bold text-white mb-3">
                  {currentService.badge}
                </span>
              )}

              {/* Title */}
              <h3 className="mb-3 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
                {currentService.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed font-medium text-emerald-50">
                {currentService.desc}
              </p>
            </div>

            {/* Bottom Illustration Container */}
            <div className="relative mt-5 sm:mt-6">
              <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-[1.2rem] border border-white/20 bg-[#14532d]/40 p-3 shadow-inner sm:h-40">
                {/* Render Graphics (same as desktop) */}
                {currentService.graphic === "analisis" && (
                  <div className="relative flex h-full w-full items-center justify-center gap-3">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 shadow-lg">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40 bg-white/20">
                        <Icon icon="solar:target-bold-duotone" className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex h-28 w-24 flex-col justify-between rounded-xl border border-white/30 bg-white/20 p-2.5 backdrop-blur-md shadow-lg">
                      <div className="flex items-center gap-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                        <div className="h-1.5 w-12 rounded bg-white/60" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded bg-white/40" />
                        <div className="h-2 w-3/4 rounded bg-white/40" />
                        <div className="h-2 w-1/2 rounded bg-white/40" />
                      </div>
                      <div className="h-4 w-full rounded-lg bg-white/40 flex items-center justify-center">
                        <div className="h-1 w-8 rounded bg-white" />
                      </div>
                    </div>
                  </div>
                )}

                {currentService.graphic === "kalkulator" && (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="relative flex w-32 flex-col items-center rounded-2xl border border-white/30 bg-white/20 p-3 backdrop-blur-md shadow-xl">
                      <div className="absolute -top-2.5 -right-1.5 rounded-full border border-white/40 bg-white/30 px-2 py-0.5 text-[9px] font-extrabold text-white shadow-sm">
                        UMR 2026
                      </div>
                      <div className="mb-2.5 w-full rounded-xl bg-white px-2.5 py-1.5 text-center shadow-inner">
                        <p className="text-[9px] font-bold text-slate-400">Total Modal Awal</p>
                        <p className="text-xs font-black text-[#16a34a]">Rp 14.5jt</p>
                      </div>
                      <div className="grid w-full grid-cols-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="h-3.5 rounded-md bg-white/40" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentService.graphic === "komparasi" && (
                  <div className="relative flex h-full w-full flex-col items-center justify-center">
                    <div className="relative flex w-40 items-center justify-between px-2">
                      <div className="flex flex-col items-center gap-1">
                        <span className="rounded-md border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          UMR
                        </span>
                        <div className="h-1.5 w-12 rounded-full bg-white/40" />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-white/30" />
                        <div className="h-10 w-1 bg-white/70" />
                        <div className="h-2.5 w-16 rounded-t-lg bg-white/50" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="rounded-md border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          Laba
                        </span>
                        <div className="h-1.5 w-12 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>
                )}

                {currentService.graphic === "rencana" && (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="flex h-28 w-40 flex-col justify-between rounded-xl border border-white/30 bg-white/20 p-3 backdrop-blur-md shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-16 rounded bg-white/60" />
                        <span className="rounded bg-white/40 px-1.5 py-0.5 text-[8px] font-black text-white">
                          SWOT
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded bg-white/40" />
                        <div className="h-1.5 w-4/5 rounded bg-white/40" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-5 rounded bg-white/30 p-1 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">90 Hari</span>
                        </div>
                        <div className="h-5 rounded bg-white/30 p-1 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">Proyeksi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentService.graphic === "komunitas" && (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="flex items-center -space-x-2.5">
                      {[
                        { name: "Kuliner", color: "bg-emerald-600" },
                        { name: "Fashion", color: "bg-green-600" },
                        { name: "Kreatif", color: "bg-teal-600" },
                        { name: "Digital", color: "bg-emerald-700" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${item.color} font-bold text-[9px] text-white shadow-lg`}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-4">
                <Link
                  href={currentService.link}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#16a34a] shadow-lg transition-transform duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <span>Akses Layanan Resmi</span>
                  <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Desktop: 3 Cards Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-6 items-stretch">
          {visibleItemsDesktop.map(({ service, originalIndex }) => {
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
                    ? "bg-gradient-to-b from-[#16a34a] to-[#15803d] text-white shadow-2xl shadow-[#16a34a]/30 scale-[1.02] ring-2 sm:ring-4 ring-[#16a34a]/20 z-10"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-emerald-100/90 dark:border-slate-800 hover:border-[#16a34a]/50 dark:hover:border-emerald-500 shadow-md hover:shadow-xl hover:scale-[1.01]"
                }`}
              >
                {/* Top Section */}
                <div>
                  {/* Title & Top-Right Button */}
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={`text-2xl font-bold tracking-tight leading-snug ${
                        isActive ? "text-white" : "text-slate-900 dark:text-white"
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
                      isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  />

                  {/* Description Text */}
                  <p
                    className={`text-sm leading-relaxed font-medium ${
                      isActive ? "text-emerald-50" : "text-slate-500 dark:text-slate-400"
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
        <div className="mt-6 flex items-center justify-between px-1 sm:mt-8 sm:px-2">
          {/* Left / Right Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Counter & Pagination Indicators */}
          <div className="flex items-center gap-3">
            {/* Mobile: Show counter like "1 / 5" */}
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 md:hidden">
              {activeIndex + 1} / {SERVICES.length}
            </span>

            {/* Desktop: Show dot indicators */}
            <div className="hidden md:flex items-center gap-2">
              {SERVICES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-10 bg-[#16a34a]"
                      : "w-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
