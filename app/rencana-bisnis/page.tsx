import type { Metadata } from "next";
import BusinessPlan from "@/components/results/BusinessPlan";

export const metadata: Metadata = {
  title: "Rencana Bisnis Anda — PetaKarier",
  description:
    "Draf rencana bisnis terstruktur otomatis yang siap direalisasikan dan diajukan ke calon investor.",
};

export default function RencanaBisnisPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#060a14] pt-28 pb-20 transition-colors duration-300">
      {/* Subtle Ambient Background Glow (Dark Mode Only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#00df82]/[0.04] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <BusinessPlan />
      </div>
    </div>
  );
}
