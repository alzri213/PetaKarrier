"use client";

import { motion } from "framer-motion";

interface ScoreBarProps {
  label: string;
  value: number;
  delay?: number;
  color?: string;
}

export default function ScoreBar({
  label,
  value,
  delay = 0,
  color = "from-emerald-600 to-emerald-700",
}: ScoreBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}
