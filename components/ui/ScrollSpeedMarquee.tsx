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
import { Icon } from "@iconify/react";

interface MarqueeItem {
  icon: string;
  label: string;
}

interface MarqueeRowProps {
  items: MarqueeItem[];
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
    <div className="flex overflow-hidden whitespace-nowrap py-2">
      <motion.div className="flex gap-3 sm:gap-5" style={{ x }}>
        {/* Render 4 sets for continuous infinite marquee */}
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className="shrink-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300 hover:border-[#16a34a] dark:hover:border-emerald-400 hover:text-[#16a34a] dark:hover:text-emerald-400 hover:shadow-md hover:scale-105 cursor-pointer select-none"
          >
            <Icon icon={item.icon} className="h-4 w-4 text-emerald-600 dark:text-[#00df82] shrink-0" />
            <span>{item.label}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const DEFAULT_ROW_1: MarqueeItem[] = [
  { icon: "solar:chef-hat-bold", label: "Makanan Rumahan" },
  { icon: "solar:cup-bold", label: "Kedai Kopi" },
  { icon: "solar:bag-heart-bold", label: "Katering Nasi Box" },
  { icon: "solar:snowflake-bold", label: "Frozen Food" },
  { icon: "solar:t-shirt-bold", label: "Distro & Thrift" },
  { icon: "solar:palette-bold", label: "Custom Merch & Sablon" },
  { icon: "solar:pen-new-square-bold", label: "Studio Desain Grafis" },
  { icon: "solar:videocamera-record-bold", label: "Content Creator" },
];

const DEFAULT_ROW_2: MarqueeItem[] = [
  { icon: "solar:laptop-minimalistic-bold", label: "Agensi Web & IT" },
  { icon: "solar:scissors-bold", label: "Barbershop & Salon" },
  { icon: "solar:book-bookmark-bold", label: "Akademi Bimbel" },
  { icon: "solar:camera-bold", label: "Foto & Video Studio" },
  { icon: "solar:washing-machine-minimalistic-bold", label: "Laundry Kiloan" },
  { icon: "solar:wheel-bold", label: "Cuci Steam Motor" },
  { icon: "solar:cart-large-4-bold", label: "Jasa Titip (Jastip)" },
  { icon: "solar:leaf-bold", label: "Urban Farming Hidroponik" },
];

interface ScrollSpeedMarqueeProps {
  row1Items?: MarqueeItem[];
  row2Items?: MarqueeItem[];
}

export default function ScrollSpeedMarquee({
  row1Items = DEFAULT_ROW_1,
  row2Items = DEFAULT_ROW_2,
}: ScrollSpeedMarqueeProps) {
  return (
    <div className="relative py-8 sm:py-10 bg-gradient-to-r from-emerald-50/60 via-white to-green-50/60 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300 overflow-hidden space-y-2 sm:space-y-3 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      {/* Row 1: Right to Left */}
      <MarqueeRow items={row1Items} baseVelocity={-2} />

      {/* Row 2: Left to Right */}
      <MarqueeRow items={row2Items} baseVelocity={2} />
    </div>
  );
}
