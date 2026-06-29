/**
 * Animated hero graphic for each asset-class landing. A sector-colored building
 * icon framed by twinkling sparkles, but each class moves its own way via the
 * `motion` prop so they don't all drift like the student-housing cap. Pure CSS
 * animation (cc-campus-* / cc-hero-* keyframes in globals.css); respects
 * reduced-motion. The building glyph is the same per-sector icon used in the nav.
 */

import type { SectorMotion } from "@/lib/dev/sectorDefs";

/**
 * Per-motion recipe: which class drives the whole svg, which drives the building
 * group, and how lively the sparkles twinkle (speed + how many show).
 */
const MOTION_CFG: Record<SectorMotion, { svg: string; building: string; sparkDur: number; sparkCount: number }> = {
  float: { svg: "cc-campus-sway", building: "cc-campus-float", sparkDur: 2,   sparkCount: 9 },
  bob:   { svg: "",               building: "cc-hero-bob",     sparkDur: 2.6, sparkCount: 7 },
  pulse: { svg: "",               building: "cc-hero-pulse",   sparkDur: 2.4, sparkCount: 6 },
  sway:  { svg: "cc-campus-sway", building: "",                sparkDur: 2.2, sparkCount: 8 },
  tilt:  { svg: "",               building: "cc-hero-tilt",    sparkDur: 2.9, sparkCount: 7 },
  still: { svg: "",               building: "",                sparkDur: 3.6, sparkCount: 5 },
};

const SPARKS = [
  { x: 40, y: 64, d: 0, r: 5 },
  { x: 204, y: 52, d: 0.7, r: 6 },
  { x: 214, y: 150, d: 1.2, r: 4.5 },
  { x: 28, y: 156, d: 1.7, r: 5 },
  { x: 120, y: 20, d: 0.35, r: 6 },
  { x: 70, y: 36, d: 1.0, r: 3.5 },
  { x: 180, y: 26, d: 1.5, r: 4 },
  { x: 16, y: 108, d: 0.5, r: 4 },
  { x: 224, y: 102, d: 2.0, r: 4.5 },
];

export function SectorHero({ color, icon, motion = "float" }: { color: string; icon: string; motion?: SectorMotion }) {
  const cfg = MOTION_CFG[motion] ?? MOTION_CFG.float;
  return (
    <svg viewBox="0 0 240 240" className={`${cfg.svg} w-full h-auto`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Asset-class illustration">
      <defs>
        <radialGradient id="sh-glow" cx="50%" cy="46%" r="56%">
          <stop offset="0" stopColor={color} stopOpacity={0.18} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="240" height="240" fill="url(#sh-glow)" />

      {/* twinkling sparkles, paced per asset class */}
      {SPARKS.slice(0, cfg.sparkCount).map((s, i) => (
        <path
          key={i}
          className="cc-campus-spark"
          style={{ animationDelay: `${s.d}s`, animationDuration: `${cfg.sparkDur}s` }}
          d={`M${s.x} ${s.y - s.r} L${s.x + s.r * 0.28} ${s.y - s.r * 0.28} L${s.x + s.r} ${s.y} L${s.x + s.r * 0.28} ${s.y + s.r * 0.28} L${s.x} ${s.y + s.r} L${s.x - s.r * 0.28} ${s.y + s.r * 0.28} L${s.x - s.r} ${s.y} L${s.x - s.r * 0.28} ${s.y - s.r * 0.28} Z`}
          fill={color}
        />
      ))}

      {/* the building glyph, moving in this class's own way */}
      <g className={cfg.building}>
        <rect x="50" y="50" width="140" height="140" rx="30" fill={color} fillOpacity="0.1" />
        <rect x="50" y="50" width="140" height="140" rx="30" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="1.5" />
        <g
          transform="translate(48 48) scale(6)"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          <path d={icon} vectorEffect="non-scaling-stroke" />
        </g>
      </g>
    </svg>
  );
}
