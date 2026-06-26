import type { PropertyType } from "@/lib/dev/types";
import { TYPE_COLOR, TYPE_LABEL } from "@/lib/dev/types";

function compactUnits(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return `${Math.round(n)}`;
}

/**
 * Vertical bars for a yearly time series. Real flex layout (not a stretched
 * SVG), so labels stay crisp: value on top of each bar, year underneath,
 * latest year highlighted.
 */
export function TrendBars({
  data,
  height = 132,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barArea = height - 18; // leave room for the value label above each bar
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const last = i === data.length - 1;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full"
              title={`${d.label}: ${Math.round(d.value).toLocaleString("en-US")} units authorized`}
            >
              <span className={`text-[10px] num leading-none mb-1 ${last ? "text-ink font-semibold" : "text-muted-2"}`}>
                {compactUnits(d.value)}
              </span>
              <div
                className="w-full max-w-[26px] rounded-t-[3px] transition-[height]"
                style={{
                  height: Math.max(2, (d.value / max) * barArea),
                  background: "var(--chart-1)",
                  opacity: last ? 1 : 0.5,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-1.5 border-t border-line pt-1.5">
        {data.map((d, i) => (
          <span
            key={i}
            className={`flex-1 text-center text-[10px] num ${i === data.length - 1 ? "text-ink-soft font-semibold" : "text-muted-2"}`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const COMP_SEG = [
  { key: "sf", label: "Single-family", color: TYPE_COLOR["single-family"] },
  { key: "mid", label: "2-4 unit", color: TYPE_COLOR["mixed-use"] },
  { key: "mf", label: "Multifamily", color: TYPE_COLOR.multifamily },
] as const;

export interface CompositionPoint {
  label: string;
  sf: number;
  mid: number;
  mf: number;
  /** Declared permit valuation in USD, for the tooltip. */
  value?: number;
}

/**
 * Stacked yearly columns broken out by structure type. Unlike a plain total-units
 * bar chart, this shows BOTH how much was authorized each year and how the mix
 * between single-family, missing-middle, and multifamily shifted over time. Each
 * column carries its total on top; the latest year is emphasized, and an inline
 * year-over-year delta sits beneath the axis.
 */
export function CompositionTrend({
  data,
  height = 168,
}: {
  data: CompositionPoint[];
  height?: number;
}) {
  const totals = data.map((d) => d.sf + d.mid + d.mf);
  const max = Math.max(1, ...totals);
  const barArea = height - 20; // room for the total label above each column
  const fmtUSD = (n: number) =>
    n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(0)}M` : `$${Math.round(n)}`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
        {COMP_SEG.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const total = totals[i];
          const last = i === data.length - 1;
          const colH = Math.max(2, (total / max) * barArea);
          const breakdown = COMP_SEG.map((s) => `${s.label}: ${Math.round(d[s.key]).toLocaleString("en-US")}`).join(" · ");
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full group"
              title={`${d.label} · ${Math.round(total).toLocaleString("en-US")} units\n${breakdown}${d.value ? `\nValue: ${fmtUSD(d.value)}` : ""}`}
            >
              <span className={`text-[10px] num leading-none mb-1 ${last ? "text-ink font-semibold" : "text-muted-2"}`}>
                {compactUnits(total)}
              </span>
              <div
                className="w-full max-w-[34px] rounded-t-[3px] overflow-hidden flex flex-col-reverse shadow-sm transition-[height]"
                style={{ height: colH, opacity: last ? 1 : 0.78 }}
              >
                {COMP_SEG.map((s) => {
                  const frac = total > 0 ? d[s.key] / total : 0;
                  return frac > 0 ? (
                    <div key={s.key} style={{ height: `${frac * 100}%`, background: s.color }} />
                  ) : null;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-1.5 border-t border-line pt-1.5">
        {data.map((d, i) => {
          const last = i === data.length - 1;
          const prev = i > 0 ? totals[i - 1] : null;
          const delta = prev && prev > 0 ? (totals[i] - prev) / prev : null;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <span className={`text-[10px] num ${last ? "text-ink-soft font-semibold" : "text-muted-2"}`}>{d.label}</span>
              {delta != null && (
                <span
                  className="text-[9px] num font-semibold"
                  style={{ color: delta >= 0 ? "#3f7a4f" : "#b23b2c" }}
                >
                  {delta >= 0 ? "+" : ""}{Math.round(delta * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Horizontal share bars for a type breakdown. */
export function TypeBars({
  counts,
  total,
}: {
  counts: Record<PropertyType, number>;
  total: number;
}) {
  const entries = (Object.entries(counts) as [PropertyType, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const denom = total || 1;
  return (
    <div className="flex flex-col gap-2">
      {entries.map(([t, v]) => (
        <div key={t} className="flex items-center gap-2.5">
          <span className="w-24 text-xs text-ink-soft shrink-0">{TYPE_LABEL[t]}</span>
          <div className="flex-1 h-2.5 rounded-full bg-surface-2 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(v / denom) * 100}%`, background: TYPE_COLOR[t] }} />
          </div>
          <span className="w-12 text-right text-xs num text-muted">{Math.round((v / denom) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}
