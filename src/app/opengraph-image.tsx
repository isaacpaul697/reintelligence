import { ImageResponse } from "next/og";

// LinkedIn / social preview card. Next.js auto-generates the <meta og:image>
// tags from this file. Recreates the hub landing hero (skyline + headline) so
// the shared card matches the live product. Rendered as vectors at 1200x630.
export const alt =
  "Real Estate Intelligence: one workspace for the deals you buy and the supply you watch";
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

/** Build the social-card illustration: a skyline that doubles as a rising bar
 *  chart, with a live data trend line, plotted points, and a map pin. Static
 *  SVG markup (the OG renderer cannot animate). */
function skylineSvg(): string {
  const BASE = 300;
  // Buildings that read as an upward bar chart (one dip for realism).
  const TOWERS = [
    { x: 26, w: 42, top: 232 },
    { x: 80, w: 42, top: 200 },
    { x: 134, w: 42, top: 168 },
    { x: 188, w: 42, top: 128 },
    { x: 242, w: 42, top: 150 },
    { x: 296, w: 42, top: 100 },
    { x: 350, w: 42, top: 62 },
  ];

  let windows = "";
  let towers = "";
  for (const t of TOWERS) {
    towers += `<rect x="${t.x}" y="${t.top}" width="${t.w}" height="${BASE - t.top}" rx="3" fill="url(#t)"/>`;
    const cols = 2;
    const colGap = t.w / (cols + 1);
    for (let y = t.top + 16; y < BASE - 12; y += 22) {
      for (let ci = 0; ci < cols; ci++) {
        const x = t.x + colGap * (ci + 1) - 4;
        windows += `<rect x="${x}" y="${y}" width="8" height="9" rx="1" fill="#fff" fill-opacity="0.92"/>`;
      }
    }
  }

  // Trend line + plotted points across the building tops.
  const pts = TOWERS.map((t) => ({ x: t.x + t.w / 2, y: t.top - 14 }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const areaPath =
    `${linePath} L${pts[pts.length - 1].x} ${BASE} L${pts[0].x} ${BASE} Z`;
  const dots = pts
    .map(
      (p) =>
        `<circle cx="${p.x}" cy="${p.y}" r="5" fill="${GOLD_BRIGHT}" stroke="#fff" stroke-width="2"/>`,
    )
    .join("");

  // Map pin floating above the early (low) part of the chart.
  const pin =
    `<g transform="translate(96,150)">` +
    `<circle cx="0" cy="-24" r="22" fill="${GOLD}" fill-opacity="0.10"/>` +
    `<circle cx="0" cy="-24" r="15" fill="${GOLD}" fill-opacity="0.16"/>` +
    `<path d="M0 0 L-9 -17 A11 11 0 1 1 9 -17 Z" fill="${GOLD}"/>` +
    `<circle cx="0" cy="-25" r="4.4" fill="#fff"/>` +
    `</g>`;

  return (
    `<svg width="420" height="340" viewBox="0 0 420 340" xmlns="http://www.w3.org/2000/svg">` +
    `<defs>` +
    `<linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD_BRIGHT}"/><stop offset="1" stop-color="${GOLD_DEEP}"/></linearGradient>` +
    `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GOLD}" stop-opacity="0.16"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></linearGradient>` +
    `</defs>` +
    `<rect x="0" y="40" width="420" height="262" rx="20" fill="url(#g)"/>` +
    `<path d="${areaPath}" fill="url(#g)"/>` +
    towers +
    windows +
    `<path d="${linePath}" fill="none" stroke="${INK_SOFT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
    dots +
    pin +
    `<rect x="0" y="${BASE}" width="420" height="3" rx="1.5" fill="${LINE_STRONG}"/>` +
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
        <div style={{ display: "flex", flexDirection: "column", width: 560, flexShrink: 0 }}>
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
              fontSize: 52,
              lineHeight: 1.06,
              fontWeight: 600,
              color: INK,
            }}
          >
            One workspace for the deals you buy and the supply you watch.
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.35,
              color: INK_SOFT,
              marginTop: 24,
              fontFamily: "Arial, sans-serif",
              maxWidth: 520,
            }}
          >
            Two intelligence suites, one source of truth. Every number traces to
            100% live public data.
          </div>
        </div>

        {/* right: skyline illustration */}
        <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", paddingLeft: 32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={skyline} width={400} height={324} alt="" />
        </div>
      </div>
    ),
    { ...size },
  );
}
