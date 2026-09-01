import { Suspense } from "react";
import type { Metadata } from "next";
import ModalCalculator from "@/components/forms/ModalCalculator";
import { getDaftarUsaha, getDaftarKota } from "@/lib/actions/data";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalkulator Modal & BEP — PetaKarier",
  description:
    "Hitung estimasi modal awal, biaya operasional bulanan per kota, dan kurva break-even point (BEP) berdasarkan standar UMR terkini.",
};

export default async function KalkulatorPage() {
  const [daftarUsaha, daftarKota] = await Promise.all([
    getDaftarUsaha(),
    getDaftarKota(),
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#060a14] pt-28 pb-20 transition-colors duration-300">
      {/* Subtle Ambient Background Glow (Dark Mode Only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#00df82]/[0.04] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Suspense
          fallback={
            <div className="mx-auto flex min-h-[400px] max-w-5xl items-center justify-center px-4 py-16 text-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-[#00df82]" />
            </div>
          }
        >
          <ModalCalculator daftarUsaha={daftarUsaha} daftarKota={daftarKota} />
        </Suspense>
      </div>
    </div>
  );
}
