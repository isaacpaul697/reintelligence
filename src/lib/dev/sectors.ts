/**
 * Per-asset-class reference data that powers each sector's specialized world:
 * the major public operators active in that class and a sector-tuned news query.
 *
 * The company roster is public fact (which firm operates in which asset class,
 * plus its SEC CIK), the same kind of static reference as our CITIES list. The
 * *activity* for each firm is pulled live from EDGAR, and headlines come live
 * from Google News, so nothing here fabricates numbers or events.
 */

export interface SectorCompany {
  name: string;
  ticker: string;
  /** SEC CIK for public filers; null for privately-held firms (e.g. Greystar). */
  cik: number | null;
  /** A factual one-line description of the firm's focus. */
  note: string;
  /** Domain used for the firm's logo disc. */
  site: string;
}

export interface SectorPlayersConfig {
  /** Google News RSS query for this asset class. */
  newsQuery: string;
  /** Short framing line shown above the players list. */
  playersIntro: string;
  companies: SectorCompany[];
}

export const SECTOR_PLAYERS: Record<string, SectorPlayersConfig> = {
  industrial: {
    newsQuery:
      'industrial real estate (warehouse OR logistics OR "distribution center" OR "cold storage") (development OR construction OR lease OR acquisition)',
    playersIntro:
      "The largest warehouse, logistics, and industrial landlords, from public REITs to the biggest privately held developers. Recent activity for public filers is pulled live from SEC filings.",
    companies: [
      { name: "Prologis", ticker: "PLD", cik: 1045609, note: "Largest global logistics real-estate REIT.", site: "prologis.com" },
      { name: "Rexford Industrial", ticker: "REXR", cik: 1571283, note: "Infill industrial focused on Southern California.", site: "rexfordindustrial.com" },
      { name: "First Industrial Realty", ticker: "FR", cik: 921825, note: "Logistics and distribution properties nationwide.", site: "firstindustrial.com" },
      { name: "EastGroup Properties", ticker: "EGP", cik: 49600, note: "Multi-tenant industrial across the Sun Belt.", site: "eastgroup.net" },
      { name: "STAG Industrial", ticker: "STAG", cik: 1479094, note: "Single-tenant industrial in secondary markets.", site: "stagindustrial.com" },
      { name: "Terreno Realty", ticker: "TRNO", cik: 1476150, note: "Industrial in six major coastal markets.", site: "terreno.com" },
      { name: "Americold Realty Trust", ticker: "COLD", cik: 1455863, note: "Global temperature-controlled (cold storage) warehouse REIT.", site: "americold.com" },
      { name: "Lineage", ticker: "LINE", cik: 1868159, note: "Largest global temperature-controlled industrial REIT; 2024 IPO.", site: "onelineage.com" },
      { name: "W. P. Carey", ticker: "WPC", cik: 1025378, note: "Net-lease REIT with a large single-tenant industrial and warehouse book.", site: "wpcarey.com" },
      { name: "LXP Industrial Trust", ticker: "LXP", cik: 910108, note: "Net-lease REIT focused on single-tenant industrial and logistics assets.", site: "lxp.com" },
      { name: "Industrial Logistics Properties Trust", ticker: "ILPT", cik: 1717307, note: "Owns industrial and logistics properties net-leased to distribution tenants.", site: "ilptreit.com" },
      { name: "Panattoni Development", ticker: "PRIVATE", cik: null, note: "One of the largest privately held industrial developers worldwide.", site: "panattoni.com" },
      { name: "Hillwood", ticker: "PRIVATE", cik: null, note: "Perot-family industrial developer; master-developer of AllianceTexas.", site: "hillwood.com" },
      { name: "Bridge Industrial", ticker: "PRIVATE", cik: null, note: "Privately held developer of infill logistics in major US markets.", site: "bridgeindustrial.com" },
      { name: "Dermody Properties", ticker: "PRIVATE", cik: null, note: "Privately held national developer of logistics and distribution real estate.", site: "dermody.com" },
    ],
  },
  "single-townhome": {
    newsQuery:
      'homebuilder (single-family OR townhome OR "for-sale housing") (housing starts OR construction OR community OR "land acquisition" OR earnings)',
    playersIntro:
      "The largest single-family and townhome builders, including the biggest privately held homebuilder. Recent activity for public filers is pulled live from SEC filings.",
    companies: [
      { name: "D.R. Horton", ticker: "DHI", cik: 882184, note: "Largest U.S. homebuilder by volume.", site: "drhorton.com" },
      { name: "Lennar", ticker: "LEN", cik: 920760, note: "National builder of single-family homes and townhomes.", site: "lennar.com" },
      { name: "PulteGroup", ticker: "PHM", cik: 822416, note: "Single-family and attached homes across major metros.", site: "pultegroup.com" },
      { name: "NVR", ticker: "NVR", cik: 906163, note: "Ryan Homes parent; East Coast single-family builder.", site: "nvrinc.com" },
      { name: "Toll Brothers", ticker: "TOL", cik: 794170, note: "Luxury single-family and townhome communities.", site: "tollbrothers.com" },
      { name: "Meritage Homes", ticker: "MTH", cik: 833079, note: "Sun Belt single-family and entry-level homes.", site: "meritagehomes.com" },
      { name: "KB Home", ticker: "KBH", cik: 795266, note: "National builder of single-family homes with a build-to-order model.", site: "kbhome.com" },
      { name: "Taylor Morrison", ticker: "TMHC", cik: 1562476, note: "Top-10 national homebuilder across single-family and active-adult.", site: "taylormorrison.com" },
      { name: "Century Communities", ticker: "CCS", cik: 1576940, note: "Fast-growing builder of single-family homes across US growth markets.", site: "centurycommunities.com" },
      { name: "LGI Homes", ticker: "LGIH", cik: 1580670, note: "Entry-level single-family homebuilder with a systematic sales model.", site: "lgihomes.com" },
      { name: "Green Brick Partners", ticker: "GRBK", cik: 1373670, note: "Diversified homebuilder and land developer across US growth markets.", site: "greenbrickpartners.com" },
      { name: "Dream Finders Homes", ticker: "DFH", cik: 1825088, note: "One of the fastest-growing national single-family homebuilders.", site: "dreamfindershomes.com" },
      { name: "M/I Homes", ticker: "MHO", cik: 799292, note: "Single-family homebuilder across the Midwest, Southeast, and Texas.", site: "mihomes.com" },
      { name: "Beazer Homes", ticker: "BZH", cik: 915840, note: "National builder of single-family homes and townhomes.", site: "beazer.com" },
      { name: "David Weekley Homes", ticker: "PRIVATE", cik: null, note: "Largest privately held homebuilder in the United States.", site: "davidweekleyhomes.com" },
    ],
  },
  multifamily: {
    newsQuery:
      'multifamily apartment (development OR construction OR acquisition OR "rent growth" OR "lease-up") -student',
    playersIntro:
      "The largest apartment owners and operators, from public REITs to the biggest privately held owner-operators. Recent activity for public filers is pulled live from SEC filings.",
    companies: [
      { name: "Greystar", ticker: "PRIVATE", cik: null, note: "Largest US apartment owner, manager, and developer; privately held.", site: "greystar.com" },
      { name: "AvalonBay Communities", ticker: "AVB", cik: 915912, note: "Develops and owns apartments in coastal metros.", site: "avalonbay.com" },
      { name: "Equity Residential", ticker: "EQR", cik: 906107, note: "Urban and high-density apartment portfolio.", site: "equityapartments.com" },
      { name: "Mid-America Apartment", ticker: "MAA", cik: 912595, note: "Sun Belt apartment owner-operator.", site: "maac.com" },
      { name: "Essex Property Trust", ticker: "ESS", cik: 920522, note: "West Coast apartment specialist.", site: "essex.com" },
      { name: "Camden Property Trust", ticker: "CPT", cik: 906345, note: "Apartments across Sun Belt growth markets.", site: "camdenliving.com" },
      { name: "UDR", ticker: "UDR", cik: 74208, note: "Diversified national apartment portfolio.", site: "udr.com" },
      { name: "Independence Realty Trust", ticker: "IRT", cik: 1466085, note: "Sun Belt apartment REIT in college-town and high-growth markets.", site: "irtliving.com" },
      { name: "NexPoint Residential", ticker: "NXRT", cik: 1620393, note: "Workforce and value-add apartments in the Sun Belt.", site: "nexpointliving.com" },
      { name: "Elme Communities", ticker: "ELME", cik: 104894, note: "Washington DC-region apartment REIT (formerly Washington REIT).", site: "elmecommunities.com" },
      { name: "Aimco", ticker: "AIV", cik: 922864, note: "Apartment REIT focused on development and value-add multifamily.", site: "aimco.com" },
      { name: "Centerspace", ticker: "CSR", cik: 798359, note: "Apartment REIT focused on Midwest and Mountain West markets.", site: "centerspacehomes.com" },
      { name: "Cortland", ticker: "PRIVATE", cik: null, note: "Privately held, vertically integrated multifamily owner-operator in the Sun Belt.", site: "cortland.com" },
      { name: "Morgan Properties", ticker: "PRIVATE", cik: null, note: "One of the largest privately held apartment owners in the US.", site: "morganproperties.com" },
      { name: "Lincoln Property Company", ticker: "PRIVATE", cik: null, note: "One of the largest privately held US multifamily developers and managers.", site: "lincolnproperty.com" },
    ],
  },
  office: {
    newsQuery:
      'office real estate (development OR leasing OR "office conversion" OR "return to office" OR acquisition)',
    playersIntro:
      "The largest office landlords, from public REITs to the biggest privately held developers. Recent activity for public filers is pulled live from SEC filings.",
    companies: [
      { name: "BXP", ticker: "BXP", cik: 1037540, note: "Largest U.S. office REIT (formerly Boston Properties).", site: "bxp.com" },
      { name: "Vornado Realty Trust", ticker: "VNO", cik: 899689, note: "Manhattan-concentrated office and retail.", site: "vno.com" },
      { name: "Kilroy Realty", ticker: "KRC", cik: 1025996, note: "West Coast office and life-science campuses.", site: "kilroyrealty.com" },
      { name: "Cousins Properties", ticker: "CUZ", cik: 25232, note: "Sun Belt trophy office buildings.", site: "cousins.com" },
      { name: "SL Green Realty", ticker: "SLG", cik: 1040971, note: "Largest Manhattan office landlord.", site: "slgreen.com" },
      { name: "Highwoods Properties", ticker: "HIW", cik: 921082, note: "Office across Southeastern business districts.", site: "highwoods.com" },
      { name: "Alexandria Real Estate", ticker: "ARE", cik: 1035443, note: "Life-science office REIT for lab and R&D campuses in innovation clusters.", site: "are.com" },
      { name: "Douglas Emmett", ticker: "DEI", cik: 1364250, note: "Office and apartment REIT concentrated in coastal LA and Honolulu.", site: "douglasemmett.com" },
      { name: "Hudson Pacific Properties", ticker: "HPP", cik: 1482512, note: "West Coast office and studio REIT serving tech and media tenants.", site: "hudsonpacificproperties.com" },
      { name: "Brandywine Realty Trust", ticker: "BDN", cik: 790816, note: "Office REIT concentrated in Philadelphia and Austin.", site: "brandywinerealty.com" },
      { name: "COPT Defense Properties", ticker: "CDP", cik: 860546, note: "Office REIT leased to US defense and government tenants.", site: "copt.com" },
      { name: "JBG Smith", ticker: "JBGS", cik: 1689796, note: "Mixed-use office REIT concentrated in the Washington DC metro.", site: "jbgsmith.com" },
      { name: "Empire State Realty Trust", ticker: "ESRT", cik: 1541401, note: "Manhattan office REIT; owner of the Empire State Building.", site: "esrtreit.com" },
      { name: "Hines", ticker: "PRIVATE", cik: null, note: "One of the largest privately held global real estate developers and managers.", site: "hines.com" },
      { name: "Tishman Speyer", ticker: "PRIVATE", cik: null, note: "Privately held global developer; owner-operator of landmark office assets.", site: "tishmanspeyer.com" },
    ],
  },
  retail: {
    newsQuery:
      'retail real estate ("shopping center" OR "retail development" OR "store openings" OR "net lease" OR acquisition)',
    playersIntro:
      "The largest retail landlords, from public REITs to a leading privately held developer. Recent activity for public filers is pulled live from SEC filings.",
    companies: [
      { name: "Simon Property Group", ticker: "SPG", cik: 1063761, note: "Largest U.S. mall and outlet operator.", site: "simon.com" },
      { name: "Realty Income", ticker: "O", cik: 726728, note: "Net-lease retail across thousands of tenants.", site: "realtyincome.com" },
      { name: "Kimco Realty", ticker: "KIM", cik: 879101, note: "Open-air, grocery-anchored shopping centers.", site: "kimcorealty.com" },
      { name: "Regency Centers", ticker: "REG", cik: 910606, note: "Grocery-anchored neighborhood centers.", site: "regencycenters.com" },
      { name: "Federal Realty", ticker: "FRT", cik: 34903, note: "Mixed-use and retail in dense, affluent markets.", site: "federalrealty.com" },
      { name: "Brixmor Property Group", ticker: "BRX", cik: 1581068, note: "Open-air retail centers nationwide.", site: "brixmor.com" },
      { name: "Macerich", ticker: "MAC", cik: 912242, note: "Regional-mall and premium-outlet REIT.", site: "macerich.com" },
      { name: "Tanger", ticker: "SKT", cik: 899715, note: "Outlet-center REIT across US tourist and metro markets.", site: "tanger.com" },
      { name: "Agree Realty", ticker: "ADC", cik: 917251, note: "Net-lease retail REIT focused on investment-grade tenants.", site: "agreerealty.com" },
      { name: "NNN REIT", ticker: "NNN", cik: 751364, note: "Single-tenant net-lease retail REIT with a long dividend-growth record.", site: "nnnreit.com" },
      { name: "Kite Realty Group", ticker: "KRG", cik: 1286043, note: "Open-air, grocery-anchored shopping-center REIT.", site: "kiterealty.com" },
      { name: "Phillips Edison", ticker: "PECO", cik: 1476204, note: "Grocery-anchored neighborhood-center REIT.", site: "phillipsedison.com" },
      { name: "Acadia Realty Trust", ticker: "AKR", cik: 899629, note: "Street and open-air retail REIT in high-density corridors.", site: "acadiarealty.com" },
      { name: "SITE Centers", ticker: "SITC", cik: 894315, note: "Open-air shopping-center REIT.", site: "sitecenters.com" },
      { name: "Edens", ticker: "PRIVATE", cik: null, note: "Privately held developer-owner of grocery-anchored retail centers.", site: "edens.com" },
    ],
  },
  affordable: {
    newsQuery:
      'affordable housing (LIHTC OR "low-income housing" OR "tax credit" OR development OR "inclusionary zoning")',
    playersIntro:
      "Operators active in income-restricted and workforce housing, from public apartment REITs (as workforce proxies) to the largest privately held affordable-housing developers and managers. Recent activity for public filers is pulled live from SEC filings.",
    companies: [
      { name: "NexPoint Residential", ticker: "NXRT", cik: 1620393, note: "Workforce and value-add apartments in the Sun Belt.", site: "nexpointliving.com" },
      { name: "Mid-America Apartment", ticker: "MAA", cik: 912595, note: "Large Sun Belt apartment operator with workforce stock.", site: "maac.com" },
      { name: "Equity Residential", ticker: "EQR", cik: 906107, note: "Major apartment owner; multifamily is the affordable proxy.", site: "equityapartments.com" },
      { name: "Independence Realty Trust", ticker: "IRT", cik: 1466085, note: "Sun Belt apartment REIT with workforce-priced communities in growth metros.", site: "irtliving.com" },
      { name: "Centerspace", ticker: "CSR", cik: 798359, note: "Midwest and Mountain West apartment REIT with workforce-priced stock.", site: "centerspacehomes.com" },
      { name: "Elme Communities", ticker: "ELME", cik: 104894, note: "DC-region apartment REIT; multifamily is the affordable proxy.", site: "elmecommunities.com" },
      { name: "Aimco", ticker: "AIV", cik: 922864, note: "Apartment REIT focused on value-add and workforce multifamily.", site: "aimco.com" },
      { name: "Camden Property Trust", ticker: "CPT", cik: 906345, note: "Large Sun Belt apartment operator with workforce-priced communities.", site: "camdenliving.com" },
      { name: "AvalonBay Communities", ticker: "AVB", cik: 915912, note: "Major apartment REIT; multifamily development is the affordable proxy.", site: "avalonbay.com" },
      { name: "The Michaels Organization", ticker: "PRIVATE", cik: null, note: "One of the largest privately held affordable-housing owners and developers.", site: "themichaelsorg.com" },
      { name: "WinnCompanies", ticker: "PRIVATE", cik: null, note: "Largest manager of affordable and mixed-income housing in the US.", site: "winncompanies.com" },
      { name: "Dominium", ticker: "PRIVATE", cik: null, note: "One of the largest privately held affordable-housing developers and owners.", site: "dominiumapartments.com" },
      { name: "NRP Group", ticker: "PRIVATE", cik: null, note: "Privately held developer of affordable and market-rate multifamily.", site: "nrpgroup.com" },
      { name: "McCormack Baron Salazar", ticker: "PRIVATE", cik: null, note: "Privately held developer of mixed-income and affordable communities.", site: "mccormackbaron.com" },
      { name: "Related Affordable", ticker: "PRIVATE", cik: null, note: "Affordable-housing arm of Related; a large preservation owner-developer.", site: "related.com" },
    ],
  },
};

export function sectorPlayers(sector: string): SectorPlayersConfig | undefined {
  return SECTOR_PLAYERS[sector];
}
