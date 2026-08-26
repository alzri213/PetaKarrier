"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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

export default function FeaturesSection() {
  // Kartu tengah (index 1) aktif secara default
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [foldedIndex, setFoldedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : SERVICES.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < SERVICES.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="relative overflow-visible bg-white px-4 py-24 transition-colors duration-500 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 sm:px-6 lg:px-8">
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

        {/* Grid 3 Kartu (Container Utama OVERFLOW-VISIBLE agar tombol menonjol tidak terpotong) */}
        <div
          className="relative mt-16 grid grid-cols-1 items-stretch gap-8 overflow-visible pb-10 md:grid-cols-3"
          style={{ perspective: 1200 }}
        >
          {SERVICES.map((service, index) => {
            const isActive = index === activeIndex;

            return (
              /* CONTAINER KARTU UTAMA - OVERFLOW-VISIBLE */
              <motion.div
                key={service.id}
                onClick={() => {
                  setActiveIndex(index);
                  setFoldedIndex(index);
                }}
                animate={
                  foldedIndex === index
                    ? {
                        rotateX: [0, 4, -3, 0],
                        rotateY: [0, -10, 6, 0],
                        y: [0, -5, 2, 0],
                      }
                    : { rotateX: 0, rotateY: 0, y: 0 }
                }
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  perspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                className={`group relative flex cursor-pointer select-none flex-col justify-between overflow-visible rounded-[2.5rem] px-7 pt-8 pb-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isActive
                    ? "bg-[#16a34a] text-white border-4 border-[#16a34a] shadow-2xl shadow-[#16a34a]/35 scale-[1.03] z-20"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-emerald-200 dark:border-slate-800 hover:border-[#16a34a]/60 shadow-md hover:shadow-xl hover:scale-[1.01] z-10"
                }`}
              >
                {/* ── SATU ELEMEN TOMBOL PANAH (JANGAN ADA DUA TOMBOL) YANG MENYERET DARI TOP-6 RIGHT-6 KE BOTTOM-[-2rem] LEFT-[-2rem] ── */}
                <motion.div
                  className={`absolute z-30 flex items-center justify-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isActive
                      ? "bottom-[-1rem] left-0 h-16 w-16 bg-white text-[#16a34a] border-4 border-[#16a34a] shadow-2xl sm:bottom-[-2rem] sm:left-[-2rem] sm:h-20 sm:w-20"
                      : "top-6 right-6 h-12 w-12 bg-[#16a34a] text-white border-0 shadow-md"
                  }`}
                >
                  <Link
                    href={service.href}
                    onClick={(e) => {
                      if (!isActive) {
                        e.preventDefault();
                        setActiveIndex(index);
                      }
                    }}
                    aria-label={`Buka ${service.title}`}
                    className="flex h-full w-full items-center justify-center rounded-full"
                  >
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isActive ? "h-9 w-9 text-[#16a34a]" : "h-6 w-6 text-white"
                      }`}
                    />
                  </Link>
                </motion.div>

                {/* Bagian Atas Teks */}
                <div className="pr-12">
                  <h3
                    className={`text-2xl font-extrabold tracking-tight leading-snug transition-colors duration-500 ${
                      isActive ? "text-white" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {service.title}
                  </h3>

                  {/* Garis Pemisah */}
                  <div
                    className={`my-4 h-px w-full transition-colors duration-500 ${
                      isActive ? "bg-white/25" : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  />

                  {/* Deskripsi */}
                  <p
                    className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${
                      isActive ? "text-emerald-50" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {service.desc}
                  </p>
                </div>

                {/* Container Gambar Menempel di Bawah (bottom-0 h-[200px]) */}
                <div className="relative mt-6 w-full overflow-visible">
                  {/* OVERFLOW-HIDDEN HANYA PADA CONTAINER GAMBAR AGAR SUDUT BAWAH MEMBULAT */}
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

        {/* Kontrol Navigasi Bawah */}
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

        {/* Section Tentang PetaKarier */}
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
