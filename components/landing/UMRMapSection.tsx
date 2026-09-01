"use client";

import InteractiveUMRMap from "@/components/landing/InteractiveUMRMap";

export default function UMRMapSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 px-4 dark:bg-[#030712] sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Background Decorative Glow (Dark Mode Only) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden dark:block">
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        <InteractiveUMRMap />
      </div>
    </section>
  );
}
