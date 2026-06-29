import type { Provenance } from "./types";

/* ==================================================================
   Auto-underwriting engine.

   No free live feed exists for cap rates, NOI, or property valuations,
   so every figure here is either (a) pulled live (the FRED 30-yr mortgage
   rate, the per-bed rent that already feeds estAnnualRevenue) or (b)
   modeled from those live inputs and tagged provenance:"estimated". The
   constants below are documented modeling assumptions, surfaced on the
   Methodology pages, not data points. Mirrors the style of
   src/lib/live/markets.ts (estimateRentGrowth) and src/lib/dev/model.ts.
   ================================================================== */

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Asset classes we underwrite. Superset of the dev PropertyType plus
 *  student-housing, which behaves like multifamily but with its own spread. */
export type UwAsset =
  | "student-housing"
  | "multifamily"
  | "single-family"
  | "office"
  | "retail"
  | "industrial"
  | "mixed-use"
  | "other";

export type UwMode = "income" | "development";

export interface UwInputs {
  mode: UwMode;
  propertyType: UwAsset;
  /** Gross annual potential rent in USD. Income mode: apartment estAnnualRevenue. */
  grossAnnualRent: number | null;
  units: number | null;
  beds?: number | null;
  sqft?: number | null;
  /** Development mode: declared/modeled all-in development cost in USD. */
  totalCost?: number | null;
  /** FRED MORTGAGE30US, percent (e.g. 6.8). LIVE. */
  mortgageRate: number | null;
  /** Income mode: stabilized occupancy (0-1), modeled from live enrollment. */
  occupancy?: number | null;
  /** Local market multiplier on modeled rent (1 = US average). Development
   *  mode only; scales modeled rents to the chosen city. Modeled assumption. */
  marketFactor?: number | null;
}

export interface UwAssumptions {
  capRatePct: number;
  expenseRatioPct: number;
  vacancyPct: number;
  ltvPct: number;
  purchasePrice: number;
}

export interface UwLine {
  label: string;
  value: number | null;
  provenance: Provenance;
  /** How this line was derived (live source or modeling note). */
  note?: string;
  /** Rendering hint for the panel. */
  unit?: "usd" | "pct";
  /** Emphasize as a subtotal/result line. */
  emphasis?: boolean;
}

export interface UwResult {
  income: UwLine[];
  valuation: UwLine[];
  returns: UwLine[];
  financing: UwLine[];
  assumptions: UwAssumptions;
  /** Whether enough live inputs exist to produce a meaningful underwrite. */
  available: boolean;
  /** Plain-language summary of which inputs are live vs modeled. */
  basis: string;
}

/* ── Modeling constants (documented on the Methodology pages) ── */

/** Cap-rate spread over the 30-yr mortgage rate, by asset class (points).
 *  Tighter (lower) for resilient residential, wider for office/retail risk. */
const TYPE_SPREAD: Record<UwAsset, number> = {
  "student-housing": 0.0,
  multifamily: -0.25,
  "single-family": 0.25,
  office: 2.0,
  retail: 1.25,
  industrial: 0.5,
  "mixed-use": 0.75,
  other: 1.0,
};

/** Operating expense ratio as a share of effective gross income. */
const EXPENSE_RATIO: Record<UwAsset, number> = {
  "student-housing": 0.45,
  multifamily: 0.40,
  "single-family": 0.35,
  office: 0.45,
  retail: 0.35,
  industrial: 0.25,
  "mixed-use": 0.40,
  other: 0.40,
};

/** Stabilized structural vacancy by asset class (used when no occupancy signal). */
const STABILIZED_VACANCY: Record<UwAsset, number> = {
  "student-housing": 0.05,
  multifamily: 0.06,
  "single-family": 0.05,
  office: 0.15,
  retail: 0.08,
  industrial: 0.05,
  "mixed-use": 0.08,
  other: 0.08,
};

/** Modeled stabilized rent per dwelling unit per month, by type (USD).
 *  Development mode only, where permit records carry no rent. */
const RENT_PER_UNIT: Partial<Record<UwAsset, number>> = {
  multifamily: 1650,
  "single-family": 2100,
  "mixed-use": 1700,
};

/** Modeled stabilized rent per sqft per YEAR, by type (USD). Dev-mode fallback. */
const RENT_PER_SQFT_YR: Partial<Record<UwAsset, number>> = {
  office: 32,
  retail: 24,
  industrial: 9,
  "mixed-use": 22,
  multifamily: 21,
  other: 18,
};

const DEFAULT_LTV = 0.65;

/* ── Helpers ── */

const line = (
  label: string,
  value: number | null,
  provenance: Provenance,
  note?: string,
  unit: UwLine["unit"] = "usd",
  emphasis = false,
): UwLine => ({ label, value, provenance, note, unit, emphasis });

/** Default cap rate: live mortgage rate + modeled type spread, clamped. */
export function defaultCapRate(type: UwAsset, mortgageRate: number | null): number {
  const base = mortgageRate ?? 6.5;
  return Math.round(clamp(base + TYPE_SPREAD[type], 4, 11) * 100) / 100;
}

/** Standard fully-amortizing annual debt service for a 30-yr loan. */
function annualDebtService(loan: number, ratePct: number): number {
  const r = ratePct / 100 / 12;
  const n = 30 * 12;
  if (loan <= 0) return 0;
  if (r === 0) return loan / 30;
  const monthly = (loan * r) / (1 - Math.pow(1 + r, -n));
  return monthly * 12;
}

/** Gross potential rent: live in income mode (from per-bed rent), modeled in
 *  development mode (no permit-level rent feed exists). */
function grossRent(inp: UwInputs): { value: number | null; provenance: Provenance; note: string } {
  if (inp.mode === "income") {
    if (inp.grossAnnualRent != null && inp.grossAnnualRent > 0) {
      return {
        value: inp.grossAnnualRent,
        provenance: "estimated",
        note: "Estimated beds (OSM) x live per-bed rent (HUD FMR / Census) x 12",
      };
    }
    return { value: null, provenance: "estimated", note: "No rent inputs available" };
  }
  // development mode
  const mkt = inp.marketFactor != null && inp.marketFactor > 0 ? inp.marketFactor : 1;
  const mktNote = mkt !== 1 ? ` x ${mkt.toFixed(2)} local market` : "";
  if (inp.units != null && inp.units > 0 && RENT_PER_UNIT[inp.propertyType]) {
    const perUnit = RENT_PER_UNIT[inp.propertyType]!;
    return {
      value: inp.units * perUnit * 12 * mkt,
      provenance: "estimated",
      note: `${inp.units} units x $${perUnit.toLocaleString()}/mo modeled rent x 12${mktNote}`,
    };
  }
  if (inp.sqft != null && inp.sqft > 0 && RENT_PER_SQFT_YR[inp.propertyType]) {
    const perSqft = RENT_PER_SQFT_YR[inp.propertyType]!;
    return {
      value: inp.sqft * perSqft * mkt,
      provenance: "estimated",
      note: `${inp.sqft.toLocaleString()} sqft x $${perSqft}/sqft/yr modeled rent${mktNote}`,
    };
  }
  return { value: null, provenance: "estimated", note: "No units or floor area to model rent" };
}

/** Auto-derive the editable assumption set from live + modeled inputs. */
export function autoAssumptions(inp: UwInputs): UwAssumptions {
  const capRatePct = defaultCapRate(inp.propertyType, inp.mortgageRate);
  const expenseRatioPct = Math.round(EXPENSE_RATIO[inp.propertyType] * 100);
  const vacancyPct =
    inp.mode === "income" && inp.occupancy != null
      ? Math.round(clamp(1 - inp.occupancy, 0.01, 0.4) * 100)
      : Math.round(STABILIZED_VACANCY[inp.propertyType] * 100);

  // Seed purchase price from the income-approach value so the panel opens balanced.
  const gpr = grossRent(inp).value;
  let purchasePrice = 0;
  if (gpr != null) {
    const egi = gpr * (1 - vacancyPct / 100);
    const noi = egi * (1 - expenseRatioPct / 100);
    purchasePrice = capRatePct > 0 ? noi / (capRatePct / 100) : 0;
  }
  // In development mode, fall back to total cost when income can't anchor a price.
  if (purchasePrice <= 0 && inp.totalCost != null) purchasePrice = inp.totalCost;

  return {
    capRatePct,
    expenseRatioPct,
    vacancyPct,
    ltvPct: Math.round(DEFAULT_LTV * 100),
    purchasePrice: Math.round(purchasePrice),
  };
}

/** Run the full underwrite for a given assumption set. */
export function underwrite(inp: UwInputs, a: UwAssumptions): UwResult {
  const gpr = grossRent(inp);
  const available = gpr.value != null && gpr.value > 0;

  const vac = a.vacancyPct / 100;
  const exp = a.expenseRatioPct / 100;
  const cap = a.capRatePct / 100;

  const gprVal = gpr.value ?? 0;
  const vacancyLoss = gprVal * vac;
  const egi = gprVal - vacancyLoss;
  const opex = egi * exp;
  const noi = egi - opex;

  const income: UwLine[] = [
    line("Gross potential rent", available ? gprVal : null, gpr.provenance, gpr.note),
    line("Vacancy loss", available ? -vacancyLoss : null, "estimated", `${a.vacancyPct}% vacancy assumption`),
    line("Effective gross income", available ? egi : null, "estimated", "Gross rent less vacancy", "usd", true),
    line("Operating expenses", available ? -opex : null, "estimated", `${a.expenseRatioPct}% expense ratio (modeled by type)`),
    line("Net operating income", available ? noi : null, "estimated", "EGI less operating expenses", "usd", true),
  ];

  const incomeValue = cap > 0 ? noi / cap : null;
  const valuation: UwLine[] = [
    line(
      "Estimated value",
      available ? incomeValue : null,
      "estimated",
      `NOI / ${a.capRatePct}% cap rate (cap = live FRED rate + type spread)`,
      "usd",
      true,
    ),
  ];
  if (inp.mode === "development" && inp.totalCost != null) {
    valuation.push(
      line("All-in development cost", inp.totalCost, "estimated", "From permit valuation or modeled construction cost"),
    );
    if (available && incomeValue != null) {
      valuation.push(
        line("Development margin", incomeValue - inp.totalCost, "estimated", "Stabilized value less all-in cost", "usd", true),
      );
    }
  }

  // Financing
  const loan = a.purchasePrice * (a.ltvPct / 100);
  const equity = a.purchasePrice - loan;
  const rate = inp.mortgageRate;
  const ds = rate != null ? annualDebtService(loan, rate) : null;
  const financing: UwLine[] = [
    line("Loan amount", a.purchasePrice > 0 ? loan : null, "estimated", `${a.ltvPct}% LTV on purchase price`),
    line("Equity required", a.purchasePrice > 0 ? equity : null, "estimated", "Purchase price less loan"),
    line("Interest rate", rate, rate != null ? "live" : "estimated", "FRED 30-yr fixed (MORTGAGE30US)", "pct"),
    line("Annual debt service", ds, "estimated", "30-yr amortizing payment at the live rate"),
  ];

  // Returns
  const capRateActual = a.purchasePrice > 0 && available ? (noi / a.purchasePrice) * 100 : null;
  const coc = available && ds != null && equity > 0 ? ((noi - ds) / equity) * 100 : null;
  const dscr = available && ds != null && ds > 0 ? noi / ds : null;
  const yoc =
    inp.mode === "development" && available && inp.totalCost != null && inp.totalCost > 0
      ? (noi / inp.totalCost) * 100
      : null;

  const returns: UwLine[] = [
    line("Cap rate", capRateActual, "estimated", "NOI / purchase price", "pct", true),
    line("Cash-on-cash", coc, "estimated", "(NOI less debt service) / equity", "pct"),
    line("DSCR", dscr, "estimated", "NOI / annual debt service (x)", "pct"),
  ];
  if (inp.mode === "development") {
    returns.push(line("Yield on cost", yoc, "estimated", "Stabilized NOI / all-in development cost", "pct"));
  }

  const basis =
    inp.mode === "income"
      ? "Top-line rent uses live per-bed rents (HUD FMR / Census) and the live FRED mortgage rate. Cap rate, expenses, vacancy, and returns are modeled and labeled estimated."
      : "Financing uses the live FRED mortgage rate. Rent, cap rate, expenses, and valuation are modeled from permit units / floor area and labeled estimated.";

  return { income, valuation, returns, financing, assumptions: a, available, basis };
}
