/**
 * API-key usage tracking. Server-only.
 *
 * Honesty rule for this app: we never invent usage numbers. Of every external
 * source we touch, exactly one, College Scorecard, served through
 * api.data.gov, returns a real, account-wide quota meter via the
 * `x-ratelimit-limit` / `x-ratelimit-remaining` response headers. Those are the
 * only live "how close am I to running out" figures that genuinely exist, so
 * they are the only ones we render as a meter. Every other provider either has
 * no per-key quota concept or exposes no remaining-counter, so we report its
 * real configured status plus its documented limit window and say plainly that
 * there is no live meter, rather than fabricate one.
 */

export type KeyState = "active" | "fallback" | "missing" | "none";
export type UsageStatus = "ok" | "low" | "exhausted" | "unknown";

export interface ProviderUsage {
  id: string;
  name: string;
  /** What this source feeds in the product. */
  role: string;
  /** metered = live remaining meter; keyed = needs a key but no meter; keyless = no key. */
  category: "metered" | "keyed" | "keyless";
  keyEnv?: string;
  keyState: KeyState;
  /** Live meter (metered providers only). */
  limit: number | null;
  remaining: number | null;
  used: number | null;
  /** Real reset cadence, e.g. "per hour", "per day", "per minute". */
  window: string;
  /** ISO timestamp the meter next refreshes (metered only). */
  resetAt: string | null;
  status: UsageStatus;
  /** Plain-language explanation of the limit / why there is or isn't a meter. */
  note: string;
}

/** Last-seen rate-limit headers captured passively from real app requests. */
interface RateSnapshot {
  limit: number;
  remaining: number;
  at: number; // epoch ms
}

const g = globalThis as unknown as {
  __apiUsage?: Map<string, RateSnapshot>;
};
const store = (g.__apiUsage ??= new Map());

/**
 * Record an api.data.gov-style rate-limit reading from a real response. Called
 * from the live fetchers so the meter reflects actual app traffic, not a probe.
 */
export function recordRateLimit(provider: string, headers: Headers): void {
  const limit = Number(headers.get("x-ratelimit-limit"));
  const remaining = Number(headers.get("x-ratelimit-remaining"));
  if (Number.isFinite(limit) && Number.isFinite(remaining)) {
    store.set(provider, { limit, remaining, at: Date.now() });
  }
}

export function getRecorded(provider: string): RateSnapshot | undefined {
  return store.get(provider);
}

/** api.data.gov resets hourly on the clock, the next top of the hour. */
export function nextHourReset(from = new Date()): Date {
  const d = new Date(from);
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d;
}

function statusFor(remaining: number, limit: number): UsageStatus {
  if (limit <= 0) return "unknown";
  if (remaining <= 0) return "exhausted";
  if (remaining / limit <= 0.2) return "low";
  return "ok";
}

/** Build the College Scorecard (api.data.gov) row from a live meter reading. */
export function scorecardRow(snap: RateSnapshot | undefined, usingDemoKey: boolean): ProviderUsage {
  const reset = nextHourReset().toISOString();
  if (!snap) {
    return {
      id: "scorecard",
      name: "College Scorecard",
      role: "Enrollment, acceptance rate, retention, room & board",
      category: "metered",
      keyEnv: "DATA_GOV_API_KEY",
      keyState: usingDemoKey ? "fallback" : "active",
      limit: null,
      remaining: null,
      used: null,
      window: "per hour",
      resetAt: reset,
      status: "unknown",
      note: usingDemoKey
        ? "Running on the shared DEMO_KEY (about 30 requests/hour, per IP). Set DATA_GOV_API_KEY for 1,000/hour. No reading captured yet."
        : "Live hourly quota from api.data.gov. No reading captured yet this session.",
    };
  }
  return {
    id: "scorecard",
    name: "College Scorecard",
    role: "Enrollment, acceptance rate, retention, room & board",
    category: "metered",
    keyEnv: "DATA_GOV_API_KEY",
    keyState: usingDemoKey ? "fallback" : "active",
    limit: snap.limit,
    remaining: snap.remaining,
    used: Math.max(0, snap.limit - snap.remaining),
    window: "per hour",
    resetAt: reset,
    status: statusFor(snap.remaining, snap.limit),
    note: usingDemoKey
      ? "Live meter from api.data.gov, currently on the shared DEMO_KEY (low hourly cap, per IP). Add DATA_GOV_API_KEY for 1,000/hour."
      : "Live hourly meter from api.data.gov, read straight off the response headers.",
  };
}

/** The keyed-but-unmetered and keyless sources, reported honestly with no fabricated meter. */
export function staticProviders(env: NodeJS.ProcessEnv): ProviderUsage[] {
  const keyed = (
    id: string,
    name: string,
    role: string,
    keyEnv: string,
    window: string,
    note: string,
  ): ProviderUsage => ({
    id,
    name,
    role,
    category: "keyed",
    keyEnv,
    keyState: env[keyEnv] ? "active" : "missing",
    limit: null,
    remaining: null,
    used: null,
    window,
    resetAt: null,
    status: "unknown",
    note,
  });

  const keyless = (id: string, name: string, role: string, window: string, note: string): ProviderUsage => ({
    id,
    name,
    role,
    category: "keyless",
    keyState: "none",
    limit: null,
    remaining: null,
    used: null,
    window,
    resetAt: null,
    status: "unknown",
    note,
  });

  return [
    keyed(
      "census",
      "U.S. Census Bureau",
      "ACS demographics + Building Permits Survey",
      "CENSUS_API_KEY",
      "per day",
      "The API key lifts the 500-queries/day anonymous cap. Census does not return a remaining-quota header, so there is no live meter, and normal usage stays well under any limit.",
    ),
    keyed(
      "hud",
      "HUD USER",
      "Fair Market Rents + USPS crosswalk",
      "HUD_API_TOKEN",
      "no published cap",
      "Access is token-gated. HUD publishes no per-key quota and returns no usage header, so there is nothing to meter or run out of in normal use.",
    ),
    keyed(
      "socrata",
      "Socrata (open data portals)",
      "Municipal building-permit datasets",
      "SOCRATA_APP_TOKEN",
      "rolling throttle",
      "The app token raises a shared rolling throttle. Socrata reports no remaining count; it simply returns HTTP 429 if you burst too fast. No live meter exists.",
    ),
    keyless(
      "fred",
      "FRED (St. Louis Fed)",
      "Construction-cost index, mortgage rate, housing starts",
      "120 / minute",
      "Keyless CSV endpoint. Soft limit ~120 requests/minute, no key and no quota meter.",
    ),
    keyless(
      "news",
      "Google News RSS",
      "Demand-signal headlines",
      "no key",
      "Public RSS feed. No key, no published quota.",
    ),
    keyless(
      "osm",
      "OpenStreetMap / Overpass / Nominatim",
      "Apartment buildings, land use, geocoding",
      "~1 / second",
      "Public endpoints under a fair-use policy (roughly 1 request/second). No key and no quota meter; requests are cached server-side to stay polite.",
    ),
    keyless(
      "wikipedia",
      "Wikipedia / Wikimedia",
      "University logos, developer profiles",
      "fair use",
      "Public API under a fair-use policy. No key, no quota meter.",
    ),
  ];
}
