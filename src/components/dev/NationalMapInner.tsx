"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Layer, PathOptions, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

/** Minimal shape we read off each GeoJSON state feature (id = FIPS code). */
type GeoFeature = { id?: string | number };
import type { BpsStateRow } from "@/lib/dev/types";
import { FIPS_TO_POSTAL, STATE_NAME } from "@/lib/dev/live/bps";
import { flagshipCity } from "@/lib/dev/cities";
import { fmtNum } from "@/lib/dev/format";
import statesGeoRaw from "@/lib/dev/us-states.geo.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statesGeo = statesGeoRaw as any;

// Warm brass ramp, light → deep, matching the Fiat studio palette.
const RAMP = ["#f4ecd6", "#e8d4a2", "#d9b765", "#c89a3d", "#a37d28", "#6d5418"];

const SEG = [
  { label: "Single-family", color: "#3aa6a0", pick: (r: BpsStateRow) => r.units1 },
  { label: "2-4 unit", color: "#9a7b2e", pick: (r: BpsStateRow) => r.units2 + r.units34 },
  { label: "Multifamily", color: "#3a6ea5", pick: (r: BpsStateRow) => r.units5 },
];

// Commercial asset classes are NOT counted in the federal residential permit
// survey, so no honest state-level figure exists. We list them for context and
// point to the per-city portals that do classify them, never invented numbers.
const COMMERCIAL = [
  { label: "Industrial", color: "#7a5c8f" },
  { label: "Office", color: "#3f7a4f" },
  { label: "Retail", color: "#d9760a" },
];

export default function NationalMapInner({
  states,
  height = 460,
}: {
  states: BpsStateRow[];
  height?: number;
}) {
  const [active, setActive] = useState<BpsStateRow | null>(null);

  const byState = useMemo(() => new Map(states.map((s) => [s.state, s])), [states]);

  // Quantile breakpoints so the skewed permit distribution spreads across the
  // ramp instead of a handful of dark states and a sea of pale ones.
  const breaks = useMemo(() => {
    const vals = states.map((s) => s.totalUnits).filter((v) => v > 0).sort((a, b) => a - b);
    if (!vals.length) return [];
    return [0.16, 0.33, 0.5, 0.67, 0.84].map((q) => vals[Math.floor(q * (vals.length - 1))]);
  }, [states]);

  const colorFor = (units: number) => {
    if (units <= 0) return "#ece6d8";
    let i = 0;
    while (i < breaks.length && units > breaks[i]) i++;
    return RAMP[Math.min(i, RAMP.length - 1)];
  };

  const rowFor = (f?: GeoFeature): BpsStateRow | undefined => {
    if (!f) return undefined;
    const postal = FIPS_TO_POSTAL[String(f.id)];
    return postal ? byState.get(postal) : undefined;
  };

  const styleFor = (f?: GeoFeature): PathOptions => {
    const row = rowFor(f);
    return {
      fillColor: colorFor(row?.totalUnits ?? 0),
      weight: 1,
      color: "#fffefb",
      fillOpacity: row ? 0.88 : 0.4,
    };
  };

  const onEach = (f: GeoFeature, layer: Layer) => {
    const row = rowFor(f);
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const t = e.target;
        t.setStyle({ weight: 2.5, color: "#6d5418", fillOpacity: 0.95 });
        t.bringToFront();
        if (row) setActive(row);
      },
      mouseout: (e: LeafletMouseEvent) => {
        e.target.setStyle(styleFor(f));
      },
      click: () => {
        const postal = FIPS_TO_POSTAL[String(f.id)];
        const city = postal ? flagshipCity(postal) : undefined;
        if (city) window.location.href = `/development/city/${city.id}`;
      },
    });
  };

  // The breakdown panel only appears while hovering a state, not on load.
  const panel = active;
  const panelCity = panel ? flagshipCity(panel.state) : undefined;
  const panelTotal = panel?.totalUnits || 1;

  return (
    <div className="relative rounded-[var(--radius-card)] overflow-hidden border border-line" style={{ height }}>
      <MapContainer
        bounds={[[24.4, -125], [49.4, -66.9]]}
        boundsOptions={{ padding: [12, 12] }}
        minZoom={3}
        maxZoom={8}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON data={statesGeo} style={(f) => styleFor(f as GeoFeature)} onEachFeature={(f, l) => onEach(f as GeoFeature, l)} />
      </MapContainer>

      {/* Live breakdown panel — updates on hover, defaults to the national leader. */}
      {panel && (
        <div className="absolute top-3 right-3 z-[500] w-[210px] bg-surface/95 backdrop-blur border border-line rounded-[var(--radius-card)] shadow-[var(--shadow-lg)] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-[15px] font-semibold text-ink leading-tight">{STATE_NAME[panel.state] ?? panel.state}</span>
            <span className="text-[10px] num text-muted-2 shrink-0">hover</span>
          </div>
          <div className="text-[18px] font-display font-semibold num text-ink mt-1">{fmtNum(panel.totalUnits)}</div>
          <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold -mt-0.5">units authorized</div>
          <div className="mt-2.5 h-2.5 rounded-full overflow-hidden flex bg-surface-2">
            {SEG.map((s) => {
              const w = (s.pick(panel) / panelTotal) * 100;
              return w > 0 ? <div key={s.label} style={{ width: `${w}%`, background: s.color }} title={`${s.label}: ${fmtNum(s.pick(panel))}`} /> : null;
            })}
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            {SEG.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: s.color }} />{s.label}
                </span>
                <span className="num text-ink-soft">{fmtNum(s.pick(panel))}</span>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-line">
            <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold">Commercial · not in this survey</div>
            <div className="mt-1 flex flex-col gap-0.5">
              {COMMERCIAL.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <span className="w-2 h-2 rounded-[2px]" style={{ background: c.color }} />{c.label}
                  </span>
                  <span className="num text-muted-2">portal only</span>
                </div>
              ))}
            </div>
          </div>

          {panelCity && (
            <a href={`/development/city/${panelCity.id}`} className="block mt-2.5 text-[11px] font-semibold text-gold-deep">
              Open {panelCity.name} map →
            </a>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[500] bg-surface/90 backdrop-blur border border-line rounded-[var(--radius-card)] px-3 py-2 shadow-[var(--shadow)]">
        <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold mb-1">Units authorized · {new Date().getUTCFullYear()}</div>
        <div className="flex items-center gap-0.5">
          {RAMP.map((c, i) => (
            <span key={c} className="w-6 h-2.5" style={{ background: c }} title={breaks[i] ? `≥ ${fmtNum(breaks[i - 1] ?? 0)}` : undefined} />
          ))}
        </div>
        <div className="flex justify-between text-[9px] num text-muted-2 mt-0.5">
          <span>fewer</span><span>more</span>
        </div>
        <div className="text-[10px] text-muted mt-1">Hover a state · click to open its map</div>
      </div>
    </div>
  );
}
