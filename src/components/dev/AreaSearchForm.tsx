"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side area search. Uses a transition so the Search button shows an
 * inline spinner the moment it's submitted (instead of the page freezing), and
 * navigates client-side so the route-level loading screen takes over.
 */
export function AreaSearchForm() {
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    startTransition(() => router.push(`/area?q=${encodeURIComponent(term)}`));
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 w-full max-w-[420px]">
      <div className="flex items-center gap-2 bg-surface-2 border border-line rounded-[var(--radius-card)] px-3 py-2 shadow-[var(--shadow)] focus-within:border-line-strong transition-colors">
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" className="text-muted-2 shrink-0">
          <circle cx={11} cy={11} r={7} /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          disabled={pending}
          placeholder="e.g. Boise, ID or Ann Arbor"
          aria-label="Search for a city or area"
          className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted-2 outline-none min-w-0 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white px-3.5 py-1.5 rounded-[10px] disabled:opacity-80"
          style={{ background: "linear-gradient(150deg, var(--gold-bright), var(--gold-deep))" }}
        >
          {pending && (
            <span
              role="status"
              aria-label="Searching"
              className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
            />
          )}
          {pending ? "Searching" : "Search"}
        </button>
      </div>
    </form>
  );
}
