/**
 * Animated hero for the Area Search empty state: a radar that sweeps a map
 * grid and pings the development sites scattered across it. Pure CSS animation
 * (keyframes in globals.css); respects reduced-motion (the sweep parks at a
 * fixed angle and the site pins stay lit).
 */

const CX = 210;
const CY = 150;

type Pin = { x: number; y: number; delay: number };
const PINS: Pin[] = [
  { x: 118, y: 92, delay: 0 },
  { x: 292, y: 108, delay: 0.6 },
  { x: 166, y: 206, delay: 1.2 },
  { x: 304, y: 198, delay: 1.8 },
  { x: 92, y: 176, delay: 2.4 },
];

export function AreaSearchHero() {
  return (
    <svg
      viewBox="0 0 420 300"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A radar sweeping a map grid for development sites"
    >
      <defs>
        <radialGradient id="as-glow" cx="50%" cy="50%" r="52%">
          <stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0.18 }} />
          <stop offset="1" style={{ stopColor: "var(--gold)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="as-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: "var(--gold)", stopOpacity: 0.45 }} />
        </linearGradient>
      </defs>

      {/* map grid */}
      <g stroke="var(--line-strong)" strokeWidth="1" opacity="0.45">
        {[60, 110, 160, 210, 260, 310, 360].map((x) => (
          <line key={`v${x}`} x1={x} y1="28" x2={x} y2="272" />
        ))}
        {[60, 100, 140, 180, 220, 260].map((y) => (
          <line key={`h${y}`} x1="38" y1={y} x2="382" y2={y} />
        ))}
      </g>

      <rect x="0" y="0" width="420" height="300" fill="url(#as-glow)" />

      {/* static range rings */}
      {[42, 84, 126].map((r) => (
        <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--gold)" strokeOpacity="0.18" />
      ))}

      {/* expanding ping */}
      <circle className="cc-radar-ping" cx={CX} cy={CY} r="42" fill="none" stroke="var(--gold)" strokeWidth="2" />

      {/* rotating sweep wedge + leading edge */}
      <g className="cc-radar-sweep">
        <path d={`M${CX} ${CY} L${CX + 126} ${CY - 46} A134 134 0 0 1 ${CX + 126} ${CY + 46} Z`} fill="url(#as-sweep)" />
        <line x1={CX} y1={CY} x2={CX + 134} y2={CY} stroke="var(--gold)" strokeWidth="2" />
      </g>

      {/* building-site pins the radar discovers */}
      {PINS.map((p) => (
        <g
          key={`${p.x}-${p.y}`}
          className="cc-radar-pin"
          style={{ animationDelay: `${p.delay}s` }}
        >
          <circle cx={p.x} cy={p.y} r="9" fill="none" stroke="var(--gold)" strokeOpacity="0.4" />
          <circle cx={p.x} cy={p.y} r="4.5" fill="var(--gold-deep)" />
        </g>
      ))}

      {/* center hub */}
      <circle cx={CX} cy={CY} r="4" fill="var(--ink)" />
    </svg>
  );
}
