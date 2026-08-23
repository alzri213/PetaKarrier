"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ArrowRight, TrendingUp, Building2, MapPin, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatRupiah, formatRupiahSingkat } from "@/lib/utils/formatCurrency";
import LoadingDots from "@/components/ui/LoadingDots";

interface UMRComparisonProps {
  daftarUsaha: { id: string; nama: string; kategori: string; emoji: string }[];
  daftarKota: { id: string; nama: string; provinsi: string; umr: number }[];
  initialUsahaId?: string;
  initialKotaId?: string;
}

interface HasilKomparasi {
  usaha: { id: string; nama: string; emoji: string; kategori: string };
  kota: { id: string; nama: string; provinsi: string; umr: number };
  labaBulanan: number;
  umrKota: number;
  selisihVsUMR: number;
  persentaseVsUMR: number;
  kelayakan: "Sangat Layak" | "Layak" | "Perlu Evaluasi";
}

export default function UMRComparison({
  daftarUsaha,
  daftarKota,
  initialUsahaId = "",
  initialKotaId = "bandung",
}: UMRComparisonProps) {
  const [usahaId, setUsahaId] = useState(initialUsahaId);
  const [kotaId, setKotaId] = useState(initialKotaId);
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilKomparasi | null>(null);

  const bandingkan = async () => {
    if (!usahaId || !kotaId) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/perbandingan?usahaId=${encodeURIComponent(usahaId)}&kotaId=${encodeURIComponent(kotaId)}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data komparasi");
      const data = await res.json();
      setHasil(data);
    } catch {
      const u = daftarUsaha.find((item) => item.id === usahaId);
      const k = daftarKota.find((item) => item.id === kotaId);
      if (u && k) {
        const laba = u.id === "kopi" ? 6500000 : u.id === "kuliner" ? 4200000 : 5500000;
        const selisih = laba - k.umr;
        const pct = (selisih / k.umr) * 100;
        setHasil({
          usaha: u,
          kota: k,
          labaBulanan: laba,
          umrKota: k.umr,
          selisihVsUMR: selisih,
          persentaseVsUMR: pct,
          kelayakan: selisih >= 0 ? "Sangat Layak" : "Perlu Evaluasi",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const kota = daftarKota.find((k) => k.id === kotaId) ?? daftarKota[0];
  const rasio = hasil ? (hasil.labaBulanan / hasil.umrKota) * 100 : 0;

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Form Input Box */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-md">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <Scale className="h-5 w-5 text-emerald-600" />
          <span>Simulasi Komparasi Laba vs UMR Daerah</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          Pilih model usaha dan kota tujuan untuk mengukur apakah hasil usaha mandiri kamu mengungguli upah minimum setempat.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Pilih Jenis Usaha
            </label>
            <select
              value={usahaId}
              onChange={(e) => setUsahaId(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            >
              <option value="">Pilih jenis usaha…</option>
              {daftarUsaha.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.emoji} {u.nama} ({u.kategori})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Pilih Kota Benchmark
            </label>
            <select
              value={kotaId}
              onChange={(e) => setKotaId(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            >
              {daftarKota.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} — {formatRupiahSingkat(k.umr)}/bln ({k.provinsi})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={bandingkan}
          disabled={!usahaId || loading}
          className="btn-shine mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <LoadingDots /> Mengkalkulasi Komparasi Finansial…
            </>
          ) : (
            <>
              <Scale className="h-5 w-5" /> Bandingkan Potensi Laba vs UMR
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {hasil && kota && (
          <motion.div
            key="hasil"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
          >
            {/* Big Headline Comparison Box */}
            <div
              className={`rounded-3xl border-2 p-6 sm:p-8 text-center backdrop-blur-xl shadow-lg ${
                hasil.selisihVsUMR >= 0
                  ? "border-emerald-300 bg-emerald-50/60"
                  : "border-amber-300 bg-amber-50/60"
              }`}
            >
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
                Kesimpulan Komparasi Finansial di {kota.nama}
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                    <span>{hasil.usaha.emoji}</span>
                    <span>{formatRupiah(hasil.labaBulanan)}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-600 font-semibold">
                    Estimasi Laba Bersih {hasil.usaha.nama}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border-2 border-slate-200 text-2xl font-extrabold text-slate-900 shadow-md">
                  {hasil.selisihVsUMR >= 0 ? "≥" : "≤"}
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
                    {formatRupiah(hasil.umrKota)}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 font-semibold">
                    Standar UMR {kota.nama} ({kota.provinsi})
                  </p>
                </div>
              </div>

              <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm text-sm">
                {hasil.selisihVsUMR >= 0 ? (
                  <p className="leading-relaxed text-emerald-800 font-medium">
                    🚀 <b>Potensi Usaha Mengungguli UMR</b> — estimasi laba bersih bulanan kamu{" "}
                    <b className="text-slate-900">
                      {formatRupiah(hasil.selisihVsUMR)} lebih tinggi
                    </b>{" "}
                    dari UMR {kota.nama} (setara <b className="text-slate-900">{rasio.toFixed(0)}%</b> standar UMR).
                  </p>
                ) : (
                  <p className="leading-relaxed text-amber-800 font-medium">
                    💡 <b>Rekomendasi Tahap Awal (Usaha Sampingan)</b> — laba awal masih{" "}
                    <b className="text-slate-900">
                      {formatRupiah(Math.abs(hasil.selisihVsUMR))}
                    </b>{" "}
                    di bawah standar UMR. Pertahankan pekerjaan utama seraya mengembangkan basis pelanggan di {kota.nama}.
                  </p>
                )}
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Rasio vs UMR",
                  value: `${rasio.toFixed(0)}%`,
                  desc: "Proporsi laba terhadap upah minimum",
                  color: rasio >= 100 ? "text-emerald-700" : "text-amber-600",
                },
                {
                  label: "Surplus Finansial",
                  value: formatRupiah(Math.max(0, hasil.selisihVsUMR)),
                  desc: "Kelebihan dana dibanding standar UMR",
                  color: "text-emerald-700",
                },
                {
                  label: "Status Kelayakan",
                  value: hasil.kelayakan,
                  desc: "Rekomendasi eksekusi model bisnis",
                  color: "text-slate-900",
                },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{s.label}</p>
                  <p className={`mt-2 text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="mt-1 text-xs text-slate-600 font-normal">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Continue */}
            <div className="text-center pt-4">
              <Link
                href={`/rencana-bisnis?usahaId=${hasil.usaha.id}&kotaId=${hasil.kota.id}`}
                className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/25 transition hover:scale-105"
              >
                <span>Susun Rencana Bisnis Otomatis</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
