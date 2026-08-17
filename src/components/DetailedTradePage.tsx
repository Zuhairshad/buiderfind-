"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserAvatar } from "@/components/UserAvatar";
import { DEMO_TRADESPEOPLE } from "@/data/demo-tradespeople";
import { TradeIllustration } from "@/components/TradeIllustrations";

// ─── TRADE CONFIG ─────────────────────────────────────────────────────────────

const TRADE_CONFIG: Record<string, {
  name: string;
  plural: string;
  heading: string;
  subheading: string;
  intro: string;
  jobs: string[];
  guides: { title: string; from: string; desc: string }[];
  nearMe: string[];
  faqs: { q: string; a: string }[];
}> = {
  builders: {
    name: "Builder", plural: "Builders",
    heading: "Hire a Builder for Renovations, Conversions and New Builds",
    subheading: "Compare local builders for structural projects, major refurbishments and carefully managed building work.",
    intro: "Hiring a builder in the UK means checking experience on projects like yours, insurance, references and a clear written scope. Compare itemised quotes that cover labour, materials, waste removal, Building Regulations responsibilities and the proposed payment schedule.",
    jobs: ["House Extensions", "Loft Conversions", "Garage Conversions", "Structural Renovations"],
    guides: [
      { title: "20m² House Extension", from: "£40,000", desc: "Typical UK build costs are about £40,000–£60,000 before premium finishes." },
      { title: "Dormer Loft Conversion", from: "£45,000", desc: "Allow roughly £45,000–£75,000 depending on roof structure, stairs and location." },
      { title: "Single Garage Conversion", from: "£8,500", desc: "Straightforward 15m² conversions commonly cost £8,500–£20,000." },
      { title: "Load-bearing Wall Removal", from: "£2,000", desc: "Budget around £2,000–£5,000 including steelwork, making good and engineering." },
    ],
    nearMe: ["House builders near Manchester", "Renovation builders in London", "General builders near Birmingham", "Local builders in Leeds"],
    faqs: [
      { q: "What should I check before appointing a builder?", a: "Ask for recent references from similar projects, evidence of public liability insurance, company details and any relevant trade memberships. Visit a completed job if possible and confirm who will supervise the site each day." },
      { q: "What should a builder's written quote include?", a: "It should define the drawings and specification, labour, materials, VAT, skips, scaffolding, provisional sums, exclusions, start date and estimated duration. An itemised quote makes genuine comparisons much easier." },
      { q: "Should I use a building contract?", a: "Yes for substantial work. A suitable written contract should record the scope, staged payments, variations, delays, insurance, defects process and how disputes will be handled." },
      { q: "Who arranges Building Regulations approval?", a: "The homeowner remains responsible for ensuring approval is in place, although a builder or designer may handle the application and inspections. Agree responsibility in writing and retain the completion certificate." },
      { q: "How should I pay a builder for a large project?", a: "Use agreed stage payments linked to completed work rather than large cash advances. Keep a sensible final balance until snagging is resolved and obtain invoices and receipts for every payment." },
    ],
  },
  plumbers: {
    name: "Plumber", plural: "Plumbers",
    heading: "Find a Plumber for Leaks, Pipework and Water Systems",
    subheading: "Get help with urgent water leaks or compare quotes for planned plumbing installations and upgrades.",
    intro: "A good UK plumber should diagnose the cause of a leak or pressure problem before pricing the repair, not simply replace the visible fitting. For planned work, ask whether the quote includes isolation, pipe routes, fittings, testing and reinstating walls or floors.",
    jobs: ["Emergency Leak Repairs", "Bathroom Pipework", "Hot-water Cylinders", "Taps and Toilets"],
    guides: [
      { title: "Emergency Plumber Call-out", from: "£100", desc: "Initial call-outs often run £100–£180, with parts and extended labour extra." },
      { title: "Leaking Pipe Repair", from: "£120", desc: "Accessible pipe repairs typically cost £120–£350 depending on damage and access." },
      { title: "Tap Replacement", from: "£100", desc: "Labour and a standard tap commonly total £100–£250 per fitting." },
      { title: "Unvented Cylinder Replacement", from: "£1,200", desc: "Supply and installation usually ranges from £1,200–£2,500 by capacity and access." },
    ],
    nearMe: ["Emergency plumber near Manchester", "Leak repair plumber in London", "Bathroom plumber near Birmingham", "Local plumber in Sheffield"],
    faqs: [
      { q: "What should I do before an emergency plumber arrives?", a: "If safe, close the internal stop tap, turn off affected appliances and collect escaping water. Do not touch electrical fittings near water, and tell the plumber where the leak appears and what you have isolated." },
      { q: "Is a plumber automatically qualified to work on gas?", a: "No. Anyone working on a gas boiler, pipe or appliance must be registered for that category of work on the Gas Safe Register; plumbing experience alone is not enough." },
      { q: "Why is my water pressure suddenly low?", a: "Possible causes include a local supply issue, a partly closed stop tap, a hidden leak, blocked fittings or a fault in an unvented system. A plumber can test flow and pressure to narrow it down." },
      { q: "Should plumbing repairs come with paperwork?", a: "Ask for an invoice describing the fault, parts fitted and any warranty. New unvented hot-water cylinders and some alterations may also require notification or certification under Building Regulations." },
      { q: "Can a plumber quote for hidden pipework without opening the area?", a: "They can give an estimate, but concealed leaks and damaged floors often make the final scope uncertain. Agree the investigation charge and how any extra work will be authorised before opening finishes." },
    ],
  },
  electricians: {
    name: "Electrician", plural: "Electricians",
    heading: "Choose an Electrician for Safe, Certified Home Electrical Work",
    subheading: "Compare electricians for rewires, consumer units, inspections and EV charging installations.",
    intro: "Electrical alterations in UK homes should be designed, installed and tested to the current BS 7671 standard, with Building Regulations notification where applicable. Ask the electrician which certificate you will receive, whether testing and remedial work are included, and who will notify the work if required.",
    jobs: ["Full House Rewires", "Consumer Unit Upgrades", "EICR Inspections", "EV Charger Installation"],
    guides: [
      { title: "Three-bedroom House Rewire", from: "£4,500", desc: "Typical occupied-home rewires cost about £4,500–£8,000 before redecoration." },
      { title: "Consumer Unit Upgrade", from: "£650", desc: "Modern metal units with testing commonly cost £650–£1,200." },
      { title: "Electrical Installation Condition Report", from: "£180", desc: "A domestic EICR generally costs £180–£350, excluding remedial work." },
      { title: "Home EV Charge Point", from: "£850", desc: "Standard supply and installation is often £850–£1,500 before any grant." },
    ],
    nearMe: ["Registered electrician near Manchester", "House rewire electrician in London", "EICR electrician near Birmingham", "EV charger installer in Bristol"],
    faqs: [
      { q: "Which electrical jobs need Building Regulations notification?", a: "In England, new circuits, consumer unit replacements and work in certain special locations are examples of notifiable work. Rules differ across UK nations, so confirm the route to compliance before work begins." },
      { q: "What certificate should an electrician provide?", a: "New installations and significant alterations normally require an Electrical Installation Certificate; smaller changes may receive a Minor Electrical Installation Works Certificate. An EICR records the condition of an existing installation." },
      { q: "How long will a full house rewire disrupt the property?", a: "Many rewires take around five to ten working days, depending on size, occupancy and access. Floorboards may be lifted and walls chased, so clarify making-good and redecoration before accepting the quote." },
      { q: "Can I use an EICR to price a consumer unit replacement?", a: "An EICR can identify defects and suitability, but the electrician may need further inspection to quote accurately. Ask whether bonding upgrades, circuit repairs and surge protection are included." },
      { q: "What should be checked before fitting an EV charger?", a: "The installer should assess supply capacity, earthing, cable route, charger location and any distribution network notification. They should also explain load management and provide installation certification." },
    ],
  },
  roofers: {
    name: "Roofer", plural: "Roofers",
    heading: "Find a Roofer for Leaks, Flat Roofs and Full Replacements",
    subheading: "Compare roofers who can diagnose water ingress and specify the right repair or replacement system.",
    intro: "Roof quotes should identify the failure rather than assume every leak needs a complete replacement. Ask UK roofers to state the covering, membrane, battens, ventilation, leadwork, scaffolding, waste removal and guarantee included in their price.",
    jobs: ["Pitched Roof Repairs", "Complete Re-roofing", "Flat Roof Systems", "Chimney and Leadwork"],
    guides: [
      { title: "Slipped Tile and Leak Repair", from: "£180", desc: "Minor accessible repairs often cost £180–£750 before scaffolding." },
      { title: "Semi-detached Roof Replacement", from: "£7,000", desc: "Tile or slate re-roofing typically ranges from £7,000–£15,000." },
      { title: "Garage Flat Roof Replacement", from: "£1,800", desc: "Felt, EPDM or GRP systems commonly cost £1,800–£4,000 by area and deck condition." },
      { title: "Fascia, Soffit and Gutter Renewal", from: "£1,200", desc: "A typical house installation can range from £1,200–£3,500." },
    ],
    nearMe: ["Roof repair near Manchester", "Flat roofer in London", "Emergency roofer near Birmingham", "Slate roofer in Leeds"],
    faqs: [
      { q: "How can a roofer trace a leak that appears away from the damage?", a: "Water can travel along felt, rafters and ceilings before becoming visible. A roofer should inspect coverings, flashings, valleys, penetrations and the loft, ideally during or soon after wet weather." },
      { q: "When is patch repair better than a complete re-roof?", a: "A local repair can be sensible when the surrounding covering and underlay remain sound. Widespread tile failure, brittle membrane, repeated leaks or a failing deck can make replacement better value." },
      { q: "Will my roofing quote include scaffolding?", a: "Do not assume it does. The quote should state the access method, scaffold lifts, permits if needed, protection for neighbouring property and whether scaffold remains for inspections." },
      { q: "Does replacing a roof require Building Regulations approval?", a: "Replacing a substantial portion of a roof covering can trigger Building Regulations requirements, including thermal performance. Check with the relevant local authority or approved inspector before starting." },
      { q: "What guarantee should I expect on a flat roof?", a: "Ask for separate details of the installer's workmanship cover and the manufacturer's system warranty. Confirm required maintenance, transfer terms and whether the deck and trims are included." },
    ],
  },
  plasterers: {
    name: "Plasterer", plural: "Plasterers",
    heading: "Hire a Plasterer for Smooth Walls, Ceilings and Render",
    subheading: "Compare plasterers for skimming, plasterboard, damaged surfaces and weather-resistant exterior finishes.",
    intro: "A lasting plaster finish depends on preparation, suction control and choosing a system suited to the existing wall or ceiling. When comparing UK plasterers, establish who will remove loose material, protect the room, handle beads and bonding coats, and leave the surface ready for decoration.",
    jobs: ["Wall and Ceiling Skimming", "Plasterboard and Dry Lining", "External Rendering", "Crack and Patch Repairs"],
    guides: [
      { title: "Skim a Standard Room", from: "£500", desc: "Walls in a typical room often cost £500–£1,000 depending on preparation." },
      { title: "Board and Plaster a Ceiling", from: "£450", desc: "A standard ceiling generally costs £450–£900 including boards and skim." },
      { title: "Render a House Exterior", from: "£4,000", desc: "Traditional or monocouche systems commonly range from £4,000–£12,000." },
      { title: "Cover a Textured Ceiling", from: "£350", desc: "Overboarding or skimming a small ceiling usually costs £350–£750 after assessment." },
    ],
    nearMe: ["Room plasterer near Manchester", "Ceiling skimming in London", "Rendering contractor near Birmingham", "Plaster repair in Bristol"],
    faqs: [
      { q: "How long should new plaster dry before painting?", a: "Wait until it has dried evenly to a pale colour; a thin skim may take several days while thicker work can take weeks. Ventilate gently and follow the plasterer's advice rather than forcing it with intense heat." },
      { q: "Can cracked plaster simply be skimmed over?", a: "Only after the cause has been assessed. Loose backgrounds, movement, moisture and failed lath need repair or reinforcement first, otherwise cracks may quickly return through the new finish." },
      { q: "Should old textured coatings be tested before disturbance?", a: "Some older textured coatings can contain asbestos. If age or composition is uncertain, arrange appropriate testing before sanding, scraping, drilling or removal." },
      { q: "What is the difference between skimming and replastering?", a: "Skimming adds a thin finish coat to a stable background. Replastering can involve removing failed material, applying base coats or new board, then finishing, so it takes longer and costs more." },
      { q: "Who moves sockets and radiators before plastering?", a: "Agree this before the start date. Electrical accessories and radiators may need safe isolation or removal by the relevant trade, while the plasterer usually protects boxes and works neatly around pipework." },
    ],
  },
  painters: {
    name: "Painter & Decorator", plural: "Painters & Decorators",
    heading: "Find a Painter and Decorator for a Durable, Clean Finish",
    subheading: "Compare decorators for careful preparation, interior colour schemes, wallpaper and exterior protection.",
    intro: "Professional decorating is largely about the preparation hidden beneath the final coat. Ask painters and decorators to specify repairs, filling, sanding, primer, paint brand and number of coats, plus how rooms, floors and exterior planting will be protected.",
    jobs: ["Interior Painting", "Exterior Masonry Painting", "Wallpaper Hanging", "Woodwork Finishing"],
    guides: [
      { title: "Paint a Bedroom", from: "£350", desc: "Walls, ceiling and woodwork typically cost £350–£800 including standard paint." },
      { title: "Decorate a Three-bedroom House", from: "£3,000", desc: "Whole-interior labour and materials often range from £3,000–£7,000." },
      { title: "Paint Exterior Masonry", from: "£1,200", desc: "A typical house exterior can cost £1,200–£4,000 before major repairs or access." },
      { title: "Wallpaper a Feature Wall", from: "£250", desc: "Preparation and hanging commonly cost £250–£600, excluding premium paper." },
    ],
    nearMe: ["Interior decorator near Manchester", "House painter in London", "Wallpaper hanger near Birmingham", "Exterior painter in Bristol"],
    faqs: [
      { q: "Why do decorating quotes vary so much for the same room?", a: "One quote may allow only light preparation while another includes crack repair, stain blocking, multiple coats and woodwork. Compare the stated preparation, products, coverage and exclusions rather than the total alone." },
      { q: "Who supplies the paint and wallpaper?", a: "Either arrangement can work, but record the exact brand, product, finish and colour. If you supply wallpaper, ask the decorator how many rolls to order and whether the batch numbers must match." },
      { q: "Can a decorator paint over fresh plaster?", a: "Only once the plaster is fully dry. The first coat must be suitable for new plaster and diluted or formulated as the manufacturer directs, followed by the specified finish coats." },
      { q: "How is exterior painting affected by UK weather?", a: "Surfaces need to be sound and sufficiently dry, with temperatures inside the coating manufacturer's limits. A decorator should plan around rain, direct heat and drying time rather than paint in unsuitable conditions." },
      { q: "Should I move furniture before decorating starts?", a: "Remove small and fragile items and agree who will move larger furniture. The decorator should explain how remaining furniture, flooring, fittings and access routes will be sheeted and protected." },
    ],
  },
  carpenters: {
    name: "Carpenter", plural: "Carpenters",
    heading: "Commission a Carpenter for Doors, Storage and Bespoke Joinery",
    subheading: "Find skilled carpenters for precise first-fix structure and made-to-measure second-fix woodwork.",
    intro: "Carpentry quotes should distinguish site carpentry from workshop-made joinery and specify the timber, sheet material, ironmongery and finish. For fitted work, confirm drawings, dimensions, access, scribing, decoration and who is responsible for removing old units.",
    jobs: ["Fitted Wardrobes", "Internal Door Hanging", "Skirting and Architraves", "Staircase Joinery"],
    guides: [
      { title: "Built-in Wardrobe", from: "£800", desc: "A straightforward fitted wardrobe usually costs £800–£1,400 before premium finishes." },
      { title: "Hang an Internal Door", from: "£100", desc: "Labour is commonly £100–£140 per door, with door and ironmongery extra." },
      { title: "Fit New Skirting Boards", from: "£20/m", desc: "Supply and fitting typically ranges from £20–£40 per linear metre." },
      { title: "Refurbish a Staircase", from: "£1,500", desc: "New handrails, spindles and finishing can range from £1,500–£5,000." },
    ],
    nearMe: ["Bespoke carpenter near Manchester", "Fitted wardrobe joiner in London", "Door hanging carpenter near Birmingham", "Staircase joiner in Leeds"],
    faqs: [
      { q: "What is the practical difference between carpentry and joinery?", a: "Joinery is often manufactured in a workshop, while carpentry commonly covers fitting and structural timber work on site. Many professionals do both, but specialist machinery may be needed for bespoke doors, windows or cabinetry." },
      { q: "What details should a fitted-furniture quote contain?", a: "Look for dimensions, drawings, internal layout, material thickness, edge treatment, hinges, handles, finish, installation and decoration. Confirm how changes after approval will affect price and delivery." },
      { q: "Can a carpenter trim every type of internal door?", a: "No. Solid timber doors usually allow more adjustment than hollow-core, fire or prefinished doors. The manufacturer states trimming limits, and fire doors must retain their tested specification and correct gaps." },
      { q: "Who paints new skirting, doors and architraves?", a: "Some carpenters offer finishing, while others leave timber primed or bare for a decorator. Agree filling, caulking, knot treatment, primer and final coats in the quote." },
      { q: "Does staircase work need Building Regulations approval?", a: "A like-for-like cosmetic refurbishment may not, but changes to stair geometry, guarding or structural support can engage Building Regulations. Confirm the design and approval route before manufacture." },
    ],
  },
  tilers: {
    name: "Tiler", plural: "Tilers",
    heading: "Find a Tiler for Bathrooms, Floors and Waterproof Wet Areas",
    subheading: "Compare tilers who can prepare the background, plan the layout and finish every junction neatly.",
    intro: "Successful tiling depends on a flat, stable background and the right adhesive, grout and movement joints for the location. UK homeowners should ask whether removal, levelling, backer boards, tanking, trims, sealing and waste are included before comparing prices.",
    jobs: ["Bathroom Wall Tiling", "Kitchen Splashbacks", "Porcelain Floor Tiling", "Wet-room Tanking and Tiling"],
    guides: [
      { title: "Tile a Small Bathroom", from: "£900", desc: "Labour, preparation and standard tiles often total £900–£2,500." },
      { title: "Porcelain Floor Installation", from: "£60/m²", desc: "Supply and laying commonly ranges from £60–£120 per m² before levelling." },
      { title: "Kitchen Splashback Tiling", from: "£350", desc: "A standard splashback generally costs £350–£900 including mid-range tiles." },
      { title: "Tank and Tile a Wet Room", from: "£2,500", desc: "Waterproofing and tiling typically cost £2,500–£6,000 excluding sanitaryware." },
    ],
    nearMe: ["Bathroom tiler near Manchester", "Porcelain floor tiler in London", "Kitchen tiler near Birmingham", "Wet room tiler in Bristol"],
    faqs: [
      { q: "Does a shower area need tanking behind the tiles?", a: "Tiles and grout are not the waterproof layer. Wet areas should use a compatible waterproofing or backer-board system installed to the manufacturer's specification before tiling." },
      { q: "Why does tile size change the installation price?", a: "Large-format tiles need very flat backgrounds, careful handling and specialist cutting, while mosaics require more setting-out and grout. Patterns, niches, mitres and natural stone also add time." },
      { q: "Can new floor tiles be laid over old tiles?", a: "Sometimes, if the existing tiles are firmly bonded, level and suitable for the added load and height. The tiler should check movement, doors, thresholds and the correct primer and adhesive." },
      { q: "How much extra tile should I order?", a: "Around 10% extra is common for straight layouts, with more for diagonal patterns, complex rooms or fragile natural stone. Keep spare tiles from the same batch for future repairs." },
      { q: "When can I use a newly tiled bathroom?", a: "Curing time depends on the adhesive, grout, sealant and site conditions. Follow the product instructions and the tiler's handover advice before walking on floors or running a shower." },
    ],
  },
  flooring: {
    name: "Flooring Specialist", plural: "Flooring Specialists",
    heading: "Choose a Flooring Specialist for a Level, Long-lasting Floor",
    subheading: "Compare fitters for wood, laminate, luxury vinyl and restoration, including essential subfloor preparation.",
    intro: "The quality of a new floor depends as much on moisture testing and subfloor preparation as on the visible finish. Ask flooring specialists to price removal, levelling, damp protection, underlay, trims, door adjustments and waste alongside the chosen product.",
    jobs: ["Engineered Wood Flooring", "Luxury Vinyl Tile", "Laminate Installation", "Floor Sanding and Sealing"],
    guides: [
      { title: "Laminate a 20m² Room", from: "£700", desc: "Supply and fitting commonly costs £700–£1,400 before major subfloor work." },
      { title: "Luxury Vinyl Tile Floor", from: "£50/m²", desc: "Mid-range LVT supply and installation is often £50–£100 per m²." },
      { title: "Engineered Wood Floor", from: "£75/m²", desc: "Materials and fitting generally range from £75–£140 per m²." },
      { title: "Sand and Seal Floorboards", from: "£30/m²", desc: "Professional sanding and finishing typically costs £30–£55 per m²." },
    ],
    nearMe: ["Wood flooring fitter near Manchester", "LVT installer in London", "Laminate fitter near Birmingham", "Floor sanding in Leeds"],
    faqs: [
      { q: "How does a fitter decide whether the subfloor needs levelling?", a: "They should inspect flatness, stability and moisture against the flooring manufacturer's tolerances. High spots, loose boards or damp screed must be corrected before the finish is installed." },
      { q: "Does wood flooring need to acclimatise in the house?", a: "Often yes, but the period and storage method depend on the product and site conditions. Follow the manufacturer's instructions and do not open packs early unless directed by the fitter." },
      { q: "Which flooring is practical for kitchens and utility rooms?", a: "Water-resistant LVT and suitable tile are common choices. Engineered wood and laminate vary by product, so check moisture limitations, joint sealing and the warranty for the intended room." },
      { q: "Will the flooring specialist trim doors and fit thresholds?", a: "These tasks are not always included. Ask the quote to list door trimming, skirting or beading, transitions between rooms and changes in finished floor height." },
      { q: "Can underfloor heating sit beneath any floor covering?", a: "Only coverings and adhesives approved for the system and operating temperature should be used. The fitter should check thermal resistance and coordinate commissioning with the heating installer." },
    ],
  },
  gardeners: {
    name: "Gardener", plural: "Gardeners & Landscapers",
    heading: "Find Gardeners and Landscapers for Healthier Outdoor Spaces",
    subheading: "Compare regular garden care with complete landscaping, planting, lawn and patio projects.",
    intro: "Choose a gardener for ongoing horticultural care or a landscaper when the work involves levels, drainage, structures and hard surfaces. A useful UK quote should identify plant sizes, soil improvement, waste removal, access, aftercare and seasonal limits on the proposed work.",
    jobs: ["Garden Maintenance", "Planting and Soft Landscaping", "Lawn Installation", "Patios and Paths"],
    guides: [
      { title: "Regular Garden Maintenance Visit", from: "£60", desc: "A routine visit often costs £60–£150 depending on time, tools and waste." },
      { title: "Lay a New Lawn", from: "£25/m²", desc: "Ground preparation and turf commonly range from £25–£45 per m²." },
      { title: "Install a 20m² Patio", from: "£3,000", desc: "Prepared and paved patios typically cost £3,000–£6,000 by material and access." },
      { title: "Redesign a Medium Garden", from: "£5,000", desc: "Mixed hard and soft landscaping can range from £5,000–£20,000 or more." },
    ],
    nearMe: ["Garden maintenance near Manchester", "Landscape gardener in London", "Lawn installer near Birmingham", "Patio landscaper in Bristol"],
    faqs: [
      { q: "Do I need a gardener or a landscape contractor?", a: "Use a gardener for pruning, planting, lawn care and regular maintenance. Choose a landscape contractor for excavation, drainage, retaining features, paving and larger construction-led redesigns." },
      { q: "Who removes green waste after garden work?", a: "Confirm this in the quote. A contractor carrying waste should use the appropriate legal disposal route; alternatively, they may chip material on site or leave agreed waste for your council collection." },
      { q: "When is the best time to plant a new garden?", a: "Autumn and spring are often favourable because soil is workable and rainfall supports establishment. Container-grown plants can be planted more widely through the year if watering and ground conditions are suitable." },
      { q: "Can a landscaper change garden levels near the house?", a: "Yes, but finished levels and drainage must protect the building and avoid bridging the damp-proof course. Significant retaining work may need structural design and permissions." },
      { q: "What aftercare should be included with turf and planting?", a: "Ask for watering, mowing, feeding and establishment instructions, plus the replacement policy for failed plants. New landscapes need active care during their first season, especially in dry weather." },
    ],
  },
  handymen: {
    name: "Handyman", plural: "Handymen",
    heading: "Book a Handyman for Small Repairs, Assembly and Home Fixes",
    subheading: "Bundle practical household tasks into one clear visit, from mounting and adjustment to minor maintenance.",
    intro: "A handyman is well suited to a list of small, non-specialist jobs that do not justify several separate contractors. Send photos and dimensions in advance, agree who supplies fixings and materials, and keep regulated gas or electrical work for appropriately registered tradespeople.",
    jobs: ["Flat-pack Assembly", "Shelves and Curtain Rails", "TV Wall Mounting", "Minor Door Repairs"],
    guides: [
      { title: "Handyman Call-out", from: "£50", desc: "Minimum visits commonly cost £50–£90 before additional time or materials." },
      { title: "Half-day Odd-job List", from: "£140", desc: "Three to four hours of mixed tasks often costs £140–£250 plus parts." },
      { title: "Flat-pack Furniture Assembly", from: "£70", desc: "Small items may cost £70, while larger wardrobes can reach £200–£350." },
      { title: "Wall-mount a Television", from: "£80", desc: "Basic mounting usually costs £80–£180, excluding bracket and concealed cabling." },
    ],
    nearMe: ["Local handyman near Manchester", "Flat-pack assembly in London", "Odd-job service near Birmingham", "TV mounting handyman in Leeds"],
    faqs: [
      { q: "Which tasks are suitable for a handyman visit?", a: "Typical jobs include furniture assembly, shelves, curtain rails, resealing, minor adjustments and simple repairs. Send one prioritised list so the handyman can estimate time and arrive with suitable tools." },
      { q: "Which jobs should not be given to a general handyman?", a: "Gas work requires Gas Safe registration, and notifiable electrical work needs the proper competence and certification route. Structural changes, asbestos disturbance and specialist roofing also need the relevant contractor." },
      { q: "Is an hourly rate or fixed price better for odd jobs?", a: "A fixed price suits a clearly defined task, while hourly or half-day pricing can be efficient for a mixed list. Confirm the minimum charge, travel, materials and what happens if the list takes longer." },
      { q: "What information helps price wall-mounted items safely?", a: "Provide the item weight, bracket type, wall material, fixing location and photos. The handyman may need to check for hidden pipes or cables and use specialist fixings for plasterboard or masonry." },
      { q: "Should a handyman carry insurance?", a: "Public liability insurance is sensible for anyone working in your home. Ask for evidence where the task could damage finishes, plumbing or valuable fittings, and request an invoice for completed work." },
    ],
  },
  heating: {
    name: "Heating Engineer", plural: "Heating Engineers",
    heading: "Find a Heating Engineer for Boilers, Radiators and Heat Pumps",
    subheading: "Compare qualified engineers for efficient heating repairs, replacements and low-carbon upgrades.",
    intro: "A heating engineer should assess heat loss, controls, water quality and the existing distribution system before recommending new equipment. Check Gas Safe registration for gas work, appropriate heat-pump competence for renewable systems, and exactly what commissioning and certification the quote includes.",
    jobs: ["Boiler Replacement", "Boiler Servicing", "Radiator Upgrades", "Air-source Heat Pumps"],
    guides: [
      { title: "Combi Boiler Replacement", from: "£2,200", desc: "A like-for-like installation commonly costs £2,200–£4,000." },
      { title: "Annual Boiler Service", from: "£90", desc: "Routine domestic servicing generally ranges from £90–£150." },
      { title: "Replace a Radiator", from: "£250", desc: "A standard supplied and fitted radiator often costs £250–£550." },
      { title: "Air-source Heat Pump System", from: "£8,000", desc: "Typical installations are £8,000–£18,000 before any eligible grant." },
    ],
    nearMe: ["Gas heating engineer near Manchester", "Boiler service in London", "Radiator installer near Birmingham", "Heat pump engineer in Bristol"],
    faqs: [
      { q: "How do I verify a heating engineer for gas boiler work?", a: "Check the engineer's photo ID card and the categories of gas work listed, then verify the details on the official Gas Safe Register. Company registration alone does not prove every engineer can perform every task." },
      { q: "What is included in a proper boiler service?", a: "The engineer should follow the manufacturer's instructions, inspect safety and combustion, check relevant controls and record findings. Repairs and replacement parts are normally quoted separately." },
      { q: "Should a new boiler be sized from the old boiler's output?", a: "Not automatically. The engineer should consider the property's heat loss, hot-water demand, emitters and controls; oversizing can reduce efficiency and cause frequent cycling." },
      { q: "Will a heat pump work with my existing radiators?", a: "It may, but lower flow temperatures often require a room-by-room heat-loss calculation and larger radiators or other upgrades. The design should state expected temperatures, performance and electrical requirements." },
      { q: "Why might a heating quote include a system flush or filter?", a: "Sludge and debris can restrict circulation and damage new equipment. The engineer should assess water condition and explain the cleaning method, inhibitor, filter and commissioning tests included." },
    ],
  },
  bathrooms: {
    name: "Bathroom Fitter", plural: "Bathroom Fitters",
    heading: "Find a Bathroom Fitter for Complete, Watertight Renovations",
    subheading: "Compare installers who coordinate plumbing, electrics, preparation, tiling and sanitaryware as one project.",
    intro: "A bathroom refit combines several trades in a small space, so sequencing and responsibility matter as much as the visible products. Ask who manages plumbing and electrical certification, waterproofing, ventilation, waste removal, hidden damage and final commissioning.",
    jobs: ["Complete Bathroom Refits", "Walk-in Showers", "Wet-room Conversions", "New En-suites"],
    guides: [
      { title: "Standard Bathroom Refit", from: "£5,000", desc: "Labour and mid-range products commonly total £5,000–£12,000." },
      { title: "Walk-in Shower Conversion", from: "£2,000", desc: "Replacing a bath with a shower often costs £2,000–£5,000." },
      { title: "Complete Domestic Wet Room", from: "£7,000", desc: "Drainage, tanking, tiling and fittings typically cost £7,000–£15,000." },
      { title: "Create a New En-suite", from: "£6,000", desc: "A new en-suite usually ranges from £6,000–£15,000 depending on services and layout." },
    ],
    nearMe: ["Bathroom fitter near Manchester", "Wet room installer in London", "Shower fitter near Birmingham", "En-suite installer in Leeds"],
    faqs: [
      { q: "How long is a typical bathroom out of use during a refit?", a: "A straightforward refit often takes one to two working weeks, but drying times, bespoke screens and hidden floor damage can extend it. Ask for a day-by-day programme if it is your only bathroom." },
      { q: "Does every shower enclosure need a tanking system?", a: "The required waterproofing depends on the construction and system, but tiles and grout alone should not be treated as waterproof. The installer should specify a compatible background and protection for wet areas." },
      { q: "Who certifies bathroom electrical work?", a: "Electrical work near baths and showers is subject to special requirements. Use an electrician who can test the installation and provide the appropriate certificate and notification where required." },
      { q: "Can I keep the bathroom layout to reduce cost?", a: "Usually. Leaving the toilet, basin and shower near existing soil and water connections can reduce pipe alterations, floor opening and risk, although condition and access still need checking." },
      { q: "What happens if rotten flooring is found after removal?", a: "The fitter should pause, show you the damage and price the repair before covering it. Your contract should explain how unforeseen work is approved and how it affects the programme." },
    ],
  },
  kitchens: {
    name: "Kitchen Fitter", plural: "Kitchen Fitters",
    heading: "Find a Kitchen Fitter for Cabinets, Worktops and Final Installation",
    subheading: "Compare installers who can turn a kitchen plan into accurately fitted units, services and finishes.",
    intro: "Kitchen fitting brings cabinetry together with worktops, plumbing, electrics, appliances and decoration, so unclear boundaries can create costly gaps. Ask for a survey against the final plan and a quote that names every trade, connection, cut-out, panel, trim and making-good item included.",
    jobs: ["Complete Kitchen Installation", "Cabinet and Door Replacement", "Worktop Fitting", "Appliance Integration"],
    guides: [
      { title: "Kitchen Installation Labour", from: "£3,000", desc: "Fitting a standard suite often costs £3,000–£6,000 before specialist trades." },
      { title: "Mid-range Kitchen Renovation", from: "£10,000", desc: "Units, fitting and associated works commonly total £10,000–£30,000." },
      { title: "Laminate Worktop Installation", from: "£600", desc: "Supply, joints and cut-outs typically cost £600–£1,500." },
      { title: "Quartz Worktop Installation", from: "£2,000", desc: "Template, fabrication and fitting commonly range from £2,000–£5,000." },
    ],
    nearMe: ["Kitchen fitter near Manchester", "Kitchen installation in London", "Worktop fitter near Birmingham", "Kitchen cabinet installer in Bristol"],
    faqs: [
      { q: "When should the kitchen fitter survey the room?", a: "Arrange a site survey before units are ordered and again if building work changes dimensions. The fitter should check walls, floors, service positions, door swings, appliance clearances and the final supplier plan." },
      { q: "Who coordinates plumbing, gas and electrical work in a kitchen?", a: "Some fitters manage qualified subcontractors; others expect you to arrange them. Record names, timing, certification responsibility and costs so no service connection is omitted." },
      { q: "How long does a complete kitchen replacement take?", a: "Simple fitting may take about a week, while removal, services, plastering, flooring and templated worktops can extend the project to three or four weeks. Bespoke items can add lead time." },
      { q: "Can worktops be measured before the base units are fitted?", a: "Manufactured stone and solid-surface worktops are normally templated after base units are fixed, level and secure. Temporary worktops may be needed during fabrication." },
      { q: "What should I inspect before signing off a fitted kitchen?", a: "Check door and drawer alignment, worktop joints, sealant, appliance operation, plumbing leaks, extract ventilation, finishes and all certificates. Record snags in writing before the final payment." },
    ],
  },
  windows: {
    name: "Window Fitter", plural: "Window & Door Fitters",
    heading: "Find Window and Door Fitters for Secure, Efficient Glazing",
    subheading: "Compare made-to-measure replacements in uPVC, aluminium or timber, with compliant installation and finishing.",
    intro: "Replacement windows and external doors must suit the opening, ventilation strategy, security needs and character of the property. Ask fitters to state frame specification, glass performance, trickle vents, safety glazing, reveals, trims, disposal and the compliance certificate provided.",
    jobs: ["uPVC Replacement Windows", "Aluminium Bi-fold Doors", "Composite Front Doors", "Misted Glass Replacement"],
    guides: [
      { title: "Single uPVC Window Replacement", from: "£500", desc: "A standard supplied and fitted window commonly costs £500–£1,200." },
      { title: "Whole-house Double Glazing", from: "£6,000", desc: "Eight to twelve uPVC windows typically total £6,000–£15,000." },
      { title: "Three-panel Aluminium Bi-fold Door", from: "£3,000", desc: "Supply and installation often ranges from £3,000–£7,000 before structural work." },
      { title: "Composite Front Door", from: "£1,500", desc: "A fitted composite entrance door generally costs £1,500–£3,000." },
    ],
    nearMe: ["uPVC window fitter near Manchester", "Double glazing installer in London", "Bi-fold door fitter near Birmingham", "Composite door installer in Leeds"],
    faqs: [
      { q: "What proof of compliance should I receive for replacement windows?", a: "The installer should explain whether the work will be self-certified through a competent person scheme or approved by Building Control. Keep the resulting certificate for future sale or remortgage paperwork." },
      { q: "Will new windows cure condensation?", a: "They can improve internal surface temperatures, but condensation also depends on humidity and ventilation. Blocking background ventilation or leaving moisture sources unresolved can allow the problem to continue." },
      { q: "How should I compare window energy specifications?", a: "Compare the whole-window rating or U-value, not just the number of glass panes. Also consider solar gain, warm-edge spacers, frame construction, air leakage and correct installation." },
      { q: "Do listed buildings need consent for replacement glazing?", a: "Often yes, and controls can also apply in conservation areas or properties with planning conditions. Check with the local planning authority before ordering because like-for-like appearance may still be required." },
      { q: "What should a window fitter do around the new frame?", a: "The opening should be properly fixed, insulated, weather-sealed and made good inside and out. Agree treatment of sills, render, plaster, trims, alarms, blinds and disposal before installation." },
    ],
  },
  driveways: {
    name: "Driveway Specialist", plural: "Driveway Specialists",
    heading: "Find a Driveway Installer for Proper Groundwork and Drainage",
    subheading: "Compare block paving, tarmac, resin and gravel installations built on a durable, well-drained sub-base.",
    intro: "A driveway lasts only when excavation depth, sub-base compaction, falls and drainage are right for the ground and expected traffic. Ask UK contractors to itemise excavation, spoil removal, membranes, sub-base, edging, drainage channels and the exact surface specification.",
    jobs: ["Block-paved Driveways", "Tarmac Surfacing", "Resin-bound Driveways", "Gravel Driveways"],
    guides: [
      { title: "20m² Gravel Driveway", from: "£1,400", desc: "A small installed gravel drive typically costs £1,400–£2,500." },
      { title: "20m² Tarmac Driveway", from: "£2,200", desc: "A small tarmac installation generally ranges from £2,200–£3,500." },
      { title: "50m² Block-paved Driveway", from: "£5,000", desc: "A two-car block-paved drive commonly costs £5,000–£7,500." },
      { title: "50m² Resin-bound Driveway", from: "£6,000", desc: "A prepared two-car resin-bound drive often costs £6,000–£8,500." },
    ],
    nearMe: ["Driveway installer near Manchester", "Block paving contractor in London", "Tarmac driveway near Birmingham", "Resin-bound driveway in Bristol"],
    faqs: [
      { q: "When does a front-garden driveway need planning permission?", a: "In England, impermeable surfacing over five square metres that drains onto the highway may need permission, while compliant permeable surfacing or on-site drainage is generally treated differently. Check local and devolved-nation rules." },
      { q: "What sub-base should a driveway quote specify?", a: "It should state excavation depth, geotextile where needed, sub-base type and compacted thickness for the ground and vehicle load. A decorative surface laid over weak groundwork will soon move or rut." },
      { q: "Is resin-bound the same as resin-bonded surfacing?", a: "No. Resin-bound aggregate is mixed through and laid as a permeable layer when the full system allows; resin-bonded stone is scattered onto resin and is generally not permeable. Confirm which system is quoted." },
      { q: "Do I need council approval for a dropped kerb?", a: "Yes, vehicle access across the pavement requires approval from the relevant highway authority, and only approved contractors may be allowed to do the work. Permission is separate from the driveway installation." },
      { q: "How soon can a new driveway carry a car?", a: "The answer depends on the surface, temperature and product specification. Follow the installer's written curing instructions; driving on tarmac, concrete or resin too early can permanently mark it." },
    ],
  },
  extensions: {
    name: "Extension Specialist", plural: "Extension Specialists",
    heading: "Find an Extension Specialist to Add Well-planned Living Space",
    subheading: "Compare contractors for rear, side-return and two-storey additions from groundwork through final finishes.",
    intro: "An extension contractor must coordinate structure, weatherproofing, services and finishes while protecting the occupied home. Before tendering in the UK, develop drawings and a specification so quotes cover the same foundations, steelwork, insulation, glazing, drainage and internal finish.",
    jobs: ["Single-storey Rear Extensions", "Side-return Extensions", "Two-storey Extensions", "Kitchen-diner Extensions"],
    guides: [
      { title: "20m² Single-storey Extension", from: "£40,000", desc: "A standard build is typically £40,000–£60,000 excluding the new kitchen." },
      { title: "40m² Two-storey Extension", from: "£108,000", desc: "Two-storey projects commonly range from £108,000–£180,000 by finish and location." },
      { title: "London Side-return Extension", from: "£55,000", desc: "Constrained access and structural glazing can put projects around £55,000–£100,000." },
      { title: "Kitchen-diner Extension", from: "£60,000", desc: "Building work plus a mid-range kitchen often totals £60,000–£110,000." },
    ],
    nearMe: ["Rear extension builder near Manchester", "Side-return extension in London", "Two-storey extension near Birmingham", "Kitchen extension builder in Leeds"],
    faqs: [
      { q: "Can my extension be built under permitted development rights?", a: "Some homes and designs qualify, but limits depend on location, property history, dimensions and the UK nation. Obtain professional confirmation and consider a lawful development certificate rather than relying on an assumption." },
      { q: "Why do I need Building Regulations approval as well as planning?", a: "Planning controls the development's acceptability, while Building Regulations cover matters such as structure, fire safety, insulation, ventilation and drainage. An extension may need one, both or neither planning permission and still require regulatory approval." },
      { q: "Should I get a soil investigation before fixing the price?", a: "It can reduce uncertainty where ground conditions, trees, drains or neighbouring foundations may affect design. Without enough information, foundation costs are often provisional and can rise after excavation." },
      { q: "When does the Party Wall etc. Act affect an extension?", a: "It may apply to work on or near a shared structure or excavation close to neighbouring buildings in England and Wales. Take project-specific advice and serve any required notices before relevant work begins." },
      { q: "What contingency should I keep for an extension project?", a: "A sensible contingency is commonly included for unknowns and client changes, with the amount based on design maturity and risk. Keep it outside the contractor's contract sum and authorise variations in writing." },
    ],
  },
  drainage: {
    name: "Drainage Specialist", plural: "Drainage Specialists",
    heading: "Find a Drainage Specialist to Diagnose Blockages and Pipe Damage",
    subheading: "Compare engineers for high-pressure clearance, CCTV evidence, no-dig repairs and surface-water solutions.",
    intro: "Recurring drainage trouble needs a diagnosis of pipe condition, falls, roots or misuse rather than repeated basic unblocking. Ask specialists to explain call-out limits, jetting time, CCTV footage, reporting, excavation, waste disposal and whether the affected drain is privately owned.",
    jobs: ["Drain Unblocking and Jetting", "CCTV Drain Surveys", "Drain Lining and Repairs", "Soakaway Installation"],
    guides: [
      { title: "Domestic Drain Unblocking", from: "£100", desc: "Straightforward clearance commonly costs £100–£250 during normal hours." },
      { title: "CCTV Drain Condition Survey", from: "£180", desc: "A recorded survey and basic report often range from £180–£400." },
      { title: "No-dig Drain Lining", from: "£750", desc: "Short liner repairs commonly cost £750–£1,500; longer runs can reach £3,000+." },
      { title: "Crate Soakaway Installation", from: "£1,500", desc: "Typical domestic systems cost £1,500–£2,500 before difficult excavation or design." },
    ],
    nearMe: ["Drain unblocking near Manchester", "CCTV drain survey in London", "Drain lining near Birmingham", "Soakaway installer in Bristol"],
    faqs: [
      { q: "How can I tell whether the blockage is inside my home or underground?", a: "One slow fixture may indicate a local trap or branch blockage; several affected fixtures, gurgling gullies or a rising inspection chamber suggest a shared downstream issue. Avoid using water until the level is understood." },
      { q: "Who is responsible for a blocked sewer outside my boundary?", a: "In England and Wales, the water company is generally responsible for public sewers and many shared lateral drains, while homeowners maintain private drains. Responsibility differs by layout and UK nation, so check the network map or contact the provider." },
      { q: "What should a useful CCTV drain survey include?", a: "Ask for dated footage, pipe sizes and direction, defect locations, access points and a written explanation of recommended work. Surveys for a property purchase may need a more formal mapped report." },
      { q: "When can a drain be lined instead of excavated?", a: "Lining can seal some cracks and displaced joints when the pipe retains enough shape and access is suitable. Collapsed, badly deformed or incorrectly graded sections may still require excavation and replacement." },
      { q: "Does a new soakaway need testing or approval?", a: "The design should be based on ground infiltration, roof area, groundwater and separation from buildings and boundaries. Building Regulations, environmental restrictions or local approvals may apply, so confirm them before excavation." },
    ],
  },
};

type Profile = {
  id: string;
  slug: string;
  name: string;
  company: string;
  area: string;
  rating: number;
  reviews: number;
  years: number;
  verified: boolean;
  featured: boolean;
  bio: string;
  services: string[];
};

const DEMO_DIRECTORY_PROFILES: Profile[] = DEMO_TRADESPEOPLE.map((profile, index) => ({
  id: `demo-${index + 1}`,
  slug: profile.slug,
  name: profile.owner,
  company: profile.businessName,
  area: profile.area,
  rating: profile.rating,
  reviews: profile.reviews.length,
  years: profile.yearsExperience,
  verified: true,
  featured: index === 0,
  bio: profile.bio,
  services: profile.services,
}));

// ─── STARS ────────────────────────────────────────────────────────────────────

function Stars({ rating, small }: { rating: number; small?: boolean }) {
  const size = small ? "w-3.5 h-3.5" : "w-4 h-4";
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${size} ${i < full ? "fill-[#90CAF9]" : half && i === full ? "fill-[#90CAF9]" : "fill-[#E3F2FD]"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── BUILDER CARD ─────────────────────────────────────────────────────────────

function BuilderCard({ profile, tradeName, jobs }: { profile: Profile; tradeName: string; jobs: string[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border transition-all ${profile.featured ? "border-[#2196F3]/30 shadow-[0_4px_24px_rgba(13,71,161,0.10)]" : "border-[#90CAF9] shadow-sm hover:shadow-md"}`}>
      {profile.featured && (
        <div className="px-5 pt-3 pb-0">
          <span className="text-[10px] font-semibold text-[#0D47A1] bg-[#E3F2FD] px-2.5 py-1 rounded-full">Featured</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <UserAvatar name={profile.name} seed={`${profile.id}-${profile.company}`} size={48} className="shadow-sm" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[15px] font-semibold text-[#0D47A1]">{profile.company}</h3>
                  {profile.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#0D47A1] bg-[#E3F2FD] px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 fill-[#2196F3]" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#000000] mt-0.5">{profile.name} · {profile.area} · {profile.years} years&apos; experience</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 justify-end">
                  <Stars rating={profile.rating} small />
                  <span className="text-[13px] font-semibold text-[#000000]">{profile.rating.toFixed(1)}</span>
                </div>
                <p className="text-[11px] text-[#000000] mt-0.5">{profile.reviews} review{profile.reviews !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Description */}
            <p className={`text-[13px] text-[#000000] leading-relaxed mt-3 ${!expanded ? "line-clamp-2" : ""}`}>
              {profile.bio || `${profile.years} years of experience in ${tradeName.toLowerCase()} work, including ${jobs.slice(0, 3).join(", ").toLowerCase()}.`}
            </p>
            {!expanded && (
              <button onClick={() => setExpanded(true)} className="text-[12px] text-[#0D47A1] font-semibold mt-1 hover:underline">
                Read more
              </button>
            )}

            {/* Footer row */}
            <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#000000]">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {profile.services.slice(0, 2).join(" · ") || "Verified trade profile"}
              </div>
              <Link
                href={`/tradespeople/${profile.slug}`}
                className="bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[13px] px-5 py-2.5 rounded-full transition-all shadow-sm whitespace-nowrap"
              >
                View profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DetailedTradePage({ tradeSlug }: { tradeSlug: string }) {
  const data = TRADE_CONFIG[tradeSlug] ?? TRADE_CONFIG.builders;

  const [postcode, setPostcode] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("rating");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState("");
  const loadProfiles = useCallback(async (area?: string) => {
    setProfilesLoading(true); setProfilesError("");
    try {
      const query = new URLSearchParams({ trade: tradeSlug });
      if (area?.trim()) query.set("postcode", area.trim());
      const response = await fetch(`/api/builders?${query}`);
      const result = await response.json() as { builders?: Profile[]; error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to load verified builders");
      setProfiles(result.builders?.length ? result.builders : DEMO_DIRECTORY_PROFILES);
    } catch { setProfiles(DEMO_DIRECTORY_PROFILES); }
    finally { setProfilesLoading(false); }
  }, [tradeSlug]);
  useEffect(() => { const timer = window.setTimeout(() => void loadProfiles(), 0); return () => window.clearTimeout(timer); }, [loadProfiles]);

  const sortedProfiles = [...profiles].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#E3F2FD] border-b border-[#90CAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="max-w-[620px]">
            <nav className="flex items-center gap-1.5 text-[12px] text-[#000000] mb-5">
              <Link href="/" className="hover:text-[#0D47A1]">Home</Link>
              <span>›</span>
              <span className="text-[#000000]">{data.plural}</span>
            </nav>
            <h1 className="text-[34px] sm:text-[42px] font-bold text-[#0D47A1] leading-[1.1] mb-4 tracking-tight">
              {data.heading}
            </h1>
            <p className="text-[16px] text-[#000000] mb-7 leading-relaxed">{data.subheading}</p>

            <form onSubmit={(e) => { e.preventDefault(); void loadProfiles(postcode); }} className="flex items-stretch bg-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-[#90CAF9] overflow-hidden max-w-[480px] mb-7">
              <div className="flex items-center pl-5 text-black/50">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Enter your postcode"
                className="flex-1 px-4 py-4 text-[15px] font-semibold text-black/70 placeholder:text-black/50 outline-none bg-transparent min-w-0"
              />
              <button type="submit" className="bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[13px] px-7 py-4 transition-all flex-shrink-0 tracking-wide">
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-5 text-[13px] text-[#000000]">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 fill-[#2196F3]" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Free to use
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 fill-[#2196F3]" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Up to 3 quotes
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 fill-[#2196F3]" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                No obligations
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-px">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-3.5 h-3.5 fill-[#90CAF9]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <span>4.7/5 · 4,200+ reviews</span>
              </div>
            </div>
          </div>
          <div className="hidden overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_22px_60px_rgba(13,71,161,.14)] lg:block">
            <TradeIllustration variant={tradeSlug === "roofers" ? "roofing" : tradeSlug === "gardeners" ? "landscaper" : tradeSlug === "heating" ? "heating" : tradeSlug === "bathrooms" ? "bathroom" : tradeSlug === "kitchens" ? "kitchen" : "builder"} className="h-auto w-full" />
            <div className="grid grid-cols-3 divide-x divide-[#90CAF9] border-t border-[#90CAF9] text-center">
              <div className="p-3"><p className="text-lg font-black text-[#0D47A1]">4.7</p><p className="text-[10px] font-semibold text-[#000000]">Average rating</p></div>
              <div className="p-3"><p className="text-lg font-black text-[#0D47A1]">3</p><p className="text-[10px] font-semibold text-[#000000]">Quotes to compare</p></div>
              <div className="p-3"><p className="text-lg font-black text-[#0D47A1]">Free</p><p className="text-[10px] font-semibold text-[#000000]">To homeowners</p></div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 grid gap-4 rounded-3xl border border-[#90CAF9] bg-[#E3F2FD] p-5 sm:grid-cols-3 sm:p-6">
            {[["01", "Describe the work", `Choose the ${data.name.toLowerCase()} service and add photos, measurements and access notes.`], ["02", "Compare local replies", `Review up to three ${data.plural.toLowerCase()} against the same brief, scope and timing.`], ["03", "Hire with confidence", "Check experience, insurance, written inclusions and payment stages before starting."]].map(([number, title, copy]) => <div key={number} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D47A1] text-xs font-black text-white">{number}</span><div><h2 className="text-sm font-bold text-[#0D47A1]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#000000]">{copy}</p></div></div>)}
          </div>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left: Listings */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                  <h2 className="text-[20px] font-bold text-[#0D47A1]">
                    {profiles.length} verified {data.plural.toLowerCase()}{postcode ? ` near ${postcode.toUpperCase()}` : " on BuilderFind"}
                  </h2>
                  <p className="text-[13px] text-[#000000] mt-0.5">Compare availability, reviews and relevant experience before contacting anyone.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#000000]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-[13px] font-semibold text-[#000000] border border-[#90CAF9] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2196F3] bg-white"
                  >
                    <option value="rating">Rating</option>
                    <option value="reviews">Most reviewed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {profilesLoading ? <div className="rounded-2xl border border-dashed border-[#90CAF9] bg-[#E3F2FD] p-8 text-center text-[13px] font-semibold text-[#0D47A1]">Loading verified profiles…</div> : null}
                {profilesError ? <div role="alert" className="rounded-2xl bg-[#E3F2FD] p-5 text-[13px] font-semibold text-[#0D47A1]">{profilesError}</div> : null}
                {sortedProfiles.map((profile) => (
                  <BuilderCard
                    key={profile.id}
                    profile={profile}
                    tradeName={data.name}
                    jobs={data.jobs}
                  />
                ))}
              </div>
              {!profilesLoading && !profilesError && !profiles.length ? <div className="mt-4 rounded-2xl border border-dashed border-[#90CAF9] p-8 text-center"><p className="text-sm font-semibold text-black/70">No verified {data.plural.toLowerCase()} match this search yet.</p><Link href="/post-a-job" className="mt-3 inline-block text-sm font-bold text-[#0D47A1]">Post the job and we&apos;ll notify suitable trades →</Link></div> : null}
            </div>

            {/* Right: Sidebar */}
            <div className="lg:w-[300px] flex-shrink-0 space-y-5">
              {/* Post a job CTA */}
              <div className="bg-[#0D47A1] rounded-2xl p-6 text-white">
                <h3 className="text-[16px] font-bold mb-2">Not sure who to choose?</h3>
                <p className="text-[13px] text-[#90CAF9] leading-relaxed mb-5">
                  Post your job for free and let up to 3 local {data.plural.toLowerCase()} come to you with their best quotes.
                </p>
                <Link
                  href="/post-a-job"
                  className="block w-full text-center bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold py-3.5 rounded-xl transition-all text-[14px]"
                >
                  Post a job — it&apos;s free
                </Link>
                <div className="mt-4 space-y-2">
                  {["Takes less than 2 minutes", "Up to 3 free quotes", "No obligations ever"].map(b => (
                    <div key={b} className="flex items-center gap-2 text-[12px] text-[#90CAF9]">
                      <svg className="w-3.5 h-3.5 fill-[#2196F3] flex-shrink-0" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall rating */}
              <div className="bg-white rounded-2xl border border-[#90CAF9] shadow-sm p-6">
                <h3 className="text-[14px] font-semibold text-[#0D47A1] mb-4">Customer rating for {data.plural}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[40px] font-bold text-[#0D47A1] leading-none">4.7</span>
                  <div>
                    <Stars rating={4.7} />
                    <p className="text-[12px] text-[#000000] mt-1">from 4,200+ reviews</p>
                  </div>
                </div>
                {[
                  { label: "5 star", pct: 72 },
                  { label: "4 star", pct: 18 },
                  { label: "3 star", pct: 6 },
                  { label: "2 star", pct: 2 },
                  { label: "1 star", pct: 2 },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] text-[#000000] w-10 flex-shrink-0">{r.label}</span>
                    <div className="flex-1 h-1.5 bg-[#E3F2FD] rounded-full overflow-hidden">
                      <div className="h-full bg-[#90CAF9] rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-[11px] text-[#000000] w-8 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Common jobs */}
              <div className="bg-white rounded-2xl border border-[#90CAF9] shadow-sm p-6">
                <h3 className="text-[14px] font-semibold text-[#0D47A1] mb-3">Popular {data.name.toLowerCase()} jobs</h3>
                <div className="flex flex-wrap gap-2">
                  {data.jobs.map((job) => (
                    <Link
                      key={job}
                      href="/post-a-job"
                      className="px-3 py-1.5 bg-[#E3F2FD] hover:bg-[#E3F2FD] text-[#0D47A1] text-[12px] font-semibold rounded-full transition-all border border-[#90CAF9]"
                    >
                      {job}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Are you a builder? */}
              <div className="bg-[#E3F2FD] rounded-2xl border border-[#90CAF9] p-6">
                <p className="text-[13px] font-semibold text-[#0D47A1] mb-1">Are you a {data.name.toLowerCase()}?</p>
                <p className="text-[12px] text-[#000000] mb-3 leading-relaxed">
                  Join BuilderFind free and get job leads in your area.
                </p>
                <Link href="/builder-signup" className="text-[13px] font-semibold text-[#0D47A1] hover:underline">
                  Sign up free →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About this trade ── */}
      <section className="bg-[#E3F2FD] py-14 border-t border-[#90CAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-[24px] font-bold text-[#0D47A1] mb-4 tracking-tight">
                About {data.plural} on BuilderFind
              </h2>
              <p className="text-[14px] text-[#000000] leading-relaxed mb-5">{data.intro}</p>
              <h3 className="text-[16px] font-semibold text-[#0D47A1] mb-3">
                What can a {data.name.toLowerCase()} help with?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {data.jobs.map((job) => (
                  <div key={job} className="flex items-center gap-2 text-[13px] text-[#000000]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] flex-shrink-0" />
                    {job}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#90CAF9] shadow-sm p-6 h-fit">
              <h3 className="text-[15px] font-semibold text-[#0D47A1] mb-4">How BuilderFind works</h3>
              {[
                { n: "1", label: "Post your job", desc: "Describe the work needed — free and takes 2 minutes." },
                { n: "2", label: "Receive up to 3 quotes", desc: "Vetted local builders respond with competitive quotes." },
                { n: "3", label: "Choose your builder", desc: "Compare, review and hire with full confidence." },
              ].map((s) => (
                <div key={s.n} className="flex gap-3 mb-4 last:mb-0">
                  <div className="w-7 h-7 rounded-full bg-[#0D47A1] text-white flex items-center justify-center text-[12px] font-semibold flex-shrink-0 mt-0.5">
                    {s.n}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0D47A1]">{s.label}</p>
                    <p className="text-[12px] text-[#000000] mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
              <Link href="/post-a-job" className="block mt-5 text-center bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold py-3 rounded-xl transition-all text-[13px]">
                Post a job — it&apos;s free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cost guides ── */}
      <section className="bg-white py-14 border-t border-[#90CAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-[24px] font-bold text-[#0D47A1] mb-2 tracking-tight">
            {data.name} cost guides
          </h2>
          <p className="text-[14px] text-[#000000] mb-8">
            Free price guides to help you budget your {data.name.toLowerCase()} project
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {data.guides.map((guide) => (
              <Link
                key={guide.title}
                href="/cost-guides"
                className="bg-[#E3F2FD] rounded-2xl p-6 border border-[#90CAF9] hover:border-[#2196F3] hover:bg-[#E3F2FD] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#0D47A1] uppercase tracking-wider">Cost Guide</span>
                  <span className="text-[13px] font-bold text-[#0D47A1]">From {guide.from}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-[#0D47A1] group-hover:text-[#0D47A1] transition-colors mb-2">{guide.title}</h3>
                <p className="text-[12px] text-[#000000]">{guide.desc}</p>
                <p className="text-[12px] text-[#0D47A1] font-semibold mt-4">Read guide →</p>
              </Link>
            ))}
          </div>
          <Link href="/cost-guides" className="text-[#0D47A1] font-semibold text-[14px] hover:underline">
            See all cost guides →
          </Link>
        </div>
      </section>

      {/* ── Near me searches ── */}
      <section className="bg-[#E3F2FD] py-14 border-t border-[#90CAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-[24px] font-bold text-[#0D47A1] mb-2 tracking-tight">
            Find {data.plural.toLowerCase()} by location
          </h2>
          <p className="text-[14px] text-[#000000] mb-8">Search for local {data.plural.toLowerCase()} in your area</p>
          <div className="flex flex-wrap gap-3 mb-6">
            {data.nearMe.map((loc) => (
              <Link
                key={loc}
                href="/post-a-job"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#90CAF9] rounded-full text-[13px] font-semibold text-[#000000] hover:text-[#0D47A1] hover:border-[#2196F3] transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-[#2196F3]" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {loc}
              </Link>
            ))}
          </div>
          <Link href="/all-locations" className="text-[#0D47A1] font-semibold text-[14px] hover:underline">
            See all locations →
          </Link>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-white py-14 border-t border-[#90CAF9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-[24px] font-bold text-[#0D47A1] mb-8 tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#90CAF9] shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`trade-faq-${i}`}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-[14px] font-semibold text-[#0D47A1] pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-[#0D47A1] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div id={`trade-faq-${i}`} className="px-6 pb-5 border-t border-[#90CAF9]">
                    <p className="text-[13px] text-[#000000] leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#0D47A1] py-14 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[28px] font-bold mb-3 tracking-tight">
            Ready to find a trusted {data.name.toLowerCase()}?
          </h2>
          <p className="text-white/80 text-[15px] mb-8">
            Post your job free and receive up to 3 quotes from vetted local {data.plural.toLowerCase()}.
          </p>
          <Link
            href="/post-a-job"
            className="inline-block bg-[#0D47A1] hover:bg-[#000000] text-white font-semibold text-[15px] px-10 py-4 rounded-full transition-all shadow-lg"
          >
            Post a job — it&apos;s free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
