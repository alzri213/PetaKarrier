"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Icon } from "@iconify/react";
import Reveal from "@/components/ui/Reveal";

export interface TimelineStep {
  icon: string;
  title: string;
  desc: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
}

export const DEFAULT_STEPS: TimelineStep[] = [
  {
    icon: "solar:user-plus-bold",
    title: "Isi Profil Usaha & Budget",
    desc: "Mulai dengan memasukkan minat, keahlian, dan ketersediaan modal awalmu.",
    imageSrc:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Perajin wanita menyulam benang emas pada kain tapis tradisional",
    href: "/analisis",
  },
  {
    icon: "solar:clipboard-list-bold",
    title: "Kuesioner Interaktif 2 Menit",
    desc: "Jawab beberapa pertanyaan singkat mengenai kesiapan dan komitmen usahamu.",
    imageSrc:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Nenek yang semangat berjualan kerajinan di pasar tradisional",
    href: "/analisis",
  },
  {
    icon: "solar:magnifier-bold",
    title: "Pencocokan Rekomendasi Usaha",
    desc: "Sistem mencocokkan profilmu dengan 14 jenis usaha terkurasi dan analisis risiko.",
    imageSrc:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Studio desain kertas dan pengrajin berkreasi dengan berbagai alat",
    href: "/analisis",
  },
  {
    icon: "solar:calculator-bold",
    title: "Simulasi Modal & Parameter Kota",
    desc: "Pilih kota domisili untuk menghitung biaya sewa, UMR, utilitas, dan margin laba.",
    imageSrc:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Close-up tangan desainer memegang sampel cetak di dekat laptop",
    href: "/kalkulator",
  },
  {
    icon: "solar:scale-bold",
    title: "Komparasi Finansial vs UMR",
    desc: "Bandingkan kelayakan return usaha vs gaji upah minimum di wilayah pilihanmu.",
    imageSrc:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Pria dengan janggut memegang papan OPEN di depan barbershop",
    href: "/perbandingan",
  },
  {
    icon: "solar:document-text-bold",
    title: "Dokumen Rencana Bisnis Otomatis",
    desc: "Dapatkan dokumen rencana bisnis profesional standar KUR/perbankan, siap diunduh.",
    imageSrc:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Pemandangan dalam sebuah studio desain dengan seorang pekerja kreatif",
    href: "/rencana-bisnis",
  },
];

interface VerticalUserFlowTimelineProps {
  steps?: TimelineStep[];
  titlePrefix?: string;
  titleHighlight?: string;
  subtitle?: string;
}

export default function FlowSection({
  steps = DEFAULT_STEPS,
  titlePrefix = "Dari Nol Menuju ",
  titleHighlight = "Rencana Bisnis Matang",
  subtitle = "Hanya butuh kurang dari 5 menit untuk mendapatkan simulasi modal dan dokumen rencana bisnis pertamamu.",
}: VerticalUserFlowTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress tied strictly to this section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 80%"],
  });

  // Spring physics for smooth drawing/undrawing line effect
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section
      id="cara-kerja"
      ref={containerRef}
      className="relative overflow-hidden bg-white px-4 py-16 sm:py-24 dark:bg-slate-950 sm:px-6 lg:px-8"
    >
      {/* Ambient background glow (Dark Mode Only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden dark:block">
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-[#16a34a]/10 blur-[130px]" />
        <div className="absolute left-1/4 bottom-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <Reveal className="text-center px-2">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            <span>{titlePrefix}</span>
            <span className="text-[#16a34a]">{titleHighlight}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        </Reveal>

        {/* Vertical Zigzag Flow Container */}
        <div className="relative mt-14 sm:mt-20">
          {/* Base Background Central Line (Gray Track) */}
          <div className="absolute left-[22px] top-4 h-[calc(100%-32px)] w-1 rounded-full bg-slate-200 dark:bg-slate-800 sm:left-1/2 sm:-translate-x-1/2" />

          {/* Animated Scroll-Linked Green Filling Line */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-[22px] top-4 h-[calc(100%-32px)] w-1.5 origin-top rounded-full bg-[#16a34a] shadow-[0_0_12px_rgba(22,163,74,0.6)] sm:left-1/2 sm:-translate-x-1/2"
          />

          {/* Timeline Steps List */}
          <div className="space-y-8 sm:space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.title}
                  className={`relative flex items-start sm:items-center gap-3.5 sm:gap-0 ${
                    isEven
                      ? "sm:flex-row sm:pr-[calc(50%+3.5rem)]"
                      : "sm:flex-row-reverse sm:pl-[calc(50%+3.5rem)]"
                  }`}
                >
                  {/* Central Line Icon Badge */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    whileInView={{ scale: 1.1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 20,
                    }}
                    className="relative z-20 flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-lg shadow-[#16a34a]/30 border-[3px] sm:border-4 border-white dark:border-slate-900 sm:absolute sm:left-1/2 sm:-translate-x-1/2 mt-2 sm:mt-0"
                  >
                    <Icon icon={step.icon} className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </motion.div>

                  {/* Reactive Step Card with Image */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="group flex-1 min-w-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    {/* Top Image Container */}
                    <div className="relative h-36 sm:h-48 w-full overflow-hidden">
                      <Image
                        src={step.imageSrc}
                        alt={step.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                    </div>

                    {/* Bottom Card Content */}
                    <div className="p-4 sm:p-6">
                      <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#16a34a] mb-2 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-[#00df82]">
                        LANGKAH {index + 1}
                      </span>
                      <h3 className="text-base sm:text-xl font-extrabold leading-snug text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                        {step.desc}
                      </p>

                      {/* Bottom Interactive Link */}
                      <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <Link
                          href={step.href || "/analisis"}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:text-emerald-800 dark:text-[#00df82] dark:hover:text-emerald-400 transition-colors"
                        >
                          <span>Selengkapnya</span>
                          <Icon
                            icon="solar:arrow-right-linear"
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
                          Estimasi ~1 Menit
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
