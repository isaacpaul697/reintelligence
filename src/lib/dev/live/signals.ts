import type { Article } from "@/lib/types";
import type { Filing } from "./edgar";
import { fetchFilings } from "./edgar";
import { fetchNews } from "@/lib/live/news";
import type { SectorCompany } from "../sectors";

/**
 * A unified live "signal" stream. Every signal is a real, dated, linkable event
 * pulled live from an external source, never modeled or fabricated:
 *   - "news"   : a headline from Google News RSS
 *   - "filing" : a material SEC filing (8-K, 10-Q, offering, etc.) from EDGAR
 * Signals are merged across sources and sorted newest-first so a page can show
 * a single "what just happened" feed for a market or asset class.
 */
export type SignalKind = "news" | "filing";

export interface Signal {
  kind: SignalKind;
  title: string;
  /** Short attribution line: a publication, or "TICKER · FORM" for filings. */
  source: string;
  date: string; // ISO yyyy-mm-dd or full ISO timestamp
  url: string;
  /** SEC form code, surfaced as a small badge on filing rows. */
  badge?: string;
}

/** Turn live Google News articles into feed signals. */
export function newsSignals(articles: Article[]): Signal[] {
  return articles
    .filter((a) => a.title && a.link)
    .map((a) => ({
      kind: "news" as const,
      title: a.title,
      source: a.source || "Google News",
      date: a.published,
      url: a.link,
    }));
}

/** Turn live EDGAR filings (grouped by company) into feed signals. */
export function filingSignals(
  rows: { company: Pick<SectorCompany, "name" | "ticker">; filings: Filing[] }[],
): Signal[] {
  const out: Signal[] = [];
  for (const r of rows) {
    for (const f of r.filings) {
      out.push({
        kind: "filing",
        title: `${r.company.name}: ${f.label}`,
        source: `${r.company.ticker} · ${f.form}`,
        date: f.date,
        url: f.url,
        badge: f.form,
      });
    }
  }
  return out;
}

/** Merge any number of signal groups and sort them newest-first. */
export function mergeSignals(...groups: Signal[][]): Signal[] {
  return groups
    .flat()
    .filter((s) => s.date && s.title && s.url)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * Bellwether public operators spanning the major asset classes. Their live SEC
 * filings give the national feed real, cross-sector corporate activity.
 */
const NATIONAL_BELLWETHERS: Pick<SectorCompany, "name" | "ticker" | "cik">[] = [
  { name: "D.R. Horton", ticker: "DHI", cik: 882184 },
  { name: "AvalonBay Communities", ticker: "AVB", cik: 915912 },
  { name: "Prologis", ticker: "PLD", cik: 1045609 },
  { name: "Simon Property Group", ticker: "SPG", cik: 1063761 },
  { name: "BXP", ticker: "BXP", cik: 1037540 },
  { name: "Equity Residential", ticker: "EQR", cik: 906107 },
];

const NATIONAL_NEWS_QUERY =
  'US real estate (apartment OR housing OR warehouse OR office OR retail) ' +
  '(development OR construction OR "building permit" OR groundbreaking OR earnings)';

/**
 * The national, cross-sector live feed: broad U.S. real-estate development
 * headlines merged with bellwether SEC filings, newest-first.
 */
export async function fetchNationalSignals(limit = 14): Promise<Signal[]> {
  const [articles, filingGroups] = await Promise.all([
    fetchNews(NATIONAL_NEWS_QUERY, 10),
    Promise.all(
      NATIONAL_BELLWETHERS.map(async (c) => ({ company: c, filings: await fetchFilings(c.cik, 2) })),
    ),
  ]);
  return mergeSignals(newsSignals(articles), filingSignals(filingGroups)).slice(0, limit);
}
