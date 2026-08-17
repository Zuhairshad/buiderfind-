import type { TradeIllustrationVariant } from "@/components/TradeIllustrations";

export type TradeDirectoryEntry = {
  slug: string;
  name: string;
  plural: string;
  summary: string;
  services: readonly [string, string, string, string];
  illustration: TradeIllustrationVariant;
  featured?: boolean;
};

export type LocationEntry = {
  name: string;
  slug: string;
  type: "city" | "county";
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const TRADE_DIRECTORY: readonly TradeDirectoryEntry[] = [
  { slug: "builders", name: "Builder", plural: "Builders", summary: "Extensions, structural alterations, conversions and complete property renovations.", services: ["House extensions", "Structural work", "Property renovations", "New builds"], illustration: "builder", featured: true },
  { slug: "plumbers", name: "Plumber", plural: "Plumbers", summary: "Water leaks, pipework, cylinders and plumbing installations for UK homes.", services: ["Leak repairs", "Bathroom plumbing", "Hot-water cylinders", "Taps and toilets"], illustration: "plumber", featured: true },
  { slug: "electricians", name: "Electrician", plural: "Electricians", summary: "Certified electrical repairs, rewires, inspections and new installations.", services: ["House rewires", "Consumer units", "EICRs", "EV chargers"], illustration: "electrician", featured: true },
  { slug: "roofers", name: "Roofer", plural: "Roofers", summary: "Pitched and flat-roof repairs, replacement coverings, leadwork and roofline work.", services: ["Leak repairs", "Re-roofing", "Flat roofs", "Leadwork"], illustration: "roofing", featured: true },
  { slug: "plasterers", name: "Plasterer", plural: "Plasterers", summary: "Skimming, dry lining, ceiling repairs and interior or exterior rendering.", services: ["Wall skimming", "Ceiling plastering", "Dry lining", "Rendering"], illustration: "plastering", featured: true },
  { slug: "painters", name: "Painter and Decorator", plural: "Painters and Decorators", summary: "Careful preparation and durable decorating for interiors, exteriors and woodwork.", services: ["Interior painting", "Exterior painting", "Wallpaper hanging", "Woodwork finishing"], illustration: "builder", featured: true },
  { slug: "carpenters", name: "Carpenter and Joiner", plural: "Carpenters and Joiners", summary: "Made-to-measure joinery, doors, storage, stairs and precise second-fix carpentry.", services: ["Door hanging", "Fitted storage", "Skirting boards", "Staircases"], illustration: "builder", featured: true },
  { slug: "tilers", name: "Tiler", plural: "Tilers", summary: "Accurate wall and floor tiling for bathrooms, kitchens and living spaces.", services: ["Bathroom tiling", "Kitchen splashbacks", "Floor tiling", "Grout repairs"], illustration: "bathroom", featured: true },
  { slug: "flooring", name: "Flooring Specialist", plural: "Flooring Specialists", summary: "Preparation and fitting for timber, laminate, vinyl, carpet and specialist floors.", services: ["Engineered wood", "Luxury vinyl tile", "Laminate flooring", "Subfloor preparation"], illustration: "flooring", featured: true },
  { slug: "gardeners", name: "Gardener", plural: "Gardeners", summary: "Garden maintenance, planting, landscaping and practical outdoor improvements.", services: ["Garden maintenance", "Planting", "Turfing", "Landscaping"], illustration: "landscaper", featured: true },
  { slug: "handymen", name: "Handyperson", plural: "Handypeople", summary: "Small household repairs, mounting, assembly and maintenance completed efficiently.", services: ["Furniture assembly", "Shelving", "Minor repairs", "Curtain fitting"], illustration: "builder", featured: true },
  { slug: "heating", name: "Heating Engineer", plural: "Heating Engineers", summary: "Boilers, radiators, controls and central-heating diagnosis by appropriately qualified engineers.", services: ["Boiler replacement", "Heating repairs", "Radiators", "Smart controls"], illustration: "heating", featured: true },
  { slug: "bathrooms", name: "Bathroom Fitter", plural: "Bathroom Fitters", summary: "Coordinated bathroom renovations covering plumbing, tiling, furniture and finishing.", services: ["Full refurbishments", "Shower rooms", "Wet rooms", "Bathroom repairs"], illustration: "bathroom", featured: true },
  { slug: "kitchens", name: "Kitchen Fitter", plural: "Kitchen Fitters", summary: "Kitchen installation, worktops, appliances and finishing from survey to handover.", services: ["Complete installations", "Worktops", "Cabinet replacement", "Kitchen upgrades"], illustration: "kitchen", featured: true },
  { slug: "windows", name: "Window and Conservatory Specialist", plural: "Window and Conservatory Specialists", summary: "Replacement glazing, external doors, window repairs and conservatory improvements.", services: ["Replacement windows", "External doors", "Glazing repairs", "Conservatories"], illustration: "extension", featured: true },
  { slug: "driveways", name: "Driveway Specialist", plural: "Driveway Specialists", summary: "Properly excavated and drained block paving, resin, gravel and tarmac driveways.", services: ["Block paving", "Resin driveways", "Tarmac", "Gravel drives"], illustration: "driveway", featured: true },
  { slug: "extensions", name: "Extension Specialist", plural: "Extension Specialists", summary: "Managed rear, side-return and wraparound extensions that add useful living space.", services: ["Rear extensions", "Side returns", "Wraparound extensions", "Two-storey extensions"], illustration: "extension", featured: true },
  { slug: "drainage", name: "Drainage Specialist", plural: "Drainage Specialists", summary: "Blocked drains, CCTV surveys, repairs and practical rainwater or foul-water solutions.", services: ["Drain unblocking", "CCTV surveys", "Drain repairs", "Soakaways"], illustration: "plumber", featured: true },
  { slug: "bricklayers", name: "Bricklayer", plural: "Bricklayers", summary: "New brickwork, garden walls, repointing and masonry repairs matched to the property.", services: ["Garden walls", "Repointing", "Brick repairs", "New masonry"], illustration: "builder" },
  { slug: "cleaners", name: "Cleaner", plural: "Cleaners", summary: "Domestic, end-of-tenancy and specialist cleaning with a clearly agreed checklist.", services: ["House cleaning", "Deep cleans", "End-of-tenancy cleans", "Carpet cleaning"], illustration: "bathroom" },
  { slug: "locksmiths", name: "Locksmith", plural: "Locksmiths", summary: "Entry, lock replacement and door-security work without unnecessary damage.", services: ["Emergency entry", "Lock changes", "uPVC mechanisms", "Security upgrades"], illustration: "builder" },
  { slug: "loft-conversions", name: "Loft Conversion Specialist", plural: "Loft Conversion Specialists", summary: "Dormer, rooflight and hip-to-gable conversions planned around structure, stairs and fire safety.", services: ["Dormer conversions", "Rooflight lofts", "Hip-to-gable work", "Loft stairs"], illustration: "loft" },
  { slug: "pest-control", name: "Pest Controller", plural: "Pest Controllers", summary: "Identification, treatment and prevention for household insects, rodents and nesting pests.", services: ["Rodent control", "Wasp nests", "Bed bugs", "Proofing work"], illustration: "landscaper" },
  { slug: "tree-surgeons", name: "Tree Surgeon", plural: "Tree Surgeons", summary: "Tree inspection, pruning, dismantling and stump work completed with suitable safeguards.", services: ["Tree pruning", "Tree removal", "Stump grinding", "Crown reduction"], illustration: "landscaper" },
  { slug: "internal-renovations", name: "Renovation Specialist", plural: "Renovation Specialists", summary: "Coordinated internal reconfiguration, upgrades and whole-room refurbishment.", services: ["Room refurbishments", "Layout changes", "Making good", "Internal upgrades"], illustration: "extension" },
  { slug: "wooden-doors", name: "Wooden Door Specialist", plural: "Wooden Door Specialists", summary: "Accurate fitting, adjustment and repair of internal and external timber doors.", services: ["Internal doors", "External doors", "Door repairs", "Ironmongery"], illustration: "builder" },
  { slug: "flat-pack-assembly", name: "Flat-pack Assembler", plural: "Flat-pack Assemblers", summary: "Safe assembly and positioning of wardrobes, beds, cabinets and office furniture.", services: ["Wardrobes", "Beds", "Cabinets", "Office furniture"], illustration: "builder" },
  { slug: "fencing", name: "Fencing Contractor", plural: "Fencing Contractors", summary: "Boundary fencing and gates installed with suitable posts, fixings and ground preparation.", services: ["Panel fencing", "Close-board fencing", "Garden gates", "Fence repairs"], illustration: "landscaper" },
  { slug: "chimneys", name: "Chimney Specialist", plural: "Chimney Specialists", summary: "Chimney repointing, flashing, pots, cowls and safe removal or rebuilding.", services: ["Repointing", "Lead flashing", "Chimney pots", "Stack repairs"], illustration: "roofing" },
  { slug: "laminate-flooring", name: "Laminate Flooring Fitter", plural: "Laminate Flooring Fitters", summary: "Neat laminate installation with appropriate underlay, expansion gaps and thresholds.", services: ["Floor preparation", "Laminate fitting", "Underlay", "Trims and thresholds"], illustration: "flooring" },
  { slug: "gas-boilers", name: "Gas Boiler Engineer", plural: "Gas Boiler Engineers", summary: "Gas Safe registered boiler servicing, diagnosis, repair and replacement.", services: ["Boiler servicing", "Fault diagnosis", "Boiler repairs", "New boilers"], illustration: "heating" },
  { slug: "garages-outbuildings", name: "Garage and Outbuilding Builder", plural: "Garage and Outbuilding Builders", summary: "Purpose-built garages, workshops and outbuildings designed around access and use.", services: ["Detached garages", "Workshops", "Garden rooms", "Outbuilding repairs"], illustration: "extension" },
  { slug: "radiators", name: "Radiator Engineer", plural: "Radiator Engineers", summary: "Radiator replacement, balancing, valve upgrades and cold-spot diagnosis.", services: ["Radiator fitting", "TRV replacement", "System balancing", "Leak repairs"], illustration: "heating" },
  { slug: "gas-cookers", name: "Gas Cooker Installer", plural: "Gas Cooker Installers", summary: "Gas Safe connection, disconnection and testing of domestic cookers and hobs.", services: ["Cooker connection", "Hob installation", "Disconnection", "Safety checks"], illustration: "kitchen" },
  { slug: "flat-roofs", name: "Flat Roofer", plural: "Flat Roofers", summary: "Felt, EPDM and GRP roof systems installed with sound decks, falls and drainage.", services: ["EPDM roofs", "GRP roofs", "Torch-on felt", "Flat-roof repairs"], illustration: "roofing" },
  { slug: "garage-conversions", name: "Garage Conversion Specialist", plural: "Garage Conversion Specialists", summary: "Garage conversions planned around insulation, ventilation, structure and Building Regulations.", services: ["Integral garages", "Detached garages", "Utility rooms", "Home offices"], illustration: "extension" },
  { slug: "porches-canopies", name: "Porch and Canopy Builder", plural: "Porch and Canopy Builders", summary: "Entrance porches and canopies detailed to suit the house, drainage and exposure.", services: ["Enclosed porches", "Door canopies", "Brick porches", "Roof repairs"], illustration: "extension" },
  { slug: "guttering", name: "Guttering Specialist", plural: "Guttering Specialists", summary: "Rainwater systems repaired or replaced with correct falls, outlets and secure fixings.", services: ["Gutter repairs", "Gutter replacement", "Downpipes", "Rainwater leaks"], illustration: "roofing" },
  { slug: "garden-sheds", name: "Garden Building Installer", plural: "Garden Building Installers", summary: "Sheds and garden buildings assembled on stable, level bases with weatherproof detailing.", services: ["Shed assembly", "Shed bases", "Summerhouses", "Garden offices"], illustration: "landscaper" },
  { slug: "garden-clearance", name: "Garden Clearance Specialist", plural: "Garden Clearance Specialists", summary: "Overgrowth, green waste and unwanted garden structures cleared responsibly.", services: ["Overgrowth removal", "Green waste", "Shed clearance", "Site preparation"], illustration: "landscaper" },
  { slug: "tarmac-driveways", name: "Tarmac Contractor", plural: "Tarmac Contractors", summary: "Tarmac drives and paths built on a compacted sub-base with considered drainage and edging.", services: ["Tarmac drives", "Drive repairs", "Edging", "Drainage channels"], illustration: "driveway" },
  { slug: "lawns", name: "Lawn Specialist", plural: "Lawn Specialists", summary: "Turfing, seeding, levelling and lawn renovation suited to the soil and intended use.", services: ["New turf", "Lawn seeding", "Levelling", "Lawn renovation"], illustration: "landscaper" },
  { slug: "staircases", name: "Staircase Specialist", plural: "Staircase Specialists", summary: "Stair repairs, balustrades and replacement components fitted to current safety requirements.", services: ["Balustrades", "Newel posts", "Treads and risers", "Stair repairs"], illustration: "builder" },
  { slug: "carpet-fitting", name: "Carpet Fitter", plural: "Carpet Fitters", summary: "Carpet, underlay, grippers and door bars fitted cleanly around rooms and stairs.", services: ["Room carpets", "Stair carpets", "Underlay", "Carpet repairs"], illustration: "flooring" },
  { slug: "fascias-soffits", name: "Fascia and Soffit Installer", plural: "Fascia and Soffit Installers", summary: "Roofline timber or uPVC renewed with ventilation and gutter support properly maintained.", services: ["Fascias", "Soffits", "Bargeboards", "Roofline repairs"], illustration: "roofing" },
  { slug: "decking", name: "Decking Installer", plural: "Decking Installers", summary: "Timber and composite decks built on ventilated, durable subframes with safe steps and edges.", services: ["Timber decking", "Composite decking", "Deck repairs", "Steps and balustrades"], illustration: "landscaper" },
  { slug: "power-showers", name: "Power Shower Installer", plural: "Power Shower Installers", summary: "Pumps and showers selected for the water system and installed with suitable electrical protection.", services: ["Power showers", "Shower pumps", "Mixer showers", "Shower repairs"], illustration: "bathroom" },
  { slug: "gas-fires", name: "Gas Fire Engineer", plural: "Gas Fire Engineers", summary: "Gas Safe servicing, repair, removal and replacement of domestic gas fires.", services: ["Gas fire servicing", "Fault repairs", "New gas fires", "Safe removal"], illustration: "heating" },
  { slug: "garden-maintenance", name: "Garden Maintenance Specialist", plural: "Garden Maintenance Specialists", summary: "Scheduled mowing, pruning, weeding and seasonal care for manageable outdoor spaces.", services: ["Regular maintenance", "Hedge cutting", "Pruning", "Seasonal tidy-ups"], illustration: "landscaper" },
  { slug: "foundations-underpinning", name: "Foundation Specialist", plural: "Foundation Specialists", summary: "Engineered foundation, underpinning and ground-stabilisation work for structural projects.", services: ["New foundations", "Underpinning", "Ground beams", "Structural repairs"], illustration: "builder" },
  { slug: "pebble-dashing", name: "Pebble-dash Specialist", plural: "Pebble-dash Specialists", summary: "Pebble-dash repair, patch matching and replacement after the substrate has been assessed.", services: ["Patch repairs", "New pebble dash", "Crack preparation", "Exterior finishes"], illustration: "plastering" },
  { slug: "hard-landscaping", name: "Hard Landscaper", plural: "Hard Landscapers", summary: "Patios, paths, walls and levels designed as a coherent, well-drained outdoor space.", services: ["Patios", "Garden walls", "Paths", "Landscape drainage"], illustration: "landscaper" },
] as const;

const CITY_NAMES = [
  "London", "Birmingham", "Glasgow", "Liverpool", "Bristol", "Manchester", "Sheffield", "Leeds", "Edinburgh", "Coventry", "Bradford", "Cardiff", "Nottingham", "Newcastle upon Tyne", "Stoke-on-Trent", "Southampton", "Derby", "Portsmouth", "Brighton", "Plymouth", "Reading", "Wolverhampton", "Bolton", "Aberdeen", "Bournemouth", "Norwich", "Milton Keynes", "Middlesbrough", "Peterborough", "Sunderland", "Huddersfield", "Slough", "Oxford", "York", "Poole", "Ipswich", "Cambridge", "Gloucester", "Birkenhead", "Watford", "Sale", "Solihull", "Exeter", "Gateshead", "Maidstone", "Chelmsford", "Lancaster",
] as const;

const COUNTY_NAMES = [
  "Aberdeenshire", "Argyll and Bute", "Bedfordshire", "Berkshire", "Blaenau Gwent", "Bridgend", "Buckinghamshire", "Caerphilly", "Cambridgeshire", "Cardiff County", "Carmarthenshire", "Cheshire", "City of Westminster", "Clackmannanshire", "Conwy", "Cornwall", "County Durham", "Cumbria", "Denbighshire", "Derbyshire", "Devon", "Dorset", "Dumfries and Galloway", "Dundee", "East Ayrshire", "East Dunbartonshire", "East Lothian", "East Renfrewshire", "East Riding of Yorkshire", "East Sussex", "Edinburgh", "Essex", "Faen", "Falkirk", "Fife", "Flintshire", "Glasgow", "Gloucestershire", "Greater Manchester", "Gwynedd", "Hampshire", "Herefordshire", "Hertfordshire", "Inverclyde", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Merseyside", "Merthyr Tydfil", "Midlothian", "Monmouthshire", "Neath Port Talbot", "Newport", "Norfolk", "North Ayrshire", "North Lanarkshire", "North Yorkshire", "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire", "Perth and Kinross", "Powys", "Renfrewshire", "Rhondda Cynon Taf", "Rutland", "Scottish Borders", "Shropshire", "Somerset", "South Ayrshire", "South Lanarkshire", "South Yorkshire", "Staffordshire", "Stirling", "Suffolk", "Surrey", "Swansea", "Tyne and Wear", "Vale of Glamorgan", "Warwickshire", "West Dunbartonshire", "West Lothian", "West Midlands", "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire", "Wrexham",
] as const;

export const LOCATIONS: readonly LocationEntry[] = [
  ...CITY_NAMES.map((name) => ({ name, slug: slugify(name), type: "city" as const })),
  ...COUNTY_NAMES.map((name) => ({ name, slug: slugify(name), type: "county" as const })),
];

export const CITIES = LOCATIONS.filter((location) => location.type === "city");
export const COUNTIES = LOCATIONS.filter((location) => location.type === "county");
export const TRADE_BY_SLUG = new Map(TRADE_DIRECTORY.map((trade) => [trade.slug, trade]));
export const LOCATION_BY_SLUG = new Map(LOCATIONS.map((location) => [location.slug, location]));

export const DETAILED_TRADE_SLUGS = new Set([
  "builders", "plumbers", "electricians", "roofers", "plasterers", "painters", "carpenters", "tilers", "flooring", "gardeners", "handymen", "heating", "bathrooms", "kitchens", "windows", "driveways", "extensions", "drainage",
]);

export const TRADE_SERVICE_SLUGS: Readonly<Record<string, readonly string[]>> = {
  builders: ["extensions", "loft-conversions", "garage-conversions", "new-builds"],
  plumbers: ["boiler-repair", "bathroom-fit", "emergency-plumbing"],
  electricians: ["rewiring", "fuse-board", "ev-charging"],
  roofers: ["roof-repair", "flat-roof", "guttering"],
  plasterers: ["skim-coat", "dry-lining", "rendering"],
  painters: ["interior-painting", "exterior-painting", "wallpapering"],
};

export const isTradeSlug = (slug: string) => TRADE_BY_SLUG.has(slug);
export const isLocationSlug = (slug: string) => LOCATION_BY_SLUG.has(slug);
