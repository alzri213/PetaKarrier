"use client";

import { motion } from "framer-motion";

export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
        />
      ))}
    </div>
  );
}
