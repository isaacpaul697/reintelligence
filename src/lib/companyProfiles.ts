/**
 * Reference profiles for the major-player firms shown in "Major players & moves"
 * on both the multifamily and student-housing sides.
 *
 * These are public reference facts, the same category as our CITIES or roster
 * data: what a firm does, when it was founded, where it is based, the markets it
 * concentrates in, and well-documented milestones (IPOs, mergers, take-privates).
 * They contain no invented figures. The hard numbers a user sees in a firm's
 * drawer come from two live sources instead: reported financials pulled from the
 * SEC EDGAR XBRL company-facts API, and a company-scoped Google News feed. For
 * the one privately-held firm here (Greystar, no SEC registration) there is no
 * live financial feed, so its published headline figures are listed explicitly
 * with sources.
 */

export interface RefStat {
  label: string;
  value: string;
  sub?: string;
}

export interface RefMilestone {
  year: string;
  title: string;
  detail: string;
}

export interface RefSource {
  label: string;
  url: string;
}

export interface CompanyReference {
  /** e.g. "Public (NYSE: AVB)" or "Privately held". */
  ownership: string;
  founded?: string;
  /** Fallback headquarters; the live EDGAR profile is preferred when present. */
  headquarters?: string;
  tagline: string;
  overview: string[];
  /** Qualitative, factual bullets (markets, strategy, brands). */
  highlights: string[];
  /** Published headline figures, used when no live financials exist (private). */
  stats?: RefStat[];
  milestones?: RefMilestone[];
  sources?: RefSource[];
}

export const COMPANY_REFERENCE: Record<string, CompanyReference> = {
  // ── Multifamily REITs ──────────────────────────────────────────────
  AVB: {
    ownership: "Public (NYSE: AVB)",
    founded: "1998 (via merger)",
    headquarters: "Arlington, Virginia",
    tagline: "A blue-chip apartment REIT developing and owning upscale communities in high-barrier coastal markets.",
    overview: [
      "AvalonBay Communities was formed in 1998 through the merger of Avalon Properties and Bay Apartment Communities. It is one of the largest apartment REITs in the United States and a member of the S&P 500, focused on developing, redeveloping, acquiring, and managing apartment communities in leading metropolitan areas.",
      "Its strategy centers on high-barrier-to-entry markets where new supply is constrained, complemented by a large in-house development platform that is among the most active of any public apartment owner.",
    ],
    highlights: [
      "Concentrated in New England, the New York and New Jersey metro, the Mid-Atlantic, the Pacific Northwest, and Northern and Southern California, with newer expansion in Sun Belt markets.",
      "Builds and operates communities under the Avalon, AVA, and Eaves by Avalon brands.",
      "S&P 500 constituent and one of the industry's largest developers of new apartments.",
    ],
    milestones: [
      { year: "1998", title: "Formed via merger", detail: "Avalon Properties and Bay Apartment Communities combine to create AvalonBay Communities." },
      { year: "2007", title: "Added to the S&P 500", detail: "Recognized among the largest and most liquid US public companies." },
    ],
  },
  EQR: {
    ownership: "Public (NYSE: EQR)",
    founded: "1993 (IPO)",
    headquarters: "Chicago, Illinois",
    tagline: "One of the largest US apartment owners, focused on affluent renters in dense, high-cost coastal cities.",
    overview: [
      "Founded by Sam Zell and taken public in 1993, Equity Residential is an S&P 500 apartment REIT that acquires, develops, and manages residential communities. It was one of the first apartment REITs to reach national scale.",
      "The company targets high-density, high-cost urban and suburban submarkets with strong demand from affluent, knowledge-economy renters.",
    ],
    highlights: [
      "Core markets include Boston, New York, Washington DC, Seattle, San Francisco, and Southern California.",
      "Expansion markets add Denver, Atlanta, Dallas-Fort Worth, and Austin.",
      "Focused on well-located properties serving higher-income renters.",
    ],
    milestones: [
      { year: "1993", title: "IPO", detail: "Equity Residential goes public under Sam Zell, becoming a pioneering large-scale apartment REIT." },
    ],
  },
  MAA: {
    ownership: "Public (NYSE: MAA)",
    founded: "1994 (IPO)",
    headquarters: "Germantown, Tennessee",
    tagline: "The largest Sun Belt apartment REIT, concentrated in fast-growing Southeastern and Southwestern markets.",
    overview: [
      "Mid-America Apartment Communities (MAA) is an S&P 500 apartment REIT focused on the high-growth US Sun Belt. It owns and operates a large, geographically diversified portfolio spanning primary and secondary Southeastern and Southwestern markets.",
      "MAA scaled substantially through two transformational mergers, becoming the largest publicly-traded owner of apartments concentrated in the Sun Belt.",
    ],
    highlights: [
      "Broad Sun Belt footprint including Atlanta, Dallas, Tampa, Orlando, Charlotte, Austin, Nashville, and Raleigh.",
      "Diversified across large and mid-size markets to smooth supply and demand cycles.",
      "Heavy exposure to fast-growing university metros.",
    ],
    milestones: [
      { year: "1994", title: "IPO", detail: "Mid-America Apartment Communities lists on the NYSE." },
      { year: "2013", title: "Merges with Colonial Properties", detail: "A merger that significantly expanded the Sun Belt portfolio." },
      { year: "2016", title: "Merges with Post Properties", detail: "Adds a high-quality Sun Belt portfolio and cements MAA as the region's largest apartment REIT." },
    ],
  },
  ESS: {
    ownership: "Public (NYSE: ESS)",
    founded: "1994 (IPO)",
    headquarters: "San Mateo, California",
    tagline: "A West Coast apartment specialist concentrated in supply-constrained California and Seattle markets.",
    overview: [
      "Essex Property Trust is an S&P 500 apartment REIT that develops, redevelops, acquires, and manages apartment communities exclusively on the West Coast, where housing supply is among the most tightly constrained in the country.",
      "Its focused strategy concentrates capital in high-cost, low-supply coastal submarkets rather than diversifying nationally.",
    ],
    highlights: [
      "Markets limited to Southern California, Northern California, and the Seattle metro.",
      "Benefits from persistent housing shortages and high barriers to new construction on the West Coast.",
      "Expanded materially through its 2014 acquisition of BRE Properties.",
    ],
    milestones: [
      { year: "1994", title: "IPO", detail: "Essex Property Trust goes public with a West Coast focus." },
      { year: "2014", title: "Acquires BRE Properties", detail: "A major acquisition that deepened its California and Seattle portfolio." },
    ],
  },
  CPT: {
    ownership: "Public (NYSE: CPT)",
    founded: "1993 (IPO)",
    headquarters: "Houston, Texas",
    tagline: "A Sun Belt apartment REIT known for a resident-first culture across high-growth markets.",
    overview: [
      "Camden Property Trust owns, develops, and manages apartment communities across the US Sun Belt. Founded in 1982 and public since 1993, it is consistently recognized as one of the best places to work in the country.",
      "Camden concentrates on growth markets in the South and Southwest, pairing development with a large owned-and-managed portfolio.",
    ],
    highlights: [
      "Markets include Houston, Dallas, Austin, Atlanta, Orlando, Tampa, Charlotte, Phoenix, Southern California, and the DC metro.",
      "Long track record on Fortune's Best Companies to Work For list.",
      "Expanded through the 2005 acquisition of Summit Properties.",
    ],
    milestones: [
      { year: "1993", title: "IPO", detail: "Camden Property Trust lists on the NYSE." },
      { year: "2005", title: "Acquires Summit Properties", detail: "A merger that expanded Camden's Southeastern footprint." },
    ],
  },
  UDR: {
    ownership: "Public (NYSE: UDR)",
    founded: "1972",
    headquarters: "Highlands Ranch, Colorado",
    tagline: "A diversified national apartment REIT balancing coastal and Sun Belt markets across price points.",
    overview: [
      "UDR is an S&P 500 apartment REIT that owns, operates, acquires, and develops apartment communities nationwide. Founded in 1972 as United Dominion Realty Trust, it is one of the longest-tenured apartment REITs.",
      "Its portfolio is deliberately diversified across A and B price points and across coastal and Sun Belt regions, and it is an industry leader in operating technology.",
    ],
    highlights: [
      "Coast-to-coast footprint spanning both gateway coastal cities and Sun Belt growth markets.",
      "Pioneer of a technology-driven operating model to improve margins and the resident experience.",
      "Diversified by price point to balance growth and stability.",
    ],
    milestones: [
      { year: "1972", title: "Founded", detail: "Established as United Dominion Realty Trust, among the earliest apartment REITs." },
    ],
  },
  IRT: {
    ownership: "Public (NYSE: IRT)",
    headquarters: "Philadelphia, Pennsylvania",
    tagline: "A Sun Belt apartment REIT focused on amenitized middle-market communities in growth metros.",
    overview: [
      "Independence Realty Trust owns and operates multifamily communities across non-gateway Sun Belt and Midwest growth markets, targeting middle-market renters with a value-add renovation strategy.",
      "It roughly doubled in size through its 2021 merger with Steadfast Apartment REIT.",
    ],
    highlights: [
      "Markets include Atlanta, Dallas, Columbus, Denver, Oklahoma City, Nashville, and Raleigh.",
      "Value-add strategy renovating and repositioning communities to lift rents.",
      "Concentrated in college-town and high-growth secondary markets.",
    ],
    milestones: [
      { year: "2021", title: "Merges with Steadfast Apartment REIT", detail: "A merger that roughly doubled IRT's portfolio and scale." },
    ],
  },

  // ── Student-housing owners & institutional platforms ───────────────
  ACC: {
    ownership: "Private (acquired by Blackstone, 2022)",
    founded: "1993",
    headquarters: "Austin, Texas",
    tagline: "The pioneer of purpose-built student housing as an institutional asset class.",
    overview: [
      "American Campus Communities pioneered the purpose-built student-housing REIT model, developing, owning, and managing on- and off-campus communities, often through public-private partnerships with universities.",
      "Blackstone took the company private in 2022 in a transaction valued at roughly $12.8 billion, so its SEC filings are now historical rather than current.",
    ],
    highlights: [
      "Built a national portfolio of on-campus (ACE program) and off-campus communities at flagship universities.",
      "First student-housing company to go public as a REIT.",
      "Taken private by Blackstone in 2022 for about $12.8 billion.",
    ],
    milestones: [
      { year: "2004", title: "IPO", detail: "The first purpose-built student-housing REIT to go public." },
      { year: "2022", title: "Taken private by Blackstone", detail: "A roughly $12.8 billion take-private that moved the pioneer into private hands." },
    ],
  },
  BREIT: {
    ownership: "Non-traded REIT (Blackstone)",
    founded: "2017",
    headquarters: "New York, New York",
    tagline: "Blackstone's flagship perpetual-capital real estate vehicle and a major owner of US rental housing.",
    overview: [
      "Blackstone Real Estate Income Trust (BREIT) is a non-traded, perpetual-life REIT sponsored by Blackstone that invests across income-generating real estate, with heavy weighting toward rental housing and logistics.",
      "BREIT acquired American Campus Communities in 2022, making it one of the largest owners of US purpose-built student housing.",
    ],
    highlights: [
      "Sector-leading exposure to residential (including student housing) and industrial logistics.",
      "Acquired American Campus Communities in 2022.",
      "One of the largest real estate vehicles by net asset value.",
    ],
    milestones: [
      { year: "2017", title: "Launched", detail: "Blackstone introduces BREIT as a perpetual-capital real estate vehicle." },
      { year: "2022", title: "Acquires American Campus Communities", detail: "Adds a national student-housing portfolio." },
    ],
  },
  BX: {
    ownership: "Public (NYSE: BX)",
    founded: "1985",
    headquarters: "New York, New York",
    tagline: "The world's largest alternative-asset manager and the largest owner of commercial real estate.",
    overview: [
      "Blackstone is the world's largest alternative-asset manager, with the largest real estate platform of any investor. Its real estate business owns and operates properties across housing, logistics, hospitality, and offices, and it sponsors BREIT.",
      "Through its take-private of American Campus Communities, Blackstone became the largest institutional owner of US student housing.",
    ],
    highlights: [
      "Largest owner of US purpose-built student housing following the ACC take-private.",
      "Real estate is its largest business segment.",
      "Manages over $1 trillion in total assets across strategies.",
    ],
    milestones: [
      { year: "1985", title: "Founded", detail: "Blackstone is established as an advisory and investment firm." },
      { year: "2007", title: "IPO", detail: "Blackstone goes public on the NYSE." },
      { year: "2022", title: "ACC take-private", detail: "Acquires American Campus Communities, consolidating US student housing." },
    ],
  },
  BN: {
    ownership: "Public (NYSE / TSX: BN)",
    headquarters: "Toronto, Canada",
    tagline: "A global owner-operator of real assets with a sizable purpose-built student-accommodation platform.",
    overview: [
      "Brookfield Corporation is a leading global alternative-asset manager and owner-operator of real assets across real estate, infrastructure, renewable power, and private equity.",
      "Its real estate arm includes a substantial purpose-built student-accommodation platform, particularly across the United Kingdom and Europe.",
    ],
    highlights: [
      "Global real estate portfolio spanning offices, retail, logistics, and housing.",
      "Operates a purpose-built student-accommodation platform in the UK and Europe.",
      "Trillion-dollar-scale assets under management across the Brookfield ecosystem.",
    ],
    milestones: [
      { year: "2022", title: "Brookfield Corporation created", detail: "A reorganization establishes Brookfield Corporation (BN) alongside its asset-management arm." },
    ],
  },
  GREYSTAR: {
    ownership: "Privately held",
    founded: "1993",
    headquarters: "Charleston, South Carolina",
    tagline: "The largest apartment operator, owner, and developer in the United States, and one of the largest rental-housing platforms in the world.",
    overview: [
      "Founded in 1993 by Bob Faith and headquartered in Charleston, South Carolina, Greystar is a fully-integrated rental-housing company that develops, owns, and manages residential real estate on a global scale. Because it is privately held, it does not file with the SEC, so the figures below are published reference facts rather than a live filings feed.",
      "Greystar tops the National Multifamily Housing Council rankings as the nation's #1 apartment manager, #1 owner, and #1 developer at the same time. Its US management platform crossed one million units in early 2026, a scale no other operator has reached.",
      "Beyond conventional apartments, Greystar is one of the world's largest operators of purpose-built student housing, along with growing platforms in single-family build-to-rent, senior living, logistics, and modular construction across North America, Europe, Latin America, and Asia-Pacific.",
    ],
    highlights: [
      "#1 on the NMHC lists for owner, manager, and developer at the same time.",
      "Three integrated segments: Property Management, Investment Management, and Development & Construction.",
      "Became the largest US student-housing operator via the 2018 acquisition of Education Realty Trust for about $4.6 billion.",
      "Absorbed Wood Partners in 2024 and added ~11,000 homes via a Grand Peaks partnership in 2025.",
    ],
    stats: [
      { label: "Units under management (US)", value: "1,000,000+", sub: "#1 on the NMHC 50 manager list" },
      { label: "Apartment units owned", value: "122,545", sub: "#1 NMHC owner (2025 year-end)" },
      { label: "Real estate AUM", value: "$300B+", sub: "Assets under management globally" },
      { label: "Employees", value: "22,000+", sub: "Across ~250 markets worldwide" },
      { label: "Student beds", value: "110,000+", sub: "Purpose-built student housing globally" },
      { label: "New units started (2024)", value: "8,200+", sub: "#1 NMHC developer list" },
    ],
    milestones: [
      { year: "1993", title: "Founded", detail: "Bob Faith founds Greystar to build a fully-integrated rental-housing operator." },
      { year: "2018", title: "Acquires Education Realty Trust", detail: "A ~$4.6 billion deal adds roughly 47,100 student beds across 55 universities, making Greystar a top student-housing operator overnight." },
      { year: "2023", title: "Launches Modern Living Solutions", detail: "Stands up a modular-construction arm to industrialize apartment delivery." },
      { year: "2024", title: "Absorbs Wood Partners", detail: "Integrates a large owner-developer, fueling a leap in units under management." },
      { year: "2026", title: "Crosses 1,000,000 units", detail: "US management portfolio passes one million units, topping the NMHC owner, manager, and developer lists at once." },
    ],
    sources: [
      { label: "Greystar - Tops NMHC list with 1M units under management", url: "https://www.greystar.com/business/about-greystar/newsroom/greystar-tops-nmhc-list-with-1m-units-under-management" },
      { label: "Greystar - About Us", url: "https://www.greystar.com/business/about-greystar/about" },
      { label: "CoStar - Greystar takes over top spot as nation's largest apartment owner", url: "https://www.costar.com/article/329788865/greystar-takes-over-top-spot-from-maa-as-nations-largest-apartment-owner" },
    ],
  },

  // ── Privately held industrial developers ───────────────────────────
  "PANATTONI DEVELOPMENT": {
    ownership: "Privately held",
    founded: "1986",
    headquarters: "Newport Beach, California",
    tagline: "One of the largest privately held industrial real estate developers in the world.",
    overview: [
      "Panattoni Development Company is a privately held, full-service industrial, office, and build-to-suit developer founded by Carl Panattoni. It is consistently ranked among the largest industrial developers globally, delivering logistics and distribution space across North America and Europe.",
      "Because it is privately held, Panattoni does not file with the SEC; the figures a user would otherwise see live are unavailable, so the drawer relies on reference facts and a live news feed.",
    ],
    highlights: [
      "Develops speculative and build-to-suit logistics, distribution, and manufacturing facilities.",
      "Active across the United States, Canada, and multiple European markets.",
      "One of the most prolific privately held industrial developers by annual square footage.",
    ],
    sources: [
      { label: "Panattoni - Company website", url: "https://www.panattoni.com" },
    ],
  },
  HILLWOOD: {
    ownership: "Privately held (Perot family)",
    founded: "1988",
    headquarters: "Dallas, Texas",
    tagline: "A Perot-family industrial and mixed-use developer, master-developer of AllianceTexas.",
    overview: [
      "Hillwood, founded by Ross Perot Jr., is a privately held real estate developer and investor best known as the master-developer of AllianceTexas, one of the largest master-planned developments in the United States.",
      "Its industrial platform develops and owns logistics and distribution real estate nationally, alongside residential and mixed-use projects.",
    ],
    highlights: [
      "Master-developer of the 27,000-acre AllianceTexas development north of Fort Worth.",
      "National developer of logistics, distribution, and manufacturing facilities.",
      "Part of the Perot family's Hillwood group of companies.",
    ],
    sources: [
      { label: "Hillwood - Company website", url: "https://www.hillwood.com" },
    ],
  },
  "BRIDGE INDUSTRIAL": {
    ownership: "Privately held",
    founded: "2000",
    headquarters: "Chicago, Illinois",
    tagline: "A privately held developer and operator of infill industrial and logistics real estate.",
    overview: [
      "Bridge Industrial is a privately held, vertically integrated real estate operating company focused on the acquisition and development of industrial and logistics properties in supply-constrained, infill markets.",
      "It concentrates on major coastal and gateway metros where land for new logistics space is scarce.",
    ],
    highlights: [
      "Focused on infill industrial in high-barrier US markets and select international cities.",
      "Vertically integrated across acquisitions, development, and operations.",
      "Targets last-mile and regional distribution demand.",
    ],
    sources: [
      { label: "Bridge Industrial - Company website", url: "https://www.bridgeindustrial.com" },
    ],
  },
  "DERMODY PROPERTIES": {
    ownership: "Privately held",
    founded: "1960",
    headquarters: "Reno, Nevada",
    tagline: "A privately held national developer, acquirer, and operator of logistics real estate.",
    overview: [
      "Dermody Properties is a privately held industrial real estate investment, development, and management company that has operated for more than six decades, focused on logistics and distribution facilities.",
      "It develops and acquires modern logistics space in major distribution markets across the United States.",
    ],
    highlights: [
      "Long-tenured, family-founded national logistics developer.",
      "Develops and operates modern distribution and e-commerce fulfillment facilities.",
      "Active across major US logistics corridors.",
    ],
    sources: [
      { label: "Dermody Properties - Company website", url: "https://www.dermody.com" },
    ],
  },

  // ── Privately held homebuilder ─────────────────────────────────────
  "DAVID WEEKLEY HOMES": {
    ownership: "Privately held",
    founded: "1976",
    headquarters: "Houston, Texas",
    tagline: "The largest privately held homebuilder in the United States.",
    overview: [
      "David Weekley Homes is a privately held national homebuilder founded in Houston in 1976. It builds single-family homes across a broad range of price points and is regularly cited as the largest privately held builder in the country.",
      "The company is known for its design-focused product and its recognition as a top workplace in the homebuilding industry.",
    ],
    highlights: [
      "Builds single-family homes across many US growth markets, concentrated in the Sun Belt.",
      "Frequently ranked the largest privately held US homebuilder by closings.",
      "Repeatedly recognized as a top workplace among national builders.",
    ],
    sources: [
      { label: "David Weekley Homes - Company website", url: "https://www.davidweekleyhomes.com" },
    ],
  },

  // ── Privately held multifamily owner-operators ─────────────────────
  CORTLAND: {
    ownership: "Privately held",
    founded: "2005",
    headquarters: "Atlanta, Georgia",
    tagline: "A privately held, vertically integrated multifamily owner-operator concentrated in the Sun Belt.",
    overview: [
      "Cortland is a privately held, vertically integrated multifamily investment, development, and management firm. It acquires, renovates, builds, and operates apartment communities, handling design, construction, and property management in-house.",
      "It is one of the largest apartment owners in the United States, with a portfolio concentrated in high-growth Sun Belt markets.",
    ],
    highlights: [
      "Vertically integrated across investment, development, construction, and management.",
      "Portfolio concentrated in Sun Belt growth markets, with a global corporate footprint.",
      "Consistently ranked among the largest US apartment owners on the NMHC 50.",
    ],
    sources: [
      { label: "Cortland - Company website", url: "https://cortland.com" },
    ],
  },
  "MORGAN PROPERTIES": {
    ownership: "Privately held",
    founded: "1985",
    headquarters: "King of Prussia, Pennsylvania",
    tagline: "One of the largest privately held apartment owners in the United States.",
    overview: [
      "Morgan Properties is a privately held, family-owned apartment owner and operator founded by Mitchell Morgan. Through aggressive acquisitions it has grown into one of the largest apartment owners in the country.",
      "The company focuses on acquiring and improving suburban, workforce-oriented apartment communities, primarily across the Mid-Atlantic, Northeast, and Midwest.",
    ],
    highlights: [
      "Among the largest apartment owners in the US on the NMHC 50 owners list.",
      "Value-add strategy renovating and repositioning suburban communities.",
      "Family-owned and vertically integrated across acquisitions and management.",
    ],
    sources: [
      { label: "Morgan Properties - Company website", url: "https://www.morganproperties.com" },
    ],
  },
  "LINCOLN PROPERTY COMPANY": {
    ownership: "Privately held",
    founded: "1965",
    headquarters: "Dallas, Texas",
    tagline: "One of the largest privately held US multifamily developers and managers.",
    overview: [
      "Lincoln Property Company is a privately held real estate firm founded in 1965 that develops, manages, and invests in residential and commercial real estate. Its residential arm is one of the largest apartment managers and developers in the United States.",
      "It operates a large third-party management platform in addition to its owned and developed communities.",
    ],
    highlights: [
      "One of the largest apartment managers and developers in the country.",
      "National residential platform spanning development, management, and investment.",
      "Long operating history across US multifamily and commercial real estate.",
    ],
    sources: [
      { label: "Lincoln Property Company - Company website", url: "https://www.lincolnproperty.com" },
    ],
  },

  // ── Privately held office / diversified developers ─────────────────
  HINES: {
    ownership: "Privately held",
    founded: "1957",
    headquarters: "Houston, Texas",
    tagline: "One of the largest privately held global real estate developers, owners, and managers.",
    overview: [
      "Hines is a privately held global real estate investment, development, and management firm founded by Gerald D. Hines in 1957. It is one of the largest privately held real estate organizations in the world, active across offices, residential, industrial, and mixed-use.",
      "The firm develops and manages landmark office towers and invests on behalf of institutional partners across dozens of countries.",
    ],
    highlights: [
      "Global platform spanning offices, residential, industrial, and mixed-use assets.",
      "Developer and manager of numerous landmark office towers worldwide.",
      "Invests and operates across dozens of countries on behalf of institutions.",
    ],
    sources: [
      { label: "Hines - Company website", url: "https://www.hines.com" },
    ],
  },
  "TISHMAN SPEYER": {
    ownership: "Privately held",
    founded: "1978",
    headquarters: "New York, New York",
    tagline: "A privately held global developer and owner-operator of landmark office and mixed-use assets.",
    overview: [
      "Tishman Speyer is a privately held global real estate developer, owner, and operator founded in 1978. It is known for developing and managing landmark commercial properties, including its stewardship of Rockefeller Center.",
      "The firm operates across major gateway cities in the Americas, Europe, and Asia.",
    ],
    highlights: [
      "Owner-operator of landmark office and mixed-use assets, including Rockefeller Center.",
      "Active across gateway cities in the Americas, Europe, and Asia.",
      "Develops office, residential, and life-science space for institutional partners.",
    ],
    sources: [
      { label: "Tishman Speyer - Company website", url: "https://www.tishmanspeyer.com" },
    ],
  },

  // ── Privately held retail developer ────────────────────────────────
  EDENS: {
    ownership: "Privately held",
    founded: "1966",
    headquarters: "Washington, D.C.",
    tagline: "A privately held developer, owner, and operator of grocery-anchored retail centers.",
    overview: [
      "Edens is a privately held retail real estate company that develops, owns, and operates grocery-anchored and mixed-use shopping centers concentrated in primary markets along the East Coast and in Texas and California.",
      "It focuses on necessity-based, community-oriented retail in dense, high-growth submarkets.",
    ],
    highlights: [
      "Portfolio centered on grocery-anchored, necessity-based retail.",
      "Concentrated in primary East Coast markets plus Texas and California.",
      "Emphasis on mixed-use, community-gathering retail places.",
    ],
    sources: [
      { label: "Edens - Company website", url: "https://www.edens.com" },
    ],
  },

  // ── Privately held affordable-housing owners & developers ──────────
  "THE MICHAELS ORGANIZATION": {
    ownership: "Privately held",
    founded: "1973",
    headquarters: "Camden, New Jersey",
    tagline: "One of the largest privately held affordable and mixed-income housing owners and developers.",
    overview: [
      "The Michaels Organization is a privately held, full-service residential real estate company specializing in affordable, mixed-income, military, and student housing. It is one of the largest owners and developers of affordable housing in the United States.",
      "Its integrated platform spans development, property management, construction, and investment.",
    ],
    highlights: [
      "One of the largest US owners and developers of affordable and mixed-income housing.",
      "Active in affordable, market-rate, military, and student housing.",
      "Integrated across development, management, construction, and investment.",
    ],
    sources: [
      { label: "The Michaels Organization - Company website", url: "https://themichaelsorg.com" },
    ],
  },
  WINNCOMPANIES: {
    ownership: "Privately held",
    founded: "1971",
    headquarters: "Boston, Massachusetts",
    tagline: "The largest manager of affordable and mixed-income housing in the United States.",
    overview: [
      "WinnCompanies is a privately held real estate development and management firm founded in 1971. Its management arm, WinnResidential, is the largest manager of affordable and mixed-income apartment housing in the country.",
      "The firm also develops and preserves affordable, workforce, market-rate, and military housing across many states.",
    ],
    highlights: [
      "Largest US manager of affordable and mixed-income housing.",
      "Active in affordable, workforce, market-rate, and military housing.",
      "Develops, preserves, and manages communities across many states.",
    ],
    sources: [
      { label: "WinnCompanies - Company website", url: "https://www.winncompanies.com" },
    ],
  },
  DOMINIUM: {
    ownership: "Privately held",
    founded: "1972",
    headquarters: "Plymouth, Minnesota",
    tagline: "One of the largest privately held affordable-housing developers, owners, and managers.",
    overview: [
      "Dominium is a privately held affordable-housing developer, owner, and manager founded in 1972. It is one of the largest affordable-housing companies in the United States, specializing in the development and long-term operation of income-restricted communities.",
      "It makes extensive use of the Low-Income Housing Tax Credit (LIHTC) and related financing to develop and preserve affordable apartments.",
    ],
    highlights: [
      "One of the largest US affordable-housing owners and developers.",
      "Specialist in LIHTC development, acquisition, and preservation.",
      "Owns and manages a large portfolio of income-restricted communities.",
    ],
    sources: [
      { label: "Dominium - Company website", url: "https://www.dominiumapartments.com" },
    ],
  },
  "NRP GROUP": {
    ownership: "Privately held",
    founded: "1994",
    headquarters: "Cleveland, Ohio",
    tagline: "A privately held developer, builder, and manager of affordable and market-rate multifamily.",
    overview: [
      "The NRP Group is a privately held, vertically integrated multifamily developer, builder, and manager founded in 1994. It develops affordable, workforce, and market-rate apartment communities across the United States.",
      "Its integrated platform combines development, construction, and property management in-house.",
    ],
    highlights: [
      "Vertically integrated across development, construction, and management.",
      "Develops affordable, workforce, and market-rate multifamily.",
      "Consistently ranked among the most active US affordable-housing developers.",
    ],
    sources: [
      { label: "The NRP Group - Company website", url: "https://www.nrpgroup.com" },
    ],
  },
  "MCCORMACK BARON SALAZAR": {
    ownership: "Privately held",
    founded: "1973",
    headquarters: "St. Louis, Missouri",
    tagline: "A privately held developer of mixed-income and affordable urban communities.",
    overview: [
      "McCormack Baron Salazar is a privately held developer, manager, and asset manager of economically integrated urban neighborhoods, founded in 1973. It is one of the nation's leading developers of mixed-income and affordable housing.",
      "The firm specializes in revitalizing distressed urban areas through mixed-income communities, often via public-private partnerships.",
    ],
    highlights: [
      "A leading US developer of mixed-income and affordable urban housing.",
      "Focuses on revitalizing distressed neighborhoods through public-private partnerships.",
      "Integrated across development, property management, and asset management.",
    ],
    sources: [
      { label: "McCormack Baron Salazar - Company website", url: "https://www.mccormackbaron.com" },
    ],
  },
  "RELATED AFFORDABLE": {
    ownership: "Privately held (Related Companies)",
    founded: "1972",
    headquarters: "New York, New York",
    tagline: "The affordable-housing arm of Related Companies and a large preservation owner-developer.",
    overview: [
      "Related Affordable is the affordable-housing division of Related Companies, one of the largest privately held real estate firms in the United States. It develops, acquires, and preserves affordable and mixed-income housing nationwide.",
      "The platform is a major owner and preserver of affordable apartments, extending the affordability of at-risk communities.",
    ],
    highlights: [
      "Affordable-housing arm of Related Companies, a major private real estate firm.",
      "Develops, acquires, and preserves affordable and mixed-income housing nationwide.",
      "One of the larger owners of affordable apartments in the country.",
    ],
    sources: [
      { label: "Related Companies - Company website", url: "https://www.related.com" },
    ],
  },

  // ── Privately held student-housing platforms ───────────────────────
  "LANDMARK PROPERTIES": {
    ownership: "Privately held",
    founded: "2004",
    headquarters: "Athens, Georgia",
    tagline: "One of the largest privately held student-housing developers, owners, and managers.",
    overview: [
      "Landmark Properties is a privately held, vertically integrated real estate firm founded in 2004 that specializes in purpose-built student housing. It develops, builds, owns, and manages student communities at universities nationwide.",
      "It has become one of the largest student-housing developers and operators in the country, and has expanded into build-to-rent housing.",
    ],
    highlights: [
      "Among the largest US student-housing developers and operators.",
      "Vertically integrated across development, construction, and management.",
      "Operates the Legacy and The Retreat student-housing brands and a build-to-rent platform.",
    ],
    sources: [
      { label: "Landmark Properties - Company website", url: "https://www.landmarkproperties.com" },
    ],
  },
  "CORE SPACES": {
    ownership: "Privately held",
    founded: "2010",
    headquarters: "Chicago, Illinois",
    tagline: "A privately held developer-operator of premium student and build-to-rent housing.",
    overview: [
      "Core Spaces is a privately held, vertically integrated real estate company founded in 2010 that develops, acquires, and manages premium student housing and build-to-rent communities.",
      "It is known for high-amenity student communities under the Hub and oLiv brands at major universities.",
    ],
    highlights: [
      "Develops and operates high-amenity student housing under the Hub and oLiv brands.",
      "Vertically integrated across development, acquisitions, and management.",
      "Growing build-to-rent single-family platform alongside student housing.",
    ],
    sources: [
      { label: "Core Spaces - Company website", url: "https://www.corespaces.com" },
    ],
  },
  "THE SCION GROUP": {
    ownership: "Privately held",
    founded: "1999",
    headquarters: "Chicago, Illinois",
    tagline: "The largest privately held student-housing owner-operator in the United States.",
    overview: [
      "The Scion Group is a privately held owner and operator of student housing, founded in 1999. Through partnerships with institutional investors it has assembled one of the largest student-housing portfolios in the country.",
      "It owns and operates off-campus communities serving many US universities.",
    ],
    highlights: [
      "One of the largest owners and operators of US student housing.",
      "Partners with institutional investors to own off-campus communities.",
      "Focused exclusively on the student-housing asset class.",
    ],
    sources: [
      { label: "The Scion Group - Company website", url: "https://www.thesciongroup.com" },
    ],
  },
  "ASSET LIVING": {
    ownership: "Privately held",
    founded: "1986",
    headquarters: "Houston, Texas",
    tagline: "One of the largest third-party managers of student and conventional housing in the US.",
    overview: [
      "Asset Living is a privately held property management company founded in 1986. It is one of the largest third-party residential managers in the country, with a large student-housing management platform alongside conventional multifamily, build-to-rent, and affordable housing.",
      "It manages communities on behalf of owners and investors nationwide.",
    ],
    highlights: [
      "One of the largest third-party residential property managers in the US.",
      "Major student-housing management platform plus conventional and affordable housing.",
      "Manages communities for owners and institutional investors nationwide.",
    ],
    sources: [
      { label: "Asset Living - Company website", url: "https://www.assetliving.com" },
    ],
  },
  "CARDINAL GROUP COMPANIES": {
    ownership: "Privately held",
    founded: "2004",
    headquarters: "Denver, Colorado",
    tagline: "A privately held student-housing investor, developer, and manager.",
    overview: [
      "Cardinal Group Companies is a privately held, vertically integrated real estate investment, development, and management firm founded in 2004, with a strong focus on student housing.",
      "It invests in, develops, and manages student and conventional multifamily communities across the United States.",
    ],
    highlights: [
      "Vertically integrated across investment, development, and management.",
      "Large third-party student-housing management platform.",
      "Active in both student and conventional multifamily housing.",
    ],
    sources: [
      { label: "Cardinal Group - Company website", url: "https://www.cardinalgroup.com" },
    ],
  },
  "HARRISON STREET": {
    ownership: "Privately held",
    founded: "2005",
    headquarters: "Chicago, Illinois",
    tagline: "An alternative real-asset manager and major institutional investor in student housing.",
    overview: [
      "Harrison Street is a privately held investment management firm founded in 2005 that specializes in alternative real assets, including student housing, senior housing, life science, and data centers.",
      "It is one of the largest institutional investors in US purpose-built student housing, typically partnering with operators to own communities.",
    ],
    highlights: [
      "Specialist alternative real-asset manager across education, healthcare, and storage sectors.",
      "One of the largest institutional owners of US student housing.",
      "Partners with operating companies to acquire and develop communities.",
    ],
    sources: [
      { label: "Harrison Street - Company website", url: "https://www.harrisonst.com" },
    ],
  },
  "CAMPUS ADVANTAGE": {
    ownership: "Privately held",
    founded: "2003",
    headquarters: "Austin, Texas",
    tagline: "A privately held student-housing owner, operator, and third-party manager.",
    overview: [
      "Campus Advantage is a privately held student-housing company founded in 2003 that owns, operates, and provides third-party management for student communities across the United States.",
      "It focuses on acquisitions, management, and consulting within the purpose-built student-housing sector.",
    ],
    highlights: [
      "Owns, operates, and third-party manages student-housing communities nationwide.",
      "Offers management and consulting services to other student-housing owners.",
      "Focused specifically on the purpose-built student-housing sector.",
    ],
    sources: [
      { label: "Campus Advantage - Company website", url: "https://www.campusadv.com" },
    ],
  },
  "CA STUDENT LIVING": {
    ownership: "Privately held (CA Ventures)",
    founded: "2004",
    headquarters: "Chicago, Illinois",
    tagline: "The student-housing platform of CA Ventures, a private global real-asset manager.",
    overview: [
      "CA Student Living is the purpose-built student-housing platform of CA Ventures, a privately held global real estate investment management firm founded in 2004.",
      "It develops, acquires, and operates student communities at universities in the United States and internationally.",
    ],
    highlights: [
      "Student-housing arm of CA Ventures, a global private real-asset manager.",
      "Develops, acquires, and operates communities in the US and abroad.",
      "Part of a broader platform spanning multiple real estate sectors.",
    ],
    sources: [
      { label: "CA Ventures - Company website", url: "https://www.ca-ventures.com" },
    ],
  },
};

/** Look up a company's reference profile by ticker, then by name. */
export function companyReference(c: { ticker: string; name: string }): CompanyReference | undefined {
  return COMPANY_REFERENCE[c.ticker] ?? COMPANY_REFERENCE[c.name] ?? COMPANY_REFERENCE[c.name.toUpperCase()];
}
