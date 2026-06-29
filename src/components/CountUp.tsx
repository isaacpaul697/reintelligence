"use client";

import { useEffect, useRef, useState } from "react";
import { fmtNum, fmtCompactUSD } from "@/lib/dev/format";

/**
 * Named formatters, keyed by a plain string so a server component can hand the
 * choice across the client boundary (functions can't be passed as props).
 */
const FORMATS = {
  num: (n: number) => fmtNum(n),
  compactUsd: (n: number) => fmtCompactUSD(n),
  pct2: (n: number) => `${n.toFixed(2)}%`,
  pct0: (n: number) => `${n.toFixed(0)}%`,
  startsK: (n: number) => `${fmtNum(n)}K`,
} as const;

export type CountFormat = keyof typeof FORMATS;

/**
 * Animates a number from 0 up to `to` when it first scrolls into view, then
 * formats each frame with the named `format`. Pure requestAnimationFrame, no
 * deps. Respects prefers-reduced-motion (jumps straight to the final value) so
 * the count-up is a progressive enhancement, never a barrier to reading it.
 */
export function CountUp({
  to,
  format = "num",
  durationMs = 1100,
  className,
}: {
  to: number;
  format?: CountFormat;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  const fmt = FORMATS[format];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion, or no IntersectionObserver: skip the animation and show
    // the final figure so the number is never stuck at 0.
    if (reduce || typeof IntersectionObserver === "undefined") {
      setVal(to);
      return;
    }

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setVal(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setVal(to);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !ran.current) {
            ran.current = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {fmt(val)}
    </span>
  );
}
