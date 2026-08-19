"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  CalendarClock,
  Coins,
  Landmark,
  Store,
  TrendingUp,
  Zap,
  LineChart as LineChartIcon,
  ShieldCheck,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import type { HasilModal, JenisUsaha, KotaData } from "@/types";
import { formatRupiah, formatRupiahSingkat } from "@/lib/utils/formatCurrency";
import { hitungModalAction } from "@/lib/actions/kalkulator";
import LoadingDots from "@/components/ui/LoadingDots";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const SKALA_OPTIONS = [
  { value: "kecil", label: "Skala Kecil", desc: "1 Orang / Rintisan Mandiri" },
  { value: "sedang", label: "Skala Sedang", desc: "Tim 2–4 Orang + Booth Lengkap" },
  { value: "besar", label: "Skala Besar", desc: "Ekspansi & Produksi Komersial" },
] as const;

const PIE_COLORS = ["#0d9488", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"];

interface ModalCalculatorProps {
  daftarUsaha?: JenisUsaha[];
  daftarKota?: KotaData[];
}

export default function ModalCalculator({
  daftarUsaha = [],
  daftarKota = [],
}: ModalCalculatorProps) {
  const searchParams = useSearchParams();
  const paramUsahaId = searchParams.get("usahaId") || "";
  const paramAnalisisId = searchParams.get("analisisId") || "";

  const [usahaId, setUsahaId] = useState<string>(paramUsahaId);
  const [kotaId, setKotaId] = useState<string>("jakarta");
  const [skala, setSkala] = useState<"kecil" | "sedang" | "besar">("kecil");
  const [analisisId, setAnalisisId] = useState<string>(paramAnalisisId);
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilModal | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("konekumkm-usaha");
      if (saved) {
        const { usahaId: id, analisisId: aId } = JSON.parse(saved);
        if (id && !usahaId) setUsahaId(id);
        if (aId && !analisisId) setAnalisisId(aId);
      }
    } catch {}
  }, [usahaId, analisisId]);

  const usaha = useMemo(
    () => daftarUsaha.find((u) => u.id === usahaId) ?? null,
    [daftarUsaha, usahaId]
  );
  const kota = useMemo(
    () => daftarKota.find((k) => k.id === kotaId) ?? null,
    [daftarKota, kotaId]
  );

  const hitung = async () => {
    if (!usahaId || !kotaId) return;
    setLoading(true);
    try {
      const res = await hitungModalAction({ usahaId, kotaId, skala }, analisisId);
      if (!res.success || !res.hasil) {
        throw new Error(res.error ?? "Gagal menghitung simulasi modal");
      }
      setHasil(res.hasil);
      localStorage.setItem(
        "konekumkm-hasil",
        JSON.stringify({
          ...res.hasil,
          usahaId,
          kotaId,
          skala,
          analisisId,
          tanggal: new Date().toISOString(),
        })
      );
      toast.success("Kalkulasi modal & break-even berhasil diperbarui!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan kalkulasi");
    } finally {
      setLoading(false);
    }
  };

  const pieData = hasil
    ? [
        { name: "Peralatan & Aset", value: hasil.rincianModal.peralatan },
        { name: "Sewa Muka 3 Bulan", value: hasil.rincianModal.sewaMuka },
        { name: "Bahan Baku Awal", value: hasil.rincianModal.bahanBakuAwal },
        { name: "Legalitas & NIB", value: hasil.rincianModal.perizinan },
        { name: "Promosi Awal", value: hasil.rincianModal.promosiAwal },
      ]
    : [];

  const be = hasil?.breakEvenBulan ?? 0;
  const bulanBE = Number.isFinite(be) ? Math.ceil(be) : 12;
  const bulanBEBar = Math.min(bulanBE, 18);

  const areaData = hasil?.proyeksi12Bulan?.map((p) => ({
    bulan: `Bln ${p.bulan}`,
    pendapatan: p.pendapatan,
    biaya: p.biaya,
    laba: p.laba,
    kumulatif: p.kumulatif,
  })) ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 backdrop-blur-xl">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Usaha selector */}
          <div>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600">
              <Store className="mr-1.5 inline h-4 w-4 text-emerald-600" /> Pilih Jenis Usaha
            </label>
            <div className="relative">
              <select
                value={usahaId}
                onChange={(e) => setUsahaId(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Pilih jenis usaha…</option>
                {daftarUsaha.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.emoji} {u.nama} — {u.kategori}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </span>
            </div>

            {usaha && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-xs text-slate-600 space-y-1"
              >
                <p className="font-extrabold text-slate-900 text-sm">
                  {usaha.emoji} {usaha.nama}
                </p>
                <p className="leading-relaxed">{usaha.deskripsi}</p>
                <p className="text-slate-400 pt-1">
                  ⚠️ Risiko: {usaha.resiko} · Rating Potensi: {"★".repeat(usaha.potensi)}
                </p>
              </motion.div>
            )}
          </div>

          {/* Kota selector */}
          <div>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600">
              <Landmark className="mr-1.5 inline h-4 w-4 text-emerald-600" /> Kota Domisili Usaha
            </label>
            <div className="relative">
              <select
                value={kotaId}
                onChange={(e) => setKotaId(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              >
                {daftarKota.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama} — UMR {formatRupiah(k.umr)}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </span>
            </div>

            {kota && (
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Standar UMR {kota.nama}:{" "}
                  <span className="font-extrabold text-emerald-300">
                    {formatRupiah(kota.umr)}
                  </span>
                </span>
                    <span className="text-slate-500">/bulan</span>
              </div>
            )}

            {/* Skala usaha */}
            <label className="mb-2 mt-5 block text-xs font-extrabold uppercase tracking-wider text-slate-600">
              <Zap className="mr-1.5 inline h-4 w-4 text-amber-400" /> Skala Operasional
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SKALA_OPTIONS.map((s) => {
                const active = skala === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setSkala(s.value)}
                    className={`rounded-2xl border p-2.5 text-center transition-all duration-300 ${
                      active
                        ? "border-amber-400/60 bg-amber-500/15 ring-1 ring-amber-400/30"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="text-xs font-extrabold text-slate-900">{s.label}</p>
                    <p className="mt-0.5 text-[9px] text-slate-500 leading-tight">{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={hitung}
          disabled={!usahaId || !kotaId || loading}
          className="btn-shine mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <LoadingDots /> Menghitung Proyeksi Finansial & BEP…
            </>
          ) : (
            <>
              <Coins className="h-5 w-5" /> Hitung Kelayakan Modal & Break-Even
            </>
          )}
        </button>
      </div>

      {/* Results view */}
      <AnimatePresence>
        {hasil && (
          <motion.div
            key="hasil"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
          >
            {/* 4 KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Investasi Awal",
                  value: hasil.modalAwal,
                  icon: Banknote,
                  grad: "from-emerald-500 to-emerald-600",
                },
                {
                  label: "Operasional / Bulan",
                  value: hasil.operasionalBulanan,
                  icon: Briefcase,
                  grad: "from-green-400 to-emerald-500",
                },
                {
                  label: "Estimasi Laba Bersih",
                  value: hasil.labaBulanan,
                  icon: TrendingUp,
                  grad: "from-emerald-400 to-green-500",
                },
                {
                  label: "Target Balik Modal",
                  value: bulanBE,
                  format: (v: number) => `±${Math.ceil(v)} Bulan`,
                  icon: CalendarClock,
                  grad: "from-amber-400 to-orange-500",
                },
              ].map((c, i) => (
                <div
                  key={c.label}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
                >
                  <div
                    className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.grad} opacity-20 blur-xl`}
                  />
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${c.grad} text-white shadow-md`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {c.label}
                  </p>
                  <p className="mt-1 text-xl sm:text-2xl font-extrabold text-white">
                    {c.format ? (
                      <AnimatedCounter value={c.value as number} format={c.format} />
                    ) : (
                      <AnimatedCounter value={c.value as number} format={formatRupiah} />
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pie Chart: Modal Allocation */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Rincian Alokasi Modal Awal
                </h3>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatRupiah(Number(value))}
                        contentStyle={{
                          background: "#0d1226",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 16,
                          color: "#fff",
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {pieData.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2 text-slate-300">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="truncate">{p.name}</span>
                      <span className="ml-auto font-bold text-white">
                        {formatRupiah(p.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Chart: 12-Month Financial Curve */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Proyeksi Arus Kas 12 Bulan</span>
                  <span className="text-emerald-400 font-mono text-[10px]">Ramp-up Curve</span>
                </h3>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradLaba" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="bulan" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        tickFormatter={(v) => formatRupiahSingkat(v)}
                        width={60}
                      />
                      <Tooltip
                        formatter={(val, name) => [formatRupiah(Number(val)), name === "pendapatan" ? "Omzet" : "Laba Bersih"]}
                        contentStyle={{
                          background: "#0d1226",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 16,
                          fontSize: 12,
                          color: "#fff",
                        }}
                      />
                      <Area type="monotone" dataKey="pendapatan" stroke="#3b82f6" fillOpacity={1} fill="url(#gradRevenue)" strokeWidth={2} />
                      <Area type="monotone" dataKey="laba" stroke="#10b981" fillOpacity={1} fill="url(#gradLaba)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                    <span>Omzet Bulanan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Laba Bersih</span>
                  </div>
                  <span className="text-slate-300 font-semibold">
                    Margin: <span className="text-emerald-300 font-bold">{hasil.marginBulanan}%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Callout Banner */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-xl ${
                hasil.selisihVsUMR >= 0
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-amber-500/30 bg-amber-500/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-start gap-4">
                  <span className="text-3xl sm:text-4xl">
                    {hasil.selisihVsUMR >= 0 ? "🚀" : "💡"}
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-white">
                      {hasil.selisihVsUMR >= 0
                        ? "Usaha Ini Memiliki Potensi di Atas Gaji UMR!"
                        : "Perlu Pendekatan Bertahap (Side-Hustle First)"}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {hasil.kesimpulan}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
                  <Link
                    href="/perbandingan"
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                  >
                    Bandingkan UMR <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/rencana-bisnis"
                    className="btn-shine inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-3 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:scale-105"
                  >
                    Buat Rencana Bisnis <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
