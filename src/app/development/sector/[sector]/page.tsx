import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchBps, STATE_NAME, type BpsNational } from "@/lib/dev/live/bps";
import type { BpsStateRow } from "@/lib/dev/types";
import { CITIES, flagshipCity } from "@/lib/dev/cities";
import { Card, SectionTitle, Stat, StateBlock } from "@/components/dev/ui";
import { TrendBars } from "@/components/dev/charts";
import { MarketLeaderboard, type LeaderRow } from "@/components/dev/MarketLeaderboard";
import { fmtNum } from "@/lib/dev/format";

export const revalidate = 43200;

type Source = "bps" | "portal" | "program";
type TrendRow = BpsNational["trend"][number];

interface SectorDef {
  label: string;
  eyebrow: string;
  color: string;
  blurb: string;
  source: Source;
  /** For BPS-backed sectors: pull this structure-type's units from a state row. */
  pick?: (r: BpsStateRow) => number;
  /** For BPS-backed sectors: pull this structure-type's units from a trend row. */
  trend?: (t: TrendRow) => number;
  about: string[];
}

/**
 * Asset classes. Residential structure types are backed by the live Census
 * Building Permits Survey (national unit counts, real). Commercial classes
 * aren't counted in that survey, so they carry honest context + a pointer to
 * the per-city permit portals that do classify them, never invented numbers.
 */
const SECTORS: Record<string, SectorDef> = {
  multifamily: {
    label: "Multifamily",
    eyebrow: "Residential · 5+ units",
    color: "#3a6ea5",
    blurb: "Apartment and condo buildings of five or more units, the most cyclical and metro-concentrated slice of the pipeline.",
    source: "bps",
    pick: (r) => r.units5,
    trend: (t) => t.units5,
    about: [
      "The Census Building Permits Survey counts every privately-owned housing unit authorized for construction. “Multifamily” here is the 5-or-more-units-in-structure category: apartment and condominium buildings.",
      "It is the most cyclical part of the housing pipeline. Large projects cluster in a handful of high-growth metros and swing sharply with financing costs and rent expectations.",
    ],
  },
  "single-family": {
    label: "Single-family",
    eyebrow: "Residential · 1 unit",
    color: "#3aa6a0",
    blurb: "Detached and attached one-unit homes, the largest share of the U.S. residential pipeline by unit count.",
    source: "bps",
    pick: (r) => r.units1,
    trend: (t) => t.units1,
    about: [
      "One-unit homes authorized for construction. By unit count this is the largest slice of the national residential pipeline.",
      "Single-family permits track household formation and for-sale demand, and concentrate in Sun Belt and suburban growth markets.",
    ],
  },
  townhome: {
    label: "Townhome & 2–4 unit",
    eyebrow: "Residential · 2–4 units",
    color: "#9a7b2e",
    blurb: "Duplexes, triplexes, and small “missing middle” infill: the 2-unit and 3-to-4-unit structure categories.",
    source: "bps",
    pick: (r) => r.units2 + r.units34,
    trend: (t) => Math.max(0, t.totalUnits - t.units1 - t.units5),
    about: [
      "The 2-unit and 3–4-unit structure categories from the Building Permits Survey: duplexes, triplexes, fourplexes, and small infill.",
      "A small but increasingly policy-relevant slice; many cities are loosening single-family zoning specifically to encourage this “missing middle.”",
    ],
  },
  industrial: {
    label: "Industrial",
    eyebrow: "Commercial",
    color: "#7a5c8f",
    blurb: "Warehouse, logistics, and manufacturing space, tracked per-permit in city portals, not in the national residential survey.",
    source: "portal",
    about: [
      "Industrial, warehouse, and logistics space is not part of the residential Building Permits Survey, so there is no national unit figure to report here.",
      "Where it does appear is individual city permit portals, which classify each commercial permit by use. Open a live-portal city below to see real industrial permits, declared valuations, and the developers behind them.",
    ],
  },
  office: {
    label: "Office",
    eyebrow: "Commercial",
    color: "#3f7a4f",
    blurb: "Office and professional space, classified per-permit in city portals, outside the national residential survey.",
    source: "portal",
    about: [
      "Office construction is not counted in the residential Building Permits Survey, so no national unit total is shown here.",
      "City permit portals do classify office permits individually. Open a live-portal city below to explore real office projects, valuations, and developers.",
    ],
  },
  retail: {
    label: "Retail",
    eyebrow: "Commercial",
    color: "#d9760a",
    blurb: "Storefront, shopping-center, and mixed commercial space, found in city permit portals rather than the residential survey.",
    source: "portal",
    about: [
      "Retail and commercial space is outside the scope of the residential Building Permits Survey, so there is no national unit count to display.",
      "These permits are classified individually in city open-data portals. Open a live-portal city below to see real retail projects and the firms building them.",
    ],
  },
  affordable: {
    label: "Affordable housing",
    eyebrow: "Program overlay",
    color: "#b5552c",
    blurb: "A financing and regulatory designation (LIHTC, HUD, inclusionary zoning), not a building structure type.",
    source: "program",
    about: [
      "Affordable housing is a financing and regulatory designation (Low-Income Housing Tax Credits, HUD programs, and inclusionary-zoning requirements), not a building structure type. It is therefore not a separate line in the Building Permits Survey.",
      "Structurally, most newly-built affordable housing is multifamily, so multifamily permit volume is the closest live proxy. Income-restriction detail lives in HUD and state housing-finance-agency datasets.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(SECTORS).map((sector) => ({ sector }));
}

function Header({ def }: { def: SectorDef }) {
  return (
    <section>
      <Link href="/development" className="text-xs text-muted hover:text-ink">← National overview</Link>
      <div className="flex items-center gap-2 mt-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ background: `${def.color}1f`, color: def.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: def.color }} />
          {def.eyebrow}
        </span>
      </div>
      <h1 className="font-display text-[32px] md:text-[38px] font-semibold text-ink leading-tight tracking-tight mt-2">
        {def.label}
      </h1>
      <p className="text-[15px] text-ink-soft mt-2 max-w-2xl">{def.blurb}</p>
    </section>
  );
}

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const def = SECTORS[sector];
  if (!def) notFound();

  // ── Commercial sectors: honest context + the live portals that classify them.
  if (def.source === "portal" || def.source === "program") {
    const liveCities = CITIES.filter((c) => c.socrata);
    return (
      <div className="flex flex-col gap-7">
        <Header def={def} />

        <Card>
          <SectionTitle sub="Why there's no national number on this page">
            Not in the residential permit survey
          </SectionTitle>
          <div className="flex flex-col gap-3 text-[14px] text-ink-soft leading-relaxed max-w-3xl">
            {def.about.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-2">
            No figures are estimated or fabricated for this asset class.
          </div>
        </Card>

        {def.source === "program" ? (
          <Card>
            <SectionTitle sub="Closest live data within this app">Where to look next</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/development/sector/multifamily"
                className="block bg-surface-2 border border-line rounded-[var(--radius-card)] p-4 hover:border-line-strong transition-colors">
                <div className="font-display text-[16px] font-semibold text-ink">Multifamily permits →</div>
                <div className="text-xs text-muted mt-1">The structural proxy: live 5+ unit authorizations nationwide.</div>
              </Link>
              <Link href="/student-housing"
                className="block bg-surface-2 border border-line rounded-[var(--radius-card)] p-4 hover:border-line-strong transition-colors">
                <div className="font-display text-[16px] font-semibold text-ink">Student housing →</div>
                <div className="text-xs text-muted mt-1">A dedicated, fully-live workspace for purpose-built student housing.</div>
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <SectionTitle sub={`Open a live permit portal to explore real ${def.label.toLowerCase()} permits`}>
              Explore in a live-portal city
            </SectionTitle>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {liveCities.map((c) => (
                <Link key={c.id} href={`/development/city/${c.id}`}
                  className="block bg-surface-2 border border-line rounded-[var(--radius-card)] p-4 hover:border-line-strong transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[15px] font-semibold text-ink">{c.name}</span>
                    <span className="text-xs text-muted-2 shrink-0">{c.state}</span>
                  </div>
                  <div className="text-[12px] font-semibold mt-2" style={{ color: def.color }}>Open permit portal →</div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ── Residential structure types: live Building Permits Survey.
  const bps = await fetchBps();
  if (!bps) {
    return (
      <div className="flex flex-col gap-7">
        <Header def={def} />
        <StateBlock
          title="Census Building Permits Survey is unavailable right now"
          note="The national feed didn't respond. No placeholder data is shown. Try again shortly."
        />
      </div>
    );
  }

  const pick = def.pick!;
  const ranked = bps.states
    .map((r) => ({ state: r.state, v: pick(r) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const sectorTotal = ranked.reduce((s, x) => s + x.v, 0);
  const allUnits = bps.states.reduce((s, r) => s + r.totalUnits, 0);
  const share = allUnits ? sectorTotal / allUnits : 0;
  const topState = ranked[0];
  const trendData = bps.trend.map((t) => ({ label: `'${String(t.year).slice(2)}`, value: def.trend!(t) }));

  // Shared row builder: each market links to its state's flagship metro map.
  const toRow = (state: string, value: string, fill: number, badge?: LeaderRow["badge"]): LeaderRow => {
    const city = flagshipCity(state);
    return {
      key: state,
      title: STATE_NAME[state] ?? state,
      subtitle: city ? `${city.name} map →` : undefined,
      href: city ? `/development/city/${city.id}` : undefined,
      value,
      fill,
      color: def.color,
      badge,
    };
  };

  // ── "Highest recent development": top 10 states by this structure type's
  //    permit volume in the latest survey year.
  const volMax = ranked[0]?.v ?? 1;
  const volumeRows: LeaderRow[] = ranked
    .slice(0, 10)
    .map((x) => toRow(x.state, fmtNum(x.v), x.v / volMax));

  // ── "Markets gaining momentum": top 10 by year-over-year growth in this
  //    structure type. Needs a prior-year file and a minimum current volume so
  //    tiny-base swings don't dominate the ranking.
  const prevByState = new Map<string, number>(
    (bps.prevStates ?? []).map((r) => [r.state, pick(r)]),
  );
  const MIN_UNITS = 250;
  const momentum = bps.states
    .map((r) => {
      const cur = pick(r);
      const prev = prevByState.get(r.state) ?? 0;
      const growth = prev > 0 ? (cur - prev) / prev : null;
      return { state: r.state, cur, growth };
    })
    .filter((x): x is { state: string; cur: number; growth: number } =>
      x.cur >= MIN_UNITS && x.growth != null && x.growth > 0)
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 10);
  const momMax = momentum[0]?.growth ?? 1;
  const momentumRows: LeaderRow[] = momentum.map((x) =>
    toRow(x.state, fmtNum(x.cur), x.growth / momMax, {
      text: `+${Math.round(x.growth * 100)}%`,
      color: "#3f7a4f",
    }),
  );

  return (
    <div className="flex flex-col gap-7">
      <Header def={def} />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label={`Units authorized · ${bps.year}`} value={fmtNum(sectorTotal)} provenance="live" sub={`${def.label} nationwide`} />
        <Stat label="Share of all permits" value={`${Math.round(share * 100)}%`} provenance="live" sub={`of ${fmtNum(allUnits)} total units`} />
        <Stat label="Top state" value={topState?.state ?? "n/a"} provenance="live" sub={topState ? `${fmtNum(topState.v)} units` : undefined} />
        <Stat label="States with activity" value={fmtNum(ranked.length)} provenance="live" sub="reporting 1+ unit" />
      </section>

      <Card>
        <SectionTitle sub={`National ${def.label.toLowerCase()} units authorized per year`}>Construction trend</SectionTitle>
        <TrendBars data={trendData} />
      </Card>

      <section className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle sub={`${bps.year} · top states by ${def.label.toLowerCase()} units authorized · open a market for its city map`}>
            Highest recent development
          </SectionTitle>
          <MarketLeaderboard rows={volumeRows} />
        </Card>
        <Card>
          {momentumRows.length > 0 ? (
            <>
              <SectionTitle sub={`Fastest year-over-year growth in ${def.label.toLowerCase()} permits${bps.prevYear ? `, ${bps.prevYear}→${bps.year}` : ""} · markets to watch`}>
                Where to develop next
              </SectionTitle>
              <MarketLeaderboard rows={momentumRows} />
            </>
          ) : (
            <>
              <SectionTitle sub="Year-over-year comparison">Where to develop next</SectionTitle>
              <div className="text-[13px] text-muted leading-relaxed">
                A prior-year Building Permits Survey file isn&apos;t available yet, so growth rankings can&apos;t be computed without estimating. They&apos;ll appear once the comparison year publishes.
              </div>
            </>
          )}
        </Card>
      </section>

      <Card>
        <SectionTitle sub="Census Building Permits Survey">About this asset class</SectionTitle>
        <div className="flex flex-col gap-3 text-[14px] text-ink-soft leading-relaxed max-w-3xl">
          {def.about.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Card>
    </div>
  );
}
