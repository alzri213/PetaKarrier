"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  wrap,
} from "framer-motion";

interface MarqueeRowProps {
  items: string[];
  baseVelocity?: number;
}

function MarqueeRow({ items, baseVelocity = 2 }: MarqueeRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Seamless 50% wrap loop for smooth infinite animation
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Adjust direction based on scroll direction if scrolling fast
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get());

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap py-2.5">
      <motion.div className="flex gap-5" style={{ x }}>
        {/* Render 4 sets for continuous infinite marquee */}
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className="shrink-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300 hover:border-[#16a34a] dark:hover:border-emerald-400 hover:text-[#16a34a] dark:hover:text-emerald-400 hover:shadow-md hover:scale-105 cursor-pointer select-none"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const DEFAULT_ROW_1 = [
  "🍱 Makanan Rumahan",
  "☕ Kedai Kopi",
  "🍛 Katering Nasi Box",
  "🧊 Frozen Food",
  "👕 Distro & Thrift",
  "🎨 Custom Merch & Sablon",
  "🖌️ Studio Desain Grafis",
  "📱 Content Creator",
];

const DEFAULT_ROW_2 = [
  "💻 Agensi Web & IT",
  "💈 Barbershop & Salon",
  "📖 Akademi Bimbel",
  "📸 Foto & Video Studio",
  "🧺 Laundry Kiloan",
  "🛵 Cuci Steam Motor",
  "🛍️ Jasa Titip (Jastip)",
  "🌱 Urban Farming Hidroponik",
];

interface ScrollSpeedMarqueeProps {
  row1Items?: string[];
  row2Items?: string[];
}

export default function ScrollSpeedMarquee({
  row1Items = DEFAULT_ROW_1,
  row2Items = DEFAULT_ROW_2,
}: ScrollSpeedMarqueeProps) {
  return (
    <div className="relative py-10 bg-gradient-to-r from-emerald-50/60 via-white to-green-50/60 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300 overflow-hidden space-y-3 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      {/* Row 1: Right to Left */}
      <MarqueeRow items={row1Items} baseVelocity={-2} />

      {/* Row 2: Left to Right */}
      <MarqueeRow items={row2Items} baseVelocity={2} />
    </div>
  );
}
