"use client";

import { Donut, BarList, ScoreRing, Meter, scoreTone } from "@/components/charts";
import { fmtNum, fmtCompactUSD } from "@/lib/dev/format";
import { fmtPct } from "@/lib/scoring";

/** Value format keys (mirrors CountUp's named formatters). */
type StatFormat = "num" | "compactUsd";
import type { ScoredMarket } from "@/lib/compute";
import type { Apartment } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Shared scaffolding                                                 */
/* ------------------------------------------------------------------ */

const TONE_HEX: Record<string, string> = {
  vivid: "var(--c-vivid)",
  good: "var(--c-good)",
  info: "var(--c-info)",
  orangeLight: "var(--c-orange-light)",
  orange: "var(--c-orange)",
  redBright: "var(--c-red-bright)",
};

const REGION_COLOR: Record<string, string> = {
  Midwest: "var(--chart-2)", // blue
  South: "var(--chart-1)", // gold
  West: "var(--chart-3)", // green
  Northeast: "var(--chart-4)", // orange
};

/** A faint pulsing dot + "Live" tag, so the strip reads as a live feed. */
function LivePulse() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-good">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-good" />
      </span>
      Live
    </span>
  );
}

type EmblemKind = "cap" | "crane" | "bookmark";

/**
 * A small animated mascot that lives in a banner header. The motion is built
 * from the size-tuned `cc-emb-*` keyframes (see globals.css) and honors
 * prefers-reduced-motion. Each emblem echoes a real product cue: a tossing
 * graduation cap for school/score banners, a hoisting crane for building
 * banners, a bobbing bookmark for the watchlist.
 */
function BannerEmblem({ kind }: { kind: EmblemKind }) {
  const gold = "var(--gold)";
  const deep = "var(--gold-deep)";

  if (kind === "crane") {
    // A tower crane whose load hoists up and down on its rope.
    return (
      <span className="inline-flex shrink-0" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={deep} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="8" x2="8" y2="23" />
          <path d="M5 23 h6 M6.5 23 L8 19 L9.5 23" />
          <line x1="4" y1="8" x2="23" y2="8" />
          <rect x="6.7" y="8.2" width="2.6" height="2.2" fill={gold} stroke="none" opacity="0.55" />
          <line className="cc-emb-rope" x1="20" y1="8" x2="20" y2="13" strokeWidth="1" />
          <rect className="cc-emb-hoist" x="18.4" y="13" width="3.2" height="3" rx="0.4" fill={gold} stroke={deep} strokeWidth="1" />
        </svg>
      </span>
    );
  }

  if (kind === "bookmark") {
    return (
      <span className="cc-emb-bob inline-flex shrink-0" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.2L6 20V5a1 1 0 0 1 1-1Z"
            fill={gold}
            opacity="0.22"
            stroke={deep}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  // cap (default): a mortarboard that tosses while its tassel swings.
  return (
    <span className="cc-emb-toss inline-flex shrink-0" aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <path className="cc-campus-spark" d="M23 4 l.6 1.5 1.5 .6 -1.5 .6 -.6 1.5 -.6 -1.5 -1.5 -.6 1.5 -.6 Z" fill={gold} />
        <path d="M14 6 L25 11 L14 16 L3 11 Z" fill={gold} stroke={deep} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M8 13.2 V18 c0 1.6 2.7 2.8 6 2.8 s6 -1.2 6 -2.8 V13.2" fill={gold} opacity="0.35" stroke={deep} strokeWidth="1.2" strokeLinejoin="round" />
        <g className="cc-campus-tassel">
          <line x1="25" y1="11" x2="25" y2="18.5" stroke={deep} strokeWidth="1.1" />
          <circle cx="25" cy="19.4" r="1.4" fill={deep} />
        </g>
      </svg>
    </span>
  );
}

/** The graphic banner shell: title row with a live pulse, then content. */
function GraphicBanner({ title, emblem = "cap", children }: { title: string; emblem?: EmblemKind; children: React.ReactNode }) {
  return (
    <div className="cc-fade mb-6 rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow)] overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line">
        <span className="flex items-center gap-2.5">
          <BannerEmblem kind={emblem} />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</span>
        </span>
        <LivePulse />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function MiniStat({ label, to, format, plain, accent }: {
  label: string;
  to?: number;
  format?: StatFormat;
  plain?: string;
  accent?: boolean;
}) {
  const shown =
    plain != null
      ? plain
      : to != null
        ? format === "compactUsd"
          ? fmtCompactUSD(to)
          : fmtNum(to)
        : "n/a";
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-muted">{label}</span>
      <span className={`font-display text-[24px] font-semibold leading-none num ${accent ? "text-good" : "text-ink"}`}>
        {shown}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. University Markets: region mix donut + screening stats          */
/* ------------------------------------------------------------------ */

export function MarketsGraphic({ scored }: { scored: ScoredMarket[] }) {
  if (!scored.length) return null;

  const regionCounts = new Map<string, number>();
  for (const m of scored) regionCounts.set(m.market.region, (regionCounts.get(m.market.region) ?? 0) + 1);
  const segments = [...regionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value, color: REGION_COLOR[label] ?? "var(--muted)" }));

  const states = new Set(scored.map((m) => m.market.state)).size;
  const headlines = scored.reduce((s, m) => s + m.market.newsCount, 0);
  const growthVals = scored.map((m) => m.market.enrollmentGrowth).filter((x): x is number => x != null);
  const avgGrowth = growthVals.length ? growthVals.reduce((s, x) => s + x, 0) / growthVals.length : 0;
  const avgScore = Math.round(scored.reduce((s, m) => s + m.score.score, 0) / scored.length);

  return (
    <GraphicBanner title="Markets screened, live">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-5">
        <MiniStat label="Markets" to={scored.length} />
        <MiniStat label="States" to={states} />
        <MiniStat label="Avg enrollment ▲" plain={`+${fmtPct(avgGrowth)}`} accent />
        <MiniStat label="Live headlines" to={headlines} />
        <MiniStat label="Avg score" to={avgScore} />
      </div>

      {/* Regional mix as a single clean proportional bar + inline legend. */}
      <div className="mt-6 pt-5 border-t border-line">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] uppercase tracking-wide text-muted">Regional mix</span>
          <span className="text-[11px] text-muted-2">{segments.length} regions · {scored.length} campuses</span>
        </div>
        <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-surface-2">
          {segments.map((s) => (
            <div
              key={s.label}
              style={{ width: `${(s.value / scored.length) * 100}%`, background: s.color }}
              title={`${s.label}: ${s.value}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3.5">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-ink-soft font-medium">{s.label}</span>
              <span className="num text-muted-2">{Math.round((s.value / scored.length) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </GraphicBanner>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Top 10 Markets: ranked score bars                               */
/* ------------------------------------------------------------------ */

export function Top10Graphic({ top }: { top: ScoredMarket[] }) {
  if (!top.length) return null;

  const items = top.map((m) => ({
    label: m.market.shortName,
    value: m.score.score,
    color: TONE_HEX[scoreTone(m.score.score)] ?? "var(--gold)",
  }));
  const avg = Math.round(top.reduce((s, m) => s + m.score.score, 0) / top.length);
  const spread = top[0].score.score - top[top.length - 1].score.score;

  return (
    <GraphicBanner title="Top 10 acquisition scores, live">
      <div className="flex flex-wrap gap-x-10 gap-y-5">
        <div className="flex gap-8 shrink-0">
          <MiniStat label="Leader" to={top[0].score.score} />
          <MiniStat label="Avg of 10" to={avg} />
          <MiniStat label="Spread" plain={`${spread} pts`} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <BarList items={items} format={(n) => String(n)} />
        </div>
      </div>
    </GraphicBanner>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Apartments (per school): capacity + revenue curve               */
/* ------------------------------------------------------------------ */

export function ApartmentsGraphic({ apartments, label }: { apartments: Apartment[]; label: string }) {
  if (!apartments.length) return null;

  const totalBeds = apartments.reduce((s, a) => s + a.estBeds, 0);
  const totalRev = apartments.reduce((s, a) => s + a.estAnnualRevenue, 0);
  const avgRent = Math.round(apartments.reduce((s, a) => s + a.estMonthlyRent, 0) / apartments.length);
  // The largest buildings by estimated capacity, which is what the "capacity"
  // banner is actually about. A ranked bar reads far clearer than a sorted line.
  const topByBeds = [...apartments]
    .sort((a, b) => b.estBeds - a.estBeds)
    .slice(0, 6)
    .map((a) => ({ label: a.name, value: a.estBeds, color: "var(--gold)" }));

  return (
    <GraphicBanner title={`Live capacity near ${label}`} emblem="crane">
      <div className="flex flex-wrap gap-x-10 gap-y-6">
        <div className="flex gap-8 shrink-0">
          <MiniStat label="Buildings" to={apartments.length} />
          <MiniStat label="Est. beds" to={totalBeds} />
          <MiniStat label="Est. revenue/yr" to={totalRev} format="compactUsd" accent />
          <MiniStat label="Avg rent/bed" to={avgRent} format="compactUsd" />
        </div>
        <div className="flex-1 min-w-[280px]">
          <span className="text-[11px] uppercase tracking-wide text-muted">Largest buildings by est. beds</span>
          <div className="mt-2.5">
            <BarList items={topByBeds} format={(n) => `${fmtNum(n)} beds`} />
          </div>
        </div>
      </div>
    </GraphicBanner>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Top 10 Apartments: revenue ranking bars                         */
/* ------------------------------------------------------------------ */

const fmtUSD = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function TopApartmentsGraphic({ apts, marketsCount }: { apts: Apartment[]; marketsCount?: number }) {
  if (!apts.length) return null;

  const items = apts.map((a) => ({
    label: a.name,
    value: a.estAnnualRevenue,
    color: "var(--gold)",
  }));
  const totalBeds = apts.reduce((s, a) => s + a.estBeds, 0);
  const totalRev = apts.reduce((s, a) => s + a.estAnnualRevenue, 0);

  return (
    <GraphicBanner title="Top 10 revenue leaders, live" emblem="crane">
      <div className="flex flex-wrap gap-x-10 gap-y-5">
        <div className="flex gap-8 shrink-0">
          <MiniStat label="Combined revenue" to={totalRev} format="compactUsd" accent />
          <MiniStat label="Combined beds" to={totalBeds} />
          {marketsCount != null && <MiniStat label="Markets" to={marketsCount} />}
        </div>
        <div className="flex-1 min-w-[280px]">
          <BarList items={items} format={fmtUSD} />
        </div>
      </div>
    </GraphicBanner>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Scorecard: this school's standing vs the screened field         */
/* ------------------------------------------------------------------ */

export function ScorecardGraphic({
  active,
  scored,
  selectedBeds,
  selectedRevenue,
}: {
  active: ScoredMarket;
  scored: ScoredMarket[];
  selectedBeds: number;
  selectedRevenue: number;
}) {
  if (!scored.length) return null;

  const score = active.score.score;
  const rank = scored.findIndex((m) => m.market.id === active.market.id) + 1 || 1;
  const fieldAvg = Math.round(scored.reduce((s, m) => s + m.score.score, 0) / scored.length);
  const vsField = score - fieldAvg;
  // Percentile: share of the field this market outranks (100 = best).
  const percentile = scored.length > 1 ? Math.round(((scored.length - rank) / (scored.length - 1)) * 100) : 100;
  const topFactor = [...active.score.factors].sort((a, b) => b.value - a.value)[0];

  return (
    <GraphicBanner title="School standing, live">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
        <ScoreRing score={score} size={92} label="Score" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5 flex-1 min-w-[280px]">
          <MiniStat label="Field rank" plain={`#${rank} of ${scored.length}`} />
          <MiniStat label="Percentile" plain={`${percentile}th`} accent={percentile >= 50} />
          <MiniStat label="Vs field avg" plain={`${vsField >= 0 ? "+" : ""}${vsField} pts`} accent={vsField >= 0} />
          {topFactor && <MiniStat label={`Top factor`} plain={`${Math.round(topFactor.value)}`} />}
          {selectedBeds > 0 && <MiniStat label="Selected beds" to={selectedBeds} />}
          {selectedRevenue > 0 && <MiniStat label="Selected revenue/yr" to={selectedRevenue} format="compactUsd" accent />}
        </div>
      </div>
      {topFactor && (
        <div className="mt-3 text-[11px] text-muted">
          Strongest driver: {topFactor.label} · ranked against {scored.length} screened markets.
        </div>
      )}
    </GraphicBanner>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Diligence notes: coverage across the screened field             */
/* ------------------------------------------------------------------ */

export function NotesGraphic({
  totalMarkets,
  schoolsWithNotes,
  aptsNearActive,
  notedApts,
  activeLabel,
}: {
  totalMarkets: number;
  schoolsWithNotes: number;
  aptsNearActive: number;
  notedApts: number;
  activeLabel: string;
}) {
  if (!totalMarkets) return null;
  const coverage = Math.round((schoolsWithNotes / totalMarkets) * 100);

  return (
    <GraphicBanner title="Diligence coverage, live">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1 min-w-[280px]">
          <MiniStat label="Markets covered" to={totalMarkets} />
          <MiniStat label="Schools with a thesis" to={schoolsWithNotes} accent={schoolsWithNotes > 0} />
          <MiniStat label={`Properties near ${activeLabel}`} to={aptsNearActive} />
          <MiniStat label="Property notes" to={notedApts} accent={notedApts > 0} />
        </div>
        <div className="flex flex-col gap-1 min-w-[180px] flex-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted">
            <span>Thesis coverage</span>
            <span className="num text-ink-soft">{coverage}%</span>
          </div>
          <Meter value={schoolsWithNotes} max={totalMarkets} color="var(--gold)" />
        </div>
      </div>
    </GraphicBanner>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Saved apartments: watchlist revenue mix by market               */
/* ------------------------------------------------------------------ */

export function WatchlistGraphic({
  saved,
}: {
  saved: { marketId: string; marketName: string; estBeds: number; estAnnualRevenue: number }[];
}) {
  if (!saved.length) return null;

  const byMarket = new Map<string, { label: string; value: number }>();
  for (const a of saved) {
    const cur = byMarket.get(a.marketId) ?? { label: a.marketName, value: 0 };
    cur.value += a.estAnnualRevenue;
    byMarket.set(a.marketId, cur);
  }
  const items = [...byMarket.values()]
    .sort((a, b) => b.value - a.value)
    .map((it) => ({ ...it, color: "var(--gold)" }));

  const totalBeds = saved.reduce((s, a) => s + a.estBeds, 0);
  const totalRev = saved.reduce((s, a) => s + a.estAnnualRevenue, 0);

  return (
    <GraphicBanner title="Watchlist value, live" emblem="bookmark">
      <div className="flex flex-wrap gap-x-10 gap-y-5">
        <div className="flex gap-8 shrink-0">
          <MiniStat label="Saved properties" to={saved.length} />
          <MiniStat label="Markets" to={byMarket.size} />
          <MiniStat label="Combined beds" to={totalBeds} />
          <MiniStat label="Combined revenue/yr" to={totalRev} format="compactUsd" accent />
        </div>
        <div className="flex-1 min-w-[280px]">
          <span className="text-[11px] uppercase tracking-wide text-muted">Revenue by market</span>
          <div className="mt-2">
            <BarList items={items} format={fmtCompactUSD} />
          </div>
        </div>
      </div>
    </GraphicBanner>
  );
}

/* ------------------------------------------------------------------ */
/*  8. About: live pipeline snapshot                                   */
/* ------------------------------------------------------------------ */

export function AboutGraphic({
  scored,
  sourceCount,
}: {
  scored: ScoredMarket[];
  sourceCount: number;
}) {
  if (!scored.length) return null;

  const regionCounts = new Map<string, number>();
  for (const m of scored) regionCounts.set(m.market.region, (regionCounts.get(m.market.region) ?? 0) + 1);
  const segments = [...regionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value, color: REGION_COLOR[label] ?? "var(--muted)" }));

  const states = new Set(scored.map((m) => m.market.state)).size;
  const headlines = scored.reduce((s, m) => s + m.market.newsCount, 0);

  return (
    <GraphicBanner title="Pipeline running, live">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1 min-w-[260px]">
          <MiniStat label="Markets screened" to={scored.length} />
          <MiniStat label="States" to={states} />
          <MiniStat label="Live data sources" to={sourceCount} accent />
          <MiniStat label="Live headlines" to={headlines} />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative inline-grid place-items-center">
            <Donut segments={segments} size={96} />
            <div className="absolute text-center">
              <div className="font-display text-base font-semibold text-ink num leading-none">{scored.length}</div>
              <div className="text-[9px] uppercase tracking-wide text-muted">campuses</div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-ink-soft w-20">{s.label}</span>
                <span className="num text-muted">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GraphicBanner>
  );
}
