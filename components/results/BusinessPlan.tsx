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
    a.download = `rencana-bisnis-${data.hasil.usaha.id}-petakarir.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dokumen Rencana Bisnis berhasil diunduh!");
  };

  const salinTautan = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan dokumen berhasil disalin ke clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[420px] max-w-lg flex-col items-center justify-center p-8 text-center rounded-3xl border-2 border-slate-200 bg-white shadow-md">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
        >
          <BookOpen className="h-8 w-8" />
        </motion.div>
        <p className="mt-6 font-extrabold text-slate-900 text-lg">Menyusun Dokumen Rencana Bisnis…</p>
        <p className="mt-2 text-xs text-slate-500">
          Sistem PetaKarier sedang menyinkronkan proyeksi keuangan dengan parameter kota & target SDG 8.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center rounded-3xl border-2 border-slate-200 bg-white shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <FileText className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">
          Data Rencana Bisnis Belum Tersedia
        </h2>
        <p className="mt-2 text-xs text-slate-600">
          Silakan jalankan simulasi kalkulator modal terlebih dahulu untuk menerbitkan dokumen rencana bisnis otomatis.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/kalkulator"
            className="btn-shine flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg"
          >
            Buka Kalkulator Modal
          </Link>
          <Link
            href="/analisis"
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Mulai Analisis Minat
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 mb-1">
            <Globe2 className="h-4 w-4" />
            <span>Dokumen Terverifikasi SDG 8 & RAN TPB Matriks 4</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Rencana Bisnis: <span className="text-gradient">{usaha.nama}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dibuat pada {formatTanggal(data.tanggal)} · Siap untuk pengajuan KUR & eksekusi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={unduh}
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-5 py-3 text-xs font-extrabold text-white shadow-lg transition hover:scale-105"
          >
            <Download className="h-3.5 w-3.5" /> Unduh .MD
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5" /> Cetak / PDF
          </button>
          <button
            onClick={salinTautan}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3.5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            title="Salin Tautan"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Document Content View */}
      <div id="plan-dokumen" className="mt-8 space-y-6 print:space-y-4">
        {/* Cover Overview Card */}
        <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/50 p-7 sm:p-8 shadow-md">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-md border border-slate-200">
              {usaha.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-extrabold text-emerald-800 border border-emerald-300">
                  {usaha.kategori}
                </span>
                <span className="rounded-full bg-green-100 px-3 py-0.5 text-[10px] font-extrabold text-green-800 border border-green-300">
                  SDG 8 Aligned
                </span>
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">{usaha.nama}</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Domisili: <b className="text-slate-900">{kota.nama} ({kota.provinsi})</b> · Klasifikasi:{" "}
                <b className="text-emerald-800">{LABEL_SKALA[hasil.skala]}</b>
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
              <div key={s.label} className="rounded-2xl bg-white p-3.5 text-center border border-slate-200 shadow-sm">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {s.label}
                </p>
                <p className="mt-1 text-sm sm:text-base font-extrabold text-slate-900">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-emerald-600 font-mono">01</span>
            <div className="h-5 w-px bg-slate-200" />
            <h3 className="text-lg font-extrabold text-slate-900">Ringkasan Eksekutif (Executive Summary)</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Usaha <b className="text-slate-900">{usaha.nama}</b> merupakan model bisnis sektor <b className="text-emerald-700">{usaha.kategori}</b> yang dirancang untuk merespons potensi pasar konsumen di wilayah <b className="text-slate-900">{kota.nama}</b>. Model ini menyeimbangkan efisiensi modal awal dengan proyeksi laba berkelanjutan di atas rata-rata standar upah minimum kota setempat.
          </p>
        </section>

        {/* Section 2: SWOT Analysis */}
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-emerald-600 font-mono">02</span>
            <div className="h-5 w-px bg-slate-200" />
            <h3 className="text-lg font-extrabold text-slate-900">Analisis Strategis SWOT</h3>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1">
              <p className="font-extrabold text-emerald-800 uppercase tracking-wider">Strengths (Kekuatan)</p>
              <p className="text-slate-700 leading-relaxed">
                Biaya awal efisien ({formatRupiah(hasil.modalAwal)}), fleksibilitas diferensiasi produk, pemanfaatan direct-to-consumer online via social media.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-1">
              <p className="font-extrabold text-rose-800 uppercase tracking-wider">Weaknesses (Kelemahan)</p>
              <p className="text-slate-700 leading-relaxed">
                Kapasitas produksi awal berfokus pada skala rintisan mandiri, butuh waktu membangun reputasi merek lokal di {kota.nama}.
              </p>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 space-y-1">
              <p className="font-extrabold text-teal-800 uppercase tracking-wider">Opportunities (Peluang)</p>
              <p className="text-slate-700 leading-relaxed">
                Tingginya penetrasi transaksi QRIS, potensi kemitraan reseller komunitas, serta daya beli masyarakat {kota.nama} (UMR {formatRupiah(kota.umr)}).
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-1">
              <p className="font-extrabold text-amber-800 uppercase tracking-wider">Threats (Tantangan & Risiko)</p>
              <p className="text-slate-700 leading-relaxed">
                {usaha.resiko}. Fluktuasi harga bahan baku musiman.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Financial Projections & Allocation */}
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-emerald-600 font-mono">03</span>
            <div className="h-5 w-px bg-slate-200" />
            <h3 className="text-lg font-extrabold text-slate-900">Struktur Investasi Modal & Keuangan Bulanan</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Pengadaan Peralatan & Workstation</span>
              <span className="font-extrabold text-slate-900">{formatRupiah(hasil.rincianModal.peralatan)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Sewa Muka Tempat (Alokasi 3 Bulan di {kota.nama})</span>
              <span className="font-extrabold text-slate-900">{formatRupiah(hasil.rincianModal.sewaMuka)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Bahan Baku & Persediaan Awal</span>
              <span className="font-extrabold text-slate-900">{formatRupiah(hasil.rincianModal.bahanBakuAwal)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Legalitas Usaha (NIB OSS RBA & Standarisasi)</span>
              <span className="font-extrabold text-slate-900">{formatRupiah(hasil.rincianModal.perizinan)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Biaya Pemasaran Digital & Promo Peluncuran</span>
              <span className="font-extrabold text-slate-900">{formatRupiah(hasil.rincianModal.promosiAwal)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-slate-200 text-sm">
              <span className="font-extrabold text-slate-900">Total Kebutuhan Modal Awal</span>
              <span className="font-extrabold text-emerald-700">{formatRupiah(hasil.modalAwal)}</span>
            </div>
          </div>
        </section>

        {/* Action Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <Link
            href="/kalkulator"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Hitung Ulang Kalkulator
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={unduh}
              className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-6 py-3 text-xs font-extrabold text-white shadow-lg"
            >
              <Download className="h-3.5 w-3.5" /> Unduh Dokumen (.MD)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
