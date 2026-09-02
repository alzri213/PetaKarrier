"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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
    desc: "Hitung simulasi modal berbasis UMR 18 kota dengan proyeksi arus kas 12 bulan.",
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

const BTN_INACTIVE = 44;
const BTN_ACTIVE = 68;
const REST_TOP = 20;
const REST_RIGHT = 20;
const DRAG_THRESHOLD = 50;

interface ArrowButtonProps {
  isActive: boolean;
  href: string;
  label: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onActivate: () => void;
}

function ArrowButton({ isActive, href, label, cardRef, onActivate }: ArrowButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!cardRef.current) return;

    const compute = () => {
      const { width, height } = cardRef.current!.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const overhang = isMobile ? 12 : 24;
      const targetX = -(width - REST_RIGHT - BTN_ACTIVE + overhang);
      const targetY = height - REST_TOP - BTN_ACTIVE + overhang;
      setOffset({ x: targetX, y: targetY });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [cardRef]);

  return (
    <motion.div
      style={{ position: "absolute", top: REST_TOP, right: REST_RIGHT, zIndex: 30 }}
      animate={
        isActive
          ? { x: offset.x, y: offset.y, width: BTN_ACTIVE, height: BTN_ACTIVE }
          : { x: 0, y: 0, width: BTN_INACTIVE, height: BTN_INACTIVE }
      }
      initial={false}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex items-center justify-center rounded-full ${
        isActive
          ? "bg-white border-4 border-[#16a34a] shadow-2xl shadow-[#16a34a]/30"
          : "bg-[#16a34a] border-0 shadow-lg"
      }`}
    >
      <Link
        href={href}
        onClick={(e) => {
          if (!isActive) {
            e.preventDefault();
            onActivate();
          }
        }}
        aria-label={label}
        className="flex h-full w-full items-center justify-center rounded-full"
      >
        <motion.span
          animate={isActive ? { scale: 1 } : { scale: 1 }}
          className="flex items-center justify-center"
        >
          <Icon
            icon="solar:arrow-right-up-linear"
            className={`transition-all duration-300 ${
              isActive ? "h-7 w-7 text-[#16a34a]" : "h-5 w-5 text-white"
            }`}
          />
        </motion.span>
      </Link>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [direction, setDirection] = useState<number>(0);
  const [foldedIndex, setFoldedIndex] = useState<number | null>(null);

  // Drag tracking for mobile swipe
  const startX = useRef(0);
  const isDragging = useRef(false);
  const didDrag = useRef(false);

  // Desktop card refs
  const cardRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
    SERVICES.map(() => ({ current: null }))
  );
  const mobileCardRef = useRef<HTMLDivElement>(null);

  const total = SERVICES.length;

  const goTo = (idx: number, dir = 0) => {
    setDirection(dir);
    const target = ((idx % total) + total) % total;
    setActiveIndex(target);
    setFoldedIndex(target);
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
    <section className="relative overflow-visible bg-white px-4 py-16 sm:py-24 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-visible">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center md:text-left md:flex-row md:items-end md:justify-between">
          <Reveal className="w-full md:w-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
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
            Like Testimoni section: 1 Card with swipe & bottom controls
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
              className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#16a34a] text-white border-4 border-[#16a34a] p-6 pt-7 shadow-2xl shadow-[#16a34a]/30"
            >
              {/* Header Title & Top-Right Action Link */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold text-white mb-2.5">
                    LAYANAN {activeIndex + 1} DARI {total}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight leading-snug text-white">
                    {currentService.title}
                  </h3>
                </div>

                <Link
                  href={currentService.href}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#16a34a] shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label={`Buka ${currentService.title}`}
                >
                  <Icon icon="solar:arrow-right-up-linear" className="h-6 w-6 text-[#16a34a]" />
                </Link>
              </div>

              {/* Divider */}
              <div className="my-3.5 h-px w-full bg-white/25" />

              {/* Description */}
              <p className="text-xs leading-relaxed font-medium text-emerald-50">
                {currentService.desc}
              </p>

              {/* Card image */}
              <div className="relative mt-5 h-48 w-full overflow-hidden rounded-2xl shadow-md border border-white/20 bg-slate-900">
                <Image
                  src={currentService.imageSrc}
                  alt={currentService.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Bottom direct CTA button */}
              <Link
                href={currentService.href}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-[#16a34a] shadow-lg transition hover:bg-emerald-50 active:scale-95 cursor-pointer"
              >
                <span>Buka Layanan {currentService.title}</span>
                <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Centered Bottom Navigation Controls (Like Testimoni) */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#16a34a] hover:text-[#16a34a] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
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
                      ? "w-7 h-2 bg-[#16a34a] shadow-sm"
                      : "w-2 h-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#16a34a] hover:text-[#16a34a] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-2.5 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Geser kiri / kanan untuk melihat layanan lainnya
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. DESKTOP & TABLET 3-COLUMN GRID VIEW (>= md)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="relative mt-16 hidden md:grid md:grid-cols-3 items-stretch gap-6 sm:gap-8 overflow-visible pb-8"
          style={{ perspective: 1200 }}
        >
          {SERVICES.map((service, index) => {
            const isActive = index === activeIndex;
            const cardRef = cardRefs.current[index];

            return (
              <motion.div
                key={service.id}
                ref={cardRef as React.RefObject<HTMLDivElement>}
                onClick={() => {
                  setActiveIndex(index);
                  setFoldedIndex(index);
                }}
                animate={
                  foldedIndex === index
                    ? { rotateX: [0, 4, -3, 0], rotateY: [0, -10, 6, 0], y: [0, -5, 2, 0] }
                    : { rotateX: 0, rotateY: 0, y: 0 }
                }
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
                className={`group relative flex cursor-pointer select-none flex-col justify-between overflow-visible rounded-[2.5rem] px-7 pt-8 pb-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isActive
                    ? "bg-[#16a34a] text-white border-4 border-[#16a34a] shadow-2xl shadow-[#16a34a]/35 scale-[1.03] z-20"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-emerald-200 dark:border-slate-800 hover:border-[#16a34a]/60 shadow-md hover:shadow-xl hover:scale-[1.01] z-10"
                }`}
              >
                {/* Arrow button with smooth drag animation */}
                <ArrowButton
                  isActive={isActive}
                  href={service.href}
                  label={`Buka ${service.title}`}
                  cardRef={cardRef}
                  onActivate={() => setActiveIndex(index)}
                />

                {/* Title */}
                <div className="pr-12">
                  <h3
                    className={`text-2xl font-extrabold tracking-tight leading-snug transition-colors duration-500 ${
                      isActive ? "text-white" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {service.title}
                  </h3>

                  {/* Divider */}
                  <div
                    className={`my-4 h-px w-full transition-colors duration-500 ${
                      isActive ? "bg-white/25" : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  />

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${
                      isActive ? "text-emerald-50" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {service.desc}
                  </p>
                </div>

                {/* Card image */}
                <div className="relative mt-6 w-full overflow-visible">
                  <div className="relative h-[200px] w-full overflow-hidden rounded-b-[2.2rem] rounded-t-[1.2rem] shadow-md border-t border-black/5 bg-slate-900">
                    <Image
                      src={service.imageSrc}
                      alt={service.title}
                      fill
                      sizes="33vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
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
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-[#16a34a] hover:bg-[#16a34a]/10 hover:text-[#16a34a] active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next service"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-[#16a34a] hover:bg-[#16a34a]/10 hover:text-[#16a34a] active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
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
                    ? "w-10 bg-[#16a34a]"
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
              <span className="text-[#16a34a]">secara aktif</span>{" "}
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
