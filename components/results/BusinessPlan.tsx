"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  Printer,
  RotateCcw,
  Share2,
  Globe2,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import type { HasilModal, ProfilUser, SdgImpactData } from "@/types";
import { formatRupiah, formatTanggal } from "@/lib/utils/formatCurrency";
import { generateRencanaAction } from "@/lib/actions/rencana-bisnis";
import { hitungSdgImpact } from "@/lib/logic/sdgCalculator";

const LABEL_SKALA: Record<string, string> = {
  kecil: "Skala Kecil (1 Orang / Rintisan Mandiri)",
  sedang: "Skala Sedang (Tim 2–4 Orang)",
  besar: "Skala Besar (Ekspansi Penuh)",
};

export default function BusinessPlan() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    profil: ProfilUser;
    hasil: HasilModal;
    analisisId?: string;
    rencanaId?: string;
    markdown: string;
    tanggal: string;
    sdgImpact?: SdgImpactData;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const profilRaw = localStorage.getItem("konekumkm-profil");
        const hasilRaw = localStorage.getItem("konekumkm-hasil");

        if (!profilRaw || !hasilRaw) {
          setLoading(false);
          return;
        }

        const { profil, analisisId: aId1 } = JSON.parse(profilRaw);
        const hasil = JSON.parse(hasilRaw);
        const analisisId = hasil.analisisId || aId1;

        if (!hasil?.usaha || !hasil?.kota) {
          setLoading(false);
          return;
        }

        const sdg = hitungSdgImpact(hasil.usaha, hasil.kota, hasil.skala, hasil);

        const res = await generateRencanaAction({
          profil,
          hasilModal: hasil,
          analisisId,
        });

        setData({
          profil,
          hasil,
          analisisId,
          rencanaId: res.rencanaId,
          markdown: res.markdown ?? "",
          tanggal: hasil.tanggal ?? new Date().toISOString(),
          sdgImpact: sdg,
        });
      } catch (err) {
        console.error("Error loading business plan:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const unduh = () => {
    if (!data?.markdown) return;
    const blob = new Blob([data.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rencana-bisnis-${data.hasil.usaha.id}-konekumkm.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dokumen Rencana Bisnis berhasil diunduh!");
  };

  const salinTautan = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan berhasil disalin ke clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-500/20 text-cyan-400 animate-pulse">
          <FileText className="h-8 w-8" />
        </div>
        <p className="mt-6 font-extrabold text-white text-lg">Menyusun Dokumen Rencana Bisnis…</p>
        <p className="mt-1 text-xs text-slate-400">Mengintegrasikan analisis SWOT dan standar SDG 8...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center px-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-400 shadow-xl shadow-teal-500/30 text-white">
          <FileText className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-white">
          Belum Ada Data Rencana Bisnis
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
          Generator otomatis merangkai profil minat, kalkulasi modal, benchmark UMR, serta keselarasan SDG 8 menjadi satu dokumen komprehensif. Selesaikan langkah berikut:
        </p>
        <div className="mx-auto mt-8 grid max-w-md gap-3">
          <Link
            href="/analisis"
            className="btn-shine flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-400 px-6 py-4 text-sm font-extrabold text-white shadow-lg"
          >
            1. Analisis Potensi Usaha <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/kalkulator"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            2. Hitung Modal & Break-Even <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { hasil, profil, sdgImpact } = data;
  const { usaha, kota } = hasil;
  const be = hasil.breakEvenBulan;
  const bulanBE = Number.isFinite(be) ? Math.ceil(be) : 12;

  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
            <Globe2 className="h-3.5 w-3.5" />
            <span>Dokumen Terverifikasi SDG 8 & RAN TPB Matriks 4</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Rencana Bisnis: <span className="text-gradient">{usaha.nama}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dibuat pada {formatTanggal(data.tanggal)} · Siap untuk pengajuan KUR & eksekusi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={unduh}
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-3 text-xs font-extrabold text-white shadow-lg transition hover:scale-105"
          >
            <Download className="h-3.5 w-3.5" /> Unduh .MD
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-slate-200 transition hover:bg-white/10"
          >
            <Printer className="h-3.5 w-3.5" /> Cetak / Simpan PDF
          </button>
          <button
            onClick={salinTautan}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3.5 py-3 text-xs font-bold text-slate-200 transition hover:bg-white/10"
            title="Salin Tautan"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Document Content View */}
      <div id="plan-dokumen" className="mt-8 space-y-6 print:space-y-4">
        {/* Cover Overview Card */}
        <div className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-night-card to-cyan-500/10 p-7 sm:p-8 backdrop-blur-2xl">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl shadow-inner ring-1 ring-white/20">
              {usaha.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-teal-500/20 px-3 py-0.5 text-[10px] font-extrabold text-teal-300 border border-teal-400/30">
                  {usaha.kategori}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-extrabold text-emerald-300 border border-emerald-400/30">
                  SDG 8 Aligned
                </span>
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">{usaha.nama}</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Domisili: <b className="text-white">{kota.nama} ({kota.provinsi})</b> · Klasifikasi:{" "}
                <b className="text-cyan-300">{LABEL_SKALA[hasil.skala]}</b>
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Modal Awal", value: formatRupiah(hasil.modalAwal) },
              { label: "Laba Bersih/Bln", value: formatRupiah(hasil.labaBulanan) },
              { label: "Balik Modal (BEP)", value: `±${bulanBE} Bulan` },
              { label: "Serapan Kerja", value: `~${sdgImpact?.estimasiLapanganKerja ?? 2} Orang` },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-night/70 p-3.5 text-center ring-1 ring-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {s.label}
                </p>
                <p className="mt-1 text-sm sm:text-base font-extrabold text-white">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-gradient font-mono">01</span>
            <div className="h-5 w-px bg-white/10" />
            <h3 className="text-lg font-extrabold text-white">Ringkasan Eksekutif (Executive Summary)</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Usaha <b className="text-white">{usaha.nama}</b> merupakan model bisnis sektor <b className="text-cyan-300">{usaha.kategori}</b> yang dirancang untuk merespons potensi pasar konsumen di wilayah <b className="text-white">{kota.nama}</b>. Model ini menyeimbangkan efisiensi modal awal dengan proyeksi laba berkelanjutan di atas rata-rata standar upah minimum kota setempat.
          </p>
        </section>

        {/* Section 2: SWOT Analysis */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-gradient font-mono">02</span>
            <div className="h-5 w-px bg-white/10" />
            <h3 className="text-lg font-extrabold text-white">Analisis Strategis SWOT</h3>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
              <p className="font-extrabold text-emerald-400 uppercase tracking-wider">Strengths (Kekuatan)</p>
              <p className="text-slate-300 leading-relaxed">
                Biaya awal efisien ({formatRupiah(hasil.modalAwal)}), fleksibilitas diferensiasi produk, pemanfaatan direct-to-consumer online via social media.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-1">
              <p className="font-extrabold text-rose-400 uppercase tracking-wider">Weaknesses (Kelemahan)</p>
              <p className="text-slate-300 leading-relaxed">
                Kapasitas produksi awal berfokus pada skala rintisan mandiri, butuh waktu membangun reputasi merek lokal di {kota.nama}.
              </p>
            </div>
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-1">
              <p className="font-extrabold text-teal-400 uppercase tracking-wider">Opportunities (Peluang)</p>
              <p className="text-slate-300 leading-relaxed">
                Tingginya penetrasi transaksi QRIS, potensi kemitraan reseller komunitas, serta daya beli masyarakat {kota.nama} (UMR {formatRupiah(kota.umr)}).
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
              <p className="font-extrabold text-amber-400 uppercase tracking-wider">Threats (Tantangan & Risiko)</p>
              <p className="text-slate-300 leading-relaxed">
                {usaha.resiko}. Fluktuasi harga bahan baku musiman.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Financial Projections & Allocation */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-gradient font-mono">03</span>
            <div className="h-5 w-px bg-white/10" />
            <h3 className="text-lg font-extrabold text-white">Struktur Investasi Modal & Keuangan Bulanan</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Pengadaan Peralatan & Workstation</span>
              <span className="font-extrabold text-white">{formatRupiah(hasil.rincianModal.peralatan)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Sewa Muka Tempat (Alokasi 3 Bulan di {kota.nama})</span>
              <span className="font-extrabold text-white">{formatRupiah(hasil.rincianModal.sewaMuka)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Bahan Baku & Persediaan Awal</span>
              <span className="font-extrabold text-white">{formatRupiah(hasil.rincianModal.bahanBakuAwal)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Legalitas Usaha (NIB OSS RBA & Standarisasi)</span>
              <span className="font-extrabold text-white">{formatRupiah(hasil.rincianModal.perizinan)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Biaya Pemasaran Digital & Promo Peluncuran</span>
              <span className="font-extrabold text-white">{formatRupiah(hasil.rincianModal.promosiAwal)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/15 text-sm">
              <span className="font-extrabold text-white">Total Kebutuhan Modal Awal</span>
              <span className="font-extrabold text-cyan-300">{formatRupiah(hasil.modalAwal)}</span>
            </div>
          </div>
        </section>

        {/* Section 4: SDG 8 & RAN TPB Statement */}
        <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-7 backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-3">
            <Globe2 className="h-6 w-6 text-emerald-400" />
            <h3 className="text-lg font-extrabold text-white">Komitmen SDG 8 & RAN TPB Matriks 4 (Pelaku Usaha)</h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
            Usaha ini secara aktif mendukung pencapaian <b className="text-white">SDG 8: Pekerjaan Layak dan Pertumbuhan Ekonomi</b> melalui integrasi perizinan resmi NIB (Target 8.3), penciptaan <b className="text-emerald-300">~{sdgImpact?.estimasiLapanganKerja ?? 2} lapangan kerja produktif</b> (Target 8.5), serta perputaran ekonomi lokal estimasi <b className="text-white">Rp {((sdgImpact?.potensiPendapatanLokal ?? 10_000_000) / 1_000_000).toFixed(1)} juta/bulan</b> di {kota.nama}.
          </p>
        </section>

        {/* Section 5: 90-Day Execution Roadmap */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-gradient font-mono">04</span>
            <div className="h-5 w-px bg-white/10" />
            <h3 className="text-lg font-extrabold text-white">Roadmap Eksekusi 90 Hari (Aksi Terukur)</h3>
          </div>
          <div className="space-y-3 text-xs">
            {[
              { m: "Minggu 1–2", a: "Pengurusan NIB di OSS RBA, finalisasi supplier, penyiapan rekening usaha & QRIS.", e: "📋" },
              { m: "Minggu 3–4", a: "Pengadaan peralatan, uji sampel produk ke 20 pelanggan perdana, pembuatan branding medsos.", e: "🛒" },
              { m: "Minggu 5–8", a: "Soft launching, kampanye promo bundling, aktivasi ulasan bintang 5 dan database pelanggan.", e: "🚀" },
              { m: "Minggu 9–12", a: "Evaluasi laporan arus kas, perluasan kanal reseller/mitra lokal, persiapan reinvestasi kapasitas.", e: "📈" },
            ].map((item) => (
              <div key={item.m} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm">
                  {item.e}
                </span>
                <div>
                  <p className="font-extrabold text-white">{item.m}</p>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pb-12">
        <button
          onClick={() => {
            localStorage.removeItem("konekumkm-profil");
            localStorage.removeItem("konekumkm-usaha");
            localStorage.removeItem("konekumkm-hasil");
            router.push("/analisis");
          }}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold text-slate-300 transition hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" /> Mulai Analisis Baru
        </button>
        <Link
          href="/sdg-impact"
          className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-xs font-extrabold text-white transition hover:scale-105"
        >
          <Globe2 className="h-4 w-4" /> Lihat Dashboard Dampak SDG 8
        </Link>
      </div>
    </div>
  );
}
