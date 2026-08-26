"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Accessibility,
  Volume2,
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
} from "lucide-react";
import { useTheme } from "next-themes";

interface A11ySettings {
  fontSize: number;
  isVoiceActive: boolean;
  isSaturated: boolean;
  isContrast: boolean;
  isHideImages: boolean;
  isJustified: boolean;
  isDyslexia: boolean;
  lineHeightLevel: number;
}

const STORAGE_KEY = "accessibility-settings";

const DEFAULTS: A11ySettings = {
  fontSize: 100,
  isVoiceActive: false,
  isSaturated: false,
  isContrast: false,
  isHideImages: false,
  isJustified: false,
  isDyslexia: false,
  lineHeightLevel: 0,
};

const LINE_HEIGHTS = [1.5, 1.8, 2.2] as const;

function loadSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: A11ySettings) {
  if (typeof window === "undefined") return;
  const toSave = { ...s, isVoiceActive: false };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULTS);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  /* ── Mount & load from localStorage ── */
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setMounted(true);
  }, []);

  /* ── Apply all settings to DOM ── */
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const body = document.body;

    html.style.fontSize = `${settings.fontSize}%`;

    const filters: string[] = [];
    if (settings.isSaturated) filters.push("saturate(2)");
    if (settings.isContrast) filters.push("contrast(2) brightness(1.1)");
    body.style.filter = filters.length > 0 ? filters.join(" ") : "none";

    html.classList.toggle("hide-images", settings.isHideImages);
    html.classList.toggle("text-justified", settings.isJustified);
    html.classList.toggle("dyslexia-mode", settings.isDyslexia);

    body.style.lineHeight = String(LINE_HEIGHTS[settings.lineHeightLevel]);

    saveSettings(settings);
  }, [settings, mounted]);

  /* ── Voice mode ── */
  useEffect(() => {
    if (!mounted) return;
    if (!settings.isVoiceActive) {
      window.speechSynthesis?.cancel();
      return;
    }
    const els = document.querySelectorAll<HTMLElement>("h1, h2, h3, p, span, a, button");
    const texts = Array.from(els)
      .map((el) => el.textContent?.trim())
      .filter((t): t is string => !!t && t.length > 2);

    let idx = 0;
    function speakNext() {
      if (idx >= texts.length || !settings.isVoiceActive) return;
      const u = new SpeechSynthesisUtterance(texts[idx]);
      u.lang = "id-ID";
      u.rate = 0.9;
      u.onend = () => {
        idx++;
        speakNext();
      };
      window.speechSynthesis.speak(u);
    }
    speakNext();

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [settings.isVoiceActive, mounted]);

  /* ── Keyboard shortcut: Ctrl+U to toggle, Escape to close ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Lock body scroll when panel is open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggle = useCallback(
    (key: keyof A11ySettings) => {
      setSettings((s) => ({ ...s, [key]: !s[key] }));
    },
    []
  );

  const cycleLineHeight = useCallback(() => {
    setSettings((s) => ({
      ...s,
      lineHeightLevel: (s.lineHeightLevel + 1) % 3,
    }));
  }, []);

  const adjustFontSize = useCallback((delta: number) => {
    setSettings((s) => ({
      ...s,
      fontSize: Math.max(80, Math.min(150, s.fontSize + delta)),
    }));
  }, []);

  if (!mounted) return null;

  const features = [
    {
      key: "isVoiceActive" as const,
      icon: Volume2,
      label: "Moda Suara",
      type: "toggle" as const,
      active: settings.isVoiceActive,
      onToggle: () => toggle("isVoiceActive"),
    },
    {
      key: "zoomIn" as const,
      icon: ZoomIn,
      label: "Perbesar Teks",
      type: "action" as const,
      active: false,
      onToggle: () => adjustFontSize(10),
      badge: `${settings.fontSize}%`,
    },
    {
      key: "zoomOut" as const,
      icon: ZoomOut,
      label: "Perkecil Teks",
      type: "action" as const,
      active: false,
      onToggle: () => adjustFontSize(-10),
      badge: `${settings.fontSize}%`,
    },
    {
      key: "isSaturated" as const,
      icon: Droplets,
      label: "Kejenuhan",
      type: "toggle" as const,
      active: settings.isSaturated,
      onToggle: () => toggle("isSaturated"),
    },
    {
      key: "isContrast" as const,
      icon: Contrast,
      label: "Kontras+",
      type: "toggle" as const,
      active: settings.isContrast,
      onToggle: () => toggle("isContrast"),
    },
    {
      key: "isHideImages" as const,
      icon: ImageOff,
      label: "Sembunyikan Gambar",
      type: "toggle" as const,
      active: settings.isHideImages,
      onToggle: () => toggle("isHideImages"),
    },
    {
      key: "isJustified" as const,
      icon: AlignJustify,
      label: "Rata Tulisan",
      type: "toggle" as const,
      active: settings.isJustified,
      onToggle: () => toggle("isJustified"),
    },
    {
      key: "isDyslexia" as const,
      icon: BookOpen,
      label: "Ramah Disleksia",
      type: "toggle" as const,
      active: settings.isDyslexia,
      onToggle: () => toggle("isDyslexia"),
    },
    {
      key: "darkMode" as const,
      icon: resolvedTheme === "dark" ? Sun : Moon,
      label: resolvedTheme === "dark" ? "Mode Terang" : "Mode Gelap",
      type: "toggle" as const,
      active: resolvedTheme === "dark",
      onToggle: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      badge: resolvedTheme === "dark" ? "Dark" : "Light",
    },
    {
      key: "lineHeight" as const,
      icon: ArrowUpDown,
      label: "Tinggi Garis",
      type: "cycle" as const,
      active: settings.lineHeightLevel > 0,
      onToggle: cycleLineHeight,
      badge: String(LINE_HEIGHTS[settings.lineHeightLevel]),
    },
  ];

  return (
    <>
      {/* ═══ Global styles for accessibility classes ═══ */}
      <style dangerouslySetInnerHTML={{ __html: `
        html.hide-images img {
          display: none !important;
        }
        html.text-justified body {
          text-align: justify;
          text-justify: inter-word;
        }
        html.dyslexia-mode body {
          font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif !important;
          letter-spacing: 0.12em;
          word-spacing: 0.2em;
          background-color: #fdf6e3 !important;
          color: #333 !important;
        }
        html.dyslexia-mode * {
          letter-spacing: 0.08em;
        }
      `}} />

      {/* ═══ Floating trigger button ═══ */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-[60] flex h-14 w-14 items-center justify-center
                   rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30
                   transition-all duration-200 hover:scale-110 hover:bg-green-500
                   hover:shadow-xl hover:shadow-green-500/40 active:scale-95"
        aria-label="Buka Menu Aksesibilitas"
        title="Menu Aksesibilitas (CTRL+U)"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {/* ═══ Only render panel when open ═══ */}
      {isOpen && (
        <>
          {/* Overlay backdrop — below panel, above everything else */}
          <div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel — highest z-index, fully in DOM only when open */}
          <div
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-[400px] flex-col
                       border-l border-slate-200 bg-white text-slate-900 shadow-2xl shadow-slate-900/15
                       dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:shadow-black/50
                       animate-slide-in-right"
            role="dialog"
            aria-modal="true"
            aria-label="Menu Aksesibilitas"
          >
            {/* Header */}
            <div className="shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600/20">
                    <PanelRightOpen className="h-4.5 w-4.5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Menu Aksesibilitas
                    </h2>
                    <p className="text-[10px] font-semibold text-slate-500">
                      CTRL+U
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10
                             bg-white/[0.06] text-slate-300 transition-all duration-150 hover:bg-white/[0.12]
                             hover:text-white active:scale-90"
                  aria-label="Tutup panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sub-header */}
              <div className="border-t border-slate-200 px-5 py-3 dark:border-slate-800">
                <p className="text-[11px] font-bold uppercase tracking-widest text-green-400">
                  Profil Aksesibilitas
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Pengaturan disimpan otomatis di browser kamu.
                </p>
              </div>
            </div>

            {/* Feature grid — scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
                {features.map((f) => {
                  const Icon = f.icon;
                  const isActive =
                    f.type === "toggle" ? f.active : f.type === "cycle" ? f.active : false;
                  return (
                    <button
                      key={f.key}
                      onClick={f.onToggle}
                      className={`group relative flex flex-col items-center gap-2 rounded-2xl border
                                  p-4 transition-all duration-200
                                  ${
                                    isActive
                                      ? "border-green-500/50 bg-green-500/10 shadow-md shadow-green-500/10"
                                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                                  }`}
                    >
                      {/* Status indicator dot */}
                      <span
                        className={`absolute right-2.5 top-2.5 h-2 w-2 rounded-full transition-colors
                                    ${isActive ? "bg-green-400" : "bg-slate-600"}`}
                      />

                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl
                                    transition-colors duration-200
                                    ${
                                      isActive
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-white/[0.06] text-slate-400 group-hover:text-white"
                                    }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Label */}
                      <span
                        className={`text-center text-[10px] font-bold leading-tight transition-colors
                                    ${isActive ? "text-green-300" : "text-slate-400 group-hover:text-slate-200"}`}
                      >
                        {f.label}
                      </span>

                      {/* Badge */}
                      {"badge" in f && f.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold
                                      ${
                                        isActive
                                          ? "bg-green-500/20 text-green-300"
                                          : "bg-white/[0.06] text-slate-500"
                                      }`}
                        >
                          {f.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              <p className="text-center text-[10px] text-slate-600">
                Semua pengaturan disimpan di localStorage browser kamu.
              </p>
              <button
                onClick={() => setSettings({ ...DEFAULTS })}
                className="mx-auto mt-3 block rounded-lg border border-white/10 bg-white/[0.04]
                           px-4 py-2 text-[10px] font-bold text-slate-400 transition-colors
                           hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                Reset Semua Pengaturan
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
