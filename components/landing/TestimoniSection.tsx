"use client";

import { motion } from "framer-motion";
import { Star, Quote, MapPin } from "lucide-react";
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
      "KonekUMKM ngasih perhitungan break-even yang sangat akurat. Dulu ragu mulai karena takut modal habis di sewa, tapi dengan simulasi 18 kota, saya bisa pilih skala yang pas dan balik modal di bulan ke-5!",
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
      "Sebagai freelancer yang mau bikin studio, KonekUMKM membantu saya menyusun proyeksi keuangan 12 bulan dan alokasi modal legalitas NIB. Sekarang studio saya sudah menyerap 2 karyawan pemuda lokal!",
  },
];

export default function TestimoniSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
            Kisah Sukses Pengguna
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Dipercaya Oleh <span className="text-emerald-600">Wirausaha Muda Indonesia</span>
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Mereka telah memetakan karier bisnis, menghitung kelayakan modal, dan mewujudkan usaha mandiri berkelanjutan.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONI.map((t, i) => (
            <Reveal key={t.nama} delay={i * 0.12}>
              <div className="flex h-full flex-col justify-between rounded-3xl border-slate-200 bg-white p-7 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50/50">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    &ldquo;{t.testimoni}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3.5 border-t border-slate-200 pt-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-2xl shadow-inner">
                    {t.foto}
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {t.nama} <span className="text-xs text-slate-500 font-normal">({t.umur} th)</span>
                    </h4>
                    <p className="text-xs font-semibold text-emerald-600">{t.usaha}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {t.kota}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
