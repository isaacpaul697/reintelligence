"use client";

import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AppBackground } from "@/components/AppBackground";
import { Reveal } from "@/components/Reveal";
import { useSettings } from "@/lib/settings";
import { METHODOLOGY } from "@/lib/dev/model";

/** Two workspaces, described by what they actually hold. */
const WORKSPACES = [
  {
    href: "/student-housing",
    eyebrow: "Acquisitions IQ",
    title: "Student Housing",
    blurb:
      "An acquisitions desk for purpose-built and off-campus student housing. Screen university markets, size deals, and track the firms moving the sector.",
    items: [
      "University-market screening on live enrollment, demand, supply, and rent signals",
      "A transparent 0 to 100 acquisition score with a print-ready scorecard",
      "Apartment-level diligence mapped from OpenStreetMap, with one-click auto-underwriting",
      "Saved-apartment watchlist, diligence notes, and a live major-players + SEC-filings feed",
    ],
  },
  {
    href: "/national",
    eyebrow: "Development Intelligence",
    title: "National & asset classes",
    blurb:
      "A national view of where America is building, plus a dedicated tab for every asset class. Explore permit activity, model supply gaps, and profile the developers and operators behind it.",
    items: [
      "National and per-state permit activity and trends from the Census Building Permits Survey",
      "City explorer with a supply-gap model and modeled development economics",
      "Area search that sweeps OpenStreetMap building footprints for any US city",
      "Multifamily, industrial, office, retail, single/townhome and affordable tabs with live SEC filings, news, and leaderboards",
    ],
  },
];

/** The student-housing screening pipeline, step by step. */
const HOUSING_METHOD = [
  { h: "1 · Define the market set", b: "Ten major university markets configured with real federal identifiers (IPEDS unit IDs), coordinates, and conference/region metadata." },
  { h: "2 · Fetch live enrollment", b: "The College Scorecard API provides official enrollment, acceptance rates, and historical counts. Growth is annualized over a 5-year baseline." },
  { h: "3 · Pull demand signals", b: "Google News RSS surfaces recent student-housing headlines per campus; article volume is a proxy for demand momentum." },
  { h: "4 · Map real apartments", b: "OpenStreetMap's Overpass API returns named apartment buildings near each campus, with addresses, websites, and exact distances." },
  { h: "5 · Score 0 to 100", b: "A transparent weighted model across six factors. Rent and occupancy are modeled from live inputs and labeled estimated." },
  { h: "6 · Auto-underwrite", b: "Click any mapped property to size the deal: gross rent flows to NOI through modeled vacancy and expense ratios, valued at a cap rate anchored to the live FRED mortgage rate plus an asset-class spread." },
];

/** The live public sources every number traces back to. */
const SOURCES = [
  "U.S. Census (ACS + Building Permits Survey)",
  "College Scorecard",
  "Bureau of Labor Statistics",
  "FRED (Federal Reserve)",
  "HUD Fair Market Rents",
  "FEMA National Risk Index",
  "SEC EDGAR filings",
  "OpenStreetMap",
  "City open-data permit portals",
  "Google News",
  "Wikipedia",
  "Open-Meteo & USGS",
];

export default function AboutPage() {
  const { dark, toggleDark } = useSettings();
  return (
    <div className="min-h-screen flex flex-col relative">
      <AppBackground />

      <header className="h-[60px] flex items-center justify-between px-6 md:px-10 border-b border-line">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark size={36} />
          <div>
            <div className="font-display text-[17px] font-semibold text-ink leading-none tracking-tight">Real Estate Intelligence</div>
            <div className="text-[11px] mt-1 text-muted">Live public-data analytics</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[13px] font-semibold text-ink-soft hover:text-ink px-3 py-1.5 rounded-[10px] hover:bg-surface-2 transition-colors">
            ← Home
          </Link>
          <button onClick={toggleDark} aria-label="Toggle theme"
            className="grid place-items-center w-9 h-9 rounded-[10px] bg-surface-2 border border-line text-ink-soft hover:text-ink hover:border-line-strong">
            {dark ? (
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx={12} cy={12} r={4} /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 md:px-10 py-14 md:py-18">
        <Reveal>
          <div className="max-w-[680px]">
            <div className="text-[12px] font-semibold uppercase tracking-[1.6px] text-gold-deep">About this site</div>
            <h1 className="font-display text-[32px] md:text-[42px] leading-[1.08] font-semibold text-ink mt-3">
              What Real Estate Intelligence is, and how every number is built.
            </h1>
            <p className="text-[15px] text-ink-soft mt-4 leading-relaxed">
              Real Estate Intelligence is a research workspace that turns free public data into an
              acquisitions and development read on US real estate. It pairs a student-housing
              acquisitions desk with a national development monitor, around a single rule: every figure is
              either pulled live from a public source or transparently modeled from live inputs and badged
              as estimated. There are no mock numbers anywhere in the app.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {WORKSPACES.map((w, i) => (
            <Reveal key={w.href} delayMs={i * 120}>
              <div className="h-full rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)]">
                <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-muted">{w.eyebrow}</div>
                <div className="font-display text-[22px] font-semibold text-ink leading-tight mt-1">{w.title}</div>
                <p className="text-[13.5px] text-ink-soft mt-3 leading-relaxed">{w.blurb}</p>
                <ul className="mt-4 space-y-2">
                  {w.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-[13px] text-ink-soft leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "var(--gold)" }} />
                      {it}
                    </li>
                  ))}
                </ul>
                <Link href={w.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:gap-2.5 transition-all">
                  Open {w.title}
                  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={120}>
          <div className="mt-12 rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)]">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-muted">How the data works</div>
            <h2 className="font-display text-[20px] font-semibold text-ink mt-1">Live first, modeled-and-badged second</h2>
            <p className="text-[13.5px] text-ink-soft mt-3 leading-relaxed max-w-[720px]">
              Where a public source publishes a figure directly, the app shows it and tags it live. Where no
              free feed exists, such as a property valuation or an acquisition return, the number is modeled
              from live inputs using documented assumptions and clearly badged estimated, never invented.
              Every data point on every page carries a provenance tag so you always know what is real and
              what is modeled.
            </p>
            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-[1.4px] font-semibold text-muted-2 mb-2.5">Live data sources</div>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                  <span key={s} className="text-[12px] text-ink-soft bg-surface-2 border border-line rounded-full px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-12">
            <div className="text-[12px] font-semibold uppercase tracking-[1.6px] text-gold-deep">Methodology</div>
            <h2 className="font-display text-[26px] md:text-[30px] font-semibold text-ink mt-2">How each figure is computed</h2>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-6 rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)]">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-muted">Student-housing screening pipeline</div>
            <h3 className="font-display text-[18px] font-semibold text-ink mt-1">From raw public data to an acquisition score</h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-4">
              {HOUSING_METHOD.map((m) => (
                <div key={m.h} className="border-l-2 pl-4" style={{ borderColor: "var(--gold)" }}>
                  <div className="text-[13.5px] font-semibold text-ink">{m.h}</div>
                  <div className="text-[13px] text-ink-soft mt-0.5 leading-relaxed">{m.b}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-6 rounded-[var(--radius)] bg-surface border border-line p-6 md:p-7 shadow-[var(--shadow)]">
            <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-muted">Development & underwriting models</div>
            <h3 className="font-display text-[18px] font-semibold text-ink mt-1">Every modeled metric, its formula, and its source</h3>
            <div className="mt-4 flex flex-col divide-y divide-line">
              {METHODOLOGY.map((m) => (
                <div key={m.metric} className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-x-6 gap-y-1 py-3">
                  <div className="flex items-start gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 ${
                      m.provenance === "live" ? "bg-good-soft text-good" : "bg-warn-soft text-warn"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.provenance === "live" ? "bg-good" : "bg-warn"}`} />
                      {m.provenance}
                    </span>
                    <span className="text-[13.5px] font-semibold text-ink">{m.metric}</span>
                  </div>
                  <div>
                    <div className="text-[13px] text-ink-soft leading-relaxed">{m.formula}</div>
                    <div className="text-[11.5px] text-muted mt-0.5">{m.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-line px-6 md:px-10 py-5 text-[12px] text-muted">
        100% live public data · No mock numbers · Figures are live or modeled-and-badged
      </footer>
    </div>
  );
}
