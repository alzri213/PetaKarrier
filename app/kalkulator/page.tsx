import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ModalCalculator from "@/components/forms/ModalCalculator";
import { getDaftarUsaha, getDaftarKota } from "@/lib/actions/data";

export const metadata: Metadata = {
  title: "Kalkulator Modal, Operasional & Break-Even Point",
  description:
    "Hitung estimasi modal awal, biaya operasional bulanan per kota, dan kurva break-even point (BEP) 12 bulan berdasarkan standar UMR terkini.",
};

export default async function KalkulatorPage() {
  const [daftarUsaha, daftarKota] = await Promise.all([
    getDaftarUsaha(),
    getDaftarKota(),
  ]);

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        badge="Fitur 2 · Simulasi Finansial & Break-Even"
        title={
          <>
            Hitung Kebutuhan Modal & <span className="text-gradient">Waktu Balik Modal</span>
          </>
        }
        description="Pilih jenis usaha dan kota domisili. Dapatkan rincian investasi aset, beban sewa, proyeksi margin, dan estimasi kepastian break-even secara objektif."
      />
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-400 text-sm">
            Memuat kalkulator modal & parameter kota…
          </div>
        }
      >
        <ModalCalculator daftarUsaha={daftarUsaha} daftarKota={daftarKota} />
      </Suspense>
    </div>
  );
}
