import type { TradeIllustrationVariant } from "@/components/TradeIllustrations";
import { COST_JOB_LISTINGS } from "@/data/cost-job-inventory";

export type CostGuide = {
  slug: string;
  categorySlug: string;
  category: string;
  shortTitle: string;
  title: string;
  summary: string;
  typicalRange: string;
  from: string;
  duration: string;
  illustration: TradeIllustrationVariant;
  items: readonly { label: string; range: string; note: string }[];
  factors: readonly string[];
};

export type CostCategory = {
  slug: string;
  name: string;
  description: string;
  location: "Indoor" | "Outdoor";
  illustration: TradeIllustrationVariant;
  factors: readonly string[];
  guideSlugs: readonly string[];
};

type JobSeed = readonly [slug: string, shortTitle: string, summary: string, typicalRange: string, from: string, duration: string];

type CategorySeed = Omit<CostCategory, "guideSlugs"> & { jobs: readonly JobSeed[] };

const CATEGORY_SEEDS: readonly CategorySeed[] = [
  {
    slug: "bathrooms", name: "Bathrooms", location: "Indoor", illustration: "bathroom",
    description: "Plan anything from a targeted fixture change to a fully waterproofed bathroom renovation.",
    factors: ["Pipe and soil-stack alterations", "Tiling area and tile format", "Waterproofing and subfloor condition", "Sanitaryware and brassware specification"],
    jobs: [
      ["bathroom", "Full bathroom renovation", "Strip out and replace a complete bathroom, including coordinated plumbing, tiling, electrics and finishing.", "£5,000–£12,000", "£2,500", "1–3 weeks"],
      ["walk-in-shower", "Walk-in shower conversion", "Replace a bath with an accessible shower area, allowing for drainage, screens, waterproofing and making good.", "£2,500–£6,500", "£1,800", "3–7 days"],
      ["wet-room", "Wet-room installation", "Create a tanked, level-access shower room with suitable falls, drainage and slip-resistant finishes.", "£7,000–£15,000", "£5,000", "2–3 weeks"],
      ["downstairs-toilet", "Downstairs toilet", "Add a compact WC with new supplies, waste connection, ventilation, lighting and finished surfaces.", "£3,000–£7,000", "£2,000", "1–2 weeks"],
    ],
  },
  {
    slug: "carpentry-windows-doors", name: "Carpentry, windows & doors", location: "Indoor", illustration: "builder",
    description: "Compare joinery and opening upgrades, from fitted storage to new windows and stair components.",
    factors: ["Bespoke versus standard dimensions", "Timber, glazing and ironmongery choice", "Removal and making good", "Decoration and fire-rating requirements"],
    jobs: [
      ["fitted-wardrobes", "Fitted wardrobes", "Design and install made-to-measure storage around alcoves, slopes or full bedroom walls.", "£1,500–£5,000", "£900", "2–7 days"],
      ["internal-doors", "Internal door replacement", "Replace internal doors and ironmongery, including trimming, lining adjustments and fire doors where required.", "£180–£450 per door", "£120 per door", "Half–1 day per door"],
      ["staircase-refurbishment", "Staircase refurbishment", "Renew balustrades, handrails, treads or cladding without replacing the full staircase structure.", "£1,500–£6,000", "£900", "3–10 days"],
      ["replacement-windows", "Replacement windows", "Replace domestic windows with compliant double- or triple-glazed units and complete internal making good.", "£500–£1,200 per window", "£350 per window", "1–3 days"],
    ],
  },
  {
    slug: "conversions", name: "Conversions", location: "Indoor", illustration: "loft",
    description: "Understand the structural, approval and fit-out allowances behind turning underused space into rooms.",
    factors: ["Structural strengthening and openings", "Planning and Building Regulations", "Insulation, fire safety and escape", "Bathrooms, stairs and service extensions"],
    jobs: [
      ["loft-conversion", "Loft conversion", "Create habitable roof space with a safe stair, structural floor, insulation and compliant fire strategy.", "£35,000–£80,000", "£30,000", "6–12 weeks"],
      ["garage-conversion", "Garage conversion", "Convert an attached or integral garage into insulated living space with new openings and services.", "£12,000–£30,000", "£9,000", "3–6 weeks"],
      ["cellar-conversion", "Cellar conversion", "Upgrade a basement with moisture control, ventilation, safe access and habitable finishes.", "£35,000–£90,000", "£25,000", "8–16 weeks"],
      ["barn-conversion", "Barn conversion", "Transform an agricultural building while resolving structure, envelope, services and planning constraints.", "£1,800–£3,500/m²", "£100,000", "6–15 months"],
    ],
  },
  {
    slug: "kitchens", name: "Kitchens", location: "Indoor", illustration: "kitchen",
    description: "Separate cabinetry and appliances from installation, preparation and specialist trade costs.",
    factors: ["Cabinet count and construction", "Worktop material and templating", "Gas, electrical and plumbing moves", "Flooring, plastering and decoration"],
    jobs: [
      ["kitchen", "Full kitchen fitting", "Install a complete kitchen with cabinetry, worktops, appliances and coordinated service connections.", "£6,000–£25,000", "£3,000", "1–3 weeks"],
      ["kitchen-worktops", "Kitchen worktops", "Template, supply and fit replacement worktops with cut-outs, joints, upstands and sink connections.", "£800–£5,000", "£450", "1–5 days"],
      ["kitchen-tiling", "Kitchen tiling", "Tile a splashback or kitchen floor with the preparation, trims, grout and sealing the finish needs.", "£450–£1,800", "£300", "1–4 days"],
      ["utility-room", "Utility-room fit-out", "Fit practical storage, worktops and appliance connections in a dedicated laundry or boot room.", "£3,000–£10,000", "£1,800", "1–2 weeks"],
    ],
  },
  {
    slug: "electrical-lighting", name: "Electrical & lighting", location: "Indoor", illustration: "electrician",
    description: "Budget for tested, certified domestic electrical work and the making good around it.",
    factors: ["Circuit condition and accessibility", "Consumer-unit and earthing upgrades", "Number and specification of points", "Testing, certification and making good"],
    jobs: [
      ["house-rewire", "House rewiring", "Replace outdated domestic wiring, accessories and circuits, followed by testing and certification.", "£4,000–£10,000", "£3,000", "5–12 days"],
      ["eicr", "Electrical safety report", "Inspect and test a domestic installation and issue an Electrical Installation Condition Report.", "£180–£350", "£120", "2–5 hours"],
      ["ev-charger", "EV charger installation", "Fit a dedicated home charging point with circuit protection, testing and notification where applicable.", "£900–£1,500", "£700", "Half–1 day"],
      ["consumer-unit", "Consumer-unit replacement", "Upgrade the fuse board with modern protective devices, testing, labelling and certification.", "£600–£1,200", "£450", "1 day"],
    ],
  },
  {
    slug: "flooring-carpets", name: "Flooring & carpets", location: "Indoor", illustration: "flooring",
    description: "Compare the visible floor finish alongside the preparation that makes it perform properly.",
    factors: ["Subfloor moisture and flatness", "Removal and disposal of old finishes", "Material grade and laying pattern", "Trims, skirtings and door adjustments"],
    jobs: [
      ["flooring", "Flooring installation", "Install a new domestic floor with suitable underlay, trims and essential subfloor preparation.", "£25–£120/m²", "£500", "1–5 days"],
      ["carpet-fitting", "Carpet fitting", "Supply and fit carpet, underlay, grippers and thresholds to prepared rooms or stairs.", "£20–£60/m²", "£250", "Half–2 days"],
      ["lvt-flooring", "Luxury vinyl flooring", "Prepare and install click or bonded luxury vinyl tile for a durable, even finish.", "£45–£90/m²", "£600", "2–5 days"],
      ["floor-screeding", "Floor screeding", "Lay a level bonded, unbonded or floating screed ready for the specified floor finish.", "£18–£35/m²", "£600", "1–3 days plus curing"],
    ],
  },
  {
    slug: "decorating-plastering", name: "Painting, decorating & plastering", location: "Indoor", illustration: "plastering",
    description: "Allow for surface preparation and protection as well as the final decorative finish.",
    factors: ["Condition of existing surfaces", "Furniture protection and access", "Number of coats and finish quality", "Repairs, drying time and final decoration"],
    jobs: [
      ["plastering", "Room plastering", "Prepare and skim walls in a standard room, with local repairs and beads where needed.", "£500–£1,200", "£350", "2–4 days"],
      ["room-painting", "Room painting", "Prepare and repaint walls, ceiling and woodwork in a typical bedroom or living room.", "£450–£1,100", "£300", "2–4 days"],
      ["wallpapering", "Wallpaper hanging", "Prepare walls and hang patterned or plain wallpaper with neat joins and trimming.", "£350–£900", "£250", "1–3 days"],
      ["ceiling-plastering", "Ceiling plastering", "Overboard or prepare a ceiling before skimming to a smooth paint-ready finish.", "£450–£1,000", "£300", "1–3 days"],
    ],
  },
  {
    slug: "plumbing-heating", name: "Plumbing & heating", location: "Indoor", illustration: "heating",
    description: "Plan heating and water-system upgrades with the right registration, commissioning and controls.",
    factors: ["Fuel type and required registration", "Pipework route and system condition", "Controls, flushing and balancing", "Commissioning and certification"],
    jobs: [
      ["boiler-replacement", "Boiler replacement", "Replace a domestic boiler, including standard controls, flushing and commissioning.", "£2,200–£4,500", "£1,800", "1–3 days"],
      ["radiator-installation", "Radiator installation", "Replace or add a radiator with valves, pipe alterations, refilling and balancing.", "£250–£650 each", "£180 each", "2–5 hours"],
      ["underfloor-heating", "Underfloor heating", "Install electric or wet underfloor heating with controls and suitable floor build-up.", "£60–£140/m²", "£1,200", "2–7 days"],
      ["hot-water-cylinder", "Hot-water cylinder", "Replace or upgrade a vented or unvented cylinder with valves, controls and commissioning.", "£1,200–£3,000", "£900", "1–2 days"],
    ],
  },
  {
    slug: "drainage", name: "Drainage", location: "Outdoor", illustration: "plumber",
    description: "Diagnose drainage faults before selecting clearance, repair or replacement work.",
    factors: ["Depth, length and access to the run", "CCTV surveys and fault location", "Excavation versus no-dig repair", "Waste, reinstatement and permits"],
    jobs: [
      ["drain-unblocking", "Drain unblocking", "Clear a domestic blockage using rods or jetting and confirm that the line is flowing.", "£100–£350", "£90", "1–3 hours"],
      ["drain-relining", "Drain relining", "Install a cured liner through a damaged drain run where excavation can be avoided.", "£100–£250 per metre", "£900", "1–2 days"],
      ["soakaway", "Soakaway installation", "Excavate and install a rainwater soakaway sized for the roof area and ground conditions.", "£1,500–£5,000", "£1,000", "2–5 days"],
      ["septic-tank", "Septic-tank replacement", "Replace an off-mains drainage tank and connect compliant treatment and discharge arrangements.", "£7,000–£15,000", "£5,000", "1–3 weeks"],
    ],
  },
  {
    slug: "driveways-paving", name: "Driveways & paving", location: "Outdoor", illustration: "driveway",
    description: "Compare surface choices only after allowing for excavation, sub-base, edging and drainage.",
    factors: ["Excavation and spoil removal", "Sub-base depth and ground conditions", "Drainage and permitted-development rules", "Edging, steps and access restrictions"],
    jobs: [
      ["driveway", "Block-paved driveway", "Install a block-paved drive over a properly compacted sub-base with edging and drainage.", "£80–£130/m²", "£2,500", "4–10 days"],
      ["tarmac-driveway", "Tarmac driveway", "Lay a durable tarmac parking surface with suitable base courses and neat perimeter details.", "£60–£100/m²", "£2,200", "3–7 days"],
      ["resin-driveway", "Resin-bound driveway", "Install a smooth permeable resin-bound surface on a sound new or existing base.", "£90–£140/m²", "£3,000", "4–8 days"],
      ["patio", "Patio installation", "Lay a paved outdoor seating area with falls, jointing, steps and drainage details.", "£80–£180/m²", "£1,800", "3–10 days"],
    ],
  },
  {
    slug: "extensions", name: "Extensions", location: "Outdoor", illustration: "extension",
    description: "Build a whole-project allowance that includes design, structure, envelope, services and finishes.",
    factors: ["Ground conditions and foundations", "Steelwork and structural openings", "Access, scaffolding and waste", "Glazing, services and room specification"],
    jobs: [
      ["extension", "Single-storey extension", "Add ground-floor space with foundations, structure, weatherproofing, services and internal finishes.", "£2,200–£3,500/m²", "£40,000", "3–6 months"],
      ["double-storey-extension", "Double-storey extension", "Create two floors of additional space with structural connections, access and coordinated services.", "£2,000–£3,300/m²", "£80,000", "4–8 months"],
      ["porch", "New porch", "Build an enclosed entrance porch with foundations, roof, door, glazing and basic electrics.", "£4,000–£12,000", "£3,000", "1–3 weeks"],
      ["conservatory", "Conservatory", "Install a glazed garden room with base, insulated floor and a specified roof system.", "£12,000–£35,000", "£9,000", "3–8 weeks"],
    ],
  },
  {
    slug: "gardens-fences", name: "Gardens, sheds, fences & gates", location: "Outdoor", illustration: "landscaper",
    description: "Price garden improvements with access, ground preparation, materials and waste included.",
    factors: ["Garden access and level changes", "Ground clearance and preparation", "Material grade and treatment", "Waste removal and aftercare"],
    jobs: [
      ["garden-clearance", "Garden clearance", "Cut back overgrowth, remove unwanted material and leave an agreed area ready for its next use.", "£300–£1,500", "£180", "1–4 days"],
      ["fencing", "Garden fencing", "Remove and replace fence panels, posts, gravel boards and gates along a defined boundary.", "£90–£180 per metre", "£700", "2–6 days"],
      ["decking", "Garden decking", "Build a treated timber or composite deck over a stable frame with steps and edge details.", "£120–£250/m²", "£2,000", "3–10 days"],
      ["artificial-grass", "Artificial grass", "Prepare, edge and install a drained artificial lawn with a stable compacted base.", "£60–£110/m²", "£1,500", "2–6 days"],
    ],
  },
  {
    slug: "gutters-roofline", name: "Guttering, fascias & soffits", location: "Outdoor", illustration: "roofing",
    description: "Maintain the roof edge and rainwater path before leaks damage walls, timbers or foundations.",
    factors: ["Building height and scaffold access", "Length and number of roof edges", "Timber decay behind existing boards", "Downpipe routes and drainage connections"],
    jobs: [
      ["gutter-replacement", "Gutter replacement", "Replace leaking gutters and downpipes with correct falls, outlets and secure brackets.", "£700–£2,000", "£450", "1–3 days"],
      ["fascia-soffit", "Fascia and soffit replacement", "Renew roofline boards and ventilation after checking the condition of supporting timbers.", "£2,000–£5,000", "£1,200", "3–7 days"],
      ["gutter-cleaning", "Gutter cleaning", "Clear accessible gutters and outlets, then check joints and downpipe flow.", "£80–£250", "£60", "1–3 hours"],
      ["roofline-repair", "Roofline repair", "Repair local gutter, fascia or soffit defects without replacing the entire elevation.", "£250–£1,200", "£150", "Half–2 days"],
    ],
  },
  {
    slug: "energy-saving", name: "Solar power & energy saving", location: "Outdoor", illustration: "heating",
    description: "Compare energy upgrades using system sizing, expected performance and certification—not headline capacity alone.",
    factors: ["Property heat demand or electricity use", "Roof orientation, shading and structure", "Electrical and heating-system upgrades", "Accreditation, warranties and commissioning"],
    jobs: [
      ["solar-panels", "Solar panels", "Install a domestic photovoltaic array with inverter, scaffold, electrical connection and commissioning.", "£5,000–£8,500", "£4,000", "1–3 days"],
      ["battery-storage", "Home battery storage", "Add a compatible battery system to store solar generation or shift grid electricity use.", "£4,000–£9,000", "£3,000", "1–2 days"],
      ["heat-pump", "Air-source heat pump", "Design and install a heat-pump system with suitable emitters, controls and commissioning.", "£8,000–£18,000", "£6,000", "3–8 days"],
      ["loft-insulation", "Loft insulation", "Top up accessible loft insulation while maintaining ventilation and safe service clearances.", "£500–£1,500", "£350", "Half–2 days"],
    ],
  },
  {
    slug: "external-finishes", name: "External painting & rendering", location: "Outdoor", illustration: "plastering",
    description: "Protect external walls with the preparation, access and weather window the finish requires.",
    factors: ["Scaffold and difficult access", "Cracks, damp and substrate repairs", "Coating or render system", "Elevation area and architectural details"],
    jobs: [
      ["exterior-painting", "Exterior house painting", "Prepare and repaint masonry, trims and agreed joinery using suitable exterior coatings.", "£1,500–£6,000", "£900", "3–10 days"],
      ["rendering", "House rendering", "Apply a traditional or proprietary render system over a correctly prepared external substrate.", "£60–£120/m²", "£4,000", "1–3 weeks"],
      ["render-repair", "Render repair", "Remove failed areas, repair cracks and blend new render before applying compatible decoration.", "£500–£3,000", "£300", "1–5 days"],
      ["pebble-dash", "Pebble-dash finish", "Prepare elevations and apply a durable wet-dash or dry-dash external finish.", "£70–£120/m²", "£4,500", "1–3 weeks"],
    ],
  },
  {
    slug: "roofs-chimneys", name: "Roofs & chimneys", location: "Outdoor", illustration: "roofing",
    description: "Separate access and strip-off from the covering, timber and weathering details in every roofing quote.",
    factors: ["Roof size, pitch and complexity", "Tile, slate or membrane specification", "Scaffold, permits and access", "Timber, chimney and leadwork repairs"],
    jobs: [
      ["roofing", "Roof replacement", "Strip and renew a pitched roof covering with membrane, battens, ventilation and flashings.", "£6,000–£15,000", "£5,000", "1–3 weeks"],
      ["flat-roof", "Flat-roof replacement", "Renew a garage or extension roof using felt, EPDM or GRP with compatible edge details.", "£1,800–£6,000", "£1,200", "2–5 days"],
      ["roof-repair", "Roof repair", "Diagnose and repair local slipped coverings, failed flashings or storm damage.", "£250–£1,500", "£180", "Half–2 days"],
      ["chimney-repointing", "Chimney repointing", "Rake out and renew failing chimney joints, including safe access and local leadwork checks.", "£800–£2,500", "£500", "2–5 days"],
    ],
  },
] as const;

export const COST_CATEGORIES: readonly CostCategory[] = CATEGORY_SEEDS.map((category) => ({
  slug: category.slug,
  name: category.name,
  description: category.description,
  location: category.location,
  illustration: category.illustration,
  factors: category.factors,
  guideSlugs: COST_JOB_LISTINGS
    .filter((job) => job.categorySlugs.includes(category.slug))
    .map((job) => job.slug),
}));

export const COST_GUIDES: readonly CostGuide[] = CATEGORY_SEEDS.flatMap((category) =>
  category.jobs.map(([slug, shortTitle, summary, typicalRange, from, duration]) => ({
    slug,
    categorySlug: category.slug,
    category: category.name,
    shortTitle,
    title: `${shortTitle} costs in the UK`,
    summary,
    typicalRange,
    from,
    duration,
    illustration: category.illustration,
    items: [
      { label: "Starting allowance", range: `From ${from}`, note: "For a straightforward, accessible job with a standard specification." },
      { label: "Typical UK project", range: typicalRange, note: "An early planning range before a tradesperson inspects the property." },
      { label: "Likely programme", range: duration, note: "Site time varies with preparation, sequencing, approvals and drying periods." },
    ],
    factors: category.factors,
  })),
);

export const COST_GUIDE_BY_SLUG = new Map(COST_GUIDES.map((guide) => [guide.slug, guide]));
export const COST_CATEGORY_BY_SLUG = new Map(COST_CATEGORIES.map((category) => [category.slug, category]));

const FEATURED_SLUGS = ["bathroom", "kitchen", "extension", "loft-conversion", "roofing", "driveway", "flooring", "plastering"] as const;
export const FEATURED_COST_GUIDES = FEATURED_SLUGS.map((slug) => COST_GUIDE_BY_SLUG.get(slug)).filter((guide): guide is CostGuide => Boolean(guide));
