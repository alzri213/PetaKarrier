"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Shield, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  email: string;
  onResend: () => Promise<void>;
}

export default function OTPModal({ isOpen, onClose, onVerify, email, onResend }: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (!isOpen) {
      setCountdown(60);
      setCanResend(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setSuccess(false);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (value && index === 5 && newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
      setError("");
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Handle paste
    else if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      // Paste will be handled by handlePaste
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Only accept 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      setError("");
      
      // Focus last input
      inputRefs.current[5]?.focus();
      
      // Auto-verify
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode: string) => {
    setIsVerifying(true);
    setError("");

    try {
      await onVerify(otpCode);
      setSuccess(true);
      
      // Close modal after 1.5 seconds on success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kode OTP salah. Silakan coba lagi.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    
    try {
      await onResend();
      setCountdown(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim ulang kode. Silakan coba lagi.");
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    if (!username || !domain) return email;
    const maskedUsername = username.slice(0, 2) + "***" + username.slice(-1);
    return `${maskedUsername}@${domain}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0a0f1d] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 px-6 py-6">
            <button
              onClick={onClose}
              disabled={isVerifying}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00df82]/20 text-[#00df82]">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Verifikasi Keamanan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Masukkan kode OTP yang dikirim ke email Anda
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-5">
            {/* Email Info */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border border-slate-200 dark:border-slate-800">
              <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                {maskEmail(email)}
              </span>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span className="font-semibold">Verifikasi berhasil! Redirecting...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && !success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-300"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* OTP Input */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 text-center">
                Masukkan Kode OTP (6 Digit)
              </label>
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isVerifying || success}
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl border-2 text-center text-xl font-bold transition outline-none ${
                      digit
                        ? "border-[#00df82] bg-emerald-50 text-slate-900 dark:bg-emerald-950/30 dark:text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    } focus:border-[#00df82] focus:ring-2 focus:ring-[#00df82]/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Kode akan expired dalam 10 menit
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={() => handleVerify(otp.join(""))}
              disabled={otp.some((d) => !d) || isVerifying || success}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#00df82] py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-[#00c975] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Verifikasi Kode</span>
                </>
              )}
            </button>

            {/* Resend Button */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tidak menerima kode?
              </p>
              <button
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={`inline-flex items-center gap-2 text-sm font-semibold transition ${
                  canResend
                    ? "text-[#00df82] hover:text-[#00c975] cursor-pointer"
                    : "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengirim ulang...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>
                      {canResend ? "Kirim Ulang Kode" : `Kirim ulang dalam ${countdown}s`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
