"use client";

/**
 * Real Estate Intelligence master mark. A rising skyline that doubles as a
 * data chart (real estate + analytics), with a trend line tracing the
 * tower tops. Clean white on the gold gradient tile.
 */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-grid place-items-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: "linear-gradient(150deg, var(--gold-bright), var(--gold-deep))",
        boxShadow: "0 1px 3px rgba(0,0,0,.12)",
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width={size * 0.62}
        height={size * 0.62}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Skyline / bar-chart towers, increasing in height (centered in viewBox) */}
        <rect x="6" y="17" width="5" height="8" rx="1" fill="white" fillOpacity={0.78} />
        <rect x="13.5" y="13" width="5" height="12" rx="1" fill="white" fillOpacity={0.9} />
        <rect x="21" y="9" width="5" height="16" rx="1" fill="white" />
        {/* Window slits, so the bars also read as buildings */}
        <rect x="7.6" y="19.5" width="1.8" height="1.4" rx="0.4" fill="var(--gold-deep)" fillOpacity={0.55} />
        <rect x="15.1" y="15.5" width="1.8" height="1.4" rx="0.4" fill="var(--gold-deep)" fillOpacity={0.55} />
        <rect x="22.6" y="11.5" width="1.8" height="1.4" rx="0.4" fill="var(--gold-deep)" fillOpacity={0.55} />
        {/* Rising trend line tracing the tower tops, with end node */}
        <path d="M6 16.5 13.5 12 23.5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23.5" cy="8" r="1.7" fill="white" />
      </svg>
    </span>
  );
}
