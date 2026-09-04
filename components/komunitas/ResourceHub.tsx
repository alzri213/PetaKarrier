"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  Users2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
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
    icon: "solar:buildings-3-bold",
    color: "from-emerald-600 to-teal-700",
    image: "/resources/oss-nib.jpg",
  },
  {
    id: "sertifikasi-halal",
    kategori: "perizinan",
    judul: "Sertifikasi Halal BPJPH",
    deskripsi:
      "Program sertifikasi halal self-declare untuk produk makanan, minuman, dan olahan UMKM melalui Badan Penyelenggara Jaminan Produk Halal.",
    link: "https://ptsp.halal.go.id",
    badge: "Fasilitasi Kemenag",
    icon: "solar:shield-check-bold",
    color: "from-amber-600 to-orange-700",
    image: "/resources/sertifikasi-halal.jpg",
  },
  {
    id: "kur-bank",
    kategori: "pembiayaan",
    judul: "KUR Bunga Rendah 6%",
    deskripsi:
      "Pinjaman modal kerja bersubsidi bunga 6% efektif per tahun untuk UMKM pemula tanpa agunan tambahan hingga Rp50 juta.",
    link: "https://kur.ekon.go.id",
    badge: "Bunga Subsidi 6%",
    icon: "solar:card-bold",
    color: "from-blue-600 to-indigo-700",
    image: "/resources/kur-bank.jpg",
  },
  {
    id: "lpdb-kumkm",
    kategori: "pembiayaan",
    judul: "Dana Bergulir LPDB UKM",
    deskripsi:
      "Akses pembiayaan murah dan pendampingan manajemen bisnis bagi koperasi dan kelompok UMKM potensial di seluruh Indonesia.",
    link: "https://www.lpdb.go.id",
    badge: "Dana Bergulir",
    icon: "solar:wallet-money-bold",
    color: "from-violet-600 to-purple-700",
    image: "/resources/lpdb-kumkm.jpg",
  },
  {
    id: "qris-bi",
    kategori: "digital",
    judul: "Integrasi QRIS Digital",
    deskripsi:
      "Panduan registrasi merchant QRIS resmi dari Bank Indonesia untuk menerima pembayaran dari seluruh e-wallet dan mobile banking.",
    link: "https://qris.id",
    badge: "Cashless Ecosystem",
    icon: "solar:qr-code-bold",
    color: "from-cyan-600 to-sky-700",
    image: "/resources/qris-bi.jpg",
  },
  {
    id: "katalog-lkpp",
    kategori: "digital",
    judul: "E-Katalog LKPP Pemerintah",
    deskripsi:
      "Daftarkan produk UMKM ke katalog elektronik nasional untuk mendapatkan akses belanja pengadaan pemerintah (APBN/APBD).",
    link: "https://katalog.inaproc.id",
    badge: "Pasar Pengadaan",
    icon: "solar:cart-large-4-bold",
    color: "from-rose-600 to-pink-700",
    image: "/resources/katalog-lkpp.jpg",
  },
  {
    id: "pelatihan-kemenkop",
    kategori: "pelatihan",
    judul: "Pelatihan Wirausaha Digital",
    deskripsi:
      "Akses pelatihan dan modul wirausaha online gratis: literasi keuangan, foto produk, packaging, dan digital marketing UMKM.",
    link: "https://linkumkm.id",
    badge: "Gratis Bersertifikat",
    icon: "solar:square-academic-cap-bold",
    color: "from-lime-600 to-green-700",
    image: "/resources/pelatihan-kemenkop.jpg",
  },
  {
    id: "rumah-bumn",
    kategori: "komunitas",
    judul: "Rumah BUMN & Inkubator",
    deskripsi:
      "Pusat pembinaan, coworking space, dan temu komunitas UMKM yang dikelola BUMN di ratusan kota/kabupaten di Indonesia.",
    link: "https://rumah-bumn.id",
    badge: "Jaringan 200+ Kota",
    icon: "solar:users-group-two-rounded-bold",
    color: "from-teal-600 to-emerald-800",
    image: "/resources/rumah-bumn.jpg",
  },
];

// Responsive helper for 3D Cylinder Orbit Layout
function useResponsive() {
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  return {
    cardW: isMobile ? 240 : isTablet ? 290 : 330,
    cardH: isMobile ? 360 : isTablet ? 410 : 460,
    stageH: isMobile ? 420 : isTablet ? 480 : 540,
    radius: isMobile ? 260 : isTablet ? 380 : 480,
    xSpacing: isMobile ? 140 : isTablet ? 200 : 260,
    pxPerCard: isMobile ? 100 : isTablet ? 130 : 160,
    maxVisible: isMobile ? 2 : 3,
  };
}

export default function ResourceHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const total = RESOURCES.length;
  const resp = useResponsive();

  const isDragging = useRef(false);
  const startX = useRef(0);
  const didDrag = useRef(false);

  // Smooth target navigation
  const goTo = useCallback(
    (idx: number) => {
      const target = ((idx % total) + total) % total;
      setActiveIndex(target);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  // Pointer drag event handlers for continuous fluid tracking
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Do NOT capture drag if user is clicking directly on a link or button
    if (target.closest("a") || target.closest("button")) {
      return;
    }

    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    setIsDraggingState(true);
    didDrag.current = false;
    startX.current = e.clientX;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 6) {
      didDrag.current = true;
    }
    setDragOffset(dx / resp.pxPerCard);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);

    const steps = Math.round(dragOffset);
    const target = (((activeIndex - steps) % total) + total) % total;

    setDragOffset(0);
    setActiveIndex(target);

    setTimeout(() => {
      didDrag.current = false;
    }, 150);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
      {/* ── 3D CYLINDER ROTATING CAROUSEL STAGE ── */}
      <div className="relative select-none" style={{ isolation: "isolate" }}>
        {/* Ambient Orbit Glow Backing */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
          <div className="h-[360px] w-[650px] rounded-full bg-emerald-500/15 blur-[140px] dark:bg-emerald-500/10" />
        </div>

        {/* 3D Stage Container with Deep Perspective */}
        <div
          className="relative mx-auto flex items-center justify-center"
          style={{
            height: resp.stageH,
            perspective: 1800,
            perspectiveOrigin: "50% 50%",
            overflow: "visible",
            cursor: isDraggingState ? "grabbing" : "grab",
            touchAction: "pan-y",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {RESOURCES.map((item, idx) => {
            // Calculate shortest relative circular offset (-total/2 to +total/2)
            let baseOffset = idx - activeIndex;
            while (baseOffset > total / 2) baseOffset -= total;
            while (baseOffset < -total / 2) baseOffset += total;

            const liveOffset = baseOffset + dragOffset;
            if (Math.abs(liveOffset) > resp.maxVisible + 0.5) return null;

            return (
              <Orbit3DCard
                key={item.id}
                item={item}
                index={idx}
                liveOffset={liveOffset}
                isDragging={isDraggingState}
                didDrag={didDrag}
                onSelectCard={() => goTo(idx)}
                resp={resp}
              />
            );
          })}
        </div>

        {/* Floating Side Quick Navigation Chevrons */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-6 z-40">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Sebelumnya"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-800 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-emerald-500/60 dark:hover:bg-emerald-950/40 cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Berikutnya"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-800 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-emerald-500/60 dark:hover:bg-emerald-950/40 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* ── CLEAN CENTERED FLOATING CONTROL DOCK ── */}
        <div className="relative mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 z-50">
          <div className="flex items-center gap-3.5 rounded-full border border-slate-200/80 bg-white/95 px-6 py-2.5 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            {/* Page Count */}
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 tabular-nums">
              <span className="text-emerald-600 dark:text-[#00df82]">{activeIndex + 1}</span>
              <span className="text-slate-400 dark:text-slate-500"> / {total}</span>
            </span>

            {/* Separator */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Interactive Dot Bar */}
            <div className="flex items-center gap-1.5">
              {RESOURCES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Ke Kartu ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "h-2 w-6 bg-[#00df82] shadow-sm shadow-emerald-500/50"
                      : "h-2 w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── COMMUNITY CALLOUT BANNER ── */}
      <Reveal delay={0.2}>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-300/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 sm:p-12 shadow-2xl dark:border-emerald-500/30 dark:from-[#0a0f1d] dark:via-[#06121e] dark:to-[#0a0f1d] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100/60 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-[#00df82]">
              <Compass className="h-3.5 w-3.5" />
              Jejaring Wirausaha Indonesia
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Butuh Pendampingan atau Mau Berkolaborasi?
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed dark:text-slate-300">
              Bergabunglah dengan jaringan ratusan wirausaha muda binaan PetaKarier di seluruh Indonesia. Saling berbagi supplier bahan baku, strategi promosi digital, dan peluang pasar bersama.
            </p>
          </div>

          <a
            href="https://wa.me/?text=Halo%20PetaKarier%2C%20saya%20tertarik%20bergabung%20dengan%20komunitas%20wirausaha%20muda."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#00df82] px-8 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:bg-[#00c975] hover:scale-105 active:scale-95 shrink-0 w-full sm:w-auto"
          >
            <Users2 className="h-4 w-4" />
            <span>Gabung Grup Komunitas</span>
          </a>
        </div>
      </Reveal>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Orbit3DCard
   - Selected center card: crystal clear, bright (blur-0), sharp
   - Side inactive cards: depth-of-field bokeh (blur-sm, dimmed)
   - Official portal button is 100% clickable and opens in new tab
───────────────────────────────────────────────────────────────── */
interface Orbit3DCardProps {
  item: ResourceItem;
  index: number;
  liveOffset: number;
  isDragging: boolean;
  didDrag: React.RefObject<boolean>;
  onSelectCard: () => void;
  resp: ReturnType<typeof useResponsive>;
}

function Orbit3DCard({
  item,
  liveOffset,
  isDragging,
  didDrag,
  onSelectCard,
  resp,
}: Orbit3DCardProps) {
  const isCenter = Math.abs(liveOffset) < 0.35;

  // 3D coordinate math
  const x = liveOffset * resp.xSpacing;
  const z = -Math.pow(Math.abs(liveOffset), 1.35) * (resp.radius * 0.42);
  const rotateY = liveOffset * -24;
  const scale = Math.max(0.6, 1.05 - Math.abs(liveOffset) * 0.16);
  const opacity =
    Math.abs(liveOffset) > 2.6 ? 0 : Math.abs(liveOffset) > 1.8 ? 0.45 : 1;
  const zIndex = Math.round(50 - Math.abs(liveOffset) * 10);

  const handleCardClick = (e: React.MouseEvent) => {
    // If click originated from a link/button, let the link handle it
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }

    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!isCenter) {
      e.stopPropagation();
      onSelectCard();
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      animate={{
        x,
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
      }}
      transition={
        isDragging
          ? { duration: 0 }
          : { type: "spring", stiffness: 280, damping: 28, mass: 0.8 }
      }
      style={{
        position: "absolute",
        transformStyle: "preserve-3d",
        cursor: isCenter ? "default" : "pointer",
        willChange: "transform, opacity",
        width: resp.cardW,
        height: resp.cardH,
        pointerEvents: "auto",
      }}
    >
      <div
        className={`relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${
          item.color ?? "from-slate-700 to-slate-900"
        } flex flex-col justify-between p-6 sm:p-8 transition-all duration-500 select-none ${
          isCenter
            ? "ring-2 ring-white/50 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.8)]"
            : "hover:scale-[1.03] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.5)] filter brightness-[0.9] hover:brightness-100"
        }`}
      >
        {/* Real Live Website Background Photo with Bokeh Depth-of-Field */}
        {item.image && (
          <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.judul}
              className={`h-full w-full object-cover object-top transition-all duration-500 ${
                isCenter
                  ? "filter brightness-[0.75] contrast-[1.08] blur-0 scale-100"
                  : "filter brightness-[0.32] contrast-[0.95] blur-[5px] scale-105 opacity-40"
              }`}
            />
            {/* Elegant glassmorphism readability overlay */}
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isCenter
                  ? "bg-gradient-to-t from-slate-950/92 via-slate-950/35 to-transparent"
                  : "bg-slate-950/75"
              }`}
            />
          </div>
        )}

        {/* Card Top: Icon & Badge */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-md border border-white/30 shadow-md text-white">
            <Icon icon={item.icon} className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-sm" />
          </div>
          <span className="rounded-full bg-white/25 backdrop-blur-md px-3.5 py-1 text-[10px] sm:text-xs font-extrabold text-white border border-white/30 shadow-sm text-right leading-tight max-w-[55%]">
            {item.badge}
          </span>
        </div>

        {/* Card Bottom: Title, Description & Action */}
        <div className="relative z-10 space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            {item.judul}
          </h3>

          <p
            className={`text-xs sm:text-sm leading-relaxed text-white/95 font-medium transition-all duration-300 drop-shadow ${
              isCenter ? "line-clamp-4" : "line-clamp-2 opacity-75"
            }`}
          >
            {item.deskripsi}
          </p>

          {/* Action Link: fully clickable with stopPropagation and direct external opening */}
          {isCenter && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="pt-1 relative z-20"
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/30 hover:bg-white/45 active:bg-white/50 backdrop-blur-md border border-white/40 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-auto"
              >
                <span>Akses Layanan Resmi</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </motion.div>
          )}
        </div>

        {/* Decorative Ambient Glass Glow Highlights */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-black/25 blur-2xl" />
      </div>
    </motion.div>
  );
}
