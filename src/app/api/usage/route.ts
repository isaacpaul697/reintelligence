import { NextResponse } from "next/server";
import {
  recordRateLimit,
  getRecorded,
  scorecardRow,
  staticProviders,
  type ProviderUsage,
} from "@/lib/usage";

export const dynamic = "force-dynamic";

/**
 * Live API-key usage. Only College Scorecard (api.data.gov) exposes a real
 * remaining-quota meter, so we read it straight from a lightweight probe and
 * cache that for a minute to avoid spending the very quota we are reporting on.
 * Every other source is reported honestly with no fabricated meter.
 */

const KEY = process.env.DATA_GOV_API_KEY || "DEMO_KEY";
const USING_DEMO = !process.env.DATA_GOV_API_KEY;
const PROBE_TTL_MS = 60_000;

const g = globalThis as unknown as { __usageProbe?: { at: number } };

/**
 * Refresh the cached Scorecard meter at most once a minute. The probe is the
 * cheapest possible Scorecard call (one field, one row); reading the
 * rate-limit headers off it records the live remaining count into the shared
 * registry. We swallow failures, a stale/last-known reading is still honest.
 */
async function refreshScorecardMeter(): Promise<void> {
  const last = g.__usageProbe?.at ?? 0;
  if (Date.now() - last < PROBE_TTL_MS) return;
  g.__usageProbe = { at: Date.now() };
  try {
    const res = await fetch(
      `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${KEY}&per_page=1&fields=id`,
      { cache: "no-store" },
    );
    recordRateLimit("scorecard", res.headers);
  } catch {
    /* keep last-known reading */
  }
}

export async function GET() {
  await refreshScorecardMeter();

  const providers: ProviderUsage[] = [
    scorecardRow(getRecorded("scorecard"), USING_DEMO),
    ...staticProviders(process.env),
  ];

  const alerts = providers
    .filter((p) => p.status === "exhausted" || p.status === "low")
    .map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      remaining: p.remaining,
      limit: p.limit,
      resetAt: p.resetAt,
    }));

  return NextResponse.json(
    { generatedAt: new Date().toISOString(), providers, alerts },
    { headers: { "cache-control": "no-store" } },
  );
}
