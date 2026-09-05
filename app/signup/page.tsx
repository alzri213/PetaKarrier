"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordLongEnough = password.length >= 6;

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    const result = await signIn("google", { callbackUrl: "/", redirect: false });

    if (result?.error) {
      setError("Login Google gagal. Pastikan akun OAuth dan URL callback Google sudah dikonfigurasi.");
      setIsLoading(false);
      return;
    }

    if (result?.url) window.location.assign(result.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data: { success?: boolean; error?: string } = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        setError("Respon server tidak valid. Silakan coba beberapa saat lagi.");
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal mendaftar. Silakan coba lagi.");
        return;
      }

      // Registration successful — redirect to login page so user signs in manually
      router.push("/login?registered=true");
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#060a14] transition-colors duration-300 pt-28 pb-16">
      {/* Background Decorative Elements (Dark Mode Only) */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#00df82]/[0.04] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ═══ LEFT: Branding ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-6"
          >
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden border border-emerald-500/30 bg-white shadow-sm">
                <Image
                  src="/logo-utama.png"
                  alt="PetaKarier Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                Peta <span className="text-[#00df82] font-extrabold">Karier</span>
              </span>
            </Link>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight xl:text-4xl">
              Bergabung dengan<br />
              Komunitas Wirausaha
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-md">
              Buat akun gratis dan mulai akses semua fitur perencanaan usaha — dari analisis potensi hingga rencana bisnis otomatis.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Gratis tanpa batas waktu",
                "Analisis potensi usaha berbasis AI",
                "Data 18 kota besar Indonesia",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00df82]/20">
                    <div className="h-2 w-2 rounded-full bg-[#00df82]" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ═══ RIGHT: Signup Form Card ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-[#0a0f1d]/95 dark:shadow-2xl sm:p-10">
              {/* Mobile Logo */}
              <div className="mb-6 flex items-center gap-2 lg:hidden">
                <Link href="/" className="flex items-center gap-2">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border border-emerald-500/30 bg-white">
                    <Image
                      src="/logo-utama.png"
                      alt="PetaKarier Logo"
                      width={32}
                      height={32}
                      className="h-full w-full object-contain p-0.5"
                    />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    Peta <span className="text-[#00df82]">Karier</span>
                  </span>
                </Link>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Buat Akun Baru
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Isi data berikut untuk mulai menggunakan PetaKarier.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-300"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      required
                      minLength={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicators */}
                  {password.length > 0 && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        {passwordLongEnough ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#00df82]" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span
                          className={
                            passwordLongEnough
                              ? "text-[#00df82] font-semibold"
                              : "text-slate-400"
                          }
                        >
                          Min. 6 karakter
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password"
                      required
                      className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500 ${
                        confirmPassword.length > 0
                          ? passwordsMatch
                            ? "border-[#00df82] ring-1 ring-[#00df82]/30"
                            : "border-red-400 ring-1 ring-red-400/30"
                          : "border-slate-200 dark:border-slate-700 focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30"
                      }`}
                    />
                  </div>
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-[11px] font-medium text-red-500">
                      Password tidak cocok
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !passwordsMatch || !passwordLongEnough}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#00df82] py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-[#00c975] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mendaftar...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Sekarang</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* ═══ OR Divider ═══ */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  atau
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* ═══ Social Sign-Up Buttons ═══ */}
              <div className="space-y-3">
                {/* Google Sign-Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Daftar dengan Google</span>
                </button>

                {/* GitHub Sign-Up */}
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <svg className="h-4.5 w-4.5 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>Daftar dengan GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  Sudah punya akun?
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Login Link */}
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Masuk ke Akun
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
