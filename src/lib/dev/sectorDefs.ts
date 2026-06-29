import type { BpsNational } from "@/lib/dev/live/bps";
import type { BpsStateRow } from "@/lib/dev/types";

export type SectorSource = "bps" | "portal" | "program";
type TrendRow = BpsNational["trend"][number];

/**
 * How each asset class's hero graphic animates, so they don't all drift like the
 * student-housing cap. "float" is the lively student-housing-style bob+sway;
 * the others are progressively calmer: a grounded bob, a breathing pulse, a
 * gentle sway, a slow tilt, and "still" (only the sparkles twinkle).
 */
export type SectorMotion = "float" | "bob" | "pulse" | "sway" | "tilt" | "still";

export interface SectorDef {
  label: string;
  eyebrow: string;
  color: string;
  blurb: string;
  /** Hero headline: a plain lead clause + an emphasized, attention-grabbing close. */
  heroLead: string;
  heroPunch: string;
  /** Distinct motion personality for this class's hero graphic. */
  motion: SectorMotion;
  source: SectorSource;
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
export const SECTORS: Record<string, SectorDef> = {
  multifamily: {
    label: "Multifamily",
    eyebrow: "Residential · 5+ units",
    color: "#3a6ea5",
    blurb: "Apartment and condo buildings of five or more units, the most cyclical and metro-concentrated slice of the pipeline.",
    heroLead: "Track where America's apartments are",
    heroPunch: "actually getting built.",
    motion: "float",
    source: "bps",
    pick: (r) => r.units5,
    trend: (t) => t.units5,
    about: [
      "The Census Building Permits Survey counts every privately-owned housing unit authorized for construction. “Multifamily” here is the 5-or-more-units-in-structure category: apartment and condominium buildings.",
      "It is the most cyclical part of the housing pipeline. Large projects cluster in a handful of high-growth metros and swing sharply with financing costs and rent expectations.",
    ],
  },
  "single-townhome": {
    label: "Single-family & Townhome",
    eyebrow: "Residential · 1–4 units",
    color: "#3aa6a0",
    blurb: "Detached one-unit homes plus duplex-to-fourplex “missing middle” infill: the 1-to-4-unit, lower-density slice of the residential pipeline.",
    heroLead: "See where the next neighborhoods",
    heroPunch: "break ground.",
    motion: "bob",
    source: "bps",
    pick: (r) => r.units1 + r.units2 + r.units34,
    trend: (t) => t.totalUnits - t.units5,
    about: [
      "Combines two Building Permits Survey categories: 1-unit homes (the largest slice of the national pipeline by unit count) and the 2-to-4-unit “missing middle” of duplexes, triplexes, and fourplexes.",
      "Together they cover the lower-density, predominantly for-sale and small-infill side of residential development, which tracks household formation and concentrates in Sun Belt and suburban growth markets.",
      "Many cities are loosening single-family zoning specifically to encourage more of the 2-to-4-unit format, so this combined view captures where that lower-density supply is actually being authorized.",
    ],
  },
  industrial: {
    label: "Industrial",
    eyebrow: "Commercial",
    color: "#7a5c8f",
    blurb: "Warehouse, logistics, and manufacturing space, tracked per-permit in city portals, not in the national residential survey.",
    heroLead: "Follow the warehouses",
    heroPunch: "reshaping the supply chain.",
    motion: "still",
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
    heroLead: "See which office markets are",
    heroPunch: "coming back to life.",
    motion: "pulse",
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
    heroLead: "Find the retail corridors that",
    heroPunch: "still draw a crowd.",
    motion: "sway",
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
    heroLead: "Trace where America builds",
    heroPunch: "housing people can afford.",
    motion: "tilt",
    source: "program",
    about: [
      "Affordable housing is a financing and regulatory designation (Low-Income Housing Tax Credits, HUD programs, and inclusionary-zoning requirements), not a building structure type. It is therefore not a separate line in the Building Permits Survey.",
      "Structurally, most newly-built affordable housing is multifamily, so multifamily permit volume is the closest live proxy. Income-restriction detail lives in HUD and state housing-finance-agency datasets.",
    ],
  },
};

/** Distinct icon (SVG path) per workspace, shared by the sidebar nav and the
 *  home launcher so every asset class reads at a glance. Drawn on a 24x24 grid,
 *  stroked (fill="none"). */
export const STUDENT_HOUSING_ICON =
  "M12 5 2 10l10 5 10-5-10-5ZM6 12v4.4c0 1.5 2.7 2.5 6 2.5s6-1 6-2.5V12M22 10v6.5M21 17.5a1 1 0 1 0 2 0 1 1 0 1 0 -2 0";

export const SECTOR_ICON: Record<string, string> = {
  // Apartment block with a window grid + annex.
  multifamily: "M3 21h18M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M14 9h5a1 1 0 0 1 1 1v11M7 7h2M11 7h2M7 11h2M11 11h2M7 15h2M11 15h2",
  // Sawtooth factory roof with a chimney.
  industrial: "M2 21h20M4 21V13l4 2v-2l4 2v-2l4 2v6M16 21V7h4v14",
  // Tall office tower, dense window grid.
  office: "M3 21h18M5 21V3h14v18M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M9 18h2M13 18h2",
  // Storefront with a sloping awning and a door.
  retail: "M3 11h18M5 21V11h14v10M3 11l2-4h14l2 4M10 21v-5h4v5",
  // Two pitched-roof townhomes side by side.
  "single-townhome": "M2 21h20M3 21V12l4-3 4 3v9M11 21V12l4-3 4 3v9M6 21v-4h2v4M14 21v-4h2v4",
  // House sheltering a heart.
  affordable: "M3 12l9-7 9 7M5 10v11h14V10M12 18.5c2.1-1.5 3-2.6 3-3.9a1.6 1.6 0 0 0-3-.8 1.6 1.6 0 0 0-3 .8c0 1.3.9 2.4 3 3.9Z",
};

/** The asset classes, in display order, for the global tab bar. */
export const SECTOR_ORDER = [
  "multifamily",
  "industrial",
  "office",
  "retail",
  "single-townhome",
  "affordable",
] as const;

export type SectorSubPage = { slug: string; name: string };

/**
 * Hybrid sub-navigation per asset class. Every class has an Overview and a
 * live "Players & news" feed. Residential classes (backed by the Building
 * Permits Survey) also get a Leaderboards page; commercial and program classes
 * have no national unit counts to rank, so they skip it rather than show an
 * empty page.
 */
export function sectorSubnav(sector: string): SectorSubPage[] {
  const def = SECTORS[sector];
  const pages: SectorSubPage[] = [{ slug: "", name: "Overview" }];
  if (def?.source === "bps") pages.push({ slug: "leaderboards", name: "Leaderboards" });
  pages.push({ slug: "players", name: "Players & news" });
  return pages;
}
