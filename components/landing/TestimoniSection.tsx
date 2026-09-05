"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import {
  Star, Quote, MapPin, ChevronLeft, ChevronRight,
  Send, CheckCircle2, Loader2, MessageSquare, UserCircle2, Trash2, Sparkles,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const FORMSPREE_ID = "mwlkooyb";

const SEED_TESTIMONI = [
  {
    id: "seed-1",
    nama: "Fajar Pratama",
    umur: 24,
    kota: "Bandung, Jawa Barat",
    usaha: "Kedai Kopi Minimalis",
    icon: "solar:cup-bold",
    fotoUrl: "",
    rating: 5,
    testimoni:
      "PetaKarier ngasih perhitungan break-even yang sangat akurat. Dulu ragu mulai karena takut modal habis di sewa, tapi dengan simulasi 18 kota saya bisa pilih skala yang pas dan balik modal di bulan ke-5!",
    isUser: false,
  },
  {
    id: "seed-2",
    nama: "Nadia Anggraini",
    umur: 22,
    kota: "Surabaya, Jawa Timur",
    usaha: "Katering Nasi Box Rumahan",
    icon: "solar:chef-hat-bold",
    fotoUrl: "",
    rating: 5,
    testimoni:
      "Fitur perbandingan UMR-nya ngebuka mata banget. Laba bersih katering rumahan ternyata bisa 140% di atas UMR Surabaya. Rencana bisnis yang di-generate langsung saya pakai buat presentasi ke orang tua dan mitra.",
    isUser: false,
  },
  {
    id: "seed-3",
    nama: "Rizky Firmansyah",
    umur: 26,
    kota: "Yogyakarta",
    usaha: "Studio Desain & Branding",
    icon: "solar:palette-bold",
    fotoUrl: "",
    rating: 5,
    testimoni:
      "Sebagai freelancer yang mau bikin studio, PetaKarier membantu saya menyusun proyeksi keuangan 12 bulan dan alokasi modal legalitas NIB. Sekarang studio saya sudah menyerap 2 karyawan pemuda lokal!",
    isUser: false,
  },
  {
    id: "seed-4",
    nama: "Siti Rahma",
    umur: 21,
    kota: "Medan, Sumatera Utara",
    usaha: "Kerajinan Batik Digital",
    icon: "solar:t-shirt-bold",
    fotoUrl: "",
    rating: 5,
    testimoni:
      "Saya dari nol banget soal bisnis. Dengan kuesioner minat PetaKarier, saya ketemu model usaha batik digital yang cocok budget mahasiswa. Modal Rp3 juta sudah BEP di bulan ke-2!",
    isUser: false,
  },
  {
    id: "seed-5",
    nama: "Bagas Prakoso",
    umur: 23,
    kota: "Semarang, Jawa Tengah",
    usaha: "Jasa Foto Produk UMKM",
    icon: "solar:camera-bold",
    fotoUrl: "",
    rating: 5,
    testimoni:
      "Fitur komparasi UMR bikin saya yakin jasa foto produk lebih menguntungkan dari kerja kantoran. Sekarang saya punya 4 klien tetap UMKM lokal dengan penghasilan 2x UMR Semarang.",
    isUser: false,
  },
];

type Testimoni = typeof SEED_TESTIMONI[0];
type FormStatus = "idle" | "sending" | "success" | "error";

const LS_KEY = "petakarier_feedback";
const DRAG_THRESHOLD = 50;

// ── Avatar component: profile image > Solar Vector Icon > UserCircle2 icon ──
function Avatar({ icon, fotoUrl, nama }: { icon?: string; fotoUrl?: string; nama: string }) {
  const [imgError, setImgError] = useState(false);

  if (fotoUrl && !imgError) {
    return (
      <div className="h-11 w-11 shrink-0 relative overflow-hidden rounded-2xl border-2 border-emerald-400/40 shadow-md">
        <Image
          src={fotoUrl}
          alt={nama}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          unoptimized={fotoUrl.includes("googleusercontent.com") || fotoUrl.includes("githubusercontent.com")}
        />
      </div>
    );
  }

  if (icon) {
    return (
      <span className="h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-inner dark:bg-emerald-950/60 dark:text-[#00df82] border border-emerald-200/60 dark:border-emerald-800">
        <Icon icon={icon} className="h-6 w-6" />
      </span>
    );
  }

  return (
    <span className="h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <UserCircle2 className="h-6 w-6" />
    </span>
  );
}

export default function TestimoniSection() {
  const { data: session } = useSession();

  const [list, setList] = useState<Testimoni[]>(() => {
    if (typeof window === "undefined") return SEED_TESTIMONI;
    try {
      const saved = localStorage.getItem(LS_KEY);
      const userItems: Testimoni[] = saved ? JSON.parse(saved) : [];
      return [...userItems, ...SEED_TESTIMONI];
    } catch {
      return SEED_TESTIMONI;
    }
  });

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const total = list.length;

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setIndex(((next) % total + total) % total);
  };
  const prev = () => goTo(index - 1, -1);
  const next = () => goTo(index + 1, 1);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    if (Math.abs(e.clientX - startX.current) > 5) didDrag.current = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (!didDrag.current) return;
    const dx = e.clientX - startX.current;
    if (dx < -DRAG_THRESHOLD) next();
    else if (dx > DRAG_THRESHOLD) prev();
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  // Form state
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [nama, setNama] = useState("");
  const [usaha, setUsaha] = useState("");
  const [kota, setKota] = useState("");
  const [pesan, setPesan] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const sessionName = session?.user?.name ?? "";
  const sessionImage = session?.user?.image ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setErrorMsg("Pilih rating bintang terlebih dahulu."); return; }
    if (pesan.trim().length < 10) { setErrorMsg("Pesan minimal 10 karakter."); return; }
    setErrorMsg("");
    setFormStatus("sending");

    const displayName = (session ? sessionName : nama.trim()) || "Anonim";

    const newCard: Testimoni = {
      id: `user-${Date.now()}`,
      nama: displayName,
      umur: 0,
      kota: kota.trim(),
      usaha: usaha.trim(),
      icon: "solar:user-bold",
      fotoUrl: sessionImage,
      rating,
      testimoni: pesan.trim(),
      isUser: true,
    };

    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        nama: newCard.nama,
        usaha: usaha.trim(),
        kota: kota.trim(),
        rating: `${rating} / 5 bintang`,
        pesan,
        _subject: `Feedback PetaKarier dari ${newCard.nama} — Rating ${rating}/5`,
      }),
    }).catch(() => {});

    const updated = [newCard, ...list];
    setList(updated);

    try {
      const userOnly = updated.filter((t) => t.isUser);
      localStorage.setItem(LS_KEY, JSON.stringify(userOnly));
    } catch {}

    setIndex(0);
    setDirection(-1);
    setFormStatus("success");
    setRating(0); setNama(""); setUsaha(""); setKota(""); setPesan("");
  };

  const handleClearData = () => {
    if (!confirm("Hapus semua testimoni yang kamu kirimkan? Data ini tidak bisa dikembalikan.")) return;
    try {
      localStorage.removeItem(LS_KEY);
      setList(SEED_TESTIMONI);
      setIndex(0);
      setDirection(0);
    } catch {}
  };

  const t = list[index];

  // ── Card footer (avatar + name row) ──
  const CardFooter = ({ card }: { card: Testimoni }) => (
    <div className="mt-6 flex items-center gap-3.5 border-t border-slate-200 pt-4 dark:border-slate-800">
      <Avatar icon={card.icon} fotoUrl={card.fotoUrl} nama={card.nama} />
      <div className="min-w-0">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
          {card.nama}
          {card.umur > 0 && <span className="text-xs text-slate-400 font-normal ml-1">({card.umur} th)</span>}
        </h3>
        {card.usaha && <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">{card.usaha}</p>}
        {card.kota && (
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" /> {card.kota}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── CAROUSEL ── */}
      <section className="relative bg-white px-4 py-16 sm:py-24 dark:bg-slate-950 sm:px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center px-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Dipercaya Oleh{" "}
              <span className="text-emerald-600 dark:text-emerald-400">Wirausaha Muda Indonesia</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Mereka telah memetakan karier bisnis, menghitung kelayakan modal, dan mewujudkan usaha mandiri berkelanjutan.
            </p>
          </Reveal>

          {/* Desktop 3-up — circular: always shows 3 cards, wraps around */}
          <div className="mt-12 sm:mt-14 hidden md:grid md:grid-cols-3 gap-6">
            {[-1, 0, 1].map((offset) => {
              const ci = ((index + offset) % total + total) % total;
              const card = list[ci];
              const isCenter = offset === 0;
              return (
                <motion.div
                  key={`${offset}-${card.id}`}
                  layout
                  animate={{ scale: isCenter ? 1 : 0.96, opacity: isCenter ? 1 : 0.6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => !isCenter && goTo(ci, offset)}
                  className={`flex flex-col justify-between rounded-3xl border-2 p-6 sm:p-7 shadow-md cursor-pointer transition-all duration-300 ${
                    isCenter
                      ? "border-emerald-400/60 bg-white dark:bg-slate-900 shadow-xl dark:ring-2 dark:ring-emerald-500/20"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {Array.from({ length: card.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {card.isUser && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Ulasan Pengguna
                          </span>
                        )}
                        <Quote className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                      </div>
                    </div>
                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-5">
                      &ldquo;{card.testimoni}&rdquo;
                    </p>
                  </div>
                  <CardFooter card={card} />
                </motion.div>
              );
            })}
          </div>

          {/* Mobile single+drag */}
          <div
            className="mt-8 sm:mt-10 md:hidden cursor-grab active:cursor-grabbing select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t.id}
                custom={direction}
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border-2 border-emerald-400/60 bg-white p-6 shadow-xl dark:bg-slate-900 dark:ring-2 dark:ring-emerald-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.isUser && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Ulasan Pengguna
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">&ldquo;{t.testimoni}&rdquo;</p>
                <CardFooter card={t} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4">
            <button onClick={prev} aria-label="Sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {list.map((_, i) => (
                <button key={i} onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${i === index ? "w-7 sm:w-8 h-2 bg-emerald-500" : "w-2 h-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"}`} />
              ))}
            </div>
            <button onClick={next} aria-label="Berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-600">
            Geser kiri / kanan untuk melihat testimoni lainnya
          </p>

          {/* Clear user data button */}
          {list.some((t) => t.isUser) && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleClearData}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-[11px] font-bold text-rose-600 transition hover:bg-rose-100 hover:border-rose-300 dark:border-rose-800/60 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                Hapus feedback saya
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FEEDBACK FORM ── */}
      <section className="relative bg-white px-4 py-16 sm:py-24 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl">
          <Reveal className="text-center mb-8 sm:mb-12 px-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 mb-3 sm:mb-4">
              <MessageSquare className="h-3.5 w-3.5" />
              Cerita & Masukan Kamu
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Bagikan <span className="text-emerald-600 dark:text-emerald-400">Pengalamanmu</span>
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Feedback kamu akan langsung muncul di bagian testimoni di atas.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
              <AnimatePresence mode="wait">
                {formStatus === "success" ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center gap-4 sm:gap-5 py-14 sm:py-20 px-6 sm:px-10 text-center"
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}>
                      <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                      <span>Terima kasih!</span>
                      <Sparkles className="h-5 w-5 text-emerald-500" />
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                      Testimonimu sudah muncul di bagian atas. Scroll ke atas untuk melihatnya!
                    </p>
                    <button onClick={() => setFormStatus("idle")}
                      className="mt-2 rounded-2xl border border-emerald-300 px-6 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/20 cursor-pointer">
                      Kirim feedback lagi
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5 sm:space-y-6"
                  >
                    {/* Profile preview */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      {sessionImage ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-emerald-400/40">
                          <Image
                            src={sessionImage}
                            alt={sessionName}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-400 dark:bg-slate-700">
                          <UserCircle2 className="h-6 w-6" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate">
                          {session ? sessionName : "Tamu"}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {session ? "Foto profil akan tampil di testimoni" : "Login untuk tampilkan foto profilmu"}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Rating Pengalamanmu *
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {[1,2,3,4,5].map((star) => (
                          <button key={star} type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            className="transition-transform hover:scale-125 active:scale-110 cursor-pointer">
                            <Star className={`h-7 w-7 sm:h-8 sm:w-8 transition-colors duration-150 ${
                              star <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300 dark:text-slate-600"
                            }`} />
                          </button>
                        ))}
                        {(hovered || rating) > 0 && (
                          <span className="text-xs font-bold text-amber-500 ml-1">
                            {["","Kurang","Cukup","Bagus","Sangat Bagus","Luar Biasa!"][hovered || rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nama — only show if not logged in */}
                    {!session && (
                      <div className="space-y-1.5">
                        <label htmlFor="fb-nama" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Nama <span className="text-slate-400 font-normal normal-case">(opsional)</span>
                        </label>
                        <input id="fb-nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                          placeholder="Nama kamu" maxLength={60}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500" />
                      </div>
                    )}

                    {/* Pesan */}
                    <div className="space-y-1.5">
                      <label htmlFor="fb-pesan" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Cerita / Masukan *
                      </label>
                      <textarea id="fb-pesan" value={pesan} onChange={(e) => setPesan(e.target.value)}
                        placeholder="Ceritakan pengalamanmu menggunakan PetaKarier…" rows={4} maxLength={500} required
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500" />
                      <p className="text-right text-[10px] text-slate-400 tabular-nums">{pesan.length} / 500</p>
                    </div>

                    <AnimatePresence>
                      {errorMsg && (
                        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-700 dark:bg-rose-900/20 dark:border-rose-700/40 dark:text-rose-400">
                          {errorMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={formStatus === "sending"}
                      className="btn-shine w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
                      {formStatus === "sending"
                        ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Mengirim…</span></>
                        : <><Send className="h-4 w-4" /><span>Kirim & Tampilkan di Testimoni</span></>
                      }
                    </button>

                    <p className="text-center text-[10px] text-slate-500 dark:text-slate-600 leading-relaxed">
                      Testimonimu langsung muncul di atas. Data tersimpan di perangkat ini.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}