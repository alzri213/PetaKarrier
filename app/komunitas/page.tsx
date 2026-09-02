import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ResourceHub from "@/components/komunitas/ResourceHub";

export const metadata: Metadata = {
  title: "Resource Hub, Legalitas NIB, Akses KUR & Komunitas UMKM",
  description:
    "Pusat panduan resmi pendaftaran NIB di OSS RBA, sertifikasi halal gratis, akses permodalan KUR bunga 6%, integrasi QRIS, dan jejaring wirausaha muda daerah.",
};

export default function KomunitasPage() {
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        title={
          <>
            Resource Hub & <span className="text-gradient">Akselerasi UMKM</span>
          </>
        }
        description="Akses langsung ke portal resmi perizinan usaha pemerintah (OSS NIB), sertifikasi produk, pembiayaan bersubsidi KUR, digital payment QRIS, dan jejaring inkubator daerah."
      />
      <ResourceHub />
    </div>
  );
}
