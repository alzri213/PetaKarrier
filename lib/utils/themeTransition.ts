/**
 * Smooth Theme Switcher with View Transitions API (Circular Ripple Effect)
 * Expands circular ripple directly originating from the Theme Toggle button.
 */

export function toggleThemeSmoothly(
  setTheme: (theme: string) => void,
  currentResolvedTheme: string | undefined,
  origin?: { x: number; y: number } | React.MouseEvent | any
) {
  const isDark = currentResolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  // A full-root clip-path transition is expensive on mobile, especially over
  // pages containing maps, images, and backdrop filters.
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  if (isMobile) {
    window.requestAnimationFrame(() => setTheme(nextTheme));
    return;
  }

  // Check if browser supports the View Transitions API and user does not prefer reduced motion
  const isViewTransitionSupported =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isViewTransitionSupported) {
    setTheme(nextTheme);
    return;
  }

  // Calculate origin coordinates (default to top-right where navbar button is located)
  let x = window.innerWidth - 80;
  let y = 40;

  if (origin && typeof origin.x === "number" && typeof origin.y === "number") {
    x = origin.x;
    y = origin.y;
  } else if (origin && typeof origin.clientX === "number" && origin.clientX > 0) {
    x = origin.clientX;
    y = origin.clientY;
  } else if (origin && origin.currentTarget instanceof HTMLElement) {
    const rect = origin.currentTarget.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }

  // Calculate maximum distance to the furthest corner of viewport with margin
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  ) * 1.15;

  try {
    const transition = (document as any).startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    }).catch(() => {
      setTheme(nextTheme);
    });
  } catch {
    setTheme(nextTheme);
  }
}
