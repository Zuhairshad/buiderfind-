export {
  COST_CATEGORIES,
  COST_CATEGORY_BY_SLUG,
  COST_GUIDES,
  COST_GUIDE_BY_SLUG,
  FEATURED_COST_GUIDES,
} from "@/data/cost-guides";
export type { CostCategory, CostGuide } from "@/data/cost-guides";
export { COST_JOB_BY_SLUG, COST_JOB_LISTINGS } from "@/data/cost-job-inventory";
export type { CostJobListing } from "@/data/cost-job-inventory";

import type { TradeIllustrationVariant } from "@/components/TradeIllustrations";

export type NearMeGuide = {
  slug: string;
  tradeSlug: string;
  title: string;
  summary: string;
  checks: readonly string[];
  illustration: TradeIllustrationVariant;
};

export const NEAR_ME_GUIDES: readonly NearMeGuide[] = [
  { slug: "builders", tradeSlug: "builders", title: "Builders Near Me", summary: "Compare local builders for extensions, conversions and structural renovations, with references from similar UK projects.", checks: ["Recent comparable projects", "Public liability insurance", "Itemised written quotation", "Contract and staged payments"], illustration: "builder" },
  { slug: "plumbers", tradeSlug: "plumbers", title: "Plumbers Near Me", summary: "Find a nearby plumber for urgent leaks or planned pipework, and establish the call-out charge before attendance.", checks: ["Call-out and hourly rates", "Parts and warranty", "Gas Safe status where relevant", "Making-good exclusions"], illustration: "plumber" },
  { slug: "electricians", tradeSlug: "electricians", title: "Electricians Near Me", summary: "Choose an electrician who will test the installation and provide the correct certificate for the work completed.", checks: ["Competent-person registration", "Electrical certification", "Testing included", "Building Regulations notification"], illustration: "electrician" },
  { slug: "roofers", tradeSlug: "roofers", title: "Roofers Near Me", summary: "Ask local roofers to diagnose the cause, photograph inaccessible defects and price access and disposal clearly.", checks: ["Written roof diagnosis", "Scaffold allowance", "Material specification", "Workmanship guarantee"], illustration: "roofing" },
  { slug: "gardeners", tradeSlug: "gardeners", title: "Gardeners and Landscapers Near Me", summary: "Match the contractor to the job: routine garden care and structural landscaping require different equipment and experience.", checks: ["Relevant project photographs", "Waste-carrier arrangements", "Plant and material specification", "Maintenance after completion"], illustration: "landscaper" },
  { slug: "bathroom-fitters", tradeSlug: "bathrooms", title: "Bathroom Fitters Near Me", summary: "Find a fitter who can coordinate plumbing, waterproofing, tiling, electrics and final commissioning.", checks: ["Named lead installer", "Waterproofing system", "Electrical certification", "Product and labour warranties"], illustration: "bathroom" },
  { slug: "heating-engineers", tradeSlug: "heating", title: "Heating Engineers Near Me", summary: "Use an appropriately registered engineer for gas, oil or solid-fuel work and compare the proposed system design, not only the boiler price.", checks: ["Correct trade registration", "Heat-loss assessment", "Controls and flushing", "Commissioning paperwork"], illustration: "heating" },
  { slug: "kitchen-fitters", tradeSlug: "kitchens", title: "Kitchen Fitters Near Me", summary: "Compare fitters on planning, scribing, service coordination and how they handle damaged or missing components.", checks: ["Detailed installation scope", "Trade coordination", "Worktop templating", "Snagging and handover"], illustration: "kitchen" },
] as const;

export const NEAR_ME_BY_SLUG = new Map(NEAR_ME_GUIDES.map((guide) => [guide.slug, guide]));
