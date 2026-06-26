"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "@/components/ui";

type KeyState = "active" | "fallback" | "missing" | "none";
type UsageStatus = "ok" | "low" | "exhausted" | "unknown";

interface ProviderUsage {
  id: string;
  name: string;
  role: string;
  category: "metered" | "keyed" | "keyless";
  keyEnv?: string;
  keyState: KeyState;
  limit: number | null;
  remaining: number | null;
  used: number | null;
  window: string;
  resetAt: string | null;
  status: UsageStatus;
  note: string;
}

interface UsagePayload {
  generatedAt: string;
  providers: ProviderUsage[];
  alerts: { id: string; name: string; status: UsageStatus; remaining: number | null; limit: number | null; resetAt: string | null }[];
}

const STATUS_COLOR: Record<UsageStatus, string> = {
  ok: "var(--c-good)",
  low: "var(--c-warn)",
  exhausted: "var(--c-bad)",
  unknown: "var(--muted-2)",
};

const KEY_LABEL: Record<KeyState, string> = {
  active: "Key active",
  fallback: "Shared demo key",
  missing: "No key set",
  none: "No key needed",
};

function clockAt(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** Live "refreshes in 12m 04s" countdown toward the reset timestamp. */
function useCountdown(iso: string | null): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!iso) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [iso]);
  if (!iso) return "";
  const ms = new Date(iso).getTime() - now;
  if (ms <= 0) return "any moment";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

export function ApiUsagePanel() {
  const [data, setData] = useState<UsagePayload | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const res = await fetch("/api/usage", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const json = (await res.json()) as UsagePayload;
        if (live) {
          setData(json);
          setErr(false);
        }
      } catch {
        if (live) setErr(true);
      }
    };
    load();
    const t = setInterval(load, 60_000); // refresh the meter every minute
    return () => {
      live = false;
      clearInterval(t);
    };
  }, []);

  const metered = data?.providers.find((p) => p.category === "metered");
  const reset = useCountdown(metered?.resetAt ?? null);

  return (
    <Card className="mb-6">
      <SectionTitle sub="Live limits read straight from each provider. Only sources that publish a usage meter show one.">
        API keys &amp; usage
      </SectionTitle>

      {err && !data && (
        <p className="text-sm text-muted">Couldn&apos;t reach the usage endpoint. It will retry automatically.</p>
      )}
      {!data && !err && <p className="text-sm text-muted">Reading live limits…</p>}

      {data && (
        <>
          {/* Run-out / running-low notice */}
          {data.alerts.length > 0 && (
            <div className="mb-4 flex flex-col gap-2">
              {data.alerts.map((a) => {
                const out = a.status === "exhausted";
                return (
                  <div
                    key={a.id}
                    className="flex items-start gap-2.5 rounded-[var(--radius-card)] px-3.5 py-2.5 text-sm"
                    style={{ background: out ? "var(--c-bad-soft)" : "var(--c-warn-soft)", color: out ? "var(--c-bad)" : "var(--c-warn)" }}
                  >
                    <span className="mt-0.5 w-2 h-2 rounded-full shrink-0" style={{ background: out ? "var(--c-bad)" : "var(--c-warn)" }} />
                    <span>
                      <strong>{a.name}</strong>{" "}
                      {out
                        ? "has hit its limit; requests will fail until it refreshes"
                        : `is running low (${a.remaining} of ${a.limit} left)`}
                      {a.resetAt && (
                        <>
                          {". "}
                          Refreshes at <strong>{clockAt(a.resetAt)}</strong>
                          {reset && ` (in ${reset})`}.
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col divide-y divide-line">
            {data.providers.map((p) => (
              <ProviderRow key={p.id} p={p} />
            ))}
          </div>

          <p className="text-[11px] text-muted-2 mt-3">
            Updated {clockAt(data.generatedAt)} · meter refreshes automatically every minute
          </p>
        </>
      )}
    </Card>
  );
}

function ProviderRow({ p }: { p: ProviderUsage }) {
  const hasMeter = p.limit != null && p.remaining != null;
  const pct = hasMeter ? Math.max(0, Math.min(100, (p.remaining! / p.limit!) * 100)) : 0;
  const color = STATUS_COLOR[p.status];
  const reset = useCountdown(p.resetAt);

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-sm font-semibold text-ink truncate">{p.name}</span>
            <span
              className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-md shrink-0"
              style={{
                background: p.keyState === "missing" ? "var(--c-bad-soft)" : "var(--surface-2)",
                color: p.keyState === "missing" ? "var(--c-bad)" : "var(--muted)",
              }}
            >
              {KEY_LABEL[p.keyState]}
            </span>
          </div>
          <div className="text-xs text-muted mt-0.5 truncate">{p.role}</div>
        </div>

        <div className="text-right shrink-0">
          {hasMeter ? (
            <>
              <div className="text-sm num font-semibold text-ink">
                {p.remaining!.toLocaleString()} <span className="text-muted-2 font-normal">left</span>
              </div>
              <div className="text-[11px] num text-muted-2">
                of {p.limit!.toLocaleString()} {p.window}
              </div>
            </>
          ) : (
            <div className="text-[11px] num text-muted-2">{p.window}</div>
          )}
        </div>
      </div>

      {hasMeter && (
        <div className="mt-2 h-2 rounded-full overflow-hidden bg-surface-2">
          <div className="h-full rounded-full transition-[width]" style={{ width: `${pct}%`, background: color }} />
        </div>
      )}

      <div className="text-[11px] text-muted-2 mt-1.5 leading-snug">
        {p.note}
        {hasMeter && p.resetAt && reset && (
          <>
            {" "}
            <span className="text-muted">Refreshes in {reset}.</span>
          </>
        )}
      </div>
    </div>
  );
}
