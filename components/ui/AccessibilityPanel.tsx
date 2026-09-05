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
  Square,
  PauseCircle,
  MousePointer,
  Scan,
  Link as LinkIcon,
  Eye,
  Type,
  Menu as MenuIcon,
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
  lineHeightLevel: number; // 0: Normal (1.5x), 1: Sedang (1.8x), 2: Tinggi (2.2x)
  isReducedMotion: boolean; // Kurangi Animasi
  isBigCursor: boolean; // Kursor XL
  isTextFocus: boolean; // Fokus Teks
  isHighlightLinks: boolean; // Sorot Link
  isReadingRuler: boolean; // Penggaris Baca
  letterSpacingLevel: number; // 0: Normal, 1: Lebar, 2: Ekstra
  isExpandedTooltips: boolean; // Tooltip Diperluas
}

const STORAGE_KEY = "petakarier-a11y-settings-v3";

const DEFAULTS: A11ySettings = {
  fontSize: 100,
  isVoiceActive: false,
  saturationMode: "normal",
  isContrast: false,
  isHideImages: false,
  isJustified: false,
  isDyslexia: false,
  lineHeightLevel: 0,
  isReducedMotion: false,
  isBigCursor: false,
  isTextFocus: false,
  isHighlightLinks: false,
  isReadingRuler: false,
  letterSpacingLevel: 0,
  isExpandedTooltips: false,
};

const LINE_HEIGHT_LABELS = ["Normal", "Sedang", "Tinggi"] as const;
const LETTER_SPACING_LABELS = ["Normal", "Lebar", "Ekstra"] as const;
const SATURATION_LABELS: Record<SaturationMode, string> = {
  normal: "Normal",
  saturated: "Jenuh+",
  monochrome: "Monokrom",
};

function loadSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("petakarier-a11y-settings-v2");
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...parsed,
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
  const [readingRulerY, setReadingRulerY] = useState(300);
  const highlightedElRef = useRef<HTMLElement | null>(null);
  const speechRetryTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const { setTheme, resolvedTheme } = useTheme();

  /* ── 1. Mount & load from localStorage ── */
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setMounted(true);
  }, []);

  /* ── 2. Reading Ruler Mouse Tracking ── */
  useEffect(() => {
    if (!settings.isReadingRuler) return;
    const handlePointerMove = (e: PointerEvent) => {
      setReadingRulerY(e.clientY);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [settings.isReadingRuler]);

  /* ── 3. Apply DOM classes & styles cleanly ── */
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

    // Reduced Motion
    html.classList.toggle("a11y-reduced-motion", settings.isReducedMotion);

    // Big Cursor
    html.classList.toggle("a11y-big-cursor", settings.isBigCursor);

    // Text Focus
    html.classList.toggle("a11y-text-focus", settings.isTextFocus);

    // Highlight Links
    html.classList.toggle("a11y-highlight-links", settings.isHighlightLinks);

    // Letter Spacing
    html.classList.toggle("a11y-ls-1", settings.letterSpacingLevel === 1);
    html.classList.toggle("a11y-ls-2", settings.letterSpacingLevel === 2);

    // Expanded Tooltips
    html.classList.toggle("a11y-expanded-tooltips", settings.isExpandedTooltips);

    saveSettings(settings);
  }, [settings, mounted]);

  /* ── 4. Interactive Web Speech API (Moda Suara / Screen Reader) ── */
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
      if (speechRetryTimeoutRef.current !== null) {
        window.clearTimeout(speechRetryTimeoutRef.current);
        speechRetryTimeoutRef.current = null;
      }

      const cleaned = text.replace(/\s+/g, " ").trim();
      if (!cleaned) {
        setIsSpeaking(false);
        setCurrentSpokenText("");
        return;
      }

      let attempts = 0;
      const speakWhenVoiceReady = () => {
        const indonesianVoice = window.speechSynthesis
          .getVoices()
          .find((voice) => voice.lang.toLowerCase() === "id-id" || voice.lang.toLowerCase().startsWith("id-"));

        if (!indonesianVoice) {
          if (attempts < 40) {
            attempts += 1;
            speechRetryTimeoutRef.current = window.setTimeout(speakWhenVoiceReady, 150);
          }
          return;
        }

        speechRetryTimeoutRef.current = null;
        if (elementToHighlight) {
          elementToHighlight.classList.add("a11y-speech-highlight");
          highlightedElRef.current = elementToHighlight;
        }

        setCurrentSpokenText(cleaned);
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(cleaned);
        utterance.lang = "id-ID";
        utterance.voice = indonesianVoice;
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

        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      };

      speakWhenVoiceReady();
    },
    [clearSpeechHighlight]
  );

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (speechRetryTimeoutRef.current !== null) {
        window.clearTimeout(speechRetryTimeoutRef.current);
        speechRetryTimeoutRef.current = null;
      }
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

    // Attach click-to-speak on readable blocks
    const handleElementClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore clicks inside accessibility panel itself or buttons that close it
      if (target.closest('[role="dialog"]') || target.closest("button[aria-label]")) return;

      const readableEl = target.closest<HTMLElement>(
        "p, h1, h2, h3, h4, h5, h6, span, li, button, a, label, blockquote, dt, dd"
      );

      if (readableEl) {
        const text = readableEl.innerText || readableEl.textContent || "";
        if (text.trim().length > 0) {
          speakText(text, readableEl);
        }
      }
    };

    window.addEventListener("click", handleElementClick, true);

    return () => {
      window.removeEventListener("click", handleElementClick, true);
      stopSpeech();
    };
  }, [settings.isVoiceActive, speakText, stopSpeech, mounted]);

  /* ── 5. Keyboard Shortcut: CTRL+U to toggle panel ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setIsOpen((v) => !v);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  /* ── 6. State Modification Handlers ── */
  const adjustFontSize = (delta: number) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(150, Math.max(80, prev.fontSize + delta)),
    }));
  };

  const resetFontSize = () => {
    setSettings((prev) => ({ ...prev, fontSize: 100 }));
  };

  const cycleLineHeight = () => {
    setSettings((prev) => ({
      ...prev,
      lineHeightLevel: ((prev.lineHeightLevel + 1) % 3) as 0 | 1 | 2,
    }));
  };

  const cycleLetterSpacing = () => {
    setSettings((prev) => ({
      ...prev,
      letterSpacingLevel: ((prev.letterSpacingLevel + 1) % 3) as 0 | 1 | 2,
    }));
  };

  const cycleSaturation = () => {
    // Keep this control focused on saturation; legacy monochrome state is restored to Jenuh+.
    const next: SaturationMode = settings.saturationMode === "saturated" ? "normal" : "saturated";

    // Clear the previous visual mode immediately so filters cannot overlap.
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("a11y-saturate", "a11y-monochrome");
      if (next === "saturated") document.documentElement.classList.add("a11y-saturate");
      if (next === "monochrome") document.documentElement.classList.add("a11y-monochrome");
    }

    setSettings((prev) => ({ ...prev, saturationMode: next }));
  };

  const toggle = (key: keyof A11ySettings) => {
    if (key === "isVoiceActive") {
      if (settings.isVoiceActive) {
        stopSpeech();
      } else {
        speakText("Moda suara aktif. Klik atau arahkan kursor ke teks mana pun di layar untuk mendengarkan bacaan.");
      }
    }
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAll = () => {
    setSettings(DEFAULTS);
    stopSpeech();
  };

  const isDark = resolvedTheme === "dark";

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          0. FLOATING READING RULER (Follows mouse cursor Y)
          ══════════════════════════════════════════════════════════════════ */}
      {settings.isReadingRuler && (
        <div
          style={{ top: `${readingRulerY}px` }}
          className="pointer-events-none fixed left-0 right-0 z-[9998] h-11 -translate-y-1/2 border-y-2 border-[#00df82] bg-emerald-400/10 shadow-[0_0_20px_rgba(0,223,130,0.35)] backdrop-blur-[0.5px] transition-[top] duration-75 ease-out"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-[#00df82] px-2 py-0.5 text-[9px] font-black tracking-wider text-slate-950 shadow">
            PENGGARIS BACA
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          1. FLOATING ACCESSIBILITY TRIGGER BUTTON (Draggable anywhere)
          ══════════════════════════════════════════════════════════════════ */}
      <motion.button
        id="a11y-trigger"
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.15, cursor: "grabbing" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 200);
        }}
        onClick={() => {
          if (isDraggingRef.current) return;
          setIsOpen((v) => !v);
        }}
        className="fixed bottom-[88px] right-4 sm:right-6 z-[45] flex h-14 w-14 items-center justify-center
                   rounded-full bg-[#00df82] text-slate-950 shadow-xl
                   shadow-emerald-500/30 transition-shadow duration-300 hover:bg-[#00c975]
                   border-2 border-emerald-300/60 group cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="Buka Menu Aksesibilitas (Bisa digeser)"
        title="Menu Aksesibilitas (Pintasan: CTRL+U — Tahan & Geser untuk memindahkan)"
      >
        <Accessibility className="h-6 w-6 select-none pointer-events-none" strokeWidth={2.5} />
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
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-400 transition cursor-pointer"
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
                className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-700 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60 transition cursor-pointer"
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
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            className="a11y-drawer fixed right-0 top-0 z-[80] flex h-full w-full sm:max-w-[420px] flex-col
                       border-l border-slate-200 bg-[#060a14] text-slate-100 shadow-2xl
                       dark:border-slate-800 dark:bg-[#060a14] dark:text-slate-100
                       animate-slide-in-right overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu Aksesibilitas"
          >
            {/* ── Top Header ── */}
            <div className="shrink-0 border-b border-slate-800/80 bg-[#0a101f]/90 px-6 py-4.5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-[#00df82] border border-emerald-500/30">
                    <PanelRightOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-white">
                      Menu Aksesibilitas
                    </h2>
                    <p className="text-[11px] font-semibold text-slate-400">
                      Pintasan Cepat: <kbd className="rounded bg-slate-800 border border-slate-700 px-1 py-0.5 font-mono text-[10px] font-bold text-emerald-400">CTRL+U</kbd>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800
                             bg-slate-900 text-slate-400 shadow-sm transition hover:bg-slate-800 hover:text-white
                             active:scale-95 cursor-pointer"
                  aria-label="Tutup menu aksesibilitas"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Feature Sections ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
              {/* ════════════════════════════════════════════════════════
                  SECTION 1: KETERBACAAN TEKS
                  ════════════════════════════════════════════════════════ */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00df82]">
                  KETERBACAAN TEKS
                </span>

                <div className="mt-3 space-y-3">
                  {/* Font Zoom Stepper Card */}
                  <div className="rounded-2xl border border-slate-800/90 bg-[#0d1424] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ZoomIn className="h-4 w-4 text-[#00df82]" />
                        <span className="text-xs font-extrabold text-white">
                          Ukuran Teks Layar
                        </span>
                      </div>
                      <span className="rounded-full bg-[#052e25] border border-emerald-500/40 px-3 py-0.5 text-[11px] font-mono font-black text-[#00df82]">
                        {settings.fontSize}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adjustFontSize(-10)}
                        disabled={settings.fontSize <= 80}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#141e34] py-2.5 text-xs font-bold text-slate-300 transition hover:bg-[#1a2845] hover:text-white active:scale-95 disabled:opacity-30 cursor-pointer"
                        title="Kecilkan Teks (-10%)"
                      >
                        <ZoomOut className="h-3.5 w-3.5" />
                        <span className="sr-only">Kecilkan</span>
                      </button>

                      <button
                        type="button"
                        onClick={resetFontSize}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141e34] text-slate-300 transition hover:bg-[#1a2845] hover:text-[#00df82] active:scale-95 cursor-pointer"
                        title="Reset ke Ukuran Normal 100%"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => adjustFontSize(10)}
                        disabled={settings.fontSize >= 150}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#141e34] py-2.5 text-xs font-bold text-slate-300 transition hover:bg-[#1a2845] hover:text-white active:scale-95 disabled:opacity-30 cursor-pointer"
                        title="Perbesar Teks (+10%)"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                        <span className="sr-only">Perbesar</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Text Helper Buttons Grid: Tinggi Garis | Rata Paragraf | Disleksia */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Tinggi Garis */}
                    <button
                      type="button"
                      onClick={cycleLineHeight}
                      className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                        settings.lineHeightLevel > 0
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <ArrowUpDown className={`h-5 w-5 ${settings.lineHeightLevel > 0 ? "text-[#00df82]" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold text-slate-200 leading-tight">
                        Tinggi Garis
                      </span>
                      <span className="rounded-full bg-[#141e34] px-2.5 py-0.5 text-[9px] font-extrabold text-slate-300">
                        {LINE_HEIGHT_LABELS[settings.lineHeightLevel]}
                      </span>
                    </button>

                    {/* Rata Paragraf */}
                    <button
                      type="button"
                      onClick={() => toggle("isJustified")}
                      className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                        settings.isJustified
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <AlignJustify className={`h-5 w-5 ${settings.isJustified ? "text-[#00df82]" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold text-slate-200 leading-tight">
                        Rata Paragraf
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isJustified ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                        {settings.isJustified ? "ON" : "OFF"}
                      </span>
                    </button>

                    {/* Disleksia */}
                    <button
                      type="button"
                      onClick={() => toggle("isDyslexia")}
                      className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                        settings.isDyslexia
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <BookOpen className={`h-5 w-5 ${settings.isDyslexia ? "text-[#00df82]" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold text-slate-200 leading-tight">
                        Disleksia
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isDyslexia ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                        {settings.isDyslexia ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>
                </div>

              </div>

              {/* ════════════════════════════════════════════════════════
                  SECTION 2: TAMPILAN & WARNA
                  ════════════════════════════════════════════════════════ */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00df82]">
                  TAMPILAN & WARNA
                </span>

                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {/* Mode Terang / Gelap */}
                  <button
                    type="button"
                    onClick={(e) => toggleThemeSmoothly(setTheme, resolvedTheme, e)}
                    className="flex flex-col items-center justify-between gap-2.5 rounded-2xl border border-[#00df82] bg-emerald-500/10 p-3.5 text-center transition-all cursor-pointer shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                  >
                    <Sun className="h-5 w-5 text-amber-400" />
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      Mode Terang
                    </span>
                    <span className="rounded-full bg-[#052e25] border border-emerald-500/40 px-2.5 py-0.5 text-[9px] font-extrabold text-[#00df82]">
                      {isDark ? "Dark" : "Light"}
                    </span>
                  </button>

                  {/* Kontras+ */}
                  <button
                    type="button"
                    onClick={() => toggle("isContrast")}
                    className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                      settings.isContrast
                        ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                        : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                    }`}
                  >
                    <Contrast className={`h-5 w-5 ${settings.isContrast ? "text-[#00df82]" : "text-slate-400"}`} />
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      Kontras+
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isContrast ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                      {settings.isContrast ? "ON" : "OFF"}
                    </span>
                  </button>

                  {/* Kejenuhan */}
                  <button
                    type="button"
                    onClick={cycleSaturation}
                    className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                      settings.saturationMode !== "normal"
                        ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                        : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                    }`}
                  >
                    <Droplets className={`h-5 w-5 ${settings.saturationMode !== "normal" ? "text-[#00df82]" : "text-slate-400"}`} />
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      Kejenuhan
                    </span>
                    <span className="rounded-full bg-[#141e34] px-2.5 py-0.5 text-[9px] font-extrabold text-slate-300">
                      {SATURATION_LABELS[settings.saturationMode]}
                    </span>
                  </button>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════
                  SECTION 3: BANTUAN INTERAKTIF
                  ════════════════════════════════════════════════════════ */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00df82]">
                  BANTUAN INTERAKTIF
                </span>

                <div className="mt-3 space-y-3">
                  {/* Mode Suara (Full Width Card) */}
                  <button
                    type="button"
                    onClick={() => toggle("isVoiceActive")}
                    className={`w-full flex flex-col items-center justify-center gap-2 rounded-2xl border p-5 text-center transition-all cursor-pointer ${
                      settings.isVoiceActive
                        ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                        : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b332b] text-[#00df82] border border-emerald-500/30">
                      {settings.isVoiceActive ? <Volume2 className="h-6 w-6 animate-pulse" /> : <VolumeX className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white leading-tight">
                        Mode Suara
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        Baca teks otomatis saat disentuh
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-0.5 text-[10px] font-extrabold ${settings.isVoiceActive ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                      {settings.isVoiceActive ? "AKTIF" : "OFF"}
                    </span>
                  </button>

                  {/* Information Box (Yellow/Orange outline & text) */}
                  <div className="rounded-2xl border border-amber-500/50 bg-[#161208] p-3.5 text-amber-300/90 text-[11px] leading-relaxed shadow-sm">
                    Saran: gunakan Google Chrome atau Microsoft Edge versi terbaru. Suara hanya berjalan jika voice Bahasa Indonesia tersedia di browser atau perangkat Anda. Jika belum terdengar, tambahkan voice Bahasa Indonesia di pengaturan suara perangkat lalu muat ulang halaman.
                  </div>

                  {/* 2-Column Row: Sembunyi Gambar | Kurangi Animasi */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Sembunyi Gambar */}
                    <button
                      type="button"
                      onClick={() => toggle("isHideImages")}
                      className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                        settings.isHideImages
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b332b] text-[#00df82] border border-emerald-500/30">
                        <ImageOff className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white leading-tight">
                          Sembunyi Gambar
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                          Tingkatkan fokus membaca teks
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isHideImages ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-300"}`}>
                        {settings.isHideImages ? "SEMBUNYI" : "TAMPIL"}
                      </span>
                    </button>

                    {/* Kurangi Animasi */}
                    <button
                      type="button"
                      onClick={() => toggle("isReducedMotion")}
                      className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                        settings.isReducedMotion
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b332b] text-[#00df82] border border-emerald-500/30">
                        <PauseCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white leading-tight">
                          Kurangi Animasi
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                          Kurangi gerakan pada halaman
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isReducedMotion ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                        {settings.isReducedMotion ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════
                  SECTION 4: BANTUAN NAVIGASI & FOKUS
                  ════════════════════════════════════════════════════════ */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00df82]">
                  BANTUAN NAVIGASI & FOKUS
                </span>

                <div className="mt-3 space-y-3">
                  {/* 3-Column Row: Kursor XL | Fokus Teks | Sorot Link */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Kursor XL */}
                    <button
                      type="button"
                      onClick={() => toggle("isBigCursor")}
                      className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                        settings.isBigCursor
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <MousePointer className={`h-5 w-5 ${settings.isBigCursor ? "text-[#00df82]" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold text-slate-200 leading-tight">
                        Kursor XL
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isBigCursor ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                        {settings.isBigCursor ? "ON" : "OFF"}
                      </span>
                    </button>

                    {/* Fokus Teks */}
                    <button
                      type="button"
                      onClick={() => toggle("isTextFocus")}
                      className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                        settings.isTextFocus
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <Scan className={`h-5 w-5 ${settings.isTextFocus ? "text-[#00df82]" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold text-slate-200 leading-tight">
                        Fokus Teks
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isTextFocus ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                        {settings.isTextFocus ? "ON" : "OFF"}
                      </span>
                    </button>

                    {/* Sorot Link */}
                    <button
                      type="button"
                      onClick={() => toggle("isHighlightLinks")}
                      className={`flex flex-col items-center justify-between gap-2.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                        settings.isHighlightLinks
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <LinkIcon className={`h-5 w-5 ${settings.isHighlightLinks ? "text-[#00df82]" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold text-slate-200 leading-tight">
                        Sorot Link
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isHighlightLinks ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                        {settings.isHighlightLinks ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>

                  {/* 2-Column Row: Penggaris Baca | Jarak Huruf */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Penggaris Baca */}
                    <button
                      type="button"
                      onClick={() => toggle("isReadingRuler")}
                      className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                        settings.isReadingRuler
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b332b] text-[#00df82] border border-emerald-500/30">
                        <Eye className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white leading-tight">
                          Penggaris Baca
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                          Garis horizontal ikuti kursor
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isReadingRuler ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                        {settings.isReadingRuler ? "ON" : "OFF"}
                      </span>
                    </button>

                    {/* Jarak Huruf */}
                    <button
                      type="button"
                      onClick={cycleLetterSpacing}
                      className={`flex flex-col items-center justify-between gap-2 rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                        settings.letterSpacingLevel > 0
                          ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                          : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b332b] text-[#00df82] border border-emerald-500/30">
                        <Type className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white leading-tight">
                          Jarak Huruf
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                          Rentangkan spasi antar huruf
                        </p>
                      </div>
                      <span className="rounded-full bg-[#141e34] px-2.5 py-0.5 text-[9px] font-extrabold text-slate-300">
                        {LETTER_SPACING_LABELS[settings.letterSpacingLevel]}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════
                  SECTION 5: BANTUAN TAMBAHAN
                  ════════════════════════════════════════════════════════ */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00df82]">
                  BANTUAN TAMBAHAN
                </span>

                <div className="mt-3">
                  {/* Tooltip Diperluas */}
                  <button
                    type="button"
                    onClick={() => toggle("isExpandedTooltips")}
                    className={`w-full flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                      settings.isExpandedTooltips
                        ? "border-[#00df82] bg-emerald-500/10 shadow-[0_0_15px_rgba(0,223,130,0.15)]"
                        : "border-slate-800/90 bg-[#0d1424] hover:bg-[#121c33] hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b332b] text-[#00df82] border border-emerald-500/30">
                        <MenuIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-white leading-tight">
                          Tooltip Diperluas
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Tampilkan informasi bantuan lebih detail
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold ${settings.isExpandedTooltips ? "bg-[#00df82] text-slate-950" : "bg-[#141e34] text-slate-400"}`}>
                      {settings.isExpandedTooltips ? "ON" : "OFF"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 border-t border-slate-800/80 bg-[#0a101f]/90 px-6 py-4">
              <p className="text-center text-[10px] font-medium text-slate-400">
                Pengaturan disimpan otomatis di peramban kamu.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mx-auto mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-[#0d1424] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-red-500/50 hover:bg-red-950/30 hover:text-red-400 active:scale-95 cursor-pointer"
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
