"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface SingleServiceCardProps {
  title?: string;
  desc?: string;
  href?: string;
  imageSrc?: string;
  defaultActive?: boolean;
}

export default function SingleServiceCard({
  title = "Kalkulator Modal & BEP",
  desc = "Hitung simulasi modal berbasis UMR 38 provinsi dengan proyeksi arus kas 12 bulan.",
  href = "/kalkulator",
  imageSrc = "/services/kalkulator_real.jpg",
  defaultActive = false,
}: SingleServiceCardProps) {
  const [isActive, setIsActive] = useState<boolean>(defaultActive);

  return (
    <div
      onClick={() => setIsActive((prev) => !prev)}
      className={`group relative flex flex-col justify-between rounded-[2.5rem] p-8 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-visible select-none ${
        isActive
          ? "bg-[#16a34a] text-white border-4 border-[#16a34a] shadow-2xl shadow-[#16a34a]/30 scale-[1.02] z-20"
          : "bg-white text-slate-900 border-4 border-[#16a34a] shadow-md hover:shadow-xl hover:scale-[1.01] z-10"
      }`}
    >
      {/* Card Header & Title */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3
            className={`text-2xl font-extrabold tracking-tight leading-snug transition-colors duration-500 ${
              isActive ? "text-white" : "text-slate-900"
            }`}
          >
            {title}
          </h3>

          {/* Top Right Small Circle Icon */}
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-500 shadow-sm ${
              isActive
                ? "bg-white text-[#16a34a]"
                : "bg-[#16a34a] text-white"
            }`}
          >
            <Icon icon="solar:arrow-right-up-linear" className="h-6 w-6" />
          </div>
        </div>

        {/* Divider Line */}
        <div
          className={`my-5 h-px w-full transition-colors duration-500 ${
            isActive ? "bg-white/25" : "bg-slate-100"
          }`}
        />

        {/* Description */}
        <p
          className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${
            isActive ? "text-emerald-50" : "text-slate-500"
          }`}
        >
          {desc}
        </p>
      </div>

      {/* Image Container with Protruding Bottom-Left Arrow Circle Icon */}
      <div className="relative mt-8 overflow-visible">
        <div className="relative h-56 w-full overflow-hidden rounded-[1.8rem] shadow-inner border border-black/5">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isActive
                ? "opacity-70 scale-105 brightness-90"
                : "opacity-100 scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Bottom Left Circle Icon: Protrudes Outside Card Boundary (-bottom-6 -left-6) When Active */}
        {isActive ? (
          <motion.div
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 22,
            }}
            className="absolute -bottom-6 -left-6 z-30 flex h-20 w-20 items-center justify-center rounded-full bg-white p-1 shadow-2xl border-4 border-[#16a34a]"
          >
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Buka ${title}`}
              className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#16a34a] transition-transform duration-300 hover:scale-110 active:scale-95"
            >
              <Icon
                icon="solar:arrow-right-up-linear"
                className="h-9 w-9 text-[#16a34a]"
              />
            </Link>
          </motion.div>
        ) : (
          <div className="absolute bottom-3 left-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#16a34a] shadow-md border-2 border-[#16a34a]">
            <Icon icon="solar:arrow-right-up-linear" className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
