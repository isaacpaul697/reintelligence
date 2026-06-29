import { Spinner } from "@/components/dev/ui";

/**
 * Shown instantly while an area search sweeps OpenStreetMap, so submitting a
 * search no longer leaves the page frozen with no feedback.
 */
export default function Loading() {
  return (
    <div className="flex flex-col gap-7">
      <section>
        <span className="text-xs text-muted">← National overview</span>
        <div className="mt-2 h-9 w-64 rounded-[8px] bg-surface-2 animate-pulse" />
        <div className="mt-2 h-4 w-[22rem] max-w-full rounded bg-surface-2 animate-pulse" />
      </section>
      <Spinner label="Sweeping OpenStreetMap for developments…" />
    </div>
  );
}
