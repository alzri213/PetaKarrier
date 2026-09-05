"use client";

import { useEffect, useState } from "react";
import { Accessibility, Eye, EyeOff, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

type WidgetId = "chat-ai-trigger" | "a11y-trigger";

const WIDGETS: Array<{
  id: WidgetId;
  label: string;
  icon: typeof MessageCircle;
}> = [
  { id: "chat-ai-trigger", label: "Chat AI Widget", icon: MessageCircle },
  { id: "a11y-trigger", label: "Aksesibilitas Widget", icon: Accessibility },
];

function setWidgetVisibility(id: WidgetId, enabled: boolean) {
  document.getElementById(id)?.classList.toggle("mobile-widget-disabled", !enabled);
}

export default function MobileWidgetControls() {
  const [enabledWidgets, setEnabledWidgets] = useState<Record<WidgetId, boolean>>({
    "chat-ai-trigger": true,
    "a11y-trigger": true,
  });

  useEffect(() => {
    WIDGETS.forEach(({ id }) => setWidgetVisibility(id, enabledWidgets[id]));

    return () => {
      WIDGETS.forEach(({ id }) => setWidgetVisibility(id, true));
    };
  }, [enabledWidgets]);

  const toggleWidget = (id: WidgetId) => {
    setEnabledWidgets((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <section className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800/80 md:hidden" aria-label="Kontrol widget">
      <div className="mb-3">
        <p className="text-[11px] font-black uppercase tracking-wider text-[#00df82]">KONTROL WIDGET</p>
        <p className="mt-1 text-[11px] font-medium text-slate-500">Atur tombol widget yang tampil di layar.</p>
      </div>

      <div className="space-y-2.5">
        {WIDGETS.map(({ id, label, icon: Icon }) => {
          const isEnabled = enabledWidgets[id];

          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleWidget(id)}
              aria-pressed={isEnabled}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors duration-300 ${
                isEnabled
                  ? "border-emerald-200 bg-white shadow-sm dark:border-emerald-500/20 dark:bg-[#0d1424]"
                  : "border-slate-200 bg-slate-50 opacity-75 dark:border-slate-800 dark:bg-slate-950/50"
              }`}
            >
              <motion.span
                animate={{ scale: isEnabled ? 1 : 0.92, rotate: isEnabled ? 0 : -6 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${
                  isEnabled
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-[#00df82]"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }`}
              >
                <Icon className="h-5 w-5" />
              </motion.span>

              <span className="min-w-0 flex-1 text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black transition-colors duration-300 ${
                  isEnabled ? "bg-emerald-500 text-slate-950" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {isEnabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {isEnabled ? "ON" : "OFF"}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}