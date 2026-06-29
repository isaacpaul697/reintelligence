"use client";

import { Fragment } from "react";
import { Card, ProvenanceTag } from "@/components/ui";
import type { UwResult, UwLine } from "@/lib/underwriting";

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
    if (l.label === "DSCR") return `${l.value.toFixed(2)}x`;
    return `${l.value.toFixed(2)}%`;
  }
  return fmtUSD(l.value);
}

function lineValue(lines: UwLine[], label: string): number | null {
  return lines.find((l) => l.label === label)?.value ?? null;
}

/** Ranked-bar chart of the model's headline dollar figures. */
function ModelChart({ result }: { result: UwResult }) {
  const items = [
    { label: "Estimated value", value: lineValue(result.valuation, "Estimated value"), color: "var(--gold)" },
    { label: "All-in cost", value: lineValue(result.valuation, "All-in development cost"), color: "#b5552c" },
    { label: "Net operating income", value: lineValue(result.income, "Net operating income"), color: "#3f7a4f" },
    { label: "Loan amount", value: lineValue(result.financing, "Loan amount"), color: "var(--chart-1)" },
    { label: "Equity required", value: lineValue(result.financing, "Equity required"), color: "var(--chart-3)" },
    { label: "Annual debt service", value: lineValue(result.financing, "Annual debt service"), color: "#c2410c" },
  ].filter((x): x is { label: string; value: number; color: string } => x.value != null && x.value !== 0);

  if (!items.length) return null;
  const max = Math.max(1, ...items.map((i) => Math.abs(i.value)));
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="text-[12px] text-ink-soft w-40 shrink-0 truncate">{it.label}</span>
          <div className="flex-1 h-3 bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.max(3, (Math.abs(it.value) / max) * 100)}%`, background: it.color }} />
          </div>
          <span className="num text-[12px] text-ink w-16 text-right shrink-0">{fmtUSD(it.value)}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * A computed, Excel-style pro-forma sheet plus a model chart, rendered from a
 * committed UwResult snapshot. Used on the Underwriting Lab below the property
 * definition once the deal is computed.
 */
export function ProFormaSheet({ result, title }: { result: UwResult; title: string }) {
  const a = result.assumptions;
  const sections: { heading: string; lines: UwLine[] }[] = [
    { heading: "Income statement (annual)", lines: result.income },
    { heading: "Valuation", lines: result.valuation },
    { heading: "Return metrics", lines: result.returns },
    { heading: "Financing", lines: result.financing },
  ];
  const assumptionRows: [string, string][] = [
    ["Cap rate", `${a.capRatePct.toFixed(2)}%`],
    ["Expense ratio", `${a.expenseRatioPct}%`],
    ["Vacancy", `${a.vacancyPct}%`],
    ["Loan-to-value", `${a.ltvPct}%`],
    ["Purchase price", fmtUSD(a.purchasePrice)],
  ];

  return (
    <Card className="mt-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide font-semibold text-gold-deep">Computed model</div>
          <h3 className="font-display text-[20px] font-semibold text-ink mt-0.5">{title}</h3>
        </div>
        <ProvenanceTag p="estimated" />
      </div>

      {/* Visual graph */}
      <div className="text-[11px] uppercase tracking-wide font-semibold text-muted mb-2.5">Model at a glance</div>
      <ModelChart result={result} />

      {/* Excel-style sheet */}
      <div className="text-[11px] uppercase tracking-wide font-semibold text-muted mt-6 mb-2.5">Pro-forma sheet</div>
      <div className="overflow-x-auto border border-line rounded-[var(--radius-card)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-surface-2">
              <th className="text-left font-semibold text-muted px-3 py-2 border-b border-line">Line item</th>
              <th className="text-right font-semibold text-muted px-3 py-2 border-b border-line w-28">Amount</th>
              <th className="text-left font-semibold text-muted px-3 py-2 border-b border-line hidden sm:table-cell">Basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="bg-surface-2 text-[10px] uppercase tracking-wide font-semibold text-muted-2 px-3 py-1.5 border-b border-line">
                Assumptions
              </td>
            </tr>
            {assumptionRows.map(([k, v]) => (
              <tr key={k} className="border-b border-line">
                <td className="px-3 py-1.5 text-ink-soft">{k}</td>
                <td className="px-3 py-1.5 text-right num text-ink">{v}</td>
                <td className="px-3 py-1.5 text-[11px] text-muted-2 hidden sm:table-cell">Editable assumption</td>
              </tr>
            ))}
            {sections.map((sec) => (
              <Fragment key={sec.heading}>
                <tr>
                  <td colSpan={3} className="bg-surface-2 text-[10px] uppercase tracking-wide font-semibold text-muted-2 px-3 py-1.5 border-b border-line">
                    {sec.heading}
                  </td>
                </tr>
                {sec.lines.map((l) => (
                  <tr key={l.label} className="border-b border-line last:border-0">
                    <td className={`px-3 py-1.5 ${l.emphasis ? "font-semibold text-ink" : "text-ink-soft"}`}>{l.label}</td>
                    <td className={`px-3 py-1.5 text-right num ${l.emphasis ? "font-semibold text-ink" : "text-ink-soft"} ${l.value != null && l.value < 0 ? "text-bad" : ""}`}>
                      {fmtLine(l)}
                    </td>
                    <td className="px-3 py-1.5 text-[11px] text-muted-2 hidden sm:table-cell">{l.note ?? ""}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-muted-2 leading-snug mt-3">{result.basis}</p>
    </Card>
  );
}
