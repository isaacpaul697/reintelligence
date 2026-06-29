"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./LogoMark";
import { IntegrationsPanel } from "./IntegrationsPanel";
import { useMobileNav } from "./MobileNav";
import { CITIES } from "@/lib/dev/cities";

const PIN = "M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z";

type Section = "housing" | "development";
type Item = { href: string; name: string; icon: string; exact?: boolean };
type Group = { label: string; items: Item[] };

const HOUSING_GROUPS: Group[] = [
  {
    label: "Overview",
    items: [
      { href: "/student-housing", name: "Home", icon: "M3 11.5 12 4l9 7.5M5 10v10h14V10", exact: true },
      { href: "/student-housing/map", name: "Map View", icon: "M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3Zm6 0v12m6-9v12" },
    ],
  },
  {
    label: "Screening",
    items: [
      { href: "/student-housing/markets", name: "University Markets", icon: "M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" },
      { href: "/student-housing/apartments", name: "Apartments", icon: "M4 6h16M4 12h16M4 18h16" },
      { href: "/student-housing/top10", name: "Top 10 Markets", icon: "M5 19h4V9H5v10Zm6 0h4V5h-4v14Zm6 0h4v-6h-4v6Z" },
      { href: "/student-housing/top-apartments", name: "Top 10 Apartments", icon: "M3 21h18M9 21V9h6v12M6 21V12h3v9m6 0V12h3v9" },
    ],
  },
  {
    label: "Diligence",
    items: [
      { href: "/student-housing/scorecard", name: "Acquisition Scorecard", icon: "M7 3h10l3 4v14H4V7l3-4Zm1 9 2.5 2.5L16 9" },
      { href: "/student-housing/notes", name: "Diligence Notes", icon: "M5 3h11l3 3v15H5V3Zm3 6h8M8 13h8M8 17h5" },
      { href: "/student-housing/watchlist", name: "Saved Apartments", icon: "M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" },
    ],
  },
  {
    label: "Project",
    items: [
      { href: "/student-housing/about", name: "About / Methodology", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" },
      { href: "/student-housing/settings", name: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.8l2-1.5-2-3.4-2.3 1a8 8 0 0 0-3-1.7L14 1h-4l-.5 2.3a8 8 0 0 0-3 1.7l-2.3-1-2 3.4 2 1.5A8 8 0 0 0 4 12c0 .6 0 1.2.2 1.8l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 3 1.7L10 23h4l.5-2.3a8 8 0 0 0 3-1.7l2.3 1 2-3.4-2-1.5c.2-.6.2-1.2.2-1.8Z" },
    ],
  },
];

const DEV_GROUPS: Group[] = [
  {
    label: "Tools",
    items: [
      { href: "/development", name: "National Overview & Map", icon: "M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3Zm6 0v12m6-9v12", exact: true },
      { href: "/development/area", name: "Area Search", icon: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3" },
    ],
  },
  {
    label: "Live permit cities",
    items: CITIES.filter((c) => c.socrata).map((c) => ({
      href: `/development/city/${c.id}`,
      name: `${c.name}, ${c.state}`,
      icon: PIN,
    })),
  },
  {
    label: "Reference",
    items: [
      { href: "/development/methodology", name: "Methodology", icon: "M5 3h11l3 3v15H5V3Zm3 6h8M8 13h8M8 17h5" },
    ],
  },
];

/** Top-level workspaces. Student housing is its own fully-live world; each
 *  development asset class is its own specialized tab. */
type Tab = { href: string; label: string; match: (p: string) => boolean };
const HOUSING_TAB: Tab = {
  href: "/student-housing",
  label: "Student Housing",
  match: (p) => p.startsWith("/student-housing"),
};
/** Development home: the national overview + permit map. */
const DEV_HOME_TAB: Tab = {
  href: "/development",
  label: "Development",
  match: (p) => p === "/development",
};
const SECTOR_TABS: Tab[] = [
  { href: "/development/sector/multifamily", label: "Multifamily", match: (p) => p.startsWith("/development/sector/multifamily") },
  { href: "/development/sector/single-townhome", label: "Single / Townhome", match: (p) => p.startsWith("/development/sector/single-townhome") },
  { href: "/development/sector/industrial", label: "Industrial", match: (p) => p.startsWith("/development/sector/industrial") },
  { href: "/development/sector/office", label: "Office", match: (p) => p.startsWith("/development/sector/office") },
  { href: "/development/sector/retail", label: "Retail", match: (p) => p.startsWith("/development/sector/retail") },
  { href: "/development/sector/affordable", label: "Affordable", match: (p) => p.startsWith("/development/sector/affordable") },
];

/** Logo + section switcher + nav links + integrations. Shared by the desktop
 *  rail and the mobile drawer. */
function SidebarContent({ section, onNavigate }: { section: Section; onNavigate?: () => void }) {
  const path = usePathname();
  const groups = section === "housing" ? HOUSING_GROUPS : DEV_GROUPS;
  const subtitle = section === "housing" ? "Student Housing Acquisitions IQ" : "Development Intelligence";
  const isActive = (it: Item) => path === it.href || (!it.exact && path.startsWith(it.href + "/"));
  const sectorActive = SECTOR_TABS.some((t) => t.match(path));
  // The two top-level worlds. "Development" lands on the national overview/map;
  // it stays highlighted everywhere in development except inside an asset class.
  const housingActive = section === "housing";
  const devHomeActive = section === "development" && !sectorActive;

  return (
    <>
      <div className="px-5 pt-6 pb-4">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
          <LogoMark size={40} />
          <div>
            <div className="font-display text-[16px] font-semibold text-ink leading-none tracking-tight">Real Estate Intelligence</div>
            <div className="text-[11px] mt-1 text-muted">{subtitle}</div>
          </div>
        </Link>
      </div>

      <div className="px-3 pb-3">
        <div className="p-1 rounded-[10px] bg-surface-2 border border-line flex flex-col gap-1">
          {/* The two top-level worlds */}
          <div className="grid grid-cols-2 gap-1">
            <Link href={HOUSING_TAB.href} onClick={onNavigate}
              className={`text-center text-[12px] font-semibold py-1.5 px-1 rounded-[7px] transition-colors ${
                housingActive ? "bg-surface text-ink shadow-[var(--shadow)]" : "text-muted hover:text-ink"
              }`}>
              {HOUSING_TAB.label}
            </Link>
            <Link href={DEV_HOME_TAB.href} onClick={onNavigate}
              className={`text-center text-[12px] font-semibold py-1.5 px-1 rounded-[7px] transition-colors ${
                devHomeActive ? "bg-surface text-ink shadow-[var(--shadow)]" : "text-muted hover:text-ink"
              }`}>
              {DEV_HOME_TAB.label}
            </Link>
          </div>
          {/* Development asset classes, each its own specialized tab */}
          <div className="text-[9.5px] uppercase tracking-[1.2px] font-semibold text-muted-2 px-1.5 pt-1">
            Asset classes
          </div>
          <div className="grid grid-cols-2 gap-1">
            {SECTOR_TABS.map((t) => {
              const active = t.match(path);
              return (
                <Link key={t.href} href={t.href} onClick={onNavigate}
                  className={`text-center text-[11.5px] font-semibold py-1.5 px-1 rounded-[7px] transition-colors ${
                    active ? "bg-surface text-ink shadow-[var(--shadow)]" : "text-muted hover:text-ink"
                  }`}>
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto nav-scroll px-3 py-2">
        {groups.map((g) => (
          <div key={g.label} className="mb-5">
            <div className="text-[10px] uppercase tracking-[1.4px] font-semibold px-3 pb-2 text-muted-2">
              {g.label}
            </div>
            {g.items.map((it) => {
              const active = isActive(it);
              return (
                <Link key={it.href} href={it.href} onClick={onNavigate}
                  className={`relative flex items-center gap-3 px-3 py-2 mb-0.5 rounded-[10px] text-[13.5px] transition-colors ${
                    active
                      ? "bg-gold-soft text-ink font-semibold"
                      : "text-ink-soft hover:bg-surface-2 font-medium"
                  }`}>
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{ background: "var(--gold)" }} />
                  )}
                  <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.7}
                    strokeLinecap="round" strokeLinejoin="round"
                    style={active ? { color: "var(--gold)" } : { opacity: 0.7 }}>
                    <path d={it.icon} />
                  </svg>
                  {it.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {section === "housing" && (
        <div className="px-3 pt-3 pb-4 border-t border-line">
          <IntegrationsPanel />
        </div>
      )}
    </>
  );
}

export function Sidebar({ section }: { section: Section }) {
  const { open, setOpen } = useMobileNav();

  return (
    <>
      {/* Desktop rail */}
      <aside className="no-print hidden lg:flex w-[248px] shrink-0 sticky top-0 h-screen flex-col bg-surface border-r border-line">
        <SidebarContent section={section} />
      </aside>

      {/* Mobile drawer + backdrop */}
      <div className={`no-print lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-[1100] bg-black/40 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`fixed top-0 left-0 z-[1110] w-[280px] max-w-[85vw] h-full flex flex-col bg-surface border-r border-line shadow-[var(--shadow-lg)] transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent section={section} onNavigate={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}
