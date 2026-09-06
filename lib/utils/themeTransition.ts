import type { MouseEvent } from "react";

type ThemeTransitionOrigin = { x: number; y: number } | MouseEvent;

/**
 * Smooth Theme Switcher with View Transitions API (Circular Ripple Effect)
 * Expands circular ripple directly originating from the Theme Toggle button.
 */

export function toggleThemeSmoothly(
  setTheme: (theme: string) => void,
  currentResolvedTheme: string | undefined,
  origin?: ThemeTransitionOrigin
) {
  const isDark = currentResolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const transitionDocument = typeof document !== "undefined" ? document : null;
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isViewTransitionSupported =
    typeof transitionDocument?.startViewTransition === "function" &&
    !reducedMotion;

  const root = transitionDocument?.documentElement;
  const finish = () => root?.classList.remove("theme-switching");

  // Avoid capturing the whole document on phones. Pages with maps, blur,
  // images, and floating widgets make mobile View Transitions expensive.
  if (isMobile) {
    root?.classList.add("theme-switching");
    window.requestAnimationFrame(() => {
      setTheme(nextTheme);
      window.setTimeout(finish, reducedMotion ? 0 : 80);
    });
    return;
  }

  // Keep fallback theme changes cheap on browsers without View Transitions.
  if (!isViewTransitionSupported) {
    root?.classList.add("theme-switching");
    setTheme(nextTheme);
    window.setTimeout(finish, reducedMotion ? 0 : 120);
    return;
  }

  // Calculate origin coordinates (default to top-right where navbar button is located)
  let x = window.innerWidth - 80;
  let y = 40;

  if (origin && "x" in origin && "y" in origin) {
    x = origin.x;
    y = origin.y;
  } else if (origin && "clientX" in origin && origin.clientX > 0) {
    x = origin.clientX;
    y = origin.clientY;
  } else if (origin && "currentTarget" in origin && origin.currentTarget instanceof HTMLElement) {
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
    // Prevent dozens of independent transition-colors rules from competing
    // with the single document-level transition below.
    root?.classList.add("theme-switching");
    const transition = transitionDocument?.startViewTransition?.(() => {
      setTheme(nextTheme);
    });

    transition?.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: window.matchMedia("(max-width: 767px)").matches ? 320 : 420,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
      window.setTimeout(finish, 430);
    }).catch(() => {
      finish();
      setTheme(nextTheme);
    });
  } catch {
    finish();
    setTheme(nextTheme);
  }
}
