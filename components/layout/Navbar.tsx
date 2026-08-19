"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  LineChart,
  Scale,
  FileText,
  Globe2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/analisis", label: "Analisis" },
  { href: "/kalkulator", label: "Kalkulator" },
  { href: "/sdg-impact", label: "SDG 8" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled || !isHome
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-200"
            : "bg-white/80 backdrop-blur-lg border-b border-slate-100"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.05 }}
              className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-400 shadow-lg shadow-emerald-500/30 border-2 border-white/40"
            >
              {/* SVG Logo Graphic */}
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="20" height="16" rx="3" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="2"/>
                <path d="M8 8 L8 4 L20 4 L20 8" stroke="white" strokeWidth="2" fill="none"/>
                <rect x="8" y="12" width="4" height="4" rx="1" fill="white"/>
                <rect x="16" y="12" width="4" height="4" rx="1" fill="white"/>
                <path d="M14 20 L14 24" stroke="white" strokeWidth="2"/>
              </svg>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Konek<span className="text-emerald-700">UMKM</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active 
                      ? "text-emerald-700 bg-emerald-50" 
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/analisis"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-400 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-white/30"
            >
              Mulai Analisis
            </Link>
          </div>

          {/* Mobile Menu Hamburger Trigger */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:border-emerald-300 lg:hidden"
            aria-label="Buka navigasi sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Modern Side-Drawer (Sidebar Sliding from Right) */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 xl:hidden" style={{ contain: "layout" }}>
            {/* Backdrop Dim Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
              style={{ willChange: "opacity" }}
            />

            {/* Sidebar Panel sliding from the right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 32,
                stiffness: 340,
                mass: 0.8,
              }}
              className="absolute inset-y-0 right-0 flex w-full max-w-[320px] sm:max-w-[360px] flex-col bg-white border-l border-slate-200 shadow-2xl"
              style={{ willChange: "transform" }}
            >
              {/* Scrollable inner content */}
              <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6">
                {/* Drawer Top Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-md">
                        <TrendingUp className="h-4 w-4" />
                      </span>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 leading-none">
                          Konek<span className="text-emerald-700">UMKM</span>
                        </h2>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                          Pemberdayaan SDG 8
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setOpen(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition active:scale-95"
                      aria-label="Tutup menu sidebar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="mt-6 flex flex-col gap-1.5">
                    {LINKS.map((link, i) => {
                      const active =
                        link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.08 + i * 0.04,
                            duration: 0.35,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                              active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                                  active
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                <span className="text-xs font-bold">{link.label[0]}</span>
                              </span>
                              <span>{link.label}</span>
                            </div>

                            {active && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Drawer Bottom Actions */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                  <Link
                    href="/analisis"
                    onClick={() => setOpen(false)}
                    className="btn-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-400 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/25 transition active:scale-95"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2 L9 6 L13 7 L9 8 L8 12 L7 8 L3 7 L7 6 Z" fill="white"/>
                      <circle cx="12" cy="4" r="1.5" fill="rgba(255,255,255,0.8)"/>
                      <circle cx="4" cy="12" r="1" fill="rgba(255,255,255,0.6)"/>
                    </svg>
                    Mulai Analisis Gratis
                  </Link>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                    <p className="text-[11px] text-slate-400 leading-relaxed flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Selaras RAN TPB Matriks 4 Bappenas RI</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
