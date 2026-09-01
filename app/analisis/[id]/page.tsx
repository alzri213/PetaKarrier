import HasilRekomendasi from "@/components/results/HasilRekomendasi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekomendasi Usaha untuk Anda — PetaKarier",
  description:
    "Hasil analisis rekomendasi usaha mikro berbasis algoritma potensi mandiri dan standar UMR resmi.",
};

export default function AnalisisDetailPage() {
  return <HasilRekomendasi />;
}
