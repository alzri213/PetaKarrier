"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

// ── Replace this with your own Formspree form ID after signing up at formspree.io ──
const FORMSPREE_ID = "mwlkooyb";

type Status = "idle" | "sending" | "success" | "error";

export default function FeedbackSection() {
  const [rating, setRating]     = useState(0);
  const [hovered, setHovered]   = useState(0);
  const [nama, setNama]         = useState("");
  const [email, setEmail]       = useState("");
  const [pesan, setPesan]       = useState("");
  const [status, setStatus]     = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setErrorMsg("Pilih rating bintang terlebih dahulu."); return; }
    if (pesan.trim().length < 10) { setErrorMsg("Pesan minimal 10 karakter."); return; }

    setErrorMsg("");
    setStatus("sending");

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nama,
          email,
          rating: `${rating} / 5 bintang`,
          pesan,
          _subject: `Feedback PetaKarier dari ${nama || "Anonim"} — ${rating}⭐`,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setRating(0); setNama(""); setEmail(""); setPesan("");
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Gagal mengirim feedback.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <section className="relative bg-slate-50 px-4 py-24 dark:bg-slate-950 sm:px-6 lg:px-8 overflow-hidden">

      <div className="relative mx-auto max-w-2xl">
        {/* Header */}
        <Reveal className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 mb-4">
            <MessageSquare className="h-3.5 w-3.5" />
            Cerita & Masukan Kamu
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Bagikan <span className="text-emerald-600 dark:text-emerald-400">Pengalamanmu</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Feedback kamu membantu kami terus berkembang. Ceritakan perjalanan wirausahamu bersama PetaKarier.
          </p>
        </Reveal>

        {/* Card */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">

            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center gap-5 py-20 px-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Terima kasih! 🎉
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                    Feedback kamu sudah kami terima. Cerita suksesmu menginspirasi ribuan wirausaha muda Indonesia lainnya.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 rounded-2xl border border-emerald-300 px-6 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                  >
                    Kirim feedback lagi
                  </button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="p-8 sm:p-10 space-y-6"
                >
                  {/* Star Rating */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Rating Pengalamanmu *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHovered(star)}
                          onMouseLeave={() => setHovered(0)}
                          aria-label={`Beri rating ${star} bintang`}
                          className="transition-transform hover:scale-125 active:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors duration-150 ${
                              star <= (hovered || rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-transparent text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        </button>
                      ))}
                      {(hovered || rating) > 0 && (
                        <span className="text-xs font-bold text-amber-500 ml-1">
                          {["", "Kurang", "Cukup", "Bagus", "Sangat Bagus", "Luar Biasa!"][hovered || rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nama & Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="fb-nama" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Nama <span className="text-slate-400 font-normal normal-case">(opsional)</span>
                      </label>
                      <input
                        id="fb-nama"
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Nama kamu"
                        maxLength={60}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="fb-email" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Email <span className="text-slate-400 font-normal normal-case">(opsional)</span>
                      </label>
                      <input
                        id="fb-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@kamu.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Pesan */}
                  <div className="space-y-1.5">
                    <label htmlFor="fb-pesan" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Cerita / Masukan *
                    </label>
                    <textarea
                      id="fb-pesan"
                      value={pesan}
                      onChange={(e) => setPesan(e.target.value)}
                      placeholder="Ceritakan pengalamanmu menggunakan PetaKarier, fitur yang paling berguna, atau saran untuk pengembangan…"
                      rows={5}
                      maxLength={1000}
                      required
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                    <p className="text-right text-[10px] text-slate-400 tabular-nums">
                      {pesan.length} / 1000
                    </p>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {(errorMsg || status === "error") && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-700 dark:bg-rose-900/20 dark:border-rose-700/40 dark:text-rose-400"
                      >
                        {errorMsg || "Terjadi kesalahan. Coba lagi."}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-shine w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Mengirim…</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Kirim Feedback</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 leading-relaxed">
                    Feedback dikirim aman melalui Formspree. Email bersifat opsional dan tidak dipublikasikan.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
