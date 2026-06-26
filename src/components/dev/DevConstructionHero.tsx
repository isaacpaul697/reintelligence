/**
 * Animated hero graphic for the development national overview — a construction
 * site: buildings that rise floor-by-floor on a staggered loop while a tower
 * crane hoists its load over the work. Pure CSS animation (keyframes in
 * globals.css); respects reduced-motion (buildings render fully built).
 */

type Build = { x: number; w: number; top: number; delay: number };

const GROUND = 250;
const BUILDS: Build[] = [
  { x: 40, w: 56, top: 150, delay: 0 },
  { x: 108, w: 50, top: 96, delay: -1.5 },
  { x: 170, w: 60, top: 54, delay: -3 },
  { x: 244, w: 52, top: 120, delay: -4.5 },
];

export function DevConstructionHero() {
  return (
    <svg viewBox="0 0 420 300" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An animated construction site with buildings rising and a working crane">
      <defs>
        <linearGradient id="dc-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--gold-bright)" }} />
          <stop offset="1" style={{ stopColor: "var(--gold-deep)" }} />
        </linearGradient>
        <radialGradient id="dc-glow" cx="50%" cy="58%" r="62%">
          <stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0.16 }} />
          <stop offset="1" style={{ stopColor: "var(--gold)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect x="0" y="20" width="420" height="250" fill="url(#dc-glow)" />

      {/* buildings under construction — rise, hold, then rebuild on a loop */}
      {BUILDS.map((b) => (
        <rect
          key={b.x}
          className="cc-dev-build"
          x={b.x}
          y={b.top}
          width={b.w}
          height={GROUND - b.top}
          rx={3}
          fill="url(#dc-tower)"
          style={{ animationDelay: `${b.delay}s` }}
        />
      ))}

      {/* tower crane hoisting over the right building */}
      <g>
        <rect x="320" y="58" width="6" height={GROUND - 58} rx="2" fill="var(--ink-soft)" />
        <rect x="244" y="52" width="158" height="6" rx="3" fill="var(--ink-soft)" />
        <rect x="316" y="40" width="14" height="14" rx="2" fill="var(--ink-soft)" />
        <rect x="244" y="49" width="16" height="12" rx="2" fill="var(--ink)" />
        {/* hoist rope (scales) + lifting block (rides in sync) */}
        <rect className="cc-hero-rope" x="277.25" y="58" width="1.5" height="40" fill="var(--ink-soft)" />
        <rect className="cc-hero-block" x="272" y="98" width="12" height="9" rx="1.5" fill="var(--gold)" />
      </g>

      {/* ground line */}
      <rect x="0" y={GROUND} width="420" height="3" rx="1.5" fill="var(--line-strong)" />
    </svg>
  );
}
