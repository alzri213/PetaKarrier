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

  const areaData = hasil?.proyeksi12Bulan?.map((p) => ({
    bulan: `Bln ${p.bulan}`,
    pendapatan: p.pendapatan,
    biaya: p.biaya,
    laba: p.laba,
    kumulatif: p.kumulatif,
  })) ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      {/* Selector Form Card */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-md">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Usaha selector */}
          <div>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              <Store className="mr-1.5 inline h-4 w-4 text-emerald-600" /> Pilih Jenis Usaha
            </label>
            <div className="relative">
              <select
                value={usahaId}
                onChange={(e) => setUsahaId(e.target.value)}
                className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="">Pilih jenis usaha…</option>
                {daftarUsaha.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.emoji} {u.nama} — {u.kategori}
                  </option>
                ))}
              </select>
            </div>

            {usaha && (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>{usaha.emoji}</span>
                  <span>{usaha.nama}</span>
                </p>
                <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">{usaha.deskripsi}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-amber-700 font-bold border-t border-slate-200 pt-2">
                  <span>⚠️ Risiko: {usaha.resiko}</span>
                  <span className="text-emerald-700 font-extrabold">Rating Potensi: ★★★★☆</span>
                </div>
              </div>
            )}
          </div>

          {/* Kota selector & Skala */}
          <div>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              <Landmark className="mr-1.5 inline h-4 w-4 text-emerald-600" /> Kota Domisili Usaha
            </label>
            <select
              value={kotaId}
              onChange={(e) => setKotaId(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            >
              {daftarKota.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} — UMR {formatRupiah(k.umr)}
                </option>
              ))}
            </select>

            {kota && (
              <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs flex items-center justify-between">
                <span className="text-slate-700 font-medium">
                  Standar UMR Kota {kota.nama}: <b className="text-emerald-800 font-extrabold">{formatRupiah(kota.umr)}</b>
                </span>
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">/bulan</span>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                <Zap className="mr-1.5 inline h-4 w-4 text-emerald-600" /> Skala Operasional
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SKALA_OPTIONS.map((s) => {
                  const active = skala === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSkala(s.value)}
                      className={`rounded-2xl border-2 p-2.5 text-center text-xs transition-all ${
                        active
                          ? "border-emerald-500 bg-emerald-500/10 font-extrabold text-emerald-900 shadow-sm"
                          : "border-slate-200 bg-white font-semibold text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <p className="text-xs font-extrabold leading-none">{s.label}</p>
                      <p className="mt-1 text-[9px] text-slate-500 leading-tight">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={hitung}
          disabled={!usahaId || !kotaId || loading}
          className="btn-shine mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <LoadingDots /> Mengkalkulasi Parameter Finansial…
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
                  grad: "from-teal-500 to-emerald-500",
                },
                {
                  label: "Estimasi Laba Bersih",
                  value: hasil.labaBulanan,
                  icon: TrendingUp,
                  grad: "from-emerald-600 to-green-500",
                },
                {
                  label: "Target Balik Modal",
                  value: bulanBE,
                  format: (v: number) => `±${Math.ceil(v)} Bulan`,
                  icon: CalendarClock,
                  grad: "from-amber-500 to-orange-500",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-md"
                >
                  <div
                    className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.grad} opacity-15 blur-xl`}
                  />
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${c.grad} text-white shadow-md`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    {c.label}
                  </p>
                  <p className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">
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
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
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
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: 16,
                          color: "#0f172a",
                          fontSize: 12,
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {pieData.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2 text-slate-700">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="truncate font-semibold">{p.name}</span>
                      <span className="ml-auto font-extrabold text-slate-900">
                        {formatRupiah(p.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Chart: 12-Month Financial Curve */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center justify-between">
                  <span>Proyeksi Arus Kas 12 Bulan</span>
                  <span className="text-emerald-700 font-mono text-[10px]">Ramp-up Curve</span>
                </h3>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradLaba" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="bulan" stroke="#475569" fontSize={10} tickLine={false} />
                      <YAxis
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        tickFormatter={(v) => formatRupiahSingkat(v)}
                        width={60}
                      />
                      <Tooltip
                        formatter={(val, name) => [formatRupiah(Number(val)), name === "pendapatan" ? "Omzet" : "Laba Bersih"]}
                        contentStyle={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: 16,
                          fontSize: 12,
                          color: "#0f172a",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area type="monotone" dataKey="pendapatan" stroke="#0284c7" fillOpacity={1} fill="url(#gradRevenue)" strokeWidth={2} />
                      <Area type="monotone" dataKey="laba" stroke="#059669" fillOpacity={1} fill="url(#gradLaba)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-600" />
                    <span className="font-semibold">Omzet Bulanan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    <span className="font-semibold">Laba Bersih</span>
                  </div>
                  <span className="text-slate-700 font-semibold">
                    Margin: <span className="text-emerald-700 font-extrabold">{hasil.marginBulanan}%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Callout Banner */}
            <div
              className={`rounded-3xl border-2 p-6 shadow-md ${
                hasil.selisihVsUMR >= 0
                  ? "border-emerald-300 bg-emerald-50/70"
                  : "border-amber-300 bg-amber-50/70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-start gap-4">
                  <span className="text-3xl sm:text-4xl">
                    {hasil.selisihVsUMR >= 0 ? "🚀" : "💡"}
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {hasil.selisihVsUMR >= 0
                        ? "Usaha Ini Memiliki Potensi di Atas Gaji UMR!"
                        : "Perlu Pendekatan Bertahap (Side-Hustle First)"}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {hasil.kesimpulan}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
                  <Link
                    href="/perbandingan"
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    Bandingkan UMR <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/rencana-bisnis"
                    className="btn-shine inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105"
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
