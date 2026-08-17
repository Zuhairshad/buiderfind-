export const RESOURCE_HUB_SLUGS = ["guides", "how-to", "advice", "ideas", "blog", "trades-advice", "problems", "questions"] as const;
export type ResourceHubSlug = (typeof RESOURCE_HUB_SLUGS)[number];

export type ResourceArticle = {
  hub: ResourceHubSlug;
  slug: string;
  title: string;
  standfirst: string;
  readTime: string;
  sections: readonly { title: string; body: string }[];
  takeaways: readonly string[];
};

export const RESOURCE_HUBS: Readonly<Record<ResourceHubSlug, { label: string; title: string; intro: string }>> = {
  guides: { label: "Homeowner guides", title: "Plan home improvements with fewer surprises", intro: "Plain-English UK guides covering scope, compliance, sequencing and handover before you ask for quotes." },
  "how-to": { label: "How-to library", title: "Practical steps for better building projects", intro: "Short, useful walkthroughs for preparing a job, comparing responses and managing work in your home." },
  advice: { label: "Homeowner advice", title: "Make confident hiring and project decisions", intro: "Independent guidance on checks, contracts, payments, communication and the choices that affect quality." },
  ideas: { label: "Project ideas", title: "Make every metre work harder", intro: "Considered renovation ideas grounded in usable layouts, maintainable materials and realistic UK homes." },
  blog: { label: "BuilderFind journal", title: "The practical side of improving a home", intro: "Seasonal maintenance, marketplace updates and thoughtful perspectives on planning residential work." },
  "trades-advice": { label: "For tradespeople", title: "Run clearer customer conversations", intro: "Guidance for UK tradespeople on profiles, surveys, quotations, variations, handover and useful reviews." },
  problems: { label: "Home problems", title: "Understand the symptom before choosing the trade", intro: "Common household problems, likely causes and the point at which a qualified specialist should inspect." },
  questions: { label: "Homeowner questions", title: "Direct answers to common project questions", intro: "Concise UK-focused answers that help you ask a trade or professional the right follow-up question." },
};

export const RESOURCE_ARTICLES: readonly ResourceArticle[] = [
  {
    hub: "guides", slug: "planning-a-house-extension", title: "Planning a House Extension: From Brief to Build", readTime: "8 min read",
    standfirst: "A successful extension starts with the household problem you need to solve, then moves through design, approvals, pricing and a controlled build.",
    sections: [
      { title: "Start with outcomes", body: "Write down how the new space must work, which rooms it should connect and what natural light, storage and privacy matter. This gives a designer something more useful than a request for the largest possible footprint." },
      { title: "Build the approval route", body: "Planning permission and Building Regulations are separate. Some projects may use permitted development rights, but drawings, structural design, inspections and party-wall considerations can still apply." },
      { title: "Price one defined scheme", body: "Give each builder the same drawings and specification. Mark provisional items clearly and keep the kitchen, glazing, utility diversions and external works visible in the overall budget." },
    ], takeaways: ["Define the purpose before the floor area", "Confirm approvals before committing to a start", "Compare itemised quotes against one specification"],
  },
  {
    hub: "guides", slug: "preparing-for-a-house-rewire", title: "How to Prepare for a Full House Rewire", readTime: "6 min read",
    standfirst: "A rewire is disruptive, but early decisions on sockets, lighting, data and making good can keep the programme controlled.",
    sections: [
      { title: "Map how rooms are used", body: "Mark furniture, appliances, work areas and future equipment on a simple plan. Decide where charging, television, data, outdoor power and smoke detection are required." },
      { title: "Agree access and finishes", body: "Rewiring can involve lifted floors and chased walls. Confirm whether the property will be occupied, who moves furniture and whether plaster repairs and decoration are included." },
      { title: "Keep the paperwork", body: "The electrician should test the completed installation and provide the appropriate electrical certificate. Confirm who handles any required Building Regulations notification." },
    ], takeaways: ["Plan outlets around real furniture", "Clarify making good", "Do not finish without certification"],
  },
  {
    hub: "how-to", slug: "write-a-useful-trade-brief", title: "How to Write a Job Brief Tradespeople Can Quote", readTime: "5 min read",
    standfirst: "A useful brief describes the current condition, intended result, constraints and decisions already made without pretending the scope is fully known.",
    sections: [
      { title: "Describe what exists", body: "Include property type, approximate age, room dimensions, visible damage and previous work. Clear photographs should show the whole area as well as close details." },
      { title: "State the finish", body: "Name preferred materials or performance requirements where known. If you want the trade to recommend a system, say what matters most: longevity, appearance, maintenance or budget." },
      { title: "Expose constraints", body: "Mention parking, stairs, restricted hours, occupied rooms, shared access, pets and deadlines. Hidden constraints tend to become later cost changes." },
    ], takeaways: ["Show context and detail", "Separate requirements from preferences", "Make access constraints visible"],
  },
  {
    hub: "how-to", slug: "compare-building-quotes", title: "How to Compare Building Quotes Line by Line", readTime: "7 min read",
    standfirst: "Put each response into the same structure so missing work and optimistic allowances become visible before you choose.",
    sections: [
      { title: "Normalise the scope", body: "List demolition, structure, services, finishes, access, waste, approvals and handover. Record whether each item is included, excluded or provisional in every quote." },
      { title: "Challenge allowances", body: "A low provisional sum can make a quote look competitive while pushing the real cost into later variations. Ask what quantity and product level the allowance assumes." },
      { title: "Compare delivery as well as price", body: "Check supervision, subcontractors, programme, payment stages, insurance, warranty and how defects will be resolved. The strongest proposal is the one you can administer clearly." },
    ], takeaways: ["Use one comparison table", "Investigate provisional sums", "Link payments to completed stages"],
  },
  {
    hub: "advice", slug: "deposits-and-stage-payments", title: "Deposits and Stage Payments for Building Work", readTime: "6 min read",
    standfirst: "Payment terms should support reasonable mobilisation without leaving either party exposed far ahead of completed work.",
    sections: [
      { title: "Understand the deposit", body: "A deposit may cover booked time or ordered materials, but the amount and refund position should be written down. Large unexplained cash advances are a warning sign." },
      { title: "Define measurable stages", body: "Use stages that can be seen and inspected, such as foundations complete or roof watertight. Avoid calendar-only payments that arrive regardless of progress." },
      { title: "Keep a final balance", body: "A sensible final payment after completion and agreed snagging gives both parties a clear route to handover. Keep invoices, receipts and variation approvals together." },
    ], takeaways: ["Record what the deposit secures", "Pay against visible progress", "Keep evidence of every payment"],
  },
  {
    hub: "advice", slug: "checking-trade-credentials", title: "Checking Electrical, Gas and Other Trade Credentials", readTime: "5 min read",
    standfirst: "A logo is not enough: check the person, business, work category and current registration against the relevant official source.",
    sections: [
      { title: "Match the registration to the work", body: "Gas engineers are registered for specific appliance categories. Electrical schemes and certification routes also differ, so explain the exact work before checking competence." },
      { title: "Verify independently", body: "Use the official register and contact details rather than relying only on a badge in an advert. Ask which certificate or notification you will receive at completion." },
      { title: "Separate membership from responsibility", body: "Trade association membership can be useful but does not replace a written scope, insurance, references or your own project checks." },
    ], takeaways: ["Check the actual individual or business", "Confirm the category of work", "Know the completion paperwork in advance"],
  },
  {
    hub: "ideas", slug: "small-bathroom-layout-ideas", title: "Small Bathroom Layout Ideas That Stay Practical", readTime: "6 min read",
    standfirst: "Good small bathrooms protect movement, cleaning access and storage before adding decorative features.",
    sections: [
      { title: "Protect the clear route", body: "Keep door swings, shower access and the space in front of the toilet usable. A pocket or outward-opening door may help only where structure and regulations allow." },
      { title: "Concentrate plumbing sensibly", body: "Keeping fixtures near existing soil and water routes can reduce cost and boxing. Wall-hung fittings still need accessible frames and maintenance routes." },
      { title: "Use light in layers", body: "Combine safe task lighting, general light and a well-positioned mirror. Electrical equipment must suit the bathroom zone and be installed correctly." },
    ], takeaways: ["Draw door and shower movement", "Keep maintenance access", "Use bathroom-safe lighting"],
  },
  {
    hub: "ideas", slug: "kitchen-storage-that-earns-its-space", title: "Kitchen Storage Ideas That Earn Their Space", readTime: "5 min read",
    standfirst: "Storage works best when it follows the sequence of unpacking, preparing, cooking, serving and cleaning.",
    sections: [
      { title: "Store by activity", body: "Keep everyday items close to where they are used. A tall pantry near the food-preparation area can be more useful than several distant wall cabinets." },
      { title: "Plan corners deliberately", body: "Corner mechanisms add cost and can reduce usable volume. Sometimes a blind corner plus wider drawers provides simpler, more durable storage." },
      { title: "Leave services accessible", body: "Do not make stop taps, appliance connections or meters impossible to reach. Removable panels can preserve a clean finish without turning maintenance into demolition." },
    ], takeaways: ["Design around tasks", "Compare corner mechanisms with drawers", "Keep service points reachable"],
  },
  {
    hub: "blog", slug: "autumn-home-maintenance-checklist", title: "An Autumn Maintenance Checklist for UK Homes", readTime: "7 min read",
    standfirst: "A short inspection before persistent wet and cold weather can prevent small drainage and envelope defects becoming expensive internal damage.",
    sections: [
      { title: "Start at roof level", body: "From a safe viewpoint, look for displaced tiles, failing flashings and overflowing gutters. Do not climb onto a roof without suitable competence and equipment." },
      { title: "Follow the water", body: "Check downpipes discharge properly and ground levels do not direct water toward walls. Clear gullies and note staining that suggests repeated overflow." },
      { title: "Test heating early", body: "Run the heating before the first cold spell, check radiator performance and arrange qualified servicing where required. Early faults are easier to schedule than winter breakdowns." },
    ], takeaways: ["Inspect safely from ground level", "Keep rainwater moving away from walls", "Test heating before demand peaks"],
  },
  {
    hub: "blog", slug: "renovation-decisions-to-make-early", title: "Six Renovation Decisions Worth Making Early", readTime: "6 min read",
    standfirst: "Late choices create rework. Early decisions on layouts, services and finish interfaces protect both programme and budget.",
    sections: [
      { title: "Fix service positions", body: "Kitchen plans, bathroom layouts, radiators, lighting and data points influence first-fix work. Confirm them before walls and floors are closed." },
      { title: "Resolve material junctions", body: "Floor thicknesses, thresholds, skirting, worktop upstands and tile edges need coordinated details. Small mismatches are conspicuous at handover." },
      { title: "Choose who signs off", body: "Record who books inspections, submits notifications, commissions equipment and collects certificates. Missing paperwork is harder to reconstruct later." },
    ], takeaways: ["Freeze service layouts before first fix", "Draw important junctions", "Assign compliance responsibilities"],
  },
  {
    hub: "trades-advice", slug: "quote-variations-clearly", title: "How to Quote and Record Variations Clearly", readTime: "6 min read",
    standfirst: "A variation process protects margin and customer trust by making changed work visible before cost and programme move.",
    sections: [
      { title: "Define the original scope", body: "An itemised quotation and exclusions list create the baseline. If the baseline is vague, it becomes difficult to show what has genuinely changed." },
      { title: "Price before proceeding", body: "Describe the reason, changed work, price effect and time effect. Obtain written approval before starting except where immediate safety action is necessary." },
      { title: "Update the running total", body: "Keep one variation schedule rather than scattering approvals across messages. Include agreed additions and omissions on the next invoice." },
    ], takeaways: ["Start from an itemised scope", "Record time as well as cost", "Maintain one variation log"],
  },
  {
    hub: "trades-advice", slug: "photograph-work-for-your-profile", title: "Photographing Trade Work for a Stronger Profile", readTime: "5 min read",
    standfirst: "Useful project photographs show the problem, process and finished detail without exposing customer information.",
    sections: [
      { title: "Get permission", body: "Agree what can be photographed and published. Avoid addresses, personal items, documents, vehicle plates and identifiable people unless explicit consent covers them." },
      { title: "Show the sequence", body: "Capture the original condition, important hidden preparation and the finished result. Process images help customers understand workmanship they cannot see later." },
      { title: "Keep images honest", body: "Use natural perspective, tidy the working area and avoid filters that distort colour or hide defects. Add a short factual project description." },
    ], takeaways: ["Obtain publication consent", "Show preparation as well as finish", "Protect customer privacy"],
  },
  {
    hub: "problems", slug: "damp-patch-on-an-internal-wall", title: "What Can Cause a Damp Patch on an Internal Wall?", readTime: "6 min read",
    standfirst: "The position, timing and moisture source matter. Treating the visible stain before diagnosing the cause often wastes money.",
    sections: [
      { title: "Look for a pattern", body: "A patch after rain suggests a different route from moisture appearing during showering or when heating is off. Note weather, room use and whether the patch changes." },
      { title: "Check nearby services", body: "Supply pipes, wastes, heating pipes and appliance connections can leak slowly. A plumber may pressure-test or expose a small area when the source is concealed." },
      { title: "Consider condensation", body: "Cold surfaces, limited ventilation and high internal humidity can create local mould or dampness. Insulation and ventilation need to be considered together." },
    ], takeaways: ["Record when the patch changes", "Investigate the moisture source", "Allow the fabric to dry before redecorating"],
  },
  {
    hub: "problems", slug: "sudden-low-water-pressure", title: "Why Has My Water Pressure Suddenly Dropped?", readTime: "5 min read",
    standfirst: "Separate a supply-wide issue from a fault at one outlet before replacing taps, pumps or cylinders.",
    sections: [
      { title: "Compare outlets", body: "Check hot and cold at more than one tap and ask whether neighbouring properties are affected. A single weak outlet may have a blocked aerator or local valve issue." },
      { title: "Check safe basics", body: "Confirm the internal stop tap has not been partly closed and look for obvious leakage. Do not operate unfamiliar valves on pressurised hot-water equipment." },
      { title: "Bring in the right specialist", body: "A plumber can measure static pressure and flow, inspect filters and trace internal restrictions. Supply-side issues may need the water company." },
    ], takeaways: ["Test more than one outlet", "Check for leaks", "Measure before buying equipment"],
  },
  {
    hub: "questions", slug: "do-i-need-planning-permission-for-an-extension", title: "Do I Need Planning Permission for an Extension?", readTime: "4 min read",
    standfirst: "Some extensions can use permitted development rights, but the answer depends on the property, previous changes, location and proposed design.",
    sections: [
      { title: "Planning and Building Regulations differ", body: "Planning controls the development and its impact, while Building Regulations address matters such as structure, fire safety, insulation and drainage. A project may need one, both or a different approval route." },
      { title: "Check the property history", body: "Rights can be restricted by previous extensions, planning conditions, listed status, conservation areas or an Article 4 direction. Flats generally do not have the same permitted development rights as houses." },
      { title: "Confirm before building", body: "Use the relevant local planning authority and obtain appropriate professional advice. A lawful development certificate can provide useful evidence where permitted development is relied on." },
    ], takeaways: ["Do not confuse planning with Building Regulations", "Check property-specific restrictions", "Keep written approval evidence"],
  },
  {
    hub: "questions", slug: "how-many-trade-quotes-should-i-get", title: "How Many Quotes Should I Get for Building Work?", readTime: "4 min read",
    standfirst: "Three properly scoped quotes are often more useful than a larger set of vague prices, but complex work may need an earlier paid design or survey stage.",
    sections: [
      { title: "Give everyone the same information", body: "Issue the same drawings, measurements and specification. Answer material questions for every bidder so comparisons remain fair." },
      { title: "Look beyond the average", body: "A very low quote may omit work or underestimate risk; a high quote may include a more complete service. Ask each trade to explain assumptions and exclusions." },
      { title: "Respect survey effort", body: "Detailed pricing takes time. Shortlist suitable businesses first, communicate the decision promptly and do not use one contractor's design work to negotiate another price without permission." },
    ], takeaways: ["Aim for comparable scope", "Investigate outliers", "Shortlist before requesting detailed work"],
  },
] as const;

export const articlesForHub = (hub: ResourceHubSlug) => RESOURCE_ARTICLES.filter((article) => article.hub === hub);
export const findResourceArticle = (hub: ResourceHubSlug, slug: string) => RESOURCE_ARTICLES.find((article) => article.hub === hub && article.slug === slug);
export const metadataForResource = (hub: ResourceHubSlug, slug: string) => {
  const article = findResourceArticle(hub, slug);
  return article ? { title: `${article.title} | BuilderFind`, description: article.standfirst } : {};
};
