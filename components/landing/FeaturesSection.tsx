"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
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

// Sizes (px) for the arrow button
const BTN_INACTIVE = 48;
const BTN_ACTIVE = 80;

// Resting position (top-right corner offset)
const REST_TOP = 24;
const REST_RIGHT = 24;

// Active overhang outside the card (how far it sticks out bottom-left)
const OVERHANG = 32; // 2rem

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
      // From top-right origin, travel to bottom-left outside the card
      // x: move left past the left edge (negative = leftward)
      // y: move down past the bottom edge (positive = downward)
      const targetX = -(width - REST_RIGHT - BTN_ACTIVE + OVERHANG);
      const targetY = height - REST_TOP - BTN_ACTIVE + OVERHANG;
      setOffset({ x: targetX, y: targetY });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [cardRef]);

  return (
    <motion.div
      /* Always anchored at top-right */
      style={{ position: "absolute", top: REST_TOP, right: REST_RIGHT, zIndex: 30 }}
      animate={
        isActive
          ? { x: offset.x, y: offset.y, width: BTN_ACTIVE, height: BTN_ACTIVE }
          : { x: 0, y: 0, width: BTN_INACTIVE, height: BTN_INACTIVE }
      }
      initial={false}
      transition={{
        duration: 0.7,
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
            className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isActive ? "h-9 w-9 text-[#16a34a]" : "h-6 w-6 text-white"
            }`}
          />
        </motion.span>
      </Link>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [foldedIndex, setFoldedIndex] = useState<number | null>(null);

  // One ref per card
  const cardRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
    SERVICES.map(() => ({ current: null }))
  );

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : SERVICES.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < SERVICES.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="relative overflow-visible bg-white px-4 py-24 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-visible">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
              Our Services
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400 lg:text-right">
              Temukan berbagai peluang dan layanan lengkap untuk membangun bisnis UMKM yang berkelanjutan.
            </p>
          </Reveal>
        </div>

        {/* Card Grid */}
        <div
          className="relative mt-16 grid grid-cols-1 items-stretch gap-8 overflow-visible pb-10 md:grid-cols-3"
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
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between px-2">
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

          <div className="flex items-center gap-2">
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

        {/* About section */}
        <Reveal className="mt-28">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-3xl font-bold leading-snug text-slate-900 dark:text-white sm:text-5xl md:text-[2.75rem]">
              <span className="text-slate-900 dark:text-white">Platform kami</span>{" "}
              <span className="text-[#16a34a]">secara aktif</span>{" "}
              <span className="text-slate-900 dark:text-white">terhubung untuk</span>{" "}
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 px-3 py-1 text-white sm:px-4 sm:py-1.5">
                <Sparkle className="h-4 w-4 sm:h-5 sm:w-5" />
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

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
    </svg>
  );
}
