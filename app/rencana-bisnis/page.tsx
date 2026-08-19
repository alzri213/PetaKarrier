import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import BusinessPlan from "@/components/results/BusinessPlan";

export const metadata: Metadata = {
  title: "Generator Rencana Bisnis Otomatis & Analisis SWOT",
  description:
    "Susun dokumen rencana bisnis komprehensif secara otomatis, lengkap dengan proyeksi arus kas, analisis SWOT, dan pernyataan dampak SDG 8 siap cetak/unduh.",
};

export default function RencanaBisnisPage() {
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        badge="Fitur 4 · Generator Rencana Bisnis & Standar SDG"
        title={
          <>
            Rencana Bisnis Profesional, <span className="text-gradient">Terbit Otomatis</span>
          </>
        }
        description="Hasil analisis, perhitungan modal per kota, dan komparasi UMR dirangkai menjadi dokumen rencana bisnis lengkap dengan roadmap 90 hari, analisis SWOT, dan keselarasan SDG 8."
      />
      <BusinessPlan />
    </div>
  );
}
