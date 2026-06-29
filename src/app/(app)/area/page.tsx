import Link from "next/link";
import { redirect } from "next/navigation";
import { getAreaBundle } from "@/lib/dev/area";
import { CITIES } from "@/lib/dev/cities";
import { CityView } from "@/components/dev/CityView";
import { CityNews } from "@/components/dev/CityNews";
import { fetchNews, developmentQuery } from "@/lib/live/news";
import { StateBlock, Card } from "@/components/dev/ui";
import { AreaSearchHero } from "@/components/dev/AreaSearchHero";
import { AreaSearchForm } from "@/components/dev/AreaSearchForm";

export const revalidate = 43200;

export default async function AreaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  if (!q) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="py-12 px-6 flex flex-col items-center text-center w-full max-w-[560px]">
          <div className="w-full max-w-[420px]">
            <AreaSearchHero />
          </div>
          <h1 className="font-display text-[24px] font-semibold text-ink mt-4">Search for an area</h1>
          <p className="text-sm text-muted mt-2 max-w-md">
            Type any U.S. city or area. We sweep OpenStreetMap building footprints to map its
            developments, with modeled economics and live local news.
          </p>
          <AreaSearchForm />
        </Card>
      </div>
    );
  }

  // If the query is one of our full-portal cities, send them to the rich permit view.
  const lower = q.toLowerCase();
  const reg = CITIES.find((c) => lower.includes(c.name.toLowerCase()));
  if (reg) redirect(`/city/${reg.id}`);

  const { place, bundle } = await getAreaBundle(q);
  if (!place || !bundle) {
    return <StateBlock title={`Couldn't locate “${q}”`} note="Try a more specific city or area name." />;
  }

  const parts = place.displayName.split(",").map((s) => s.trim());
  const shortName = parts.slice(0, 2).join(", ");
  const news = await fetchNews(developmentQuery(parts[0] ?? q, parts[1] ?? ""), 8);

  return (
    <div className="flex flex-col gap-7">
      <section>
        <Link href="/national" className="text-xs text-muted hover:text-ink">← National overview</Link>
        <h1 className="font-display text-[32px] font-semibold text-ink leading-tight tracking-tight mt-1">{shortName}</h1>
        <p className="text-sm text-ink-soft mt-1">
          {bundle.ok
            ? `${bundle.developments.length.toLocaleString()} mapped developments from OpenStreetMap building data · pins color-coded by property type.`
            : place.displayName}
        </p>
        <p className="text-xs text-muted-2 mt-2 max-w-2xl">
          This area has no connected open-data permit portal, so developments are drawn from OpenStreetMap building
          footprints. Values and durations are <strong className="text-warn">modeled</strong> from footprint geometry
          and building type (badged estimated), never invented. Permit dates and developer names aren&apos;t available
          here.
        </p>
      </section>

      <CityView bundle={bundle} />

      <CityNews articles={news} city={shortName} />
    </div>
  );
}
