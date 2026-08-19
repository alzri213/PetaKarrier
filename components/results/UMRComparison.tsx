"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Scale, MapPin, TrendingUp, Building2, Layers } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { toast } from "sonner";
import type { HasilModal, JenisUsaha, KotaData } from "@/types";
import { formatRupiah, formatRupiahSingkat } from "@/lib/utils/formatCurrency";
import { hitungModalAction } from "@/lib/actions/kalkulator";
import LoadingDots from "@/components/ui/LoadingDots";

interface UMRComparisonProps {
  daftarUsaha?: JenisUsaha[];
  daftarKota?: KotaData[];
}

export default function UMRComparison({
  daftarUsaha = [],
  daftarKota = [],
}: UMRComparisonProps) {
  const [usahaId, setUsahaId] = useState<string>("");
  const [kotaId, setKotaId] = useState<string>("jakarta");
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilModal | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("konekumkm-hasil");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.usahaId) setUsahaId(d.usahaId);
        if (d.kotaId) setKotaId(d.kotaId);
      } else {
        const usaha = localStorage.getItem("konekumkm-usaha");
        if (usaha) {
          const { usahaId: id } = JSON.parse(usaha);
          if (id) setUsahaId(id);
        }
      }
    } catch {}
  }, []);

  const kota = useMemo(() => daftarKota.find((k) => k.id === kotaId) ?? null, [daftarKota, kotaId]);
  const usaha = useMemo(() => daftarUsaha.find((u) => u.id === usahaId) ?? null, [daftarUsaha, usahaId]);

  const bandingkan = async () => {
    if (!usahaId || !kotaId) return;
    setLoading(true);
    try {
      const res = await hitungModalAction({ usahaId, kotaId, skala: "kecil" });
      if (!res.success || !res.hasil) {
        throw new Error(res.error ?? "Gagal membandingkan data");
      }
      setHasil(res.hasil);
      toast.success("Komparasi UMR berhasil diperbarui!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const chartData = hasil
    ? [
        {
          nama: "Estimasi Omzet",
          nilai: hasil.pendapatanBulanan,
          color: "#3b82f6",
        },
        {
          nama: "Laba Bersih Usaha",
          nilai: hasil.labaBulanan,
          color: "#10b981",
        },
        {
          nama: `Standar UMR ${hasil.kota.nama}`,
          nilai: hasil.umrKota,
          color: "#f59e0b",
        },
      ]
    : [];

  const rasio = hasil ? (hasil.labaBulanan / hasil.umrKota) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Pilih Jenis Usaha
            </label>
            <select
              value={usahaId}
              onChange={(e) => setUsahaId(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-night-card px-4 py-3.5 text-sm font-bold text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
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
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Pilih Kota Benchmark
            </label>
            <select
              value={kotaId}
              onChange={(e) => setKotaId(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-night-card px-4 py-3.5 text-sm font-bold text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
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
          className="btn-shine mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 py-4 text-sm font-extrabold text-white shadow-xl shadow-teal-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
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
              className={`rounded-3xl border p-6 sm:p-8 text-center backdrop-blur-xl ${
                hasil.selisihVsUMR >= 0
                  ? "border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 via-night-card to-cyan-500/10"
                  : "border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-night-card to-rose-500/10"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Kesimpulan Komparasi Finansial di {kota.nama}
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-2">
                    <span>{hasil.usaha.emoji}</span>
                    <span>{formatRupiah(hasil.labaBulanan)}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-semibold">
                    Estimasi Laba Bersih {hasil.usaha.nama}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl font-extrabold text-white ring-1 ring-white/15">
                  {hasil.selisihVsUMR >= 0 ? "≥" : "≤"}
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-amber-300">
                    {formatRupiah(hasil.umrKota)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 font-semibold">
                    Standar UMR {kota.nama} ({kota.provinsi})
                  </p>
                </div>
              </div>

              <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/15 bg-night/80 px-6 py-4 backdrop-blur text-sm">
                {hasil.selisihVsUMR >= 0 ? (
                  <p className="leading-relaxed text-emerald-200">
                    🚀 <b>Potensi Usaha Mengungguli UMR</b> — estimasi laba bersih bulanan kamu{" "}
                    <b className="text-white">
                      {formatRupiah(hasil.selisihVsUMR)} lebih tinggi
                    </b>{" "}
                    dari UMR {kota.nama} (setara <b className="text-white">{rasio.toFixed(0)}%</b> standar UMR).
                  </p>
                ) : (
                  <p className="leading-relaxed text-amber-200">
                    💡 <b>Rekomendasi Tahap Awal (Usaha Sampingan)</b> — laba awal masih{" "}
                    <b className="text-white">
                      {formatRupiah(Math.abs(hasil.selisihVsUMR))}
                    </b>{" "}
                    di bawah standar UMR. Pertahankan pekerjaan utama seraya mengembangkan basis pelanggan di {kota.nama}.
                  </p>
                )}
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Visualisasi Perbandingan Omzet, Laba, dan UMR
              </h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={54}>
                    <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="nama"
                      tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(v) => formatRupiahSingkat(Number(v))}
                      axisLine={false}
                      tickLine={false}
                      width={70}
                    />
                    <Tooltip
                      formatter={(value) => formatRupiah(Number(value))}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      contentStyle={{
                        background: "#0d1226",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 16,
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="nilai" radius={[12, 12, 0, 0]}>
                      {chartData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                      <LabelList
                        dataKey="nilai"
                        position="top"
                        formatter={(v) => formatRupiahSingkat(Number(v))}
                        fill="#f8fafc"
                        fontSize={12}
                        fontWeight={800}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Rasio Modal vs UMR",
                  value: `${hasil.modalSetaraUMR.toFixed(1)}x Gaji UMR`,
                  desc: `Investasi ${formatRupiah(hasil.modalAwal)} setara dengan tabungan ${hasil.modalSetaraUMR.toFixed(1)} bulan gaji ${kota.nama}`,
                },
                {
                  label: "Estimasi Balik Modal",
                  value: `${Number.isFinite(hasil.breakEvenBulan) ? Math.ceil(hasil.breakEvenBulan) : "—"} Bulan`,
                  desc: "Setelah BEP tercapai, seluruh arus kas bersih menjadi keuntungan murni wirausaha",
                },
                {
                  label: "Selisih Bersih vs UMR",
                  value: `${hasil.selisihVsUMR >= 0 ? "+" : "−"}${formatRupiah(Math.abs(hasil.selisihVsUMR))}`,
                  desc:
                    hasil.selisihVsUMR >= 0
                      ? "Surplus laba usaha di atas upah minimum regional"
                      : "Defisit laba awal terhadap upah minimum regional",
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-white">{s.value}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/rencana-bisnis"
                className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-teal-500/25 transition hover:scale-105"
              >
                Susun Dokumen Rencana Bisnis Lengkap <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
