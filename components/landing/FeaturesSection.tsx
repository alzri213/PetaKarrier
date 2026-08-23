"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ArrowRight, BarChart3, Calculator, Scale } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  {
    href: "/analisis",
    icon: BarChart3,
    title: "Analisis Potensi Usaha",
    desc: "Kuesioner interaktif minat, skill & budget — cocokkan profil dengan 14 jenis usaha.",
    gradient: "from-emerald-500 to-emerald-600",
    illustration: "analysis",
  },
  {
    href: "/kalkulator",
    icon: Calculator,
    title: "Kalkulator Modal & BEP",
    desc: "Hitung simulasi modal berbasis UMR 18 kota dengan proyeksi arus kas 12 bulan.",
    gradient: "from-emerald-500 to-green-500",
    illustration: "calculator",
  },
  {
    href: "/perbandingan",
    icon: Scale,
    title: "Komparasi Usaha vs UMR",
    desc: "Bandingkan estimasi laba usaha dengan Upah Minimum Regional kota domisili.",
    gradient: "from-green-500 to-emerald-500",
    illustration: "compare",
  },
];

/* ── Service card illustrations ── */
function ServiceIllustration({ type }: { type: string }) {
  if (type === "analysis") {
    return (
      <svg viewBox="0 0 300 180" fill="none" className="h-full w-full">
        <rect width="300" height="180" fill="url(#g1)" />
        <defs><linearGradient id="g1" x1="0" y1="0" x2="300" y2="180"><stop stopColor="#059669" /><stop offset="1" stopColor="#10b981" /></linearGradient></defs>
        <circle cx="80" cy="90" r="48" fill="rgba(255,255,255,0.1)" />
        <circle cx="80" cy="90" r="32" fill="rgba(255,255,255,0.13)" />
        <rect x="155" y="30" width="95" height="115" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="167" y="48" width="28" height="22" rx="5" fill="rgba(255,255,255,0.18)" />
        <rect x="201" y="48" width="28" height="22" rx="5" fill="rgba(255,255,255,0.18)" />
        <rect x="167" y="76" width="62" height="16" rx="5" fill="rgba(255,255,255,0.12)" />
        <rect x="167" y="98" width="42" height="16" rx="5" fill="rgba(255,255,255,0.12)" />
        <circle cx="250" cy="42" r="14" fill="rgba(255,255,255,0.18)" />
        <circle cx="42" cy="148" r="10" fill="rgba(255,255,255,0.12)" />
        <circle cx="268" cy="148" r="7" fill="rgba(255,255,255,0.18)" />
      </svg>
    );
  }
  if (type === "calculator") {
    return (
      <svg viewBox="0 0 300 180" fill="none" className="h-full w-full">
        <rect width="300" height="180" fill="url(#g2)" />
        <defs><linearGradient id="g2" x1="0" y1="0" x2="300" y2="180"><stop stopColor="#10b981" /><stop offset="1" stopColor="#16a34a" /></linearGradient></defs>
        <rect x="100" y="10" width="100" height="155" rx="16" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <rect x="110" y="22" width="80" height="32" rx="7" fill="rgba(255,255,255,0.22)" />
        <text x="150" y="43" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="15" fontWeight="bold">Rp 14JT</text>
        {[0,1,2,3].map(row => [0,1,2].map(col => (
          <rect key={`${row}${col}`} x={112 + col * 26} y={62 + row * 22} width="22" height="18" rx="5" fill="rgba(255,255,255,0.18)" />
        )))}
        <circle cx="52" cy="80" r="22" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="52" y="84" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11" fontWeight="bold">Rp</text>
        <circle cx="248" cy="100" r="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 180" fill="none" className="h-full w-full">
      <rect width="300" height="180" fill="url(#g3)" />
      <defs><linearGradient id="g3" x1="0" y1="0" x2="300" y2="180"><stop stopColor="#16a34a" /><stop offset="1" stopColor="#15803d" /></linearGradient></defs>
      <line x1="150" y1="22" x2="150" y2="100" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" />
      <line x1="82" y1="52" x2="218" y2="52" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="150" cy="22" r="9" fill="rgba(255,255,255,0.28)" />
      <path d="M82 52 L65 100 L99 100 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <text x="82" y="85" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontWeight="bold">UMR</text>
      <path d="M218 52 L201 95 L235 95 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <text x="218" y="82" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontWeight="bold">Laba</text>
      <rect x="116" y="100" width="68" height="9" rx="4.5" fill="rgba(255,255,255,0.18)" />
      <rect x="131" y="109" width="38" height="46" rx="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx="45" cy="145" r="11" fill="rgba(255,255,255,0.08)" />
      <circle cx="260" cy="42" r="9" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

/* ── Single service card with diagonal roll animation ── */
function ServiceCard({ svc, index }: { svc: (typeof SERVICES)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex shrink-0 flex-col overflow-hidden rounded-[1.5rem] border-2 border-slate-200 bg-white w-[320px] sm:w-[340px] snap-center"
      animate={{
        borderColor: hovered ? "rgb(16 185 129 / 0.6)" : "rgb(226 232 240 / 1)",
        y: hovered ? -6 : 0,
        boxShadow: hovered
          ? "0 20px 40px -12px rgba(16,185,129,0.25)"
          : "0 4px 6px -4px rgba(0,0,0,0.05)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {/* Gradient overlay — diagonal roll from bottom-left corner to top-right */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #10b981 40%, #16a34a 100%)",
        }}
        initial={{ clipPath: "polygon(0% 100%, 0% 100%, 0% 100%)" }}
        animate={{
          clipPath: hovered
            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            : "polygon(0% 100%, 0% 100%, 0% 100%)",
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.15, 1] }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col p-6 pb-0 sm:p-7 sm:pb-0">
        <div className="flex items-start justify-between">
          <motion.div
            animate={{ color: hovered ? "#ffffff" : "#0f172a" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-extrabold sm:text-xl">{svc.title}</h3>
            <motion.p
              className="mt-2 text-sm leading-relaxed"
              animate={{ color: hovered ? "rgba(255,255,255,0.8)" : "#64748b" }}
              transition={{ duration: 0.3 }}
            >
              {svc.desc}
            </motion.p>
          </motion.div>

          <motion.div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            animate={{
              backgroundColor: hovered ? "rgba(255,255,255,0.25)" : "rgb(16 185 129 / 1)",
              rotate: hovered ? -45 : 0,
              scale: hovered ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.div>
        </div>
      </div>

      {/* Illustration */}
      <div className="relative z-10 mt-4 px-5 sm:px-6">
        <div className="overflow-hidden rounded-2xl">
          <ServiceIllustration type={svc.illustration} />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between p-6 pt-4">
        <Link
          href={svc.href}
          className="inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-300 group-hover:gap-2.5"
        >
          <motion.span animate={{ color: hovered ? "#ffffff" : "#059669" }} transition={{ duration: 0.3 }}>
            Jelajahi
          </motion.span>
          <motion.span animate={{ color: hovered ? "#ffffff" : "#059669" }} transition={{ duration: 0.3 }}>
            <ArrowUpRight className="h-4 w-4" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-emerald-100 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-green-100 blur-3xl opacity-40" />

      <div className="mx-auto max-w-7xl">
        {/* Header row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
              Layanan Kami
            </p>
            <h2 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Our Services
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 lg:text-right">
              Temukan berbagai peluang dan layanan lengkap untuk membangun bisnis UMKM yang berkelanjutan.
            </p>
          </Reveal>
        </div>

        {/* Carousel */}
        <div className="mt-14 relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {SERVICES.map((svc, i) => (
              <ServiceCard key={svc.href} svc={svc} index={i} />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-600 transition-all hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-600 transition-all hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── About section ── */}
        <Reveal className="mt-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-emerald-700">
              Tentang PetaKarier
            </p>
            <h3 className="mt-8 text-3xl font-bold leading-snug text-slate-900 sm:text-5xl md:text-[2.75rem]">
              <span className="text-slate-900">Platform kami</span>{" "}
              <span className="text-emerald-700">secara aktif</span>{" "}
              <span className="text-slate-900">terhubung untuk</span>{" "}
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 px-3 py-1 text-white sm:px-4 sm:py-1.5">
                <Sparkle className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>{" "}
              <span className="text-amber-500">mewujudkan peluang</span>{" "}
              <span className="text-slate-900">bagi pelaku UMKM di seluruh Indonesia</span>{" "}
              <span className="text-slate-900">dengan dampak</span>{" "}
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
