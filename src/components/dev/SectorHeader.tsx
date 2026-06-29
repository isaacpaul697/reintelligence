import Link from "next/link";
import { SECTORS, SECTOR_ICON } from "@/lib/dev/sectorDefs";
import { Card } from "./ui";
import { SectorHero } from "./SectorHero";

/** Hero header for every asset-class sub-page: a big attention-grabbing headline,
 *  a description, and an animated sector graphic, mirroring the student-housing
 *  landing. Sub-page navigation itself lives in the sidebar. */
export function SectorHeader({ sector }: { sector: string }) {
  const def = SECTORS[sector];
  if (!def) return null;
  const icon = SECTOR_ICON[sector] ?? "";

  return (
    <Card pad={false} className="relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(900px 360px at 88% -10%, ${def.color}24 0%, transparent 60%)` }}
      />
      <div className="relative p-7 md:p-11">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:items-center">
          <div>
            <Link href="/national" className="text-xs text-muted hover:text-ink">← National overview</Link>

            <div className="flex flex-wrap items-center gap-2 mt-3 mb-5">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-good bg-good-soft rounded-full px-3 py-1">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-good opacity-60 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-good" />
                </span>
                Live data
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-full px-3 py-1"
                style={{ background: `${def.color}1f`, color: def.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: def.color }} />
                {def.eyebrow}
              </span>
            </div>

            <h1 className="font-display text-[32px] md:text-[46px] leading-[1.06] font-semibold text-ink tracking-tight max-w-3xl">
              {def.heroLead}{" "}
              <span className="italic" style={{ color: def.color }}>{def.heroPunch}</span>
            </h1>
            <p className="text-ink-soft mt-5 text-[15px] md:text-base leading-relaxed max-w-2xl">
              {def.blurb}
            </p>
          </div>

          <div className="hidden lg:block self-center">
            <SectorHero color={def.color} icon={icon} motion={def.motion} />
          </div>
        </div>
      </div>
    </Card>
  );
}
