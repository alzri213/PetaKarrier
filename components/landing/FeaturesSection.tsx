"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface ServiceCardData {
  id: string;
  title: string;
  desc: string;
  href: string;
  imageSrc: string;
}

const SERVICES: ServiceCardData[] = [
  {
    id: "analisis",
    title: "Analisis Potensi Usaha",
    desc: "Kuesioner interaktif minat, skill & budget — cocokkan profil dengan 14 jenis usaha terkurasi.",
    href: "/analisis",
    imageSrc: "/services/analisis_real.jpg",
  },
  {
    id: "kalkulator",
    title: "Kalkulator Modal & BEP",
    desc: "Hitung simulasi modal berbasis UMR 38 provinsi dengan proyeksi arus kas 12 bulan.",
    href: "/kalkulator",
    imageSrc: "/services/kalkulator_real.jpg",
  },
  {
    id: "komparasi",
    title: "Komparasi Usaha vs UMR",
    desc: "Bandingkan estimasi laba usaha dengan Upah Minimum Regional kota domisili.",
    href: "/perbandingan",
    imageSrc: "/services/komparasi_real.jpg",
  },
];

const DRAG_THRESHOLD = 50;

export default function FeaturesSection() {
  // Start on middle card by default (just like Dribbble reference)
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [direction, setDirection] = useState<number>(0);

  // Drag tracking for mobile swipe
  const startX = useRef(0);
  const isDragging = useRef(false);
  const didDrag = useRef(false);

  const total = SERVICES.length;

  const goTo = (idx: number, dir = 0) => {
    setDirection(dir);
    const target = ((idx % total) + total) % total;
    setActiveIndex(target);
  };

  const handlePrev = () => {
    goTo(activeIndex - 1, -1);
  };

  const handleNext = () => {
    goTo(activeIndex + 1, 1);
  };

  // Mobile touch / pointer handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    if (Math.abs(e.clientX - startX.current) > 5) {
      didDrag.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (!didDrag.current) return;

    const dx = e.clientX - startX.current;
    if (dx < -DRAG_THRESHOLD) {
      handleNext();
    } else if (dx > DRAG_THRESHOLD) {
      handlePrev();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const currentService = SERVICES[activeIndex];

  return (
    <section className="relative overflow-visible bg-white px-4 py-16 sm:py-24 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl overflow-visible">
        {/* Section Header matching Dribbble reference */}
        <div className="flex flex-col gap-4 text-center md:text-left md:flex-row md:items-end md:justify-between">
          <Reveal className="w-full md:w-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl tracking-tight">
              Our Services
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="w-full md:w-auto">
            <p className="mx-auto md:mx-0 max-w-sm text-xs sm:text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400 md:text-right">
              Temukan berbagai peluang dan layanan lengkap untuk membangun bisnis UMKM yang berkelanjutan.
            </p>
          </Reveal>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            1. MOBILE CAROUSEL SLIDER VIEW (< md)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="mt-8 md:hidden cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentService.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col justify-between overflow-visible rounded-[2.2rem] bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] text-white border-4 border-[#10b981] p-6 pt-7 shadow-2xl shadow-emerald-600/35"
            >
              {/* Header Title */}
              <div>
                <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold text-white mb-2.5">
                  LAYANAN {activeIndex + 1} DARI {total}
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white">
                  {currentService.title}
                </h3>
              </div>

              {/* Divider */}
              <div className="my-3.5 h-px w-full bg-white/20" />

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed font-medium text-emerald-50">
                {currentService.desc}
              </p>

              {/* Card Image Container with Scoop Cutout */}
              <div className="relative mt-6 w-full overflow-visible pb-3">
                <div
                  className="relative h-52 w-full overflow-hidden rounded-[1.8rem] shadow-inner bg-slate-900"
                  style={{
                    WebkitMaskImage:
                      "radial-gradient(circle 62px at 24px calc(100% - 24px), transparent 61px, black 62px)",
                    maskImage:
                      "radial-gradient(circle 62px at 24px calc(100% - 24px), transparent 61px, black 62px)",
                  }}
                >
                  <Image
                    src={currentService.imageSrc}
                    alt={currentService.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* Overlapping Bottom-Left Circular Button (STARK PURE WHITE) */}
                <div className="absolute -bottom-2 -left-2 z-30">
                  <Link
                    href={currentService.href}
                    aria-label={`Buka ${currentService.title}`}
                    style={{ backgroundColor: "#ffffff" }}
                    className="flex h-[66px] w-[66px] items-center justify-center rounded-full border-[3.5px] border-[#047857] shadow-2xl transition-transform active:scale-95 cursor-pointer"
                  >
                    <Icon icon="solar:arrow-right-up-linear" className="h-8 w-8 text-[#047857] stroke-[3]" />
                  </Link>
                </div>
              </div>

              {/* Direct Link button */}
              <Link
                href={currentService.href}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-[#047857] shadow-lg transition hover:bg-emerald-50 active:scale-95 cursor-pointer"
              >
                <span>Buka Layanan {currentService.title}</span>
                <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Centered Bottom Navigation Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#10b981] hover:text-[#10b981] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {SERVICES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                  aria-label={`Ke Layanan ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-8 h-2 bg-[#10b981] shadow-sm"
                      : "w-2.5 h-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#10b981] hover:text-[#10b981] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. DESKTOP & TABLET 3-COLUMN GRID VIEW (>= md)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="relative mt-16 hidden md:grid md:grid-cols-3 items-stretch gap-6 lg:gap-8 overflow-visible pb-8"
        >
          {SERVICES.map((service, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={service.id}
                onClick={() => setActiveIndex(index)}
                layout
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative flex cursor-pointer select-none flex-col justify-between overflow-visible rounded-[2.6rem] p-7 transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] text-white border-4 border-[#10b981] shadow-2xl shadow-emerald-600/35 scale-[1.03] z-20"
                    : "bg-white dark:bg-[#0c1424] text-slate-900 dark:text-white border-2 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-xl hover:scale-[1.01] z-10"
                }`}
              >
                {/* Top Section */}
                <div>
                  {/* Title & Top-Right Button */}
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={`text-2xl font-black tracking-tight leading-snug transition-colors duration-300 ${
                        isActive ? "text-white" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {service.title}
                    </h3>

                    {/* Top-Right Arrow Circle Button (ONLY on Inactive Cards, exactly like reference) */}
                    {!isActive && (
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#059669]">
                        <Icon icon="solar:arrow-right-up-linear" className="h-6 w-6 text-white stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  {/* Clean Horizontal Divider Line under Title (matching reference) */}
                  <div
                    className={`my-4 h-[1.5px] w-full transition-colors duration-300 ${
                      isActive ? "bg-white/35" : "bg-slate-200/90 dark:bg-slate-800"
                    }`}
                  />

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed font-medium transition-colors duration-300 ${
                      isActive ? "text-emerald-50" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {service.desc}
                  </p>
                </div>

                {/* Card Image Container with Inverted Scoop Cutout */}
                <div className="relative mt-8 w-full overflow-visible pb-2">
                  <div
                    className={`relative h-[220px] w-full overflow-hidden transition-all duration-500 shadow-inner bg-slate-900 ${
                      isActive ? "rounded-[1.9rem]" : "rounded-[1.7rem]"
                    }`}
                    style={
                      isActive
                        ? {
                            WebkitMaskImage:
                              "radial-gradient(circle 64px at 24px calc(100% - 24px), transparent 63px, black 64px)",
                            maskImage:
                              "radial-gradient(circle 64px at 24px calc(100% - 24px), transparent 63px, black 64px)",
                          }
                        : undefined
                    }
                  >
                    <Image
                      src={service.imageSrc}
                      alt={service.title}
                      fill
                      sizes="33vw"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Overlapping Bottom-Left Circular Button (Active Card Only, PURE WHITE CIRCLE) */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 24 }}
                      className="absolute -bottom-3 -left-3 z-30"
                    >
                      <Link
                        href={service.href}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Akses Layanan ${service.title}`}
                        style={{ backgroundColor: "#ffffff" }}
                        className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[4px] border-[#047857] shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Icon
                          icon="solar:arrow-right-up-linear"
                          className="h-9 w-9 text-[#047857] stroke-[3]"
                        />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Navigation */}
        <div className="mt-8 hidden md:flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous service"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:border-[#10b981] hover:text-[#10b981] active:scale-95 cursor-pointer"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next service"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:border-[#10b981] hover:text-[#10b981] active:scale-95 cursor-pointer"
            >
              <Icon icon="solar:alt-arrow-right-linear" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {SERVICES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "w-10 bg-[#10b981]"
                    : "w-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* About section banner */}
        <Reveal className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-4xl text-center px-2">
            <h3 className="text-2xl sm:text-4xl md:text-[2.6rem] font-extrabold leading-snug sm:leading-tight text-slate-900 dark:text-white">
              <span className="text-slate-900 dark:text-white">Platform kami</span>{" "}
              <span className="text-[#10b981]">secara aktif</span>{" "}
              <span className="text-slate-900 dark:text-white">terhubung untuk</span>{" "}
              <span className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1 text-white sm:px-4 sm:py-1.5 align-middle shadow-md shadow-emerald-500/20">
                <Icon icon="solar:compass-bold" className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </span>{" "}
              <span className="text-amber-500">mewujudkan peluang</span>{" "}
              <span className="text-slate-900 dark:text-white">bagi pelaku UMKM di seluruh Indonesia</span>{" "}
              <span className="text-slate-900 dark:text-white">dengan dampak</span>{" "}
              <span className="text-yellow-400"> nyata.</span>
            </h3>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
