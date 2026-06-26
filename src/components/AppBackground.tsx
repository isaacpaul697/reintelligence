/**
 * Shared decorative page backdrop: warm gold radial washes plus a faint
 * blueprint grid that fades toward the edges. Sits behind all content
 * (pointer-events-none, fixed, -z-10) so it never interferes with the UI, and
 * is themed entirely with CSS vars so it adapts to light/dark automatically.
 */
export function AppBackground() {
  return (
    <>
      {/* warm gold radial washes, top-right & bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(820px 460px at 88% -8%, var(--gold-soft) 0%, transparent 58%), radial-gradient(720px 520px at -8% 112%, var(--gold-soft) 0%, transparent 55%)",
        }}
      />
      {/* faint blueprint grid, masked to fade out toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          opacity: 0.5,
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 80% at 50% 0%, #000 35%, transparent 82%)",
          maskImage:
            "radial-gradient(ellipse 100% 80% at 50% 0%, #000 35%, transparent 82%)",
        }}
      />
    </>
  );
}
