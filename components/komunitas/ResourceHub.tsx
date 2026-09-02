"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Users2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { ResourceItem } from "@/types";

const RESOURCES: ResourceItem[] = [
  {
    id: "nib-oss",
    kategori: "perizinan",
    judul: "Pendaftaran NIB Online",
    deskripsi:
      "Panduan pendaftaran legalitas usaha mikro & kecil secara gratis melalui sistem OSS RBA Kementerian Investasi/BKPM.",
    link: "https://oss.go.id",
    badge: "Resmi Pemerintah",
    icon: "🏛️",
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "sertifikasi-halal",
    kategori: "perizinan",
    judul: "Sertifikasi Halal Gratis BPJPH",
    deskripsi:
      "Program sertifikasi halal self-declare untuk produk makanan, minuman, dan olahan UMKM melalui Badan Penyelenggara Jaminan Produk Halal.",
    link: "https://ptsp.halal.go.id",
    badge: "Fasilitasi Kemenag",
    icon: "📜",
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "kur-bank",
    kategori: "pembiayaan",
    judul: "KUR Bunga Rendah 6%",
    deskripsi:
      "Pinjaman modal kerja bersubsidi bunga 6% efektif per tahun untuk UMKM pemula tanpa agunan tambahan hingga Rp50 juta.",
    link: "https://kur.ekon.go.id",
    badge: "Bunga Subsidi 6%",
    icon: "💳",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "lpdb-kumkm",
    kategori: "pembiayaan",
    judul: "Dana Bergulir LPDB UKM",
    deskripsi:
      "Akses pembiayaan murah dan pendampingan manajemen bisnis bagi koperasi dan kelompok UMKM potensial di seluruh Indonesia.",
    link: "https://lpdb.kemenkopukm.go.id",
    badge: "Dana Bergulir",
    icon: "💰",
    color: "from-violet-600 to-purple-700",
  },
  {
    id: "qris-bi",
    kategori: "digital",
    judul: "Integrasi QRIS Digital",
    deskripsi:
      "Panduan registrasi merchant QRIS resmi dari Bank Indonesia untuk menerima pembayaran dari seluruh e-wallet dan mobile banking.",
    link: "https://qris.id",
    badge: "Cashless Ecosystem",
    icon: "📱",
    color: "from-cyan-600 to-sky-700",
  },
  {
    id: "katalog-lkpp",
    kategori: "digital",
    judul: "E-Katalog LKPP Pemerintah",
    deskripsi:
      "Daftarkan produk UMKM ke katalog elektronik nasional untuk mendapatkan akses belanja pengadaan pemerintah (APBN/APBD).",
    link: "https://e-katalog.lkpp.go.id",
    badge: "Pasar Pengadaan",
    icon: "🛒",
    color: "from-rose-600 to-pink-700",
  },
  {
    id: "pelatihan-kemenkop",
    kategori: "pelatihan",
    judul: "Pelatihan Wirausaha Kemenkop",
    deskripsi:
      "Akses kursus online gratis: literasi keuangan, foto produk, packaging, dan digital marketing untuk wirausaha rintisan.",
    link: "https://edukukm.id",
    badge: "Gratis Bersertifikat",
    icon: "🎓",
    color: "from-lime-600 to-green-700",
  },
  {
    id: "rumah-bumn",
    kategori: "komunitas",
    judul: "Rumah BUMN & Inkubator",
    deskripsi:
      "Pusat pembinaan, coworking space, dan temu komunitas UMKM yang dikelola BUMN di ratusan kota/kabupaten di Indonesia.",
    link: "https://rumahbumn.id",
    badge: "Jaringan 200+ Kota",
    icon: "🤝",
    color: "from-teal-600 to-emerald-800",
  },
];

// Layout constants — desktop base values
const ROT_STEP   = 16;
const Y_STEP     = 30;
const X_STEP     = 230;
const SCALE_STEP = 0.10;
const PX_PER_CARD = 120;

// Responsive helpers
function useResponsive() {
  const [width, setWidth] = useState(768);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  return {
    cardW:    isMobile ? 220  : isTablet ? 270  : 300,
    cardH:    isMobile ? 320  : isTablet ? 380  : 440,
    stageH:   isMobile ? 380  : isTablet ? 460  : 520,
    xStep:    isMobile ? 130  : isTablet ? 175  : X_STEP,
    yStep:    isMobile ? 18   : isTablet ? 24   : Y_STEP,
    rotStep:  isMobile ? 10   : isTablet ? 13   : ROT_STEP,
    pxPerCard: isMobile ? 80  : isTablet ? 100  : PX_PER_CARD,
    maxOffset: isMobile ? 2   : 3,
  };
}

export default function ResourceHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = RESOURCES.length;
  const resp  = useResponsive();

  // Single shared motion value: raw drag offset in pixels
  const dragPx = useMotionValue(0);

  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const startActive = useRef(0);
  // track how far pointer has moved so we can distinguish drag vs click
  const didDrag     = useRef(false);

  const isAnimating = useRef(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating.current) return;
      const target = ((idx) % total + total) % total;

      let diff = idx - activeIndex;
      if (diff > total / 2)  diff -= total;
      if (diff < -total / 2) diff += total;
      const slideDir = diff < 0 ? 1 : -1;

      isAnimating.current = true;
      animate(dragPx, slideDir * resp.pxPerCard, {
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          dragPx.set(0);
          setActiveIndex(target);
          isAnimating.current = false;
        },
      });
    },
    [activeIndex, dragPx, total, resp.pxPerCard]
  );

  /* ── Pointer handlers ─────────────────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    isDragging.current  = true;
    didDrag.current     = false;
    startX.current      = e.clientX;
    startActive.current = activeIndex;
    dragPx.set(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) didDrag.current = true;
    dragPx.set(dx);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const steps  = Math.round(dragPx.get() / resp.pxPerCard);
    const raw    = startActive.current - steps;
    const target = ((raw) % total + total) % total;

    dragPx.set(0);
    setActiveIndex(target);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 space-y-10">

      {/* ── FAN CAROUSEL ── */}
      <div className="relative select-none"
           style={{ isolation: "isolate" }}>

        {/* Stage */}
        <div
          className="relative mx-auto flex items-end justify-center cursor-grab active:cursor-grabbing"
          style={{ height: resp.stageH, perspective: 1600, overflow: "visible" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {RESOURCES.map((item, idx) => {
            let baseOffset = idx - activeIndex;
            if (baseOffset > total / 2)  baseOffset -= total;
            if (baseOffset < -total / 2) baseOffset += total;
            if (Math.abs(baseOffset) > resp.maxOffset) return null;

            return (
              <FanCard
                key={item.id}
                item={item}
                baseOffset={baseOffset}
                dragPx={dragPx}
                didDrag={didDrag}
                isCenter={baseOffset === 0}
                onTap={() => { if (baseOffset !== 0) goTo(idx); }}
                resp={resp}
              />
            );
          })}
        </div>

        {/* Navigation — z-60, strictly below the cards won't overlap */}
        <div
          className="relative mt-6 flex items-center justify-between px-4 sm:px-8"
          style={{ zIndex: 60 }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Sebelumnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-teal-900/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Berikutnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-teal-900/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tabular-nums">
            {activeIndex + 1} / {total}
          </span>

          <div className="flex items-center gap-1.5">
            {RESOURCES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Kartu ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-7 h-2 bg-teal-500"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Community Callout */}
      <Reveal delay={0.2}>
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 dark:border-teal-500/25 dark:from-teal-900/30 dark:via-slate-900 dark:to-cyan-900/20">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Butuh Pendampingan atau Mau Berkolaborasi?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed dark:text-slate-300">
              Bergabunglah dengan jaringan ratusan wirausaha muda binaan PetaKarier di seluruh Indonesia. Saling berbagi supplier, strategi promosi digital, dan peluang pasar bersama.
            </p>
          </div>
          <a
            href="https://wa.me/?text=Halo%20PetaKarier%2C%20saya%20tertarik%20bergabung%20dengan%20komunitas%20wirausaha%20muda."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-400 px-7 py-4 text-xs font-extrabold text-white shadow-xl shadow-teal-500/25 transition hover:scale-105 shrink-0"
          >
            <Users2 className="h-4 w-4" /> Gabung Grup Komunitas
          </a>
        </div>
      </Reveal>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FanCard
   Reads dragPx directly — ONE useTransform per value, no chaining.
   baseOffset is the card's position relative to center at rest.
───────────────────────────────────────────────────────────────── */
interface FanCardProps {
  item: ResourceItem;
  baseOffset: number;
  dragPx: ReturnType<typeof useMotionValue<number>>;
  didDrag: React.RefObject<boolean>;
  isCenter: boolean;
  onTap: () => void;
  resp: ReturnType<typeof useResponsive>;
}

function FanCard({ item, baseOffset, dragPx, didDrag, isCenter, onTap, resp }: FanCardProps) {
  const getLiveOffset = (px: number) => baseOffset + px / resp.pxPerCard;

  const x = useTransform(dragPx, (px) => getLiveOffset(px) * resp.xStep);
  const y = useTransform(dragPx, (px) => Math.abs(getLiveOffset(px)) * resp.yStep);
  const rotateY = useTransform(dragPx, (px) => getLiveOffset(px) * resp.rotStep);
  const scale = useTransform(dragPx, (px) =>
    Math.max(0.35, 1 - Math.abs(getLiveOffset(px)) * SCALE_STEP)
  );
  const opacity = useTransform(dragPx, (px) => {
    const abs = Math.abs(getLiveOffset(px));
    return abs > 3 ? 0 : abs > 2 ? 0.5 : 1;
  });
  const zIndex = useTransform(dragPx, (px) =>
    Math.round(50 - Math.abs(getLiveOffset(px)) * 10)
  );

  return (
    <motion.div
      onClick={(e) => {
        if (didDrag.current) { e.preventDefault(); return; }
        onTap();
      }}
      style={{
        x, y, rotateY, scale, opacity, zIndex,
        position: "absolute",
        bottom: 0,
        transformStyle: "preserve-3d",
        transformOrigin: "bottom center",
        cursor: isCenter ? "grab" : "pointer",
        willChange: "transform",
        width: resp.cardW,
      }}
    >
      <div
        className={`relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-br ${
          item.color ?? "from-slate-700 to-slate-900"
        } flex flex-col justify-between p-5 sm:p-7`}
        style={{
          height: resp.cardH,
          boxShadow: isCenter
            ? "0 30px 60px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 15px 35px -10px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top */}
        <div className="flex items-start justify-between">
          <span className="text-3xl sm:text-4xl leading-none">{item.icon}</span>
          <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold text-white border border-white/20 text-right max-w-[45%] leading-tight">
            {item.badge}
          </span>
        </div>

        {/* Bottom */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug tracking-tight">
            {item.judul}
          </h3>

          <motion.div
            animate={{ opacity: isCenter ? 1 : 0, height: isCenter ? "auto" : 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-xs leading-relaxed text-white/80 font-medium">{item.deskripsi}</p>
          </motion.div>

          {isCenter && (
            <motion.a
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                  // block link open if this was a drag gesture
                  if (didDrag.current) { e.preventDefault(); return; }
                  e.stopPropagation();
                }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-white/25 transition-all duration-200 hover:gap-3"
            >
              <span>Akses Layanan Resmi</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </motion.a>
          )}
        </div>

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/20 blur-2xl" />
      </div>
    </motion.div>
  );
}
