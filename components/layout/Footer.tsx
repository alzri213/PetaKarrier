import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, Globe2, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-slate-400">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-emerald-500/25 border border-slate-700 bg-white">
                <Image
                  src="/logo-utama.png"
                  alt="PetaKarier Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain p-0.5"
                />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Peta<span className="text-emerald-400">Karier</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Platform akselerator wirausaha muda dan UMKM Indonesia. Membantu menemukan potensi usaha terkurasi, menghitung modal & break-even, membandingkan dengan UMR, serta menyusun rencana bisnis profesional.
            </p>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
              <Globe2 className="h-4 w-4" />
              Selaras RAN TPB / SDG 8 Indonesia (Matriks 4)
            </div>
          </div>

          {/* Col 2: Fitur Utama */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
              Fitur Platform
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/analisis" className="transition hover:text-emerald-400 flex items-center gap-1.5">
                  Analisis Potensi Usaha
                </Link>
              </li>
              <li>
                <Link href="/kalkulator" className="transition hover:text-emerald-400 flex items-center gap-1.5">
                  Kalkulator Modal & BEP
                </Link>
              </li>
              <li>
                <Link href="/perbandingan" className="transition hover:text-emerald-400 flex items-center gap-1.5">
                  Komparasi Usaha vs UMR
                </Link>
              </li>
              <li>
                <Link href="/rencana-bisnis" className="transition hover:text-emerald-400 flex items-center gap-1.5">
                  Generator Rencana Bisnis
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ekosistem & Dampak */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
              Ekosistem & Dampak
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sdg-impact" className="transition hover:text-emerald-300 flex items-center gap-1.5 text-emerald-400 font-semibold">
                  Dashboard Dampak SDG 8 <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/komunitas" className="transition hover:text-emerald-400 flex items-center gap-1.5">
                  Resource Hub & Panduan UMKM
                </Link>
              </li>
              <li>
                <a
                  href="https://sdgs.bappenas.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-emerald-400 flex items-center gap-1.5"
                >
                  Bappenas SDGs TPB <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://oss.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-emerald-400 flex items-center gap-1.5"
                >
                  Perizinan NIB (OSS RBA) <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Standar & Validasi */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
              Kompetisi & Inisiatif
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> ITechnoCup 2026
              </div>
              <p className="text-slate-400 leading-relaxed">
                Karya inovasi teknologi berfokus pada Pilar Pembangunan Ekonomi untuk penciptaan lapangan kerja produktif dan inklusif.
              </p>
              <div className="flex items-center gap-1 text-slate-400 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Data Real-time 18 Kota
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PetaKarier · Selaras RAN TPB / SDG 8 Indonesia.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
