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
  ["real_estate_investors", "Disposition marketing", 500, 2500, "deal", "Use buyer list, photos, and deadline-driven copy"]
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
