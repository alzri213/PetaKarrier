"use client";

import { motion } from "framer-motion";

/* ─── SVG icon paths for each UMKM category ─── */
const UMKM_ICONS = [
  {
    // Kuliner - steaming bowl
    label: "Kuliner",
    color: "#f97316",
    svgContent: (
      <>
        <circle cx="12" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 13c0-1.5 1.5-3 3-3s3 1.5 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 8c.5-1 1-2 1-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <path d="M12 7c.5-1.2 1-2.2 1-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <path d="M15 8c.5-1 1-2 1-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </>
    ),
  },
  {
    // Fashion - shopping bag
    label: "Fashion",
    color: "#8b5cf6",
    svgContent: (
      <>
        <rect x="5" y="9" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 9V7a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
      </>
    ),
  },
  {
    // Kreatif - paint palette
    label: "Kreatif",
    color: "#ec4899",
    svgContent: (
      <>
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29.46.18.97-.17.93-.67-.07-.83-.36-2.35 1.18-3.28C11.7 16.59 12 15.35 12 14c0-1.66.67-3.16 1.76-4.24A5.98 5.98 0 0 1 18 8c1.1 0 2.12.3 3 .82A9.96 9.96 0 0 0 22 12c0-5.52-4.48-10-10-10z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7.5" cy="11" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="10" cy="7" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="15" cy="6.5" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="17.5" cy="10" r="1.5" fill="currentColor" opacity="0.6" />
      </>
    ),
  },
  {
    // Jasa - wrench/tools
    label: "Jasa",
    color: "#0ea5e9",
    svgContent: (
      <>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </>
    ),
  },
  {
    // Agribisnis - plant seedling
    label: "Agribisnis",
    color: "#22c55e",
    svgContent: (
      <>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 12c-4 0-7-3-7-7 4 0 7 3 7 7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 15c4 0 7-3 7-7-4 0-7 3-7 7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    // Digital - laptop
    label: "Digital",
    color: "#6366f1",
    svgContent: (
      <>
        <rect x="4" y="5" width="16" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 20h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="10" r="0.5" fill="currentColor" opacity="0.5" />
      </>
    ),
  },
  {
    // Kecantikan - cosmetics
    label: "Kecantikan",
    color: "#f43f5e",
    svgContent: (
      <>
        <rect x="9" y="2" width="6" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 10h6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 16h4v4h-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </>
    ),
  },
  {
    // Pendidikan - book
    label: "Pendidikan",
    color: "#f59e0b",
    svgContent: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <path d="M9 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </>
    ),
  },
  {
    // Kopi / Coffee cup
    label: "Kopi",
    color: "#a16207",
    svgContent: (
      <>
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M10 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M14 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </>
    ),
  },
  {
    // Toko / Shop
    label: "Toko",
    color: "#14b8a6",
    svgContent: (
      <>
        <path d="M3 9l1.5-5h15L21 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M3 9h18v12H3V9z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 21V14h6v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9c0 1.5 1.5 3 3 3s3-1.5 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        <path d="M9 9c0 1.5 1.5 3 3 3s3-1.5 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        <path d="M15 9c0 1.5 1.5 3 3 3s3-1.5 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      </>
    ),
  },
  {
    // Rupiah / Money
    label: "Rupiah",
    color: "#16a34a",
    svgContent: (
      <>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" opacity="0.7">Rp</text>
      </>
    ),
  },
  {
    // Chart / Analytics
    label: "Analisis",
    color: "#0891b2",
    svgContent: (
      <>
        <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
];

/* ─── Floating positions: scattered around the page edges ─── */
const FLOATING_ITEMS = [
  // Left side elements
  { iconIdx: 0, x: "3%",  y: "8%",  size: 42, delay: 0,   duration: 8,  rotate: 12, opacity: 0.10 },
  { iconIdx: 4, x: "5%",  y: "28%", size: 36, delay: 1.2, duration: 10, rotate: -8, opacity: 0.08 },
  { iconIdx: 8, x: "2%",  y: "52%", size: 30, delay: 2.5, duration: 9,  rotate: 15, opacity: 0.07 },
  { iconIdx: 10,x: "8%",  y: "72%", size: 38, delay: 0.8, duration: 11, rotate: -12, opacity: 0.09 },
  { iconIdx: 6, x: "4%",  y: "90%", size: 34, delay: 3.0, duration: 8.5,rotate: 20, opacity: 0.07 },

  // Right side elements
  { iconIdx: 1, x: "92%", y: "12%", size: 38, delay: 0.5, duration: 9,  rotate: -15, opacity: 0.09 },
  { iconIdx: 5, x: "90%", y: "35%", size: 44, delay: 1.8, duration: 10, rotate: 10,  opacity: 0.10 },
  { iconIdx: 9, x: "94%", y: "55%", size: 32, delay: 2.2, duration: 8,  rotate: -20, opacity: 0.08 },
  { iconIdx: 3, x: "88%", y: "75%", size: 36, delay: 0.3, duration: 11, rotate: 8,   opacity: 0.07 },
  { iconIdx: 11,x: "93%", y: "92%", size: 40, delay: 1.5, duration: 9.5,rotate: -10, opacity: 0.09 },

  // Top scattered
  { iconIdx: 2, x: "20%", y: "3%",  size: 28, delay: 2.0, duration: 12, rotate: 25, opacity: 0.06 },
  { iconIdx: 7, x: "78%", y: "5%",  size: 32, delay: 3.2, duration: 10, rotate: -18, opacity: 0.07 },

  // Bottom scattered
  { iconIdx: 0, x: "25%", y: "95%", size: 30, delay: 1.0, duration: 9,  rotate: 14, opacity: 0.06 },
  { iconIdx: 5, x: "72%", y: "93%", size: 34, delay: 2.8, duration: 11, rotate: -22, opacity: 0.07 },

  // Middle edges (far from center content)
  { iconIdx: 3, x: "12%", y: "42%", size: 26, delay: 3.5, duration: 13, rotate: 30, opacity: 0.05 },
  { iconIdx: 7, x: "85%", y: "48%", size: 28, delay: 4.0, duration: 12, rotate: -25, opacity: 0.05 },

  // Extra decorative dots/small icons
  { iconIdx: 10,x: "15%", y: "15%", size: 22, delay: 2.3, duration: 14, rotate: 45, opacity: 0.04 },
  { iconIdx: 11,x: "82%", y: "25%", size: 24, delay: 1.7, duration: 13, rotate: -35, opacity: 0.05 },
];

export default function FloatingUMKMBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Soft gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-transparent to-emerald-50/20" />
      <div className="absolute inset-0 dot-grid opacity-[0.35]" />

      {/* Floating UMKM icons */}
      {FLOATING_ITEMS.map((item, i) => {
        const icon = UMKM_ICONS[item.iconIdx];
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: item.x,
              top: item.y,
              width: item.size,
              height: item.size,
              color: icon.color,
              opacity: item.opacity,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: item.opacity,
              scale: 1,
              y: [0, -12, 0, 8, 0],
              x: [0, 5, 0, -5, 0],
              rotate: [item.rotate, item.rotate + 8, item.rotate, item.rotate - 8, item.rotate],
            }}
            transition={{
              opacity: { duration: 1.5, delay: item.delay },
              scale: { duration: 1.5, delay: item.delay },
              y: {
                duration: item.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              },
              x: {
                duration: item.duration * 1.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay + 0.5,
              },
              rotate: {
                duration: item.duration * 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              },
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              width={item.size}
              height={item.size}
              className="drop-shadow-sm"
            >
              {icon.svgContent}
            </svg>
          </motion.div>
        );
      })}

      {/* Decorative blurred circles */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-emerald-400/[0.04] blur-[60px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] top-[40%] h-40 w-40 rounded-full bg-teal-400/[0.04] blur-[80px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.06, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[20%] h-36 w-36 rounded-full bg-green-400/[0.05] blur-[70px]"
        animate={{ scale: [1, 1.25, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[15%] h-28 w-28 rounded-full bg-emerald-300/[0.04] blur-[50px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
