"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import OTPModal from "@/components/auth/OTPModal";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const justRegistered = searchParams.get("registered") === "true";
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Helper check status perangkat terpercaya (30 hari)
  const isDeviceTrusted = (userEmail: string): boolean => {
    try {
      if (typeof window === "undefined") return false;
      const stored = localStorage.getItem(`petakarier_trusted_${userEmail.toLowerCase()}`);
      if (!stored) return false;
      const data = JSON.parse(stored);
      return Boolean(data && data.expiresAt && Date.now() < data.expiresAt);
    } catch {
      return false;
    }
  };

  // Simpan status perangkat terpercaya selama 30 hari
  const markDeviceAsTrusted = (userEmail: string) => {
    try {
      if (typeof window === "undefined") return;
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        `petakarier_trusted_${userEmail.toLowerCase()}`,
        JSON.stringify({ email: userEmail.toLowerCase(), expiresAt: Date.now() + thirtyDaysMs })
      );
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Jika user tidak mencentang ingat perangkat, hapus status lama
      if (!rememberDevice) {
        try {
          localStorage.removeItem(`petakarier_trusted_${normalizedEmail}`);
        } catch {}
      }

      // STANDAR UMUM: Jika perangkat ini sudah dipercaya (30 hari), langsung login tanpa spam OTP
      if (rememberDevice && isDeviceTrusted(normalizedEmail)) {
        const result = await signIn("credentials", {
          email: normalizedEmail,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Email atau password salah. Silakan periksa kembali.");
          setIsLoading(false);
          return;
        }

        router.push(callbackUrl);
        router.refresh();
        return;
      }

      // Jika perangkat baru / belum terpercaya: verifikasi reCAPTCHA & kirim OTP
      if (!executeRecaptcha) {
        setError("reCAPTCHA belum siap. Silakan refresh halaman.");
        setIsLoading(false);
        return;
      }

      const recaptchaToken = await executeRecaptcha("login");

      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password, recaptchaToken }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        throw new Error(otpData.error || "Gagal mengirim kode OTP");
      }

      setShowOTPModal(true);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, otp }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Kode OTP salah");
      }

      // Jika user memilih ingat perangkat, simpan otorisasi perangkat 30 hari
      if (rememberDevice) {
        markDeviceAsTrusted(normalizedEmail);
      }

      setOtpVerified(true);
      setShowOTPModal(false);

      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      throw err; // Re-throw to be caught by OTPModal
    }
  };

  const handleResendOTP = async () => {
    try {
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA belum siap");
      }

      const recaptchaToken = await executeRecaptcha("resend_otp");

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim ulang kode OTP");
      }
    } catch (err) {
      throw err; // Re-throw to be caught by OTPModal
    }
  };

  return (
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
          Masuk ke Akun Anda
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Selamat datang kembali! Masukkan email dan password Anda.
        </p>
      </div>

      {/* Registration success banner */}
      {justRegistered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          <span>Akun berhasil dibuat! Silakan masuk dengan email dan password kamu.</span>
        </motion.div>
      )}

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
              placeholder="Masukkan password"
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
        </div>

        {/* Ingat Perangkat 30 Hari (Standar Umum Keamanan & Kenyamanan) */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#00df82] focus:ring-[#00df82]/30 accent-[#00df82] cursor-pointer"
            />
            <span>Ingat perangkat ini selama 30 hari</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#00df82] py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-[#00c975] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Masuk</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        {/* reCAPTCHA Badge Info */}
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600">
          Dilindungi oleh reCAPTCHA & Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600 dark:hover:text-slate-400"
          >
            Privacy Policy
          </a>{" "}
          dan{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600 dark:hover:text-slate-400"
          >
            Terms
          </a>
        </p>
      </form>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleVerifyOTP}
        email={email}
        onResend={handleResendOTP}
      />

      {/* ═══ OR Divider ═══ */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          atau
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* ═══ Social Sign-In Buttons ═══ */}
      <div className="space-y-3">
        {/* Google Sign-In */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
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
          <span>Masuk dengan Google</span>
        </button>

        {/* GitHub Sign-In */}
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl })}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg className="h-4.5 w-4.5 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>Masuk dengan GitHub</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Belum punya akun?
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Signup Link */}
      <Link
        href="/signup"
        className="flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        Buat Akun Baru
      </Link>
    </div>
  );
}

export default function LoginPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#060a14]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Konfigurasi reCAPTCHA Tidak Ditemukan
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Silakan hubungi administrator untuk mengatur NEXT_PUBLIC_RECAPTCHA_SITE_KEY
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
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
              Mulai Perjalanan<br />
              Wirausaha Anda
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-md">
              Akses analisis potensi usaha, kalkulator modal, perbandingan UMR, dan rencana bisnis otomatis — semua dalam satu platform yang selaras dengan SDG 8.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Rekomendasi usaha berbasis data lokal",
                "Kalkulator Break-Even Point per kota",
                "Rencana bisnis siap eksekusi",
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

          {/* ═══ RIGHT: Login Form Card Wrapped in Suspense ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Suspense
              fallback={
                <div className="flex min-h-[400px] items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#0a0f1d]/95">
                  <Loader2 className="h-8 w-8 animate-spin text-[#00df82]" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </motion.div>
        </div>
      </div>
      </div>
    </GoogleReCaptchaProvider>
  );
}
