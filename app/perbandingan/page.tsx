import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import UMRComparison from "@/components/results/UMRComparison";
import { getDaftarUsaha, getDaftarKota } from "@/lib/actions/data";

export const metadata: Metadata = {
  title: "Komparasi Laba Usaha vs Upah Minimum Regional (UMR)",
  description:
    "Bandingkan potensi laba bersih usaha dengan standar UMR 18 kota di Indonesia secara data-driven — buat keputusan karier objektif berdasarkan bukti finansial nyata.",
};

export default async function PerbandinganPage() {
  const [daftarUsaha, daftarKota] = await Promise.all([
    getDaftarUsaha(),
    getDaftarKota(),
  ]);

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        badge="Fitur 3 · Benchmark Finansial Usaha vs Kerja"
        title={
          <>
            Kerja atau Buka Usaha? <span className="text-gradient">Biarkan Data Menjawab</span>
          </>
        }
        description="Bandingkan estimasi laba bulanan usahamu dengan standar UMR di 18 kota di Indonesia secara transparan, lengkap dengan rasio investasi dan titik impas."
      />
      <UMRComparison daftarUsaha={daftarUsaha} daftarKota={daftarKota} />
    </div>
  );
}
