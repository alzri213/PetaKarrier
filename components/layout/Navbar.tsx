"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

const LEFT_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/analisis", label: "Analisis" },
  { href: "/kalkulator", label: "Kalkulator" },
];

const RIGHT_LINKS = [
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

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-white/90 backdrop-blur-xl shadow-md border-b border-slate-200"
            : "bg-white/80 backdrop-blur-md border-b border-slate-200/80"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          {/* Left Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {LEFT_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "text-slate-900 font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Centered Brand Logo & Text (Reference Design Exact Matching) */}
          <Link href="/" className="group flex items-center gap-2.5 mx-auto lg:mx-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-sm border border-emerald-200 bg-white">
              <Image
                src="/logo-utama.png"
                alt="PetaKarier Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain p-0.5"
                priority
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Peta<span className="text-emerald-600">Karier</span>
            </span>
          </Link>

          {/* Right Navigation Links & Pill Action Button */}
          <div className="hidden lg:flex items-center justify-end gap-6 flex-1">
            {RIGHT_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "text-slate-900 font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Pill Outline Button with Upward Diagonal Arrow (Like Contact Us ↗) */}
            <Link
              href="/analisis"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-600 px-5 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm"
            >
              <span>Mulai Analisis</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Trigger */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:border-emerald-300 lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-[300px] flex-col bg-white p-6 shadow-2xl justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200">
                      <Image
                        src="/logo-utama.png"
                        alt="PetaKarier Logo"
                        width={28}
                        height={28}
                        className="object-contain p-0.5"
                      />
                    </span>
                    <span className="font-extrabold text-slate-900">PetaKarier</span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {[...LEFT_LINKS, ...RIGHT_LINKS].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <Link
                  href="/analisis"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-emerald-600 py-3 text-xs font-extrabold text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                >
                  <span>Mulai Analisis</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
