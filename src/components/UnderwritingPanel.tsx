"use client";

import { useMemo, useState } from "react";
import {
  autoAssumptions,
  underwrite,
  type UwAssumptions,
  type UwInputs,
  type UwLine,
} from "@/lib/underwriting";
import { ProvenanceTag } from "./ui";

function fmtUSD(n: number | null): string {
  if (n == null) return "n/a";
  const neg = n < 0;
  const v = Math.abs(n);
  let s: string;
  if (v >= 1_000_000) s = `$${(v / 1_000_000).toFixed(2)}M`;
  else if (v >= 1_000) s = `$${(v / 1_000).toFixed(0)}K`;
  else s = `$${Math.round(v).toLocaleString()}`;
  return neg ? `(${s})` : s;
}

function fmtLine(l: UwLine): string {
  if (l.value == null) return "n/a";
  if (l.unit === "pct") {
    // DSCR is a multiple, render with an x; everything else is a percent.
    if (l.label === "DSCR") return `${l.value.toFixed(2)}x`;
    return `${l.value.toFixed(2)}%`;
  }
  return fmtUSD(l.value);
}

function Lever({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center justify-between text-[11px] text-muted font-medium">
        {label}
        <span className="num text-ink font-semibold">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--gold)]"
      />
    </label>
  );
}

function LineRow({ l }: { l: UwLine }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <span
        className={`text-[13px] ${l.emphasis ? "text-ink font-semibold" : "text-ink-soft"}`}
        title={l.note}
      >
        {l.label}
      </span>
      <span
        className={`num text-[13px] tabular-nums ${
          l.emphasis ? "text-ink font-semibold" : "text-ink-soft"
        } ${l.value != null && l.value < 0 ? "text-bad" : ""}`}
      >
        {fmtLine(l)}
      </span>
    </div>
  );
}

export default function UnderwritingPanel({
  inputs,
  title = "Underwriting",
}: {
  inputs: UwInputs;
  title?: string;
}) {
  const auto = useMemo(() => autoAssumptions(inputs), [inputs]);
  const [a, setA] = useState<UwAssumptions>(auto);
  // Re-seed when the underlying property changes (auto identity changes).
  const [autoKey, setAutoKey] = useState(auto);
  if (autoKey !== auto) {
    setAutoKey(auto);
    setA(auto);
  }

  const result = useMemo(() => underwrite(inputs, a), [inputs, a]);
  const set = (patch: Partial<UwAssumptions>) => setA((prev) => ({ ...prev, ...patch }));
  const dirty = JSON.stringify(a) !== JSON.stringify(auto);

  const value = result.valuation[0];

  if (!result.available) {
    return (
      <div className="bg-surface-2 border border-line rounded-[var(--radius-card)] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] uppercase tracking-wide text-muted font-semibold">{title}</h3>
          <ProvenanceTag p="estimated" />
        </div>
        <p className="text-xs text-muted mt-2 leading-snug">
          Not enough live inputs to underwrite this property. An estimate needs either a rent
          figure or a unit / floor-area count to model income from.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-2 border border-line rounded-[var(--radius-card)] p-4 space-y-4">
      {/* Headline valuation */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[11px] uppercase tracking-wide text-muted font-semibold">{title}</h3>
          <div className="font-display text-[26px] font-semibold text-ink num leading-none mt-1">
            {fmtUSD(value?.value ?? null)}
          </div>
          <div className="text-[10px] text-muted mt-1">Estimated value</div>
        </div>
        <ProvenanceTag p="estimated" />
      </div>

      {/* Adjustable levers */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        <Lever label="Cap rate" value={a.capRatePct} min={3} max={12} step={0.05}
          suffix="%" onChange={(n) => set({ capRatePct: Math.round(n * 100) / 100 })} />
        <Lever label="Expense ratio" value={a.expenseRatioPct} min={15} max={60} step={1}
          suffix="%" onChange={(n) => set({ expenseRatioPct: n })} />
        <Lever label="Vacancy" value={a.vacancyPct} min={0} max={30} step={1}
          suffix="%" onChange={(n) => set({ vacancyPct: n })} />
        <Lever label="Loan-to-value" value={a.ltvPct} min={0} max={85} step={1}
          suffix="%" onChange={(n) => set({ ltvPct: n })} />
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-muted font-medium">Purchase price</span>
        <input
          type="number"
          value={a.purchasePrice}
          step={10000}
          onChange={(e) => set({ purchasePrice: Math.max(0, Number(e.target.value)) })}
          className="w-full bg-surface border border-line rounded-[var(--radius-card)] px-3 py-1.5 text-[13px] text-ink num focus:outline-none focus:border-gold/50"
        />
      </label>
      {dirty && (
        <button
          onClick={() => setA(auto)}
          className="text-[11px] font-semibold text-gold hover:text-gold-deep transition-colors"
        >
          Reset to auto
        </button>
      )}

      {/* Income statement */}
      <div className="border-t border-line pt-2">
        <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold mb-0.5">
          Income statement (annual)
        </div>
        {result.income.map((l) => (
          <LineRow key={l.label} l={l} />
        ))}
      </div>

      {/* Development margin / value extras */}
      {result.valuation.length > 1 && (
        <div className="border-t border-line pt-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold mb-0.5">
            Valuation vs cost
          </div>
          {result.valuation.slice(1).map((l) => (
            <LineRow key={l.label} l={l} />
          ))}
        </div>
      )}

      {/* Returns */}
      <div className="border-t border-line pt-2">
        <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold mb-0.5">
          Return metrics
        </div>
        {result.returns.map((l) => (
          <LineRow key={l.label} l={l} />
        ))}
      </div>

      {/* Financing */}
      <div className="border-t border-line pt-2">
        <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold mb-0.5 flex items-center gap-1.5">
          Financing
          <ProvenanceTag p="live" />
        </div>
        {result.financing.map((l) => (
          <LineRow key={l.label} l={l} />
        ))}
      </div>

      <p className="text-[10px] text-muted-2 leading-snug border-t border-line pt-2">{result.basis}</p>
    </div>
  );
}
