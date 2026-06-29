"use client";

import { useMemo, useState } from "react";
import {
  autoAssumptions,
  underwrite,
  type UwAssumptions,
  type UwInputs,
  type UwLine,
  type UwResult,
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

/** Find the value of a result line by its label (for the at-a-glance chart). */
function lineValue(lines: UwLine[], label: string): number | null {
  return lines.find((l) => l.label === label)?.value ?? null;
}

/** Compact ranked-bar chart of the model's headline dollar figures. */
function MoneyBars({ items }: { items: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...items.map((i) => Math.abs(i.value)));
  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="text-[11px] text-ink-soft w-28 shrink-0 truncate">{it.label}</span>
          <div className="flex-1 h-2.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max(3, (Math.abs(it.value) / max) * 100)}%`, background: it.color }}
            />
          </div>
          <span className="num text-[11px] text-ink w-14 text-right shrink-0">{fmtUSD(it.value)}</span>
        </div>
      ))}
    </div>
  );
}

/** Escape a CSV field, quoting when it contains a comma, quote, or newline. */
function csvField(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a flat pro-forma spreadsheet (CSV, opens in Excel) from the result. */
function buildCsv(result: UwResult, title: string): string {
  const a = result.assumptions;
  const rows: string[][] = [[title], [], ["Assumptions", "Value"]];
  rows.push(["Cap rate (%)", String(a.capRatePct)]);
  rows.push(["Expense ratio (%)", String(a.expenseRatioPct)]);
  rows.push(["Vacancy (%)", String(a.vacancyPct)]);
  rows.push(["Loan-to-value (%)", String(a.ltvPct)]);
  rows.push(["Purchase price ($)", String(Math.round(a.purchasePrice))]);

  const section = (heading: string, lines: UwLine[]) => {
    rows.push([], [heading, "Value", "Basis"]);
    for (const l of lines) {
      const val = l.value == null ? "n/a" : l.unit === "pct" ? l.value.toFixed(2) : String(Math.round(l.value));
      rows.push([l.label, val, l.note ?? ""]);
    }
  };
  section("Income statement (annual)", result.income);
  section("Valuation", result.valuation);
  section("Return metrics", result.returns);
  section("Financing", result.financing);
  rows.push([], ["Basis", result.basis]);

  return rows.map((r) => r.map(csvField).join(",")).join("\n");
}

/** Download the pro-forma CSV in the browser (dependency-free). */
function downloadCsv(result: UwResult, title: string) {
  const csv = buildCsv(result, title);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-proforma.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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

  // Headline dollar figures for the at-a-glance bar chart.
  const chartItems = [
    { label: "Estimated value", value: lineValue(result.valuation, "Estimated value"), color: "var(--gold)" },
    { label: "All-in cost", value: lineValue(result.valuation, "All-in development cost"), color: "#b5552c" },
    { label: "Loan", value: lineValue(result.financing, "Loan amount"), color: "var(--chart-1)" },
    { label: "Equity", value: lineValue(result.financing, "Equity required"), color: "var(--chart-3)" },
    { label: "NOI", value: lineValue(result.income, "Net operating income"), color: "#3f7a4f" },
  ].filter((x): x is { label: string; value: number; color: string } => x.value != null && x.value !== 0);

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
        <div className="flex flex-col items-end gap-2">
          <ProvenanceTag p="estimated" />
          <button
            onClick={() => downloadCsv(result, title)}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold-deep hover:text-ink px-2.5 py-1 rounded-full bg-gold-soft hover:bg-gold/30 transition-colors"
          >
            <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12M8 11l4 4 4-4M5 21h14" />
            </svg>
            Export to Excel
          </button>
        </div>
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

      {/* Deal at a glance */}
      {chartItems.length > 0 && (
        <div className="border-t border-line pt-2.5">
          <div className="text-[10px] uppercase tracking-wide text-muted-2 font-semibold mb-2">
            Deal at a glance
          </div>
          <MoneyBars items={chartItems} />
        </div>
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
