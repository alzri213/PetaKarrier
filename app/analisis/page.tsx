import type { Metadata } from "next";
import QuestionnaireForm from "@/components/forms/QuestionnaireForm";

export const metadata: Metadata = {
  title: "Analisis Potensi Usaha & Rekomendasi Wirausaha | PetaKarier",
  description:
    "Petakan minat, keahlian, dan modal awal Anda untuk mendapatkan rekomendasi bisnis mikro yang paling berkelanjutan dan menguntungkan di wilayah Anda.",
};

export default function AnalisisPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#060a14] dark:text-white pt-28 pb-20">
      <QuestionnaireForm />
    </div>
  );
}
