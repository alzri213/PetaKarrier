import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Building2, MapPin, Globe2, TrendingUp } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ScoreBar from "@/components/ui/ScoreBar";
import { getAnalisisById } from "@/lib/actions/analisis";
import { formatRupiah } from "@/lib/utils/formatCurrency";
import type { Rekomendasi } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalisisDetailPage({ params }: PageProps) {
  const { id } = await params;
  const analisis = await getAnalisisById(id);

  if (!analisis) {
    return (
      <div className="min-h-screen pb-24">
        <PageHero
          badge="KonekUMKM · Hasil Analisis"
          title={<>Analisis <span className="text-gradient">Tidak Ditemukan</span></>}
          description="ID analisis ini mungkin sudah kedaluwarsa atau belum tersimpan di cloud database."
        />
        <div className="text-center mt-6">
          <Link
            href="/analisis"
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-sm font-extrabold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Mulai Analisis Baru
          </Link>
        </div>
      </div>
    );
  }

  const rekomendasi = (analisis.rekomendasi as unknown as Rekomendasi[]) || [];
  const topMatch = rekomendasi[0];

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        badge="Hasil Analisis Tersimpan"
        title={
          <>
            Peta Rekomendasi <span className="text-gradient">Kariermu</span>
          </>
        }
        description={`Analisis profil tersimpan dengan alokasi budget Rp ${analisis.budget.toLocaleString("id-ID")}, komitmen waktu ${analisis.waktu}, dan preferensi ${analisis.minat.join(", ")}.`}
      />

      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/analisis"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Analisis Ulang
          </Link>
          <span className="text-xs text-slate-400 font-mono">ID: {analisis.id}</span>
        </div>

        <div className="space-y-5">
          {rekomendasi.map((r, i) => (
            <div
              key={r.usaha.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition hover:border-white/20"
            >
              <div className="flex items-start gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-4xl ring-1 ring-white/10">
                  {r.usaha.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white">{r.usaha.nama}</h3>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-bold text-slate-300 ring-1 ring-white/10">
                      {r.usaha.kategori}
                    </span>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                      Skor SDG 8: {r.sdgScore ?? 85}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{r.alasan}</p>
                  <div className="mt-4 space-y-2 max-w-xl">
                    <ScoreBar label="Kecocokan minat" value={r.skorMinat} color="from-blue-500 to-blue-600" />
                    <ScoreBar label="Kecocokan keahlian" value={r.skorSkill} color="from-cyan-400 to-blue-500" />
                    <ScoreBar label="Kecocokan budget" value={r.skorBudget} color="from-emerald-400 to-teal-500" />
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/kalkulator?usahaId=${r.usaha.id}&analisisId=${analisis.id}`}
                      className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-400 px-6 py-3 text-xs font-extrabold text-white shadow-lg"
                    >
                      Hitung Modal Usaha Ini <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <span className="rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-slate-300">
                      Estimasi Modal: {formatRupiah(r.estimasiModal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
