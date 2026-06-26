/**
 * Animated hero graphic for the student-housing landing — a graduation cap with
 * a swinging tassel above a stack of books, framed by twinkling sparkles. Pure
 * CSS animation (keyframes in globals.css); respects reduced-motion.
 */

const SPARKS = [
  { x: 40, y: 64, d: 0, r: 5 },
  { x: 200, y: 50, d: 0.7, r: 6 },
  { x: 214, y: 150, d: 1.2, r: 4.5 },
  { x: 28, y: 156, d: 1.7, r: 5 },
  { x: 122, y: 22, d: 0.35, r: 6.5 },
  { x: 70, y: 38, d: 1.0, r: 3.5 },
  { x: 176, y: 28, d: 1.5, r: 4 },
  { x: 16, y: 108, d: 0.5, r: 4 },
  { x: 224, y: 100, d: 2.0, r: 4.5 },
];

export function CampusHero() {
  return (
    <svg viewBox="0 0 240 240" className="cc-campus-sway w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A graduation cap and a stack of books">
      <defs>
        <linearGradient id="ch-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--gold-bright)" }} />
          <stop offset="1" style={{ stopColor: "var(--gold-deep)" }} />
        </linearGradient>
        <radialGradient id="ch-glow" cx="50%" cy="44%" r="56%">
          <stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0.18 }} />
          <stop offset="1" style={{ stopColor: "var(--gold)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="240" height="240" fill="url(#ch-glow)" />

      {/* twinkling sparkles */}
      {SPARKS.map((s, i) => (
        <path
          key={i}
          className="cc-campus-spark"
          style={{ animationDelay: `${s.d}s` }}
          d={`M${s.x} ${s.y - s.r} L${s.x + s.r * 0.28} ${s.y - s.r * 0.28} L${s.x + s.r} ${s.y} L${s.x + s.r * 0.28} ${s.y + s.r * 0.28} L${s.x} ${s.y + s.r} L${s.x - s.r * 0.28} ${s.y + s.r * 0.28} L${s.x - s.r} ${s.y} L${s.x - s.r * 0.28} ${s.y - s.r * 0.28} Z`}
          fill="var(--gold)"
        />
      ))}

      {/* cap + books gently float together */}
      <g className="cc-campus-float">
        {/* stacked books */}
        <rect x="62" y="182" width="104" height="15" rx="2.5" fill="#3a6ea5" />
        <rect x="158" y="185" width="11" height="9" rx="1" fill="#fff" fillOpacity="0.5" />
        <rect x="72" y="167" width="92" height="15" rx="2.5" fill="#b5462f" />
        <rect x="151" y="170" width="11" height="9" rx="1" fill="#fff" fillOpacity="0.5" />
        <rect x="58" y="152" width="100" height="15" rx="2.5" fill="#2f7d6b" />
        <rect x="145" y="155" width="11" height="9" rx="1" fill="#fff" fillOpacity="0.5" />

        {/* mortarboard cap */}
        <path d="M92 96 H148 L156 122 H84 Z" fill="var(--gold-deep)" />
        <polygon points="56,92 120,68 184,92 120,116" fill="url(#ch-board)" />
        <circle cx="120" cy="92" r="4" fill="var(--gold-deep)" />

        {/* tassel: static run along the board + swinging drop */}
        <line x1="120" y1="92" x2="184" y2="92" stroke="var(--gold-bright)" strokeWidth="2" strokeLinecap="round" />
        <g className="cc-campus-tassel">
          <line x1="184" y1="92" x2="184" y2="138" stroke="var(--gold-bright)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="184" cy="139" r="3.5" fill="var(--gold-bright)" />
          <rect x="180" y="141" width="8" height="15" rx="2" fill="var(--gold-bright)" />
        </g>
      </g>
    </svg>
  );
}
