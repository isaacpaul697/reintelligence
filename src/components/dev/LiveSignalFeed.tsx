import { Card } from "./ui";
import type { Signal, SignalKind } from "@/lib/dev/live/signals";

/** Stable short date ("Jun 27"); avoids relative-time staleness on a cached page. */
function shortDate(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const KIND_META: Record<SignalKind, { label: string; color: string }> = {
  news: { label: "Headline", color: "var(--chart-1)" },
  filing: { label: "SEC filing", color: "var(--gold)" },
};

/** The pulsing green "Live" status pill, mirroring the sector hero. */
function LivePill() {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-good bg-good-soft rounded-full px-3 py-1 shrink-0">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-good opacity-60 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-good" />
      </span>
      Live
    </span>
  );
}

/**
 * A single, chronological "what just happened" stream that merges live SEC
 * filings and live news headlines into one feed. Every row is a real, dated,
 * linkable event; nothing here is modeled. Used on the national overview and
 * every asset-class page.
 */
export function LiveSignalFeed({
  signals,
  title = "Live signal feed",
  sub = "Recent filings and headlines, newest first.",
  accent = "var(--gold)",
}: {
  signals: Signal[];
  title?: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-[19px] font-semibold text-ink tracking-tight leading-tight">{title}</h2>
          <p className="text-xs text-muted mt-1">{sub}</p>
        </div>
        <LivePill />
      </div>

      {signals.length === 0 ? (
        <div className="text-[13px] text-muted py-6 text-center">
          No live signals responded just now. Nothing is shown rather than placeholder data; try again shortly.
        </div>
      ) : (
        <div className="max-h-[440px] overflow-y-auto pr-1 -mr-1">
          {signals.map((s, i) => {
            const meta = KIND_META[s.kind];
            return (
              <a
                key={`${s.url}-${i}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 py-3 border-b border-line last:border-0"
              >
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: s.kind === "filing" ? accent : meta.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide rounded-full px-1.5 py-0.5"
                      style={{ background: `${meta.color}1f`, color: meta.color }}
                    >
                      {meta.label}
                      {s.badge ? ` · ${s.badge}` : ""}
                    </span>
                    <span className="text-[11px] text-muted-2 num">{shortDate(s.date)}</span>
                  </div>
                  <div className="text-[13.5px] text-ink leading-snug group-hover:text-gold-deep transition-colors">
                    {s.title}
                  </div>
                  <div className="text-[11.5px] text-muted-2 mt-0.5">{s.source}</div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  width={15}
                  height={15}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-2 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-muted-2 mt-3">
        Live from SEC EDGAR and Google News, refreshed twice daily.
      </p>
    </Card>
  );
}
