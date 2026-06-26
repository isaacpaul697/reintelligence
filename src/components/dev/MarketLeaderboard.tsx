import Link from "next/link";
import type { BpsStateRow } from "@/lib/dev/types";
import { TYPE_COLOR } from "@/lib/dev/types";
import { STATE_NAME } from "@/lib/dev/live/bps";
import { flagshipCity } from "@/lib/dev/cities";
import { fmtNum } from "@/lib/dev/format";

/* ==================================================================
   Colorful, accessible rankings of permit activity. Replaces the
   harder-to-read bubble map. Every row that maps to a tracked metro
   links to that city's live map.
   ================================================================== */

export interface LeaderRow {
  key: string;
  title: string;
  subtitle?: string;
  href?: string;
  /** Right-aligned primary value, already formatted. */
  value: string;
  /** Optional colored pill (e.g. a growth figure). */
  badge?: { text: string; color: string };
  /** Bar width, 0..1 of the row max. */
  fill: number;
  color: string;
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gold-deep">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Generic ranked-bar leaderboard for a single metric. */
export function MarketLeaderboard({ rows }: { rows: LeaderRow[] }) {
  return (
    <ol className="flex flex-col">
      {rows.map((r, i) => {
        const body = (
          <div className="flex items-center gap-3 py-2.5">
            <span className="w-5 text-center font-display text-sm font-semibold text-muted-2 shrink-0">{i + 1}</span>
            <div className="w-32 sm:w-40 shrink-0 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13.5px] font-semibold text-ink truncate">{r.title}</span>
                {r.href && <Arrow />}
              </div>
              {r.subtitle && <div className="text-[11px] text-muted truncate">{r.subtitle}</div>}
            </div>
            <div className="flex-1 h-2.5 rounded-full bg-surface-2 overflow-hidden">
              <div className="h-full rounded-full transition-[width]" style={{ width: `${Math.max(3, r.fill * 100)}%`, background: r.color }} />
            </div>
            {r.badge && (
              <span className="text-[11px] font-semibold num shrink-0 px-1.5 py-0.5 rounded-full"
                style={{ color: r.badge.color, background: `${r.badge.color}1f` }}>
                {r.badge.text}
              </span>
            )}
            <span className="w-16 text-right text-xs num text-ink-soft shrink-0">{r.value}</span>
          </div>
        );
        return (
          <li key={r.key} className="border-b border-line last:border-0">
            {r.href ? (
              <Link href={r.href} className="group block px-1.5 -mx-1.5 rounded-[8px] hover:bg-surface-2 transition-colors">
                {body}
              </Link>
            ) : (
              <div className="px-1.5 -mx-1.5">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

const SEGMENTS = [
  { label: "Single-family", color: TYPE_COLOR["single-family"], pick: (r: BpsStateRow) => r.units1 },
  { label: "2-4 unit", color: TYPE_COLOR["mixed-use"], pick: (r: BpsStateRow) => r.units2 + r.units34 },
  { label: "Multifamily", color: TYPE_COLOR.multifamily, pick: (r: BpsStateRow) => r.units5 },
];

/**
 * Stacked horizontal bars ranking states by total permitted units, with each
 * bar split by structure type. Bar length = volume, color split = mix. Rows
 * link to the state's flagship metro map.
 */
export function StatePermitLeaderboard({ states, top = 12 }: { states: BpsStateRow[]; top?: number }) {
  const ranked = [...states].sort((a, b) => b.totalUnits - a.totalUnits).slice(0, top);
  const max = Math.max(1, ...ranked.map((r) => r.totalUnits));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
        {SEGMENTS.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <ol className="flex flex-col">
        {ranked.map((r, i) => {
          const city = flagshipCity(r.state);
          const href = city ? `/development/city/${city.id}` : undefined;
          const total = r.totalUnits || 1;
          const body = (
            <div className="flex items-center gap-3 py-2">
              <span className="w-5 text-center font-display text-sm font-semibold text-muted-2 shrink-0">{i + 1}</span>
              <div className="w-28 shrink-0 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-ink truncate">{STATE_NAME[r.state] ?? r.state}</span>
                  {href && <Arrow />}
                </div>
                {city && <div className="text-[11px] text-muted truncate">{city.name} map →</div>}
              </div>
              <div className="flex-1 h-3 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full flex" style={{ width: `${(r.totalUnits / max) * 100}%` }}>
                  {SEGMENTS.map((s) => {
                    const w = (s.pick(r) / total) * 100;
                    return w > 0 ? <div key={s.label} style={{ width: `${w}%`, background: s.color }} title={`${s.label}: ${fmtNum(s.pick(r))}`} /> : null;
                  })}
                </div>
              </div>
              <span className="w-16 text-right text-xs num text-ink-soft shrink-0">{fmtNum(r.totalUnits)}</span>
            </div>
          );
          return (
            <li key={r.state} className="border-b border-line last:border-0">
              {href ? (
                <Link href={href} className="group block px-1.5 -mx-1.5 rounded-[8px] hover:bg-surface-2 transition-colors">
                  {body}
                </Link>
              ) : (
                <div className="px-1.5 -mx-1.5">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
