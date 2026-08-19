"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CreditCard,
  QrCode,
  GraduationCap,
  Users2,
  ExternalLink,
  Search,
  CheckCircle,
  Building,
  Sparkles,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { ResourceItem } from "@/types";

const RESOURCES: ResourceItem[] = [
  {
    id: "nib-oss",
    kategori: "perizinan",
    judul: "Pendaftaran Nomor Induk Berusaha (NIB) Online",
    deskripsi:
      "Panduan pendaftaran legalitas usaha mikro & kecil secara gratis melalui sistem Online Single Submission (OSS RBA) Kementerian Investasi/BKPM.",
    link: "https://oss.go.id",
    badge: "Resmi Pemerintah",
    icon: "🏛️",
  },
  {
    id: "sertifikasi-halal",
    kategori: "perizinan",
    judul: "Sertifikasi Halal Gratis (SEHATI) BPJPH",
    deskripsi:
      "Program sertifikasi halal self-declare untuk produk makanan, minuman, dan olahan UMKM melalui Badan Penyelenggara Jaminan Produk Halal.",
    link: "https://ptsp.halal.go.id",
    badge: "Fasilitasi Kemenag",
    icon: "📜",
  },
  {
    id: "kur-bank",
    kategori: "pembiayaan",
    judul: "Kredit Usaha Rakyat (KUR) Bunga Rendah",
    deskripsi:
      "Informasi pengajuan pinjaman modal kerja & investasi bersubsidi bunga 6% efektif per tahun untuk UMKM pemula tanpa agunan tambahan hingga Rp50 juta.",
    link: "https://kur.ekon.go.id",
    badge: "Bunga Subsidi 6%",
    icon: "💳",
  },
  {
    id: "lpdb-kumkm",
    kategori: "pembiayaan",
    judul: "Dana Bergulir LPDB Kemenkop UKM",
    deskripsi:
      "Akses pembiayaan murah dan pendampingan manajemen bisnis bagi koperasi dan kelompok UMKM potensial di seluruh Indonesia.",
    link: "https://lpdb.kemenkopukm.go.id",
    badge: "Dana Bergulir",
    icon: "💰",
  },
  {
    id: "qris-bi",
    kategori: "digital",
    judul: "Integrasi Pembayaran Digital QRIS",
    deskripsi:
      "Panduan registrasi merchant QRIS resmi dari Bank Indonesia untuk menerima pembayaran dari seluruh e-wallet dan mobile banking tanpa biaya rumit.",
    link: "https://qris.id",
    badge: "Cashless Ecosystem",
    icon: "📱",
  },
  {
    id: "katalog-lkpp",
    kategori: "digital",
    judul: "E-Katalog Pengadaan Barang/Jasa Pemerintah (LKPP)",
    deskripsi:
      "Daftarkan produk UMKM kamu ke katalog elektronik lokal dan nasional untuk mendapatkan akses belanja pengadaan pemerintah (APBN/APBD).",
    link: "https://e-katalog.lkpp.go.id",
    badge: "Pasar Pengadaan",
    icon: "🛒",
  },
  {
    id: "pelatihan-kemenkop",
    kategori: "pelatihan",
    judul: "Edukasi & Pelatihan Wirausaha Kemenkop UKM",
    deskripsi:
      "Akses kursus online gratis mengenai literasi keuangan, foto produk, packaging design, dan digital marketing untuk wirausaha rintisan.",
    link: "https://edukukm.id",
    badge: "Gratis Bersertifikat",
    icon: "🎓",
  },
  {
    id: "rumah-bumn",
    kategori: "komunitas",
    judul: "Rumah BUMN & Inkubator Daerah",
    deskripsi:
      "Pusat pembinaan, coworking space, dan temu komunitas UMKM yang dikelola BUMN di ratusan kota/kabupaten di Indonesia.",
    link: "https://rumahbumn.id",
    badge: "Jaringan 200+ Kota",
    icon: "🤝",
  },
];

const KATEGORI_FILTER = [
  { id: "all", label: "Semua Panduan" },
  { id: "perizinan", label: "Legalitas & NIB" },
  { id: "pembiayaan", label: "Akses KUR & Modal" },
  { id: "digital", label: "Digitalisasi & QRIS" },
  { id: "pelatihan", label: "Pelatihan & Mentoring" },
  { id: "komunitas", label: "Komunitas Lokal" },
];

export default function ResourceHub() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter((r) => {
    const matchCat = filter === "all" || r.kategori === filter;
    const matchSearch =
      search === "" ||
      r.judul.toLowerCase().includes(search.toLowerCase()) ||
      r.deskripsi.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 space-y-10">
      {/* Search & Filter Controls */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari panduan NIB, KUR, sertifikasi halal, QRIS, atau inkubator…"
            className="w-full rounded-2xl border border-white/10 bg-night-card pl-11 pr-4 py-3.5 text-sm font-semibold text-white placeholder:text-slate-500 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {KATEGORI_FILTER.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300 ${
                filter === c.id
                  ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow-md shadow-teal-500/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 0.08}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-inner">
                    {item.icon}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                    {item.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {item.judul}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {item.deskripsi}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white transition group-hover:gap-2.5"
                >
                  <span>Akses Layanan Resmi</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Community Callout Box */}
      <Reveal delay={0.2}>
        <div className="rounded-3xl border border-teal-400/25 bg-gradient-to-br from-teal-900/30 via-night-card to-cyan-900/20 p-8 sm:p-10 backdrop-blur-2xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Butuh Pendampingan atau Mau Berkolaborasi?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Bergabunglah dengan jaringan ratusan wirausaha muda binaan KonekUMKM di seluruh Indonesia. Saling berbagi supplier, strategi promosi digital, dan peluang pasar bersama.
            </p>
          </div>
          <a
            href="https://wa.me/?text=Halo%20KonekUMKM%2C%20saya%20tertarik%20bergabung%20dengan%20komunitas%20wirausaha%20muda."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-400 px-7 py-4 text-xs font-extrabold text-white shadow-xl shadow-teal-500/25 transition hover:scale-105 shrink-0"
          >
            <Users2 className="h-4 w-4" /> Gabung Grup Komunitas
          </a>
        </div>
      </Reveal>
    </div>
  );
}
