"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PageHeroProps {
  badge: string;
  title: React.ReactNode;
  description: string;
}

export default function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-32 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute left-0 top-40 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-200"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
