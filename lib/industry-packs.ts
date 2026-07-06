import type { AiPromptTemplate, IndustryKey, OutreachTemplate, ServicePricing } from "@/lib/types";

export const industries: Record<IndustryKey, { label: string; focus: string }> = {
  general_contractors: {
    label: "General Contractors",
    focus: "Estimates, project follow-up, and higher-value renovation work"
  },
  cleaning_services: {
    label: "Cleaning Services",
    focus: "Recurring accounts, move-out cleans, and review-driven referrals"
  },
  barbershops: {
    label: "Barbershops",
    focus: "Bookings, reactivation, memberships, and local loyalty"
  },
  nail_salons: {
    label: "Nail Salons",
    focus: "Appointments, add-ons, bridal groups, and retention"
  },
  landscaping_companies: {
    label: "Landscaping Companies",
    focus: "Seasonal packages, maintenance routes, and upsells"
  },
  auto_detailing_businesses: {
    label: "Auto Detailing Businesses",
    focus: "Packages, mobile jobs, fleet accounts, and rebooking"
  },
  real_estate_investors: {
    label: "Real Estate Investors",
    focus: "Seller leads, property pipeline, outreach, and deal analysis"
  },
  tax_preparers: {
    label: "Tax Preparers",
    focus: "Seasonal client intake, document follow-up, extensions, and repeat filings"
  },
  heavy_truck_drivers: {
    label: "Heavy Truck Drivers",
    focus: "Loads, dispatch follow-up, maintenance tasks, compliance, and lane profitability"
  },
  hvac_services: {
    label: "HVAC Services",
    focus: "Service calls, maintenance plans, replacements, financing, and seasonal follow-up"
  },
  plumbing_services: {
    label: "Plumbing Services",
    focus: "Emergency calls, estimates, memberships, fixture jobs, and repeat property accounts"
  },
  electrical_services: {
    label: "Electrical Services",
    focus: "Panel work, troubleshooting, generators, EV chargers, and permit-ready estimates"
  },
  roofing_companies: {
    label: "Roofing Companies",
    focus: "Inspections, insurance follow-up, replacement bids, repairs, and storm response"
  },
  painting_companies: {
    label: "Painting Companies",
    focus: "Interior and exterior estimates, color consults, prep scope, and project scheduling"
  },
  flooring_installers: {
    label: "Flooring Installers",
    focus: "Material selection, square-foot pricing, subfloor notes, and install timelines"
  },
  handyman_services: {
    label: "Handyman Services",
    focus: "Small jobs, punch lists, minimum trip charges, bundles, and recurring clients"
  },
  appliance_repair: {
    label: "Appliance Repair",
    focus: "Diagnostics, parts follow-up, warranty notes, return visits, and urgent repairs"
  },
  pest_control: {
    label: "Pest Control",
    focus: "Recurring treatments, inspections, seasonal plans, and property manager accounts"
  },
  welding_fabrication: {
    label: "Welding & Fabrication",
    focus: "Custom builds, repair calls, mobile welding, materials, and shop scheduling"
  },
  concrete_masonry: {
    label: "Concrete & Masonry",
    focus: "Flatwork, repair scopes, yardage, prep, curing windows, and crew scheduling"
  },
  moving_companies: {
    label: "Moving Companies",
    focus: "Quotes, crew size, trucks, packing services, deposits, and move-day checklists"
  },
  towing_roadside: {
    label: "Towing & Roadside",
    focus: "Dispatch speed, roadside calls, impounds, fleet accounts, and payment capture"
  },
  graphic_designers: {
    label: "Graphic Designers",
    focus: "Design briefs, packages, revisions, file delivery, usage rights, and retainers"
  },
  brand_designers: {
    label: "Brand Designers",
    focus: "Identity systems, strategy, logo suites, guidelines, launch assets, and approvals"
  },
  custom_artists: {
    label: "Artists / Custom Artwork",
    focus: "Commissions, deposits, milestones, licensing, delivery, and gallery-ready records"
  },
  print_sign_shops: {
    label: "Print & Sign Shops",
    focus: "Proof approvals, print specs, rush jobs, installs, reorders, and production status"
  },
  photographers_videographers: {
    label: "Photo & Video Pros",
    focus: "Bookings, shot lists, deliverables, editing queues, licensing, and upsells"
  },
  interior_designers: {
    label: "Interior Designers",
    focus: "Consultations, room budgets, sourcing, approvals, installs, and presentation packages"
  },
  web_designers: {
    label: "Web Designers",
    focus: "Discovery, page scope, content collection, revisions, launch checklists, and care plans"
  }
};

const priceTuples: Array<[IndustryKey, string, number, number, string, string]> = [
  ["general_contractors", "Kitchen remodel estimate", 15000, 65000, "project", "Scope by materials, permits, and timeline"],
  ["general_contractors", "Bathroom remodel", 8000, 28000, "project", "Separate labor, fixtures, tile, and contingency"],
  ["general_contractors", "Deck build", 6000, 24000, "project", "Price by square footage and railing choice"],
  ["cleaning_services", "Residential deep clean", 180, 450, "visit", "Charge more for first-time or heavy condition cleans"],
  ["cleaning_services", "Recurring home clean", 120, 280, "visit", "Offer weekly, biweekly, and monthly tiers"],
  ["cleaning_services", "Move-out clean", 250, 700, "job", "Add appliances and inside cabinets as upgrades"],
  ["barbershops", "Standard haircut", 25, 55, "appointment", "Use senior barber and apprentice tiers"],
  ["barbershops", "Haircut and beard", 40, 85, "appointment", "Bundle with hot towel or wash"],
  ["barbershops", "Monthly membership", 75, 180, "month", "Include limited cuts and priority booking"],
  ["nail_salons", "Gel manicure", 35, 70, "appointment", "Add art, chrome, or repairs separately"],
  ["nail_salons", "Full acrylic set", 55, 120, "appointment", "Price by length and design complexity"],
  ["nail_salons", "Pedicure package", 40, 95, "appointment", "Create basic, spa, and deluxe tiers"],
  ["landscaping_companies", "Weekly lawn maintenance", 45, 160, "visit", "Route density protects margin"],
  ["landscaping_companies", "Mulch installation", 350, 2500, "job", "Price by yardage, bed prep, and edging"],
  ["landscaping_companies", "Seasonal cleanup", 250, 1200, "job", "Bundle leaf removal, pruning, and haul-away"],
  ["auto_detailing_businesses", "Interior detail", 120, 300, "vehicle", "Upsell pet hair and stain extraction"],
  ["auto_detailing_businesses", "Full detail", 220, 650, "vehicle", "Price by size and condition"],
  ["auto_detailing_businesses", "Fleet wash account", 35, 120, "vehicle", "Recurring route pricing by volume"],
  ["real_estate_investors", "Direct mail campaign", 700, 3500, "campaign", "Track cost per lead and appointment rate"],
  ["real_estate_investors", "Property inspection budget", 250, 800, "property", "Include photos, repair list, and ARV notes"],
  ["real_estate_investors", "Disposition marketing", 500, 2500, "deal", "Use buyer list, photos, and deadline-driven copy"],
  ["tax_preparers", "Individual tax return", 175, 550, "return", "Price by form complexity, schedules, and state filings"],
  ["tax_preparers", "Small business tax package", 650, 2500, "return", "Bundle bookkeeping cleanup, Schedule C, and entity returns separately"],
  ["tax_preparers", "Tax planning consult", 150, 450, "session", "Offer pre-season reviews, estimated payment planning, and extension strategy"],
  ["heavy_truck_drivers", "Local freight lane", 350, 1200, "load", "Track loaded miles, deadhead, detention, fuel, and minimum profitable rate"],
  ["heavy_truck_drivers", "Regional haul", 900, 3500, "load", "Price by mileage, lane demand, broker history, and reload availability"],
  ["heavy_truck_drivers", "Dedicated weekly route", 2500, 9000, "week", "Protect margin with fuel surcharge, accessorials, and maintenance reserve"],
  ["hvac_services", "Diagnostic service call", 89, 175, "visit", "Credit part of the diagnostic toward approved repairs when useful"],
  ["hvac_services", "Maintenance plan", 180, 480, "year", "Bundle seasonal tune-ups, priority scheduling, and filter reminders"],
  ["hvac_services", "System replacement", 6500, 18000, "project", "Track equipment tier, labor, permit, crane, and financing options"],
  ["plumbing_services", "Emergency service call", 125, 350, "visit", "Use after-hours minimums and dispatch fees clearly"],
  ["plumbing_services", "Water heater install", 1200, 4200, "project", "Separate tank, tankless, venting, code upgrades, and haul-away"],
  ["plumbing_services", "Fixture replacement", 225, 900, "fixture", "Bundle multiple fixtures to increase ticket size"],
  ["electrical_services", "Troubleshooting call", 125, 375, "visit", "Charge by first hour plus blocks after diagnosis"],
  ["electrical_services", "Panel upgrade", 2500, 7500, "project", "Include permit, utility coordination, materials, and inspection"],
  ["electrical_services", "EV charger install", 850, 2800, "project", "Price by panel distance, breaker capacity, and wall finish"],
  ["roofing_companies", "Roof inspection", 99, 350, "inspection", "Include photos, urgency rating, and repair-or-replace recommendation"],
  ["roofing_companies", "Leak repair", 450, 2500, "job", "Scope flashing, shingles, decking, and interior damage notes"],
  ["roofing_companies", "Full replacement", 8500, 32000, "project", "Price by square, pitch, tear-off, materials, and warranty"],
  ["painting_companies", "Interior room painting", 350, 1200, "room", "Price by prep, wall height, trim, and paint quality"],
  ["painting_companies", "Exterior repaint", 3500, 15000, "project", "Track surface prep, repairs, stories, and weather window"],
  ["painting_companies", "Cabinet painting", 2500, 9000, "project", "Separate doors, drawers, prep, spray setup, and cure time"],
  ["flooring_installers", "Luxury vinyl plank install", 4, 10, "sq ft", "Separate material, floor prep, demo, trim, and transitions"],
  ["flooring_installers", "Tile install", 12, 35, "sq ft", "Track pattern, substrate, waterproofing, and grout selection"],
  ["flooring_installers", "Carpet install", 3, 8, "sq ft", "Include pad, stairs, furniture moving, and disposal"],
  ["handyman_services", "Minimum service call", 95, 250, "visit", "Use a clear minimum to protect travel and setup time"],
  ["handyman_services", "Half-day punch list", 350, 650, "block", "Bundle small tasks into fixed blocks"],
  ["handyman_services", "Full-day repair block", 650, 1200, "day", "Define materials, exclusions, and overtime terms"],
  ["appliance_repair", "Diagnostic visit", 85, 175, "visit", "Collect model number and symptoms before dispatch"],
  ["appliance_repair", "Common repair labor", 150, 450, "job", "Quote parts separately and collect approval before ordering"],
  ["appliance_repair", "Emergency appliance call", 175, 350, "visit", "Use higher minimums for nights, weekends, and urgent refrigeration"],
  ["pest_control", "Initial treatment", 125, 350, "visit", "Bundle inspection, treatment plan, and follow-up date"],
  ["pest_control", "Quarterly plan", 95, 225, "visit", "Recurring plans stabilize route revenue"],
  ["pest_control", "Rodent exclusion", 500, 2500, "project", "Scope entry points, sealing, traps, and monitoring visits"],
  ["welding_fabrication", "Mobile welding call", 175, 450, "visit", "Use truck charge plus hourly rate and materials"],
  ["welding_fabrication", "Custom fabrication", 750, 7500, "project", "Quote design time, materials, shop labor, finish, and install"],
  ["welding_fabrication", "Repair weld", 150, 900, "job", "Document material type, access, prep, and safety risk"],
  ["concrete_masonry", "Small slab", 1200, 5000, "project", "Price demo, forms, base, reinforcement, finish, and cure protection"],
  ["concrete_masonry", "Driveway replacement", 4500, 18000, "project", "Track square footage, thickness, permits, and haul-away"],
  ["concrete_masonry", "Masonry repair", 450, 3500, "job", "Scope matching materials, access, and weather window"],
  ["moving_companies", "Local move", 450, 1800, "move", "Quote crew size, truck count, hours, stairs, and travel"],
  ["moving_companies", "Packing service", 250, 1500, "job", "Price by rooms, materials, fragile items, and timing"],
  ["moving_companies", "Long-distance move", 2500, 9000, "move", "Track mileage, weight, fuel, lodging, and delivery window"],
  ["towing_roadside", "Local tow", 95, 250, "call", "Set base hook fee plus mileage"],
  ["towing_roadside", "Roadside assistance", 75, 180, "call", "Separate jump, tire, lockout, fuel, and winch pricing"],
  ["towing_roadside", "Fleet roadside account", 500, 2500, "month", "Use monthly retainer plus discounted calls"],
  ["graphic_designers", "Logo refresh", 500, 2500, "project", "Define concepts, revisions, files, and usage rights"],
  ["graphic_designers", "Social media design pack", 250, 1200, "pack", "Bundle template count, platforms, and editability"],
  ["graphic_designers", "One-page flyer", 150, 650, "design", "Include copy readiness, print specs, and revision limit"],
  ["brand_designers", "Brand identity package", 2500, 12000, "project", "Include strategy, logo suite, colors, typography, and guidelines"],
  ["brand_designers", "Brand audit", 750, 3000, "project", "Review positioning, visuals, messaging, and consistency gaps"],
  ["brand_designers", "Launch asset kit", 1000, 5000, "kit", "Bundle social, print, web, and presentation assets"],
  ["custom_artists", "Custom commission", 300, 5000, "piece", "Collect deposit, dimensions, medium, timeline, and delivery terms"],
  ["custom_artists", "Mural project", 1500, 15000, "project", "Price design, wall prep, materials, lift, travel, and licensing"],
  ["custom_artists", "Print licensing", 100, 2000, "license", "Clarify term, territory, usage, exclusivity, and attribution"],
  ["print_sign_shops", "Banner print", 75, 450, "job", "Price by size, material, finishing, grommets, and rush timing"],
  ["print_sign_shops", "Vehicle decal package", 350, 3500, "project", "Track design, print, lamination, install, and removal risk"],
  ["print_sign_shops", "Storefront sign", 1200, 12000, "project", "Include permits, fabrication, electrical, install, and lift rental"],
  ["photographers_videographers", "Portrait session", 250, 950, "session", "Define session length, edits, gallery, and print rights"],
  ["photographers_videographers", "Event coverage", 1200, 8000, "event", "Price hours, second shooter, editing, travel, and usage"],
  ["photographers_videographers", "Brand video", 2500, 15000, "project", "Scope pre-production, shoot days, edit rounds, music, and formats"],
  ["interior_designers", "Design consultation", 250, 750, "session", "Use paid consults to qualify budget and scope"],
  ["interior_designers", "Room design package", 1200, 7500, "room", "Include layout, sourcing, renderings, revisions, and install notes"],
  ["interior_designers", "Full-service project", 7500, 50000, "project", "Track procurement, trade coordination, timeline, and markup"],
  ["web_designers", "Landing page", 750, 3500, "project", "Clarify copy, sections, assets, revisions, and launch support"],
  ["web_designers", "Small business website", 2500, 12000, "project", "Price by pages, CMS, forms, SEO setup, and integrations"],
  ["web_designers", "Care plan", 99, 750, "month", "Bundle updates, backups, analytics, and content changes"]
];

const priceRows: Array<Omit<ServicePricing, "id">> = priceTuples.map(([industry, serviceName, priceLow, priceHigh, unit, notes]) => ({
  industry,
  serviceName,
  priceLow,
  priceHigh,
  unit,
  notes
}));

const outreachRows: Array<Omit<OutreachTemplate, "id">> = Object.keys(industries).flatMap((industry) => {
  const label = industries[industry as IndustryKey].label.toLowerCase();
  return [
    {
      industry: industry as IndustryKey,
      name: "New lead speed-to-contact",
      channel: "SMS",
      template: `Hi {{first_name}}, this is {{owner_name}} with {{business_name}}. I saw your request for ${label} help. I can ask 2 quick questions and point you to the right next step.`
    },
    {
      industry: industry as IndustryKey,
      name: "Estimate follow-up",
      channel: "Email",
      template: `Subject: Quick follow-up on your {{service}} estimate\n\nHi {{first_name}}, I wanted to check whether you had any questions on the estimate. If the timing still works, I can hold a spot for {{date_option}}.`
    },
    {
      industry: industry as IndustryKey,
      name: "Past customer reactivation",
      channel: "SMS",
      template: `Hi {{first_name}}, hope you have been well. We have a few openings next week and I thought of you. Want me to send over options for {{service}}?`
    }
  ];
});

const promptRows: Array<Omit<AiPromptTemplate, "id">> = Object.keys(industries).flatMap((industry) => [
  {
    industry: industry as IndustryKey,
    name: "Daily owner coach",
    useCase: "Daily coaching",
    prompt: "Act as my operator. Based on today's leads, open deals, overdue follow-ups, and revenue goal, give me the 5 highest-leverage actions for today."
  },
  {
    industry: industry as IndustryKey,
    name: "Quote follow-up writer",
    useCase: "Follow-up",
    prompt: "Write a friendly follow-up for a prospect who received a quote for {{service}} worth {{value}} and has not responded in {{days_since_quote}} days."
  },
  {
    industry: industry as IndustryKey,
    name: "Pricing confidence check",
    useCase: "Pricing",
    prompt: "Review this service scope and suggest whether the price is too low, fair, or premium for my industry and market. Include risk notes."
  }
]);

const withIds = <T>(prefix: string, rows: Array<Omit<T, "id">>): T[] =>
  rows.map((row, index) => ({ id: `${prefix}-${index + 1}`, ...row }) as T);

export const seedPricing = withIds<ServicePricing>("price", priceRows);
export const seedOutreach = withIds<OutreachTemplate>("outreach", outreachRows);
export const seedPrompts = withIds<AiPromptTemplate>("prompt", promptRows);
