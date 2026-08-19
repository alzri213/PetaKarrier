"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const POIN = [
  {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 C7 2 3 6 3 11 C3 16 12 22 12 22 C12 22 21 16 21 11 C21 6 17 2 12 2" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="11" r="4" fill="white"/>
      <circle cx="18" cy="5" r="1.5" fill="rgba(255,255,255,0.8)"/>
    </svg>`,
    title: "Data Riil 18 Kota Indonesia",
    desc: "Basis data standar UMR, sewa tempat, dan utilitas dikurasi per kota dari sumber kredibel, menghindari jebakan estimasi modal fiktif.",
    grad: "from-emerald-500 to-emerald-600",
  },
  {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L13 7 L18 8 L13 9 L12 14 L11 9 L6 8 L11 7 Z" fill="white"/>
      <circle cx="18" cy="5" r="2" fill="rgba(255,255,255,0.8)"/>
      <circle cx="6" cy="18" r="1.5" fill="rgba(255,255,255,0.6)"/>
    </svg>`,
    title: "Satu Alur Terintegrasi",
    desc: "Hasil analisis profil mengalir langsung ke kalkulator modal, komparasi UMR, hingga terbitnya dokumen rencana bisnis otomatis.",
    grad: "from-green-500 to-emerald-500",
  },
  {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20 L4 8 L12 12 L20 4 L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M4 8 L4 4 L12 8 L20 0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="20" cy="4" r="2" fill="white"/>
    </svg>`,
    title: "Keputusan Berbasis Data",
    desc: "Perbandingan laba vs UMR dan kurva break-even 12 bulan memberikan kepastian objektif sebelum Anda berkomitmen menginvestasikan modal.",
    grad: "from-amber-500 to-yellow-500",
  },
  {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
      <path d="M12 3 C12 3 15 6 15 9 C15 12 12 15 12 15 C12 15 9 12 9 9 C9 6 12 3 12 3" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M12 15 L12 21" stroke="white" strokeWidth="2"/>
      <path d="M9 18 L15 18" stroke="white" strokeWidth="2"/>
    </svg>`,
    title: "Keselarasan SDG 8 & RAN TPB",
    desc: "Mendukung target nasional penciptaan lapangan kerja produktif dan inklusif bagi generasi muda sesuai Matriks 4 Bappenas RI.",
    grad: "from-yellow-400 to-amber-400",
  },
];

const MARQUEE = [
  "🍱 Makanan Rumahan",
  "☕ Kedai Kopi",
  "🍛 Katering Nasi Box",
  "🧊 Frozen Food",
  "👕 Distro & Thrift",
  "🎨 Custom Merch & Sablon",
  "🖌️ Studio Desain Grafis",
  "📱 Content Creator",
  "📸 Foto & Video Studio",
  "🧺 Laundry Kiloan",
  "🛵 Cuci Steam Motor",
  "🛍️ Jasa Titip (Jastip)",
  "📚 Les Privat & Bimbel",
  "🌱 Urban Farming Hidroponik",
];

export default function WhySection() {
  return (
    <>
      <div className="relative overflow-hidden border-y border-slate-200 py-6 bg-gradient-to-r from-emerald-50 via-white to-amber-50">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-4">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
              Mengapa KonekUMKM?
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
              Jawaban Nyata untuk <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Tantangan Wirausaha</span>
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed text-lg">
              Jutaan generasi muda Indonesia memiliki impian membuka usaha namun terkendala validasi finansial, perizinan, dan kepastian pasar. KonekUMKM hadir memberikan solusi berbasis data.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {POIN.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group h-full rounded-[2rem] border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl"
                >
                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.grad} shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 border-2 border-white/30`}
                    dangerouslySetInnerHTML={{ __html: p.svg }}
                  />
                  <h3 className="mt-6 text-lg font-extrabold text-slate-900">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
