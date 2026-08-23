import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SdgDashboard from "@/components/sdg/SdgDashboard";
import { getPlatformStats } from "@/lib/actions/sdg-impact";

export const metadata: Metadata = {
  title: "Dashboard Dampak SDG 8 & RAN TPB Matriks 4",
  description:
    "Pantau kontribusi platform PetaKarier terhadap pencapaian SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi) dan Rencana Aksi Nasional TPB Pelaku Usaha Bappenas RI.",
};

export default async function SdgImpactPage() {
  const stats = await getPlatformStats();

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        badge="Dampak Berkelanjutan · RAN TPB / SDG 8"
        title={
          <>
            Dashboard Kontribusi <span className="text-gradient">SDG 8 Indonesia</span>
          </>
        }
        description="Transparansi dampak platform PetaKarier dalam menciptakan lapangan kerja berbasis teknologi, formalisasi UMKM, dan perputaran ekonomi lokal sesuai Matriks 4 Bappenas RI."
      />
      <SdgDashboard stats={stats} />
    </div>
  );
}
