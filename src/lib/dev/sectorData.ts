import { fetchBps, STATE_NAME } from "@/lib/dev/live/bps";
import { flagshipCity } from "@/lib/dev/cities";
import { fmtNum } from "@/lib/dev/format";
import { SECTORS } from "@/lib/dev/sectorDefs";
import type { LeaderRow } from "@/components/dev/MarketLeaderboard";

/** Minimum current volume so tiny-base year-over-year swings don't dominate. */
const MIN_UNITS = 250;

export interface SectorBpsView {
  year: number;
  prevYear: number | null;
  sectorTotal: number;
  allUnits: number;
  share: number;
  topState: { state: string; v: number } | null;
  statesWithActivity: number;
  trendData: { label: string; value: number }[];
  volumeRows: LeaderRow[];
  momentumRows: LeaderRow[];
}

/**
 * Compute the live Building Permits Survey view for a residential asset class.
 * Returns null for non-BPS classes, and `{ available:false }` when the Census
 * feed didn't respond (so the page degrades honestly instead of showing zeros).
 */
export async function loadSectorBps(
  sector: string,
): Promise<{ available: boolean; view: SectorBpsView | null }> {
  const def = SECTORS[sector];
  if (!def || def.source !== "bps" || !def.pick || !def.trend) {
    return { available: false, view: null };
  }
  const bps = await fetchBps();
  if (!bps) return { available: false, view: null };

  const pick = def.pick;
  const ranked = bps.states
    .map((r) => ({ state: r.state, v: pick(r) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const sectorTotal = ranked.reduce((s, x) => s + x.v, 0);
  const allUnits = bps.states.reduce((s, r) => s + r.totalUnits, 0);
  const share = allUnits ? sectorTotal / allUnits : 0;
  const topState = ranked[0] ?? null;
  const trendData = bps.trend.map((t) => ({ label: `'${String(t.year).slice(2)}`, value: def.trend!(t) }));

  const toRow = (state: string, value: string, fill: number, badge?: LeaderRow["badge"]): LeaderRow => {
    const city = flagshipCity(state);
    return {
      key: state,
      title: STATE_NAME[state] ?? state,
      subtitle: city ? `${city.name} map →` : undefined,
      href: city ? `/city/${city.id}` : undefined,
      value,
      fill,
      color: def.color,
      badge,
    };
  };

  const volMax = ranked[0]?.v ?? 1;
  const volumeRows = ranked.slice(0, 10).map((x) => toRow(x.state, fmtNum(x.v), x.v / volMax));

  const prevByState = new Map<string, number>((bps.prevStates ?? []).map((r) => [r.state, pick(r)]));
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
  const momentumRows = momentum.map((x) =>
    toRow(x.state, fmtNum(x.cur), x.growth / momMax, {
      text: `+${Math.round(x.growth * 100)}%`,
      color: "#3f7a4f",
    }),
  );

  return {
    available: true,
    view: {
      year: bps.year,
      prevYear: bps.prevYear ?? null,
      sectorTotal,
      allUnits,
      share,
      topState,
      statesWithActivity: ranked.length,
      trendData,
      volumeRows,
      momentumRows,
    },
  };
}
