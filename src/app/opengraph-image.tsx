import { ImageResponse } from "next/og";

// LinkedIn / social preview card. Next.js auto-generates the <meta og:image>
// tags from this file. Recreates the hub landing hero (skyline + headline) so
// the shared card matches the live product. Rendered as vectors at 1200x630.
export const alt =
  "Real Estate Intelligence — one workspace for the deals you buy and the supply you watch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Warm "Fiat studio" palette (CSS vars resolved to hex, since the OG renderer
// cannot read CSS custom properties).
const GOLD = "#9a7b2e";
const GOLD_BRIGHT = "#c0973a";
const GOLD_DEEP = "#6d5418";
const INK = "#26231d";
const INK_SOFT = "#574f43";
const LINE_STRONG = "#d6ccb9";
const MUTED_2 = "#b1a994";

/** Build a static (non-animated) version of the HubHero skyline as SVG markup. */
function skylineSvg(): string {
  const BASE = 300;
  const TOWERS = [
    { x: 34, w: 46, top: 206 },
    { x: 90, w: 54, top: 150 },
    { x: 154, w: 50, top: 112 },
    { x: 214, w: 60, top: 66 },
    { x: 284, w: 46, top: 174 },
  ];
  const CARS = [
    { x: 150, color: "#b5462f" },
    { x: 248, color: "#3a6ea5" },
    { x: 330, color: "#2f7d6b" },
  ];

  let windows = "";
  let towers = "";
  for (const t of TOWERS) {
    towers += `<rect x="${t.x}" y="${t.top}" width="${t.w}" height="${BASE - t.top}" rx="3" fill="url(#t)"/>`;
    const cols = t.w > 50 ? 3 : 2;
    const colGap = t.w / (cols + 1);
    for (let y = t.top + 16; y < BASE - 12; y += 22) {
      for (let ci = 0; ci < cols; ci++) {
        const x = t.x + colGap * (ci + 1) - 4;
        windows += `<rect x="${x}" y="${y}" width="8" height="9" rx="1" fill="#fff" fill-opacity="0.92"/>`;
      }
    }
  }

  const cars = CARS.map(
    (c) =>
      `<g transform="translate(${c.x},${BASE})">` +
      `<circle cx="-6" cy="-2.2" r="2.3" fill="${INK}"/>` +
      `<circle cx="6" cy="-2.2" r="2.3" fill="${INK}"/>` +
      `<rect x="-11" y="-9" width="22" height="6.5" rx="2.2" fill="${c.color}"/>` +
      `<rect x="-5.5" y="-13" width="11" height="4.5" rx="1.8" fill="${c.color}"/>` +
      `<rect x="-3.8" y="-12.2" width="7.5" height="3" rx="1" fill="#fff" fill-opacity="0.7"/>` +
      `</g>`,
  ).join("");

  const plane =
    `<g transform="translate(118,108)" fill="#fff" stroke="${MUTED_2}" stroke-width="0.5" stroke-linejoin="round">` +
    `<line x1="-24" y1="-1" x2="-58" y2="-1" stroke="#fff" stroke-width="1.4" stroke-dasharray="1 6" opacity="0.5"/>` +
    `<path d="M-20 -2 L-28 -13 L-14 -2.5 Z"/>` +
    `<path d="M-18 0 L-27 -4 L-15 0.5 Z"/>` +
    `<path d="M25 -0.5 C 14 -4, -12 -4.5, -25 -2.5 C -14 2.5, 14 3, 25 -0.5 Z"/>` +
    `</g>`;

  const crane =
    `<rect x="343" y="70" width="6" height="230" rx="2" fill="${INK_SOFT}"/>` +
    `<rect x="300" y="64" width="110" height="6" rx="3" fill="${INK_SOFT}"/>` +
    `<rect x="338" y="52" width="16" height="14" rx="2" fill="${INK_SOFT}"/>` +
    `<rect x="391.25" y="70" width="1.5" height="48" fill="${INK_SOFT}"/>` +
    `<rect x="386" y="118" width="12" height="9" rx="1.5" fill="${GOLD}"/>`;

  return (
    `<svg width="420" height="340" viewBox="0 0 420 340" xmlns="http://www.w3.org/2000/svg">` +
    `<defs>` +
    `<linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD_BRIGHT}"/><stop offset="1" stop-color="${GOLD_DEEP}"/></linearGradient>` +
    `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD}" stop-opacity="0.16"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></linearGradient>` +
    `</defs>` +
    `<rect x="0" y="40" width="420" height="262" rx="20" fill="url(#g)"/>` +
    plane +
    towers +
    windows +
    crane +
    `<rect x="0" y="${BASE}" width="420" height="3" rx="1.5" fill="${LINE_STRONG}"/>` +
    cars +
    `</svg>`
  );
}

export default function OpengraphImage() {
  const skyline = `data:image/svg+xml;utf8,${encodeURIComponent(skylineSvg())}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: "#f2ede3",
          backgroundImage:
            "linear-gradient(rgba(109,84,24,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(109,84,24,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          padding: "0 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* left: text */}
        <div style={{ display: "flex", flexDirection: "column", width: 620 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 700,
              fontFamily: "Arial, sans-serif",
              marginBottom: 22,
            }}
          >
            Real Estate Intelligence
          </div>
          <div
            style={{
              fontSize: 60,
              lineHeight: 1.04,
              fontWeight: 600,
              color: INK,
            }}
          >
            One workspace for the deals you buy and the supply you watch.
          </div>
          <div
            style={{
              fontSize: 25,
              lineHeight: 1.35,
              color: INK_SOFT,
              marginTop: 24,
              fontFamily: "Arial, sans-serif",
              maxWidth: 560,
            }}
          >
            Two intelligence suites, one source of truth. Every number traces to
            100% live public data.
          </div>
        </div>

        {/* right: skyline illustration */}
        <div style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={skyline} width={460} height={372} alt="" />
        </div>
      </div>
    ),
    { ...size },
  );
}
