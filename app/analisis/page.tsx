import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import QuestionnaireForm from "@/components/forms/QuestionnaireForm";
import FloatingUMKMBackground from "@/components/ui/FloatingUMKMBackground";

export const metadata: Metadata = {
  title: "Analisis Potensi Usaha & Rekomendasi Wirausaha",
  description:
    "Isi kuesioner interaktif minat, keahlian, dan budget modalmu — algoritma PetaKarier mencocokkan profil dengan 14 jenis usaha terkurasi beserta skor kelayakan dan dampak SDG 8.",
};

export default function AnalisisPage() {
  return (
    <div className="relative min-h-screen pb-24">
      <FloatingUMKMBackground />
      <div className="relative z-10">
        <PageHero
          badge="Fitur 1 · Analisis Potensi & Pencocokan AI"
          title={
            <>
              Temukan Peluang Usaha yang <span className="text-gradient">Tepat Untukmu</span>
            </>
          }
          description="Jawab kuesioner singkat dalam 2 menit. Sistem memetakan profil kapabilitas dan ketersediaan modalmu ke dalam rekomendasi bisnis dengan analisis risiko terukur."
        />
        <QuestionnaireForm />
      </div>
    </div>
  );
}
