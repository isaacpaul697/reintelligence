"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and slides its children in the first time they scroll into view.
 * Wrap a section or card; pass a small `delayMs` to stagger siblings. The
 * actual motion lives in the .cc-reveal / .cc-reveal-in CSS (globals.css),
 * which disables itself under prefers-reduced-motion so content stays visible.
 */
export function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (old browser / non-DOM env): show immediately so
    // content is never trapped at opacity 0.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`cc-reveal ${shown ? "cc-reveal-in" : ""} ${className}`}
      style={{ transitionDelay: shown ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
