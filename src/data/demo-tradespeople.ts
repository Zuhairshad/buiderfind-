import type { TradeIllustrationVariant } from "@/components/TradeIllustrations";

export type DemoReview = {
  title: string;
  body: string;
  reviewer: string;
  date: string;
  rating: number;
};

export type DemoTradeperson = {
  slug: string;
  businessName: string;
  owner: string;
  trade: string;
  trades: string[];
  services: string[];
  postcode: string;
  area: string;
  yearsExperience: number;
  coverageMiles: number;
  rating: number;
  completedJobs: number;
  avatar: string;
  bio: string;
  gallery: readonly { label: string; variant: TradeIllustrationVariant }[];
  jobs: readonly string[];
  reviews: readonly DemoReview[];
};

const review = (title: string, body: string, reviewer: string, date: string): DemoReview => ({ title, body, reviewer, date, rating: 5 });

export const DEMO_TRADESPEOPLE: readonly DemoTradeperson[] = [
  {
    slug: "mm-gas-ltd", businessName: "M&M Gas Ltd", owner: "Mike Morgan", trade: "Heating Engineer", trades: ["Heating Engineer", "Plumber"], services: ["Boiler repairs", "Central heating", "Radiators", "Gas safety checks"], postcode: "BL1 4QG", area: "Bolton", yearsExperience: 16, coverageMiles: 25, rating: 4.9, completedJobs: 186, avatar: "/avatars/049.webp",
    bio: "M&M Gas Ltd is a small, dependable plumbing and heating team serving Bolton and nearby Greater Manchester homes. We explain the fault, give clear options and leave every system tested, tidy and documented.",
    gallery: [{ label: "Boiler service", variant: "heating" }, { label: "Radiator upgrade", variant: "heating" }, { label: "Bathroom pipework", variant: "bathroom" }, { label: "New cylinder", variant: "heating" }, { label: "Heating controls", variant: "electrician" }, { label: "Kitchen plumbing", variant: "kitchen" }, { label: "Outdoor tap", variant: "plumber" }, { label: "System flush", variant: "heating" }],
    jobs: ["Connect new gas cooker", "Move hot water and dishwasher supply", "Install external garden tap", "Replace 60cm four-burner gas hob", "Relocate and install upright radiator"],
    reviews: [review("Connect New Gas Cooker", "A great job and really helpful advice throughout. Everything was tested before Mike left.", "Barbara", "12 Aug 2026"), review("Move Hose Tap and Dishwasher Supply", "Amazing service, punctual and clear about what was needed.", "Rebecca", "6 Aug 2026"), review("Install External Garden Water Tap", "Neat work and a quick explanation of how to isolate it for winter.", "Steven", "2 Aug 2026"), review("Disconnect and Connect Gas Cooker", "Arrived on time, worked safely and left the kitchen spotless. Highly recommended.", "Andrew", "28 Jul 2026"), review("Relocate and Install Upright Radiator", "The quote was clear, the work was tidy and the room is finally warm again.", "Mike", "12 Jul 2026")],
  },
  {
    slug: "northstone-build-co", businessName: "North & Stone Build Co.", owner: "Amelia Carter", trade: "Builder", trades: ["Builder", "Extension Specialist"], services: ["House extensions", "Kitchen renovations", "Structural alterations", "Project management"], postcode: "LS6 2AB", area: "Leeds", yearsExperience: 14, coverageMiles: 35, rating: 4.9, completedJobs: 124, avatar: "/avatars/008.webp",
    bio: "North & Stone Build Co. delivers carefully managed extensions and renovations across Leeds. We keep the scope, programme and payment stages visible so homeowners always know what happens next.",
    gallery: [{ label: "Rear extension", variant: "extension" }, { label: "Kitchen fit-out", variant: "kitchen" }, { label: "Steel installation", variant: "builder" }, { label: "Roof structure", variant: "roofing" }, { label: "Loft conversion", variant: "loft" }, { label: "Bathroom finish", variant: "bathroom" }, { label: "Brickwork", variant: "builder" }, { label: "Final handover", variant: "extension" }],
    jobs: ["Single-storey kitchen extension", "Open-plan structural alteration", "Rear extension roof and glazing", "Garage conversion to home office", "Full renovation and project management"],
    reviews: [review("Kitchen Extension", "Three quotes later, North & Stone were the clearest. The team kept the site tidy and the programme realistic.", "Sarah", "9 Aug 2026"), review("Structural Opening", "Excellent communication and a detailed method statement before the first day.", "Daniel", "1 Aug 2026"), review("Garage Conversion", "Good workmanship and no surprise extras beyond the agreed variation process.", "Priya", "24 Jul 2026"), review("Rear Extension", "The finish is brilliant and the handover list was dealt with quickly.", "Tom", "15 Jul 2026"), review("Whole-home Renovation", "A calm, organised team who coordinated every trade properly.", "Helen", "7 Jul 2026")],
  },
  {
    slug: "riverside-projects", businessName: "Riverside Projects", owner: "Daniel Evans", trade: "Carpenter & Joiner", trades: ["Carpenter", "Builder"], services: ["Bespoke joinery", "Staircases", "Fitted storage", "Internal doors"], postcode: "M20 4BX", area: "Manchester", yearsExperience: 11, coverageMiles: 22, rating: 4.8, completedJobs: 97, avatar: "/avatars/024.webp",
    bio: "Riverside Projects combines precise joinery with practical site carpentry for Manchester homes. From fitted storage to stair details, we agree drawings and finishes before making anything.",
    gallery: [{ label: "Oak staircase", variant: "builder" }, { label: "Fitted wardrobes", variant: "builder" }, { label: "Bespoke doors", variant: "builder" }, { label: "Utility storage", variant: "kitchen" }, { label: "Oak handrail", variant: "builder" }, { label: "Media wall", variant: "builder" }, { label: "Window seat", variant: "extension" }, { label: "Final joinery", variant: "builder" }],
    jobs: ["Bespoke oak staircase", "Fitted wardrobes in alcove", "Internal door and architrave package", "Utility room storage", "Window seat and built-in shelving"],
    reviews: [review("Oak Staircase", "Beautiful work and a very patient approach while we changed the handrail detail.", "James", "8 Aug 2026"), review("Fitted Wardrobes", "The drawings made the decision easy and the installation was incredibly clean.", "Nadia", "30 Jul 2026"), review("Internal Doors", "Every door closes perfectly and the finish matches the existing woodwork.", "Chris", "22 Jul 2026"), review("Utility Storage", "Maximised a difficult room without making it feel cramped.", "Louise", "11 Jul 2026"), review("Shelving and Window Seat", "On time, thoughtful and clear about the timber options.", "Owen", "3 Jul 2026")],
  },
  {
    slug: "oakline-electrics", businessName: "Oakline Electrical", owner: "Sophie Bennett", trade: "Electrician", trades: ["Electrician"], services: ["Rewiring", "Consumer units", "EICR inspections", "EV chargers"], postcode: "BS5 8HT", area: "Bristol", yearsExperience: 13, coverageMiles: 28, rating: 4.9, completedJobs: 143, avatar: "/avatars/073.webp",
    bio: "Oakline Electrical handles domestic electrical upgrades across Bristol with a strong focus on testing, documentation and neat installation. We explain the options before isolating a circuit and leave clear certificates behind.",
    gallery: [{ label: "Consumer unit", variant: "electrician" }, { label: "Kitchen rewire", variant: "kitchen" }, { label: "EV charger", variant: "electrician" }, { label: "Garden lighting", variant: "landscaper" }, { label: "Recessed lighting", variant: "electrician" }, { label: "EICR inspection", variant: "builder" }, { label: "Smart controls", variant: "heating" }, { label: "Finished sockets", variant: "electrician" }],
    jobs: ["Three-bedroom house rewire", "RCBO consumer unit upgrade", "Home EV charger installation", "Kitchen lighting and sockets", "EICR with remedial works"],
    reviews: [review("House Rewire", "The schedule was thorough and the team explained every disruption before starting.", "Marcus", "10 Aug 2026"), review("Consumer Unit Upgrade", "Professional, tidy and supplied the certificate the same afternoon.", "Aisha", "31 Jul 2026"), review("EV Charger", "Cable route is hidden neatly and the app setup was included.", "Ben", "19 Jul 2026"), review("Kitchen Electrics", "Good suggestions for lighting positions and no pressure to add extras.", "Emily", "9 Jul 2026"), review("EICR", "Clear report with priorities rather than an alarming list of upsells.", "George", "1 Jul 2026")],
  },
  {
    slug: "brightspace-decor", businessName: "Brightspace Decorating", owner: "Lauren Hughes", trade: "Painter & Decorator", trades: ["Painter & Decorator", "Plasterer"], services: ["Interior painting", "Wallpaper hanging", "Plaster repairs", "Exterior decoration"], postcode: "NG1 5FS", area: "Nottingham", yearsExperience: 9, coverageMiles: 20, rating: 4.8, completedJobs: 112, avatar: "/avatars/136.webp",
    bio: "Brightspace Decorating helps Nottingham homeowners move from tired surfaces to durable, well-prepared finishes. We protect occupied homes carefully and explain what preparation each room needs before choosing colour.",
    gallery: [{ label: "Living room refresh", variant: "builder" }, { label: "Wallpaper feature wall", variant: "plastering" }, { label: "Hallway repaint", variant: "builder" }, { label: "Exterior masonry", variant: "extension" }, { label: "Ceiling repair", variant: "plastering" }, { label: "Kitchen colour change", variant: "kitchen" }, { label: "Woodwork finish", variant: "builder" }, { label: "Final detail", variant: "builder" }],
    jobs: ["Full hallway and stairs repaint", "Living room feature wall", "Bedroom plaster repair and paint", "Exterior masonry decoration", "Kitchen cabinets and walls"],
    reviews: [review("Hallway Repaint", "Excellent preparation and no paint on the new carpet. The colour advice was spot on.", "Rachel", "7 Aug 2026"), review("Feature Wall", "Pattern matching is perfect and the room was left cleaner than it started.", "Sam", "28 Jul 2026"), review("Bedroom Repair", "The cracks were dealt with properly instead of just painted over.", "Megan", "17 Jul 2026"), review("Exterior Decoration", "Worked around the weather and kept us updated throughout.", "Ibrahim", "6 Jul 2026"), review("Kitchen Refresh", "A huge difference from a sensible, itemised quote.", "Claire", "28 Jun 2026")],
  },
];

export const DEMO_TRADESPERSON_BY_SLUG = new Map(DEMO_TRADESPEOPLE.map((profile) => [profile.slug, profile]));
