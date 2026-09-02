"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Droplets,
  Contrast,
  ImageOff,
  AlignJustify,
  BookOpen,
  ArrowUpDown,
  X,
  PanelRightOpen,
  Moon,
  Sun,
  RotateCcw,
  Play,
  Square,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toggleThemeSmoothly } from "@/lib/utils/themeTransition";

export type SaturationMode = "normal" | "saturated" | "monochrome";

interface A11ySettings {
  fontSize: number; // 80 to 150 (%)
  isVoiceActive: boolean;
  saturationMode: SaturationMode;
  isContrast: boolean;
  isHideImages: boolean;
  isJustified: boolean;
  isDyslexia: boolean;
  lineHeightLevel: number; // 0: 1.5x (normal), 1: 1.85x, 2: 2.25x
}

const STORAGE_KEY = "petakarier-a11y-settings-v2";

const DEFAULTS: A11ySettings = {
  fontSize: 100,
  isVoiceActive: false,
  saturationMode: "normal",
  isContrast: false,
  isHideImages: false,
  isJustified: false,
  isDyslexia: false,
  lineHeightLevel: 0,
};

const LINE_HEIGHT_LABELS = ["Normal (1.5x)", "Sedang (1.8x)", "Tinggi (2.2x)"] as const;
const SATURATION_LABELS: Record<SaturationMode, string> = {
  normal: "Normal",
  saturated: "Jenuh+",
  monochrome: "Monokrom",
};

function loadSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...parsed,
      // Backward compatibility for old boolean isSaturated
      saturationMode:
        parsed.saturationMode ||
        (parsed.isSaturated ? "saturated" : "normal"),
    };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: A11ySettings) {
  if (typeof window === "undefined") return;
  // Always persist voice as inactive on fresh session to avoid unexpected speech on reload
  const toSave = { ...s, isVoiceActive: false };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULTS);
  const [mounted, setMounted] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const highlightedElRef = useRef<HTMLElement | null>(null);

  const { setTheme, resolvedTheme } = useTheme();

  /* ── 1. Mount & load from localStorage ── */
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setMounted(true);
  }, []);

  /* ── 2. Apply DOM classes & styles cleanly ── */
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;

    // Font size scaling
    if (settings.fontSize === 100) {
      html.style.fontSize = "";
    } else {
      html.style.fontSize = `${settings.fontSize}%`;
    }

    // High Contrast
    html.classList.toggle("a11y-high-contrast", settings.isContrast);

    // Saturation & Monochrome modes
    html.classList.toggle("a11y-saturate", settings.saturationMode === "saturated");
    html.classList.toggle("a11y-monochrome", settings.saturationMode === "monochrome");

    // Hide Images
    html.classList.toggle("a11y-hide-images", settings.isHideImages);

    // Text Justification (Paragraphs only)
    html.classList.toggle("a11y-justified", settings.isJustified);

    // Dyslexia-Friendly Typography
    html.classList.toggle("a11y-dyslexia", settings.isDyslexia);

    // Line Height
    html.classList.toggle("a11y-lh-1", settings.lineHeightLevel === 1);
    html.classList.toggle("a11y-lh-2", settings.lineHeightLevel === 2);

    saveSettings(settings);
  }, [settings, mounted]);

  /* ── 3. Interactive Web Speech API (Moda Suara / Screen Reader) ── */
  const clearSpeechHighlight = useCallback(() => {
    if (highlightedElRef.current) {
      highlightedElRef.current.classList.remove("a11y-speech-highlight");
      highlightedElRef.current = null;
    }
  }, []);

  const speakText = useCallback(
    (text: string, elementToHighlight?: HTMLElement | null) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      clearSpeechHighlight();

      const cleaned = text.replace(/\s+/g, " ").trim();
      if (!cleaned) {
        setIsSpeaking(false);
        setCurrentSpokenText("");
        return;
      }

      if (elementToHighlight) {
        elementToHighlight.classList.add("a11y-speech-highlight");
        highlightedElRef.current = elementToHighlight;
      }

      setCurrentSpokenText(cleaned);
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
        clearSpeechHighlight();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        clearSpeechHighlight();
      };

      window.speechSynthesis.speak(utterance);
    },
    [clearSpeechHighlight]
  );

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    clearSpeechHighlight();
    setCurrentSpokenText("");
  }, [clearSpeechHighlight]);

  useEffect(() => {
    if (!mounted) return;

    if (!settings.isVoiceActive) {
      stopSpeech();
      return;
    }

    // Voice mode enabled announcement
    speakText(
      "Moda suara aktif. Klik atau arahkan kursor ke teks mana pun di layar untuk mendengarkan bacaan."
    );

    // Attach click-to-speak on readable blocks
    const handleElementClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore clicks inside accessibility panel itself or buttons that close it
      if (target.closest('[role="dialog"]') || target.closest("button[aria-label]")) return;

      const readableEl = target.closest<HTMLElement>(
        "h1, h2, h3, h4, h5, p, span, li, a, button, [role='button']"
      );

      if (readableEl && readableEl.textContent) {
        const text = readableEl.textContent.trim();
        if (text.length > 1) {
          speakText(text, readableEl);
        }
      }
    };

    window.addEventListener("click", handleElementClick, { capture: true });

    return () => {
      window.removeEventListener("click", handleElementClick, { capture: true });
      stopSpeech();
    };
  }, [settings.isVoiceActive, mounted, speakText, stopSpeech]);

  /* ── 4. Keyboard Shortcuts: Ctrl+U to toggle, Escape to close ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* ── 5. Lock body scroll while panel is open ── */
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("a11y-panel-open");
    } else {
      document.documentElement.classList.remove("a11y-panel-open");
    }
    return () => {
      document.documentElement.classList.remove("a11y-panel-open");
    };
  }, [isOpen]);

  /* ── 6. State Mutation Handlers ── */
  const toggle = useCallback((key: keyof A11ySettings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }, []);

  const adjustFontSize = useCallback((delta: number) => {
    setSettings((s) => ({
      ...s,
      fontSize: Math.max(80, Math.min(150, s.fontSize + delta)),
    }));
  }, []);

  const resetFontSize = useCallback(() => {
    setSettings((s) => ({ ...s, fontSize: 100 }));
  }, []);

  const cycleSaturation = useCallback(() => {
    setSettings((s) => {
      const next: Record<SaturationMode, SaturationMode> = {
        normal: "saturated",
        saturated: "monochrome",
        monochrome: "normal",
      };
      return { ...s, saturationMode: next[s.saturationMode] };
    });
  }, []);

  const cycleLineHeight = useCallback(() => {
    setSettings((s) => ({
      ...s,
      lineHeightLevel: (s.lineHeightLevel + 1) % 3,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings(DEFAULTS);
    stopSpeech();
  }, [stopSpeech]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          1. FLOATING ACCESSIBILITY TRIGGER BUTTON (Draggable anywhere on screen)
          ══════════════════════════════════════════════════════════════════ */}
      <motion.button
        id="a11y-trigger"
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.15, cursor: "grabbing" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-20 right-4 sm:right-6 z-[45] flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center
                   rounded-full bg-[#00df82] text-slate-950 shadow-xl
                   shadow-emerald-500/30 transition-shadow duration-300 hover:bg-[#00c975]
                   border-2 border-emerald-300/60 group cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="Buka Menu Aksesibilitas (Bisa digeser)"
        title="Menu Aksesibilitas (Pintasan: CTRL+U — Tahan & Geser untuk memindahkan)"
      >
        <Accessibility className="h-5 w-5 sm:h-6 sm:w-6 select-none pointer-events-none" strokeWidth={2.5} />
        <span className="sr-only">Menu Aksesibilitas (CTRL+U)</span>
      </motion.button>

      {/* ══════════════════════════════════════════════════════════════════
          2. FLOATING VOICE MODE LIVE PLAYER (Visible when Voice is ON)
          ══════════════════════════════════════════════════════════════════ */}
      {settings.isVoiceActive && (
        <aside
          aria-label="Panel Pembaca Suara Aktif"
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-[60] rounded-2xl border border-emerald-500/40
                     bg-white/95 p-3.5 text-slate-900 shadow-2xl backdrop-blur-xl dark:border-emerald-500/30
                     dark:bg-slate-900/95 dark:text-white transition-all animate-fade-in"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-2 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                Moda Suara Aktif
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggle("isVoiceActive")}
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-400 transition"
              title="Matikan Moda Suara"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
            {currentSpokenText ? `"${currentSpokenText}"` : "Sentuh atau klik teks apa pun pada halaman untuk mendengarkan."}
          </p>

          {isSpeaking && (
            <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                Sedang Membaca...
              </span>
              <button
                type="button"
                onClick={stopSpeech}
                className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-700 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60 transition"
              >
                <Square className="h-2.5 w-2.5" />
                Hentikan
              </button>
            </div>
          )}
        </aside>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          3. MAIN ACCESSIBILITY DRAWER PANEL
          ══════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            className="fixed right-0 top-0 z-[80] flex h-full w-full sm:max-w-[420px] flex-col
                       border-l border-slate-200 bg-white text-slate-900 shadow-2xl
                       dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100
                       animate-slide-in-right overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu Aksesibilitas"
          >
            {/* ── Top Header ── */}
            <div className="shrink-0 border-b border-slate-200 bg-slate-50/80 px-6 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30">
                    <PanelRightOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Menu Aksesibilitas
                    </h2>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Pintasan Cepat: <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 font-mono text-[10px] font-bold">CTRL+U</kbd>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200
                             bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900
                             active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label="Tutup menu aksesibilitas"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Feature Sections ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-6">
              {/* SECTION 1: KETERBACAAN TEKS & TYPOGRAPHY */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Keterbacaan Teks
                </span>

                <div className="mt-3 space-y-3">
                  {/* Font Zoom Stepper Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ZoomIn className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Ukuran Teks Layar
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                        {settings.fontSize}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adjustFontSize(-10)}
                        disabled={settings.fontSize <= 80}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:border-emerald-300 active:scale-95 disabled:opacity-30 disabled:hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        title="Kecilkan Teks (-10%)"
                      >
                        <ZoomOut className="h-3.5 w-3.5" />
                        <span>Kecil</span>
                      </button>

                      <button
                        type="button"
                        onClick={resetFontSize}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        title="Reset ke Ukuran Normal 100%"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => adjustFontSize(10)}
                        disabled={settings.fontSize >= 150}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:border-emerald-300 active:scale-95 disabled:opacity-30 disabled:hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        title="Perbesar Teks (+10%)"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                        <span>Besar</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Text Helper Buttons Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Spasi Baris */}
                    <button
                      type="button"
                      onClick={cycleLineHeight}
                      className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 text-center transition-all ${
                        settings.lineHeightLevel > 0
                          ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                          : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <ArrowUpDown className={`h-5 w-5 ${settings.lineHeightLevel > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} />
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        Tinggi Garis
                      </span>
                      <span className="rounded-full bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-extrabold text-slate-700 dark:text-slate-300">
                        {LINE_HEIGHT_LABELS[settings.lineHeightLevel].split(" ")[0]}
                      </span>
                    </button>

                    {/* Rata Teks (Justify) */}
                    <button
                      type="button"
                      onClick={() => toggle("isJustified")}
                      className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 text-center transition-all ${
                        settings.isJustified
                          ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                          : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <AlignJustify className={`h-5 w-5 ${settings.isJustified ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} />
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        Rata Paragraf
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${settings.isJustified ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                        {settings.isJustified ? "ON" : "OFF"}
                      </span>
                    </button>

                    {/* Ramah Disleksia */}
                    <button
                      type="button"
                      onClick={() => toggle("isDyslexia")}
                      className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 text-center transition-all ${
                        settings.isDyslexia
                          ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                          : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <BookOpen className={`h-5 w-5 ${settings.isDyslexia ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} />
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        Disleksia
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${settings.isDyslexia ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                        {settings.isDyslexia ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: TAMPILAN & WARNA */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Tampilan & Warna
                </span>

                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {/* Dark Mode Toggle */}
                  <button
                    type="button"
                    onClick={(e) => toggleThemeSmoothly(setTheme, resolvedTheme, e)}
                    className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 text-center transition-all ${
                      isDark
                        ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5 text-amber-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    )}
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {isDark ? "Mode Terang" : "Mode Gelap"}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 dark:text-emerald-300">
                      {isDark ? "Dark" : "Light"}
                    </span>
                  </button>

                  {/* High Contrast */}
                  <button
                    type="button"
                    onClick={() => toggle("isContrast")}
                    className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 text-center transition-all ${
                      settings.isContrast
                        ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Contrast className={`h-5 w-5 ${settings.isContrast ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      Kontras+
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${settings.isContrast ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                      {settings.isContrast ? "ON" : "OFF"}
                    </span>
                  </button>

                  {/* Saturation Cycle (Normal -> Jenuh -> Monokrom) */}
                  <button
                    type="button"
                    onClick={cycleSaturation}
                    className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 text-center transition-all ${
                      settings.saturationMode !== "normal"
                        ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Droplets className={`h-5 w-5 ${settings.saturationMode !== "normal" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      Kejenuhan
                    </span>
                    <span className="rounded-full bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-extrabold text-slate-700 dark:text-slate-300">
                      {SATURATION_LABELS[settings.saturationMode]}
                    </span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: BANTUAN SUARA & GAMBAR */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Bantuan Interaktif
                </span>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {/* Moda Suara (TTS) */}
                  <button
                    type="button"
                    onClick={() => toggle("isVoiceActive")}
                    className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-4 text-center transition-all ${
                      settings.isVoiceActive
                        ? "border-emerald-500 bg-emerald-500/15 shadow-md shadow-emerald-500/10"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      {settings.isVoiceActive ? <Volume2 className="h-6 w-6 animate-pulse" /> : <VolumeX className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Moda Suara
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Baca teks otomatis saat disentuh
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${settings.isVoiceActive ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                      {settings.isVoiceActive ? "AKTIF" : "NONAKTIF"}
                    </span>
                  </button>

                  {/* Sembunyikan Gambar */}
                  <button
                    type="button"
                    onClick={() => toggle("isHideImages")}
                    className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-4 text-center transition-all ${
                      settings.isHideImages
                        ? "border-emerald-500 bg-emerald-500/15 shadow-md shadow-emerald-500/10"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <ImageOff className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Sembunyi Gambar
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Tingkatkan fokus membaca teks
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${settings.isHideImages ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                      {settings.isHideImages ? "TERSEMBUNYI" : "TAMPIL"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Pengaturan disimpan otomatis di peramban kamu.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mx-auto mt-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Semua Pengaturan</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
