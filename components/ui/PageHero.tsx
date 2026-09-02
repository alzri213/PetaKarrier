"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";

interface PageHeroProps {
  badge?: string;
  title: React.ReactNode;
  description: string;
}

export default function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-32 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-600/15 blur-[120px] hidden dark:block" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-[100px] hidden dark:block" />
      <div className="pointer-events-none absolute left-0 top-40 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] hidden dark:block" />

      <div className="relative mx-auto max-w-3xl text-center">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            <Compass className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            {badge}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: badge ? 0.1 : 0 }}
          className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: badge ? 0.2 : 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 font-medium sm:text-lg dark:text-slate-300"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
