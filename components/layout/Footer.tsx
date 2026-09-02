import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, Globe2, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50 px-4 pt-16 pb-12 text-slate-600 transition-colors duration-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-emerald-500/25 border border-slate-200 bg-white dark:border-slate-700">
                <Image
                  src="/logo-utama.png"
                  alt="PetaKarier Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain p-0.5"
                />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Peta<span className="text-emerald-500 dark:text-emerald-400">Karier</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              Platform akselerator wirausaha muda dan UMKM Indonesia. Membantu menemukan potensi usaha terkurasi, menghitung modal & break-even, membandingkan dengan UMR, serta menyusun rencana bisnis profesional.
            </p>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Globe2 className="h-4 w-4" />
              Selaras RAN TPB / SDG 8 Indonesia (Matriks 4)
            </div>
          </div>

          {/* Col 2: Fitur Platform */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-200">
              Fitur Platform
            </p>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/analisis",       label: "Analisis Potensi Usaha" },
                { href: "/kalkulator",     label: "Kalkulator Modal & BEP" },
                { href: "/perbandingan",   label: "Komparasi Usaha vs UMR" },
                { href: "/rencana-bisnis", label: "Generator Rencana Bisnis" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-600 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Ekosistem & Dampak */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-200">
              Ekosistem & Dampak
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/sdg-impact"
                  className="flex items-center gap-1 font-semibold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Dashboard Dampak SDG 8 <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/komunitas"
                  className="text-slate-600 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Resource Hub & Panduan UMKM
                </Link>
              </li>
              <li>
                <a
                  href="https://sdgs.bappenas.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-600 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Bappenas SDGs TPB <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://oss.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-600 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Perizinan NIB (OSS RBA) <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Kompetisi & Inisiatif */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-200">
              Kompetisi & Inisiatif
            </p>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                ITechnoCup 2026
              </div>
              <p className="text-slate-500 leading-relaxed dark:text-slate-400">
                Karya inovasi teknologi berfokus pada Pilar Pembangunan Ekonomi untuk penciptaan lapangan kerja produktif dan inklusif.
              </p>
              <div className="flex items-center gap-1 text-slate-500 pt-1 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                Data 34 Provinsi Indonesia
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          <p>© {new Date().getFullYear()} PetaKarier · Selaras RAN TPB / SDG 8 Indonesia.</p>
          <p className="flex items-center gap-1.5">
            Dibangun dengan <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
