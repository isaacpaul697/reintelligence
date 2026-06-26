/**
 * Animated hero for the hub landing: a skyline that builds itself, windows
 * that flicker on, a construction crane whose block raises and lowers on a
 * lengthening rope, cars driving along the road, and a plane drifting across
 * the sky. Pure CSS animation (keyframes in globals.css); respects
 * reduced-motion.
 */

type Tower = { x: number; w: number; top: number; delay: number };

const BASE = 300;
const TOWERS: Tower[] = [
  { x: 34, w: 46, top: 206, delay: 0 },
  { x: 90, w: 54, top: 150, delay: 0.12 },
  { x: 154, w: 50, top: 112, delay: 0.24 },
  { x: 214, w: 60, top: 66, delay: 0.36 },
  { x: 284, w: 46, top: 174, delay: 0.48 },
];

/**
 * Traffic on the road. Each car sweeps left→right at its own speed; negative
 * delays stagger them so the road already has cars spread across it on load.
 */
type Car = { color: string; dur: number; delay: number };
const CARS: Car[] = [
  { color: "#b5462f", dur: 7, delay: -0.4 },   // red
  { color: "#3a6ea5", dur: 5.5, delay: -1.4 }, // blue
  { color: "#2f7d6b", dur: 9, delay: -3.6 },   // teal
  { color: "#5b6470", dur: 8, delay: -5.2 },   // slate
  { color: "#caa53d", dur: 10, delay: -8.5 },  // gold
];

/**
 * A white airliner viewed from the side, nose pointing right (its direction of
 * travel): long fuselage with a pointed nose, an upswept vertical tail fin,
 * and a contrail streaming off the tail. A hairline edge keeps it legible on
 * the light paper sky; it reads pure white on dark.
 */
function Plane() {
  return (
    <g fill="#fff" stroke="var(--muted-2)" strokeWidth={0.5} strokeLinejoin="round" strokeLinecap="round">
      {/* contrail streaming off the tail */}
      <line x1={-24} y1={-1} x2={-58} y2={-1} stroke="#fff" strokeWidth={1.4} strokeDasharray="1 6" opacity={0.5} />
      {/* vertical tail fin (drawn under the fuselage so its base hides) */}
      <path d="M-20 -2 L-28 -13 L-14 -2.5 Z" />
      {/* tail horizontal stabilizer */}
      <path d="M-18 0 L-27 -4 L-15 0.5 Z" />
      {/* fuselage: pointed nose at +x, slim tapered tail at -x */}
      <path d="M25 -0.5 C 14 -4, -12 -4.5, -25 -2.5 C -14 2.5, 14 3, 25 -0.5 Z" />
      {/* cockpit window + passenger window line, on top of the fuselage */}
      <circle cx={20} cy={-1} r={1.2} fill="var(--muted-2)" stroke="none" opacity={0.5} />
      <line x1={-9} y1={-1.6} x2={13} y2={-1.6} stroke="var(--muted-2)" strokeWidth={0.9} strokeLinecap="round" strokeDasharray="0.5 2.4" opacity={0.45} />
    </g>
  );
}

/** A small car drawn around a baseline at local y=0 (wheels rest on the road). */
function Car({ color }: { color: string }) {
  return (
    <>
      <circle cx={-6} cy={-2.2} r={2.3} fill="var(--ink)" />
      <circle cx={6} cy={-2.2} r={2.3} fill="var(--ink)" />
      <rect x={-11} y={-9} width={22} height={6.5} rx={2.2} fill={color} />
      <rect x={-5.5} y={-13} width={11} height={4.5} rx={1.8} fill={color} />
      <rect x={-3.8} y={-12.2} width={7.5} height={3} rx={1} fill="#fff" fillOpacity={0.7} />
    </>
  );
}

function Windows({ t }: { t: Tower }) {
  const cols = t.w > 50 ? 3 : 2;
  const colGap = t.w / (cols + 1);
  const rows: number[] = [];
  for (let y = t.top + 16; y < BASE - 12; y += 22) rows.push(y);
  const cells: { x: number; y: number; d: number }[] = [];
  rows.forEach((y, ri) =>
    Array.from({ length: cols }).forEach((_, ci) => {
      cells.push({ x: t.x + colGap * (ci + 1) - 4, y, d: (ri + ci) * 0.4 + t.delay });
    }),
  );
  return (
    <>
      {cells.map((c, i) => (
        <rect
          key={i}
          className="cc-hero-lite"
          x={c.x}
          y={c.y}
          width={8}
          height={9}
          rx={1}
          fill="#fff"
          style={{ animationDelay: `${1.1 + c.d}s` }}
        />
      ))}
    </>
  );
}

export function HubHero() {
  return (
    <svg viewBox="0 0 420 340" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An animated city skyline under construction">
      <defs>
        <linearGradient id="hh-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--gold-bright)" }} />
          <stop offset="1" style={{ stopColor: "var(--gold-deep)" }} />
        </linearGradient>
        <linearGradient id="hh-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0.16 }} />
          <stop offset="1" style={{ stopColor: "var(--gold)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* soft glow behind the skyline */}
      <rect x="0" y="40" width="420" height="262" fill="url(#hh-glow)" rx="20" />

      {/* a plane drifts across the sky above the skyline */}
      <g className="cc-hero-plane">
        <Plane />
      </g>

      {/* towers + windows */}
      {TOWERS.map((t) => (
        <g key={t.x}>
          <rect
            className="cc-hero-build"
            x={t.x}
            y={t.top}
            width={t.w}
            height={BASE - t.top}
            rx={3}
            fill="url(#hh-tower)"
            style={{ animationDelay: `${t.delay}s` }}
          />
          <Windows t={t} />
        </g>
      ))}

      {/* construction crane over the tallest tower */}
      <g>
        <rect x="343" y="70" width="6" height="230" rx="2" fill="var(--ink-soft)" />
        <rect x="300" y="64" width="110" height="6" rx="3" fill="var(--ink-soft)" />
        <rect x="338" y="52" width="16" height="14" rx="2" fill="var(--ink-soft)" />
        {/* hoist rope (scales taller/shorter) + lifting block (rides with it) */}
        <rect className="cc-hero-rope" x="391.25" y="70" width="1.5" height="40" fill="var(--ink-soft)" />
        <rect className="cc-hero-block" x="386" y="110" width="12" height="9" rx="1.5" fill="var(--gold)" />
      </g>

      {/* ground line */}
      <rect x="0" y={BASE} width="420" height="3" rx="1.5" fill="var(--line-strong)" />

      {/* cars driving along the road */}
      <g className="cc-hero-cars">
        {CARS.map((c, i) => (
          <g
            key={i}
            className="cc-hero-car"
            style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
          >
            <Car color={c.color} />
          </g>
        ))}
      </g>
    </svg>
  );
}
