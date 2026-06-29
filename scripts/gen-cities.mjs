// One-off generator: builds src/lib/dev/cities.ts from the GeoNames cities1000
// dataset. Keeps the 7 hand-configured Socrata cities verbatim, then appends the
// top-N most-populous places per state (min 20) with accurate centroids so each
// gets a real OSM-backed map. Run: node scripts/gen-cities.mjs
import fs from "node:fs";

const SRC = "/tmp/cities1000.txt";
const OUT = decodeURIComponent(new URL("../src/lib/dev/cities.ts", import.meta.url).pathname);
const PER_STATE = 20;

// Socrata cities are configured by hand (portal domain + dataset). The
// generator must not duplicate or re-id these.
const SOCRATA = [
  { id: "austin", name: "Austin", state: "TX", lat: 30.2672, lng: -97.7431, zoom: 11, socrata: { domain: "data.austintexas.gov", dataset: "3syk-w9eu" } },
  { id: "chicago", name: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298, zoom: 11, socrata: { domain: "data.cityofchicago.org", dataset: "ydr8-5enu" } },
  { id: "nyc", name: "New York City", state: "NY", lat: 40.7128, lng: -74.006, zoom: 11, socrata: { domain: "data.cityofnewyork.us", dataset: "rbx6-tga4" } },
  { id: "seattle", name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, zoom: 11, socrata: { domain: "data.seattle.gov", dataset: "76t5-zqzr" } },
  { id: "sf", name: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, zoom: 12, socrata: { domain: "data.sfgov.org", dataset: "i98e-djp9" } },
  { id: "la", name: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437, zoom: 11, socrata: { domain: "data.lacity.org", dataset: "pi9x-tg5x" } },
  { id: "neworleans", name: "New Orleans", state: "LA", lat: 29.9511, lng: -90.0715, zoom: 12, socrata: { domain: "data.nola.gov", dataset: "nbcf-m6c2" } },
];

const ALLOWED = new Set(["PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLA5", "PPLC", "PPLG"]);
// (state|name) of Socrata cities so we never generate a duplicate of them.
const SKIP = new Set([
  "TX|Austin", "IL|Chicago", "NY|New York City", "NY|New York",
  "WA|Seattle", "CA|San Francisco", "CA|Los Angeles", "LA|New Orleans",
]);
const STATES = new Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "));

function slug(name) {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "");
}

// Parse + group by state, dedupe by name keeping the most populous entry.
const byState = new Map();
for (const line of fs.readFileSync(SRC, "utf8").split("\n")) {
  const c = line.split("\t");
  if (c[8] !== "US") continue;
  const fcode = c[7];
  if (c[6] !== "P" || !ALLOWED.has(fcode)) continue;
  const state = c[10];
  if (!STATES.has(state)) continue;
  const name = c[1];
  if (SKIP.has(`${state}|${name}`)) continue;
  const lat = parseFloat(c[4]);
  const lng = parseFloat(c[5]);
  const pop = parseInt(c[14], 10) || 0;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
  if (!byState.has(state)) byState.set(state, new Map());
  const m = byState.get(state);
  const prev = m.get(name);
  if (!prev || pop > prev.pop) m.set(name, { name, state, lat, lng, pop });
}

// Top-N per state by population, then flatten sorted by population desc so the
// flagshipCity() lookup (first match per state) resolves to the biggest metro.
const reserved = new Set(SOCRATA.map((c) => c.id));
const generated = [];
for (const state of [...byState.keys()].sort()) {
  const top = [...byState.get(state).values()].sort((a, b) => b.pop - a.pop).slice(0, PER_STATE);
  for (const c of top) generated.push(c);
}
generated.sort((a, b) => b.pop - a.pop);

const used = new Set(reserved);
for (const c of generated) {
  let id = slug(c.name);
  if (used.has(id)) id = `${id}${c.state.toLowerCase()}`;
  while (used.has(id)) id = `${id}x`;
  used.add(id);
  c.id = id;
  c.zoom = c.pop >= 250000 ? 11 : 12;
}

const counts = {};
for (const c of generated) counts[c.state] = (counts[c.state] || 0) + 1;
for (const c of SOCRATA) counts[c.state] = (counts[c.state] || 0) + 1;
const low = Object.entries(counts).filter(([, n]) => n < 20).sort((a, b) => a[1] - b[1]);
console.error("states under 20:", low.length ? low : "none");
console.error("total generated:", generated.length, "+ socrata", SOCRATA.length);

function entry(c) {
  const soc = c.socrata ? `, socrata: { domain: "${c.socrata.domain}", dataset: "${c.socrata.dataset}" }` : "";
  return `  { id: ${JSON.stringify(c.id)}, name: ${JSON.stringify(c.name)}, state: ${JSON.stringify(c.state)}, lat: ${c.lat}, lng: ${c.lng}, zoom: ${c.zoom}${soc} },`;
}

const header = `import type { CityConfig } from "./types";

/**
 * City registry. The first ${SOCRATA.length} cities expose live open-data permit portals
 * (verified over the Socrata SODA API). Every other entry is the most-populous
 * incorporated places per state (at least 20 each), sourced from the GeoNames
 * cities1000 dataset; these are mapped from OpenStreetMap building footprints with
 * modeled economics. Generated by scripts/gen-cities.mjs; edit that, not this file.
 */
export const CITIES: CityConfig[] = [
  // ---- Live permit portals (Socrata) ----
${SOCRATA.map(entry).join("\n")}

  // ---- OSM-mapped: top ${PER_STATE}+ cities per state by population (GeoNames) ----
${generated.map(entry).join("\n")}
];

export function getCity(id: string): CityConfig | undefined {
  return CITIES.find((c) => c.id === id);
}

/**
 * The primary tracked metro for a state. CITIES lists live-portal cities first,
 * then every other city ordered by population, so the first match for a state is
 * its flagship metro, used as the map entry point for state-level rankings.
 */
export function flagshipCity(state: string): CityConfig | undefined {
  return CITIES.find((c) => c.state === state);
}
`;

fs.writeFileSync(OUT, header);
console.error("wrote", OUT);
