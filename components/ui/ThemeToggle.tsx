"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { toggleThemeSmoothly } from "@/lib/utils/themeTransition";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get the exact center coordinate of the button
    const btn = buttonRef.current || e.currentTarget;
    if (btn && typeof btn.getBoundingClientRect === "function") {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      toggleThemeSmoothly(setTheme, resolvedTheme, { x, y });
    } else {
      toggleThemeSmoothly(setTheme, resolvedTheme, e);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      type="button"
      onClick={handleToggle}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md transition-colors hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 ${className}`}
      aria-label="Toggle Dark Mode"
      title={isDark ? "Ubah ke Mode Terang (Light)" : "Ubah ke Mode Gelap (Dark)"}
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-400" />
        ) : (
          <Moon className="h-5 w-5 text-slate-700" />
        )}
      </motion.div>
    </motion.button>
  );
}
