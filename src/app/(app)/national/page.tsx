import Link from "next/link";
import { fetchBps, STATE_NAME } from "@/lib/dev/live/bps";
import { fetchFred } from "@/lib/dev/live/fred";
import { fetchNationalSignals } from "@/lib/dev/live/signals";
import { CITIES } from "@/lib/dev/cities";
import type { CityConfig } from "@/lib/dev/types";
import { StatePermitLeaderboard } from "@/components/dev/MarketLeaderboard";
import { LiveSignalFeed } from "@/components/dev/LiveSignalFeed";
import { NationalMap } from "@/components/dev/NationalMap";
import { LinkSpinner } from "@/components/dev/LinkSpinner";
import { DevConstructionHero } from "@/components/dev/DevConstructionHero";
import { CompositionTrend } from "@/components/dev/charts";
import { Card, SectionTitle, Stat, StateBlock } from "@/components/dev/ui";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { fmtNum, fmtCompactUSD } from "@/lib/dev/format";

export const revalidate = 43200;

export default async function HomePage() {
  const [bps, fred, signals] = await Promise.all([fetchBps(), fetchFred(), fetchNationalSignals()]);

  const natUnits = bps ? bps.states.reduce((s, r) => s + r.totalUnits, 0) : null;
  const natMf = bps ? bps.states.reduce((s, r) => s + r.units5, 0) : null;
  const natSf = bps ? bps.states.reduce((s, r) => s + r.units1, 0) : null;
  const natValue = bps ? bps.states.reduce((s, r) => s + r.valueThousands, 0) * 1000 : null;

  const liveCities = CITIES.filter((c) => c.socrata);
  const stateGroups = Array.from(
    CITIES.reduce((m, c) => {
      (m.get(c.state) ?? m.set(c.state, []).get(c.state)!).push(c);
      return m;
    }, new Map<string, CityConfig[]>())
  )
    .map(([code, cities]) => ({
      code,
      cities: [...cities].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => (STATE_NAME[a.code] ?? a.code).localeCompare(STATE_NAME[b.code] ?? b.code));

  return (
    <div className="flex flex-col gap-8">
      <section className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-10 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold-deep font-semibold mb-2">National overview</p>
          <h1 className="font-display text-[34px] md:text-[40px] font-semibold text-ink leading-[1.05] tracking-tight">
            Where America is building, and where it isn&apos;t.
          </h1>
          <p className="text-[15px] text-ink-soft mt-3 max-w-2xl">
            New-construction permit activity by state and structure type, straight from the U.S. Census
            Building Permits Survey. Search any supported city to explore individual developments, modeled
            economics, supply-gap recommendations, and the developers behind them.
          </p>
        </div>
        <div className="hidden lg:block">
          <DevConstructionHero />
        </div>
      </section>

      {bps ? (
        <>
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label={`Units authorized · ${bps.year}`} value={fmtNum(natUnits)} to={natUnits ?? 0} format="num" provenance="live" sub="all structure types" />
            <Stat label="Multifamily (5+)" value={fmtNum(natMf)} to={natMf ?? 0} format="num" provenance="live" sub={natUnits ? `${Math.round((natMf! / natUnits) * 100)}% of units` : undefined} />
            <Stat label="Single-family" value={fmtNum(natSf)} to={natSf ?? 0} format="num" provenance="live" sub={natUnits ? `${Math.round((natSf! / natUnits) * 100)}% of units` : undefined} />
            <Stat label="Declared value" value={fmtCompactUSD(natValue)} to={natValue ?? 0} format="compactUsd" provenance="live" sub="permit valuations" />
          </Reveal>

          <Reveal className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card>
                <SectionTitle sub={`Census Building Permits Survey · annual state totals, ${bps.year} · shade = units authorized, click a state to open its map`}>
                  Permit activity by state
                </SectionTitle>
                <NationalMap states={bps.states} />
              </Card>
            </div>
            <div className="flex flex-col gap-4">
              <Card>
                <SectionTitle sub="Units authorized per year, split by structure type, with year-over-year change">Construction trend &amp; mix</SectionTitle>
                <CompositionTrend
                  data={bps.trend.map((t) => ({
                    label: `'${String(t.year).slice(2)}`,
                    sf: t.units1,
                    mid: Math.max(0, t.totalUnits - t.units1 - t.units5),
                    mf: t.units5,
                    value: t.valueThousands * 1000,
                  }))}
                />
              </Card>
              <Card className="flex flex-col gap-3">
                <div className="text-xs text-muted">Market context (FRED)</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink-soft">30-yr mortgage</span>
                  <span className="font-display text-lg font-semibold num">
                    {fred.mortgageRate != null ? <CountUp to={fred.mortgageRate} format="pct2" /> : "n/a"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink-soft">Housing starts</span>
                  <span className="font-display text-lg font-semibold num">
                    {fred.housingStartsK != null ? <CountUp to={fred.housingStartsK} format="startsK" /> : "n/a"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink-soft">Constr. cost vs &apos;19</span>
                  <span className="font-display text-lg font-semibold num">
                    <CountUp to={(fred.costMultiplier - 1) * 100} format="pct0" />
                  </span>
                </div>
              </Card>
            </div>
          </Reveal>

          <Reveal>
            <Card>
              <SectionTitle sub={`${bps.year} · top states ranked by total units · bar length = volume, color split = structure mix · click a state to open its map`}>
                State rankings
              </SectionTitle>
              <StatePermitLeaderboard states={bps.states} />
            </Card>
          </Reveal>

          <Reveal>
            <LiveSignalFeed
              signals={signals}
              title="Live signal feed"
              sub="Cross-sector SEC filings and U.S. real-estate development headlines, newest first."
            />
          </Reveal>

          <Reveal>
            <SectionTitle sub="Live-permit portals show real valuations and developers. Every other city is mapped from OpenStreetMap footprints with modeled economics. Search any U.S. city above.">
              Explore a city
            </SectionTitle>

            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-good mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-good" /> Live permit portals
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {liveCities.map((c) => {
                  const row = bps.states.find((s) => s.state === c.state);
                  return (
                    <Link
                      key={c.id}
                      href={`/city/${c.id}`}
                      className="block bg-surface border border-line rounded-[var(--radius-card)] p-5 shadow-[var(--shadow)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-[17px] font-semibold text-ink">{c.name}</span>
                        <span className="text-xs text-muted-2 shrink-0">{c.state}</span>
                      </div>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-good">
                          <span className="w-1.5 h-1.5 rounded-full bg-good" /> Live permit portal
                        </span>
                      </div>
                      {row && (
                        <div className="text-xs text-muted mt-1 num">
                          {fmtNum(row.totalUnits)} units authorized statewide ({bps.year})
                        </div>
                      )}
                      <div className="text-[13px] text-gold-deep font-semibold mt-3 flex items-center gap-1.5">
                        Explore developments → <LinkSpinner />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-2 mb-2">
              Browse by state
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {stateGroups.map(({ code, cities }) => (
                <details
                  key={code}
                  className="group bg-surface border border-line rounded-[var(--radius-card)] shadow-[var(--shadow)] overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer select-none list-none hover:bg-surface-2 transition-colors">
                    <span className="font-display text-[15px] font-semibold text-ink">{STATE_NAME[code] ?? code}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-2 num">{cities.length}</span>
                      <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}
                        strokeLinecap="round" strokeLinejoin="round"
                        className="text-muted-2 transition-transform group-open:rotate-180">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </summary>
                  <div className="border-t border-line px-2 py-2 flex flex-col">
                    {cities.map((c) => (
                      <Link
                        key={c.id}
                        href={`/city/${c.id}`}
                        className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-[8px] text-[13.5px] text-ink-soft hover:bg-surface-2 hover:text-ink transition-colors"
                      >
                        <span>{c.name}</span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          <LinkSpinner />
                          {c.socrata && (
                            <span className="w-1.5 h-1.5 rounded-full bg-good" title="Live permit portal" />
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </>
      ) : (
        <StateBlock
          title="Census Building Permits Survey is unavailable right now"
          note="The national feed didn't respond. No placeholder data is shown. Try again shortly, or open a supported city to explore its live permit portal directly."
        />
      )}
    </div>
  );
}
