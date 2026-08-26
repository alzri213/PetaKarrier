"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, MapPin } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

const TESTIMONI = [
  {
    nama: "Fajar Pratama",
    umur: 24,
    kota: "Bandung, Jawa Barat",
    usaha: "Kedai Kopi Minimalis",
    foto: "☕",
    rating: 5,
    testimoni:
      "PetaKarier ngasih perhitungan break-even yang sangat akurat. Dulu ragu mulai karena takut modal habis di sewa, tapi dengan simulasi 18 kota, saya bisa pilih skala yang pas dan balik modal di bulan ke-5!",
  },
  {
    nama: "Nadia Anggraini",
    umur: 22,
    kota: "Surabaya, Jawa Timur",
    usaha: "Katering Nasi Box Rumahan",
    foto: "🍱",
    rating: 5,
    testimoni:
      "Fitur perbandingan UMR-nya ngebuka mata banget. Laba bersih katering rumahan ternyata bisa 140% di atas UMR Surabaya. Rencana bisnis yang di-generate langsung saya pakai buat presentasi ke orang tua dan mitra.",
  },
  {
    nama: "Rizky Firmansyah",
    umur: 26,
    kota: "Yogyakarta",
    usaha: "Studio Desain & Branding",
    foto: "🎨",
    rating: 5,
    testimoni:
      "Sebagai freelancer yang mau bikin studio, PetaKarier membantu saya menyusun proyeksi keuangan 12 bulan dan alokasi modal legalitas NIB. Sekarang studio saya sudah menyerap 2 karyawan pemuda lokal!",
  },
];

export default function TestimoniSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? TESTIMONI.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === TESTIMONI.length - 1 ? 0 : current + 1));
  };

  return (
    <section className="relative bg-white px-4 py-24 transition-colors duration-500 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Dipercaya Oleh <span className="text-emerald-600">Wirausaha Muda Indonesia</span>
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            Mereka telah memetakan karier bisnis, menghitung kelayakan modal, dan mewujudkan usaha mandiri berkelanjutan.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONI.map((t, i) => (
            <Reveal key={t.nama} delay={i * 0.12}>
              <motion.div
                animate={activeIndex === i ? { y: -5, rotateX: 0, rotateY: 0 } : { y: 0, rotateX: 0, rotateY: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={() => setActiveIndex(i)}
                className={`group h-full flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-md transition-all duration-300 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 md:flex ${activeIndex === i ? "flex ring-2 ring-emerald-500/30" : "hidden"}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    &ldquo;{t.testimoni}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3.5 border-t border-slate-200 pt-4 dark:border-slate-800">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-2xl shadow-inner">
                    {t.foto}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {t.nama} <span className="text-xs text-slate-500 font-normal">({t.umur} th)</span>
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600">{t.usaha}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {t.kota}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 md:hidden">
          <button
            type="button"
            onClick={showPrevious}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Testimoni sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2" aria-label={`Testimoni ${activeIndex + 1} dari ${TESTIMONI.length}`}>
            {TESTIMONI.map((t, index) => (
              <button
                key={t.nama}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-emerald-500" : "w-2 bg-slate-300 dark:bg-slate-700"}`}
                aria-label={`Tampilkan testimoni ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={showNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Testimoni berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
