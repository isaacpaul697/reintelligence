import { notFound } from "next/navigation";
import { Card, SectionTitle, StateBlock } from "@/components/dev/ui";
import { MarketLeaderboard } from "@/components/dev/MarketLeaderboard";
import { SectorHeader } from "@/components/dev/SectorHeader";
import { SECTORS } from "@/lib/dev/sectorDefs";
import { loadSectorBps } from "@/lib/dev/sectorData";

export const revalidate = 43200;

export function generateStaticParams() {
  return Object.entries(SECTORS)
    .filter(([, def]) => def.source === "bps")
    .map(([sector]) => ({ sector }));
}

export default async function SectorLeaderboardsPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const def = SECTORS[sector];
  // Only residential, BPS-backed classes have national unit counts to rank.
  if (!def || def.source !== "bps") notFound();

  const { available, view } = await loadSectorBps(sector);
  if (!available || !view) {
    return (
      <div className="flex flex-col gap-7">
        <SectorHeader sector={sector} />
        <StateBlock
          title="Census Building Permits Survey is unavailable right now"
          note="The national feed didn't respond. No placeholder data is shown. Try again shortly."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <SectorHeader sector={sector} />

      <section className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle sub={`${view.year} · top states by ${def.label.toLowerCase()} units authorized · open a market for its city map`}>
            Highest recent development
          </SectionTitle>
          <MarketLeaderboard rows={view.volumeRows} />
        </Card>
        <Card>
          {view.momentumRows.length > 0 ? (
            <>
              <SectionTitle sub={`Fastest year-over-year growth in ${def.label.toLowerCase()} permits${view.prevYear ? `, ${view.prevYear}→${view.year}` : ""} · markets to watch`}>
                Where to develop next
              </SectionTitle>
              <MarketLeaderboard rows={view.momentumRows} />
            </>
          ) : (
            <>
              <SectionTitle sub="Year-over-year comparison">Where to develop next</SectionTitle>
              <div className="text-[13px] text-muted leading-relaxed">
                A prior-year Building Permits Survey file isn&apos;t available yet, so growth rankings can&apos;t be computed without estimating. They&apos;ll appear once the comparison year publishes.
              </div>
            </>
          )}
        </Card>
      </section>
    </div>
  );
}
