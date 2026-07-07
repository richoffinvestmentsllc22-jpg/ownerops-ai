// Global reference data for each industry pack.
// User-specific records (leads, tasks, opportunities, customers, businesses)
// live in Supabase. These templates/pricing/prompts are shared reference data.

export type IndustryKey =
  | "general_contractor"
  | "cleaning"
  | "barbershop"
  | "nail_salon"
  | "landscaping"
  | "auto_detailing"
  | "real_estate_investor"

export type PricingItem = {
  service_name: string
  unit: string
  price_low: number
  price_high: number
  notes: string
}

export type OutreachTemplate = {
  name: string
  channel: "SMS" | "Email" | "Call Script" | "DM"
  subject?: string
  body: string
}

export type AiPrompt = {
  category: string
  title: string
  prompt: string
}

export type IndustryPack = {
  key: IndustryKey
  label: string
  tagline: string
  pipelineStages: string[]
  leadSources: string[]
  coaching: string[]
  pricing: PricingItem[]
  outreach: OutreachTemplate[]
  prompts: AiPrompt[]
}

const commonPrompts = (biz: string): AiPrompt[] => [
  {
    category: "Lead Response",
    title: "Fast lead reply",
    prompt: `You are the front desk for a ${biz}. A new lead just came in named {{lead_name}} asking about {{service}}. Write a warm, professional reply under 60 words that answers their question, builds trust, and asks for the best time to book.`,
  },
  {
    category: "Follow-up",
    title: "3-day follow-up nudge",
    prompt: `Write a friendly follow-up message for {{lead_name}}, a ${biz} lead who hasn't responded in 3 days. Keep it short, reference {{service}}, add one reason to act now, and include a clear call to action.`,
  },
  {
    category: "Review Request",
    title: "Ask for a 5-star review",
    prompt: `Write a short, genuine text asking {{customer_name}} for a 5-star review after we completed {{service}}. Include a placeholder {{review_link}} and keep the tone appreciative, not pushy.`,
  },
]

export const INDUSTRY_PACKS: Record<IndustryKey, IndustryPack> = {
  general_contractor: {
    key: "general_contractor",
    label: "General Contractor",
    tagline: "Win more bids and keep projects moving.",
    pipelineStages: ["New", "Estimate Sent", "Negotiating", "Won", "Lost"],
    leadSources: ["Referral", "Google", "Angi", "Facebook", "Yard Sign", "Repeat Client"],
    coaching: [
      "Respond to every estimate request within 1 hour — speed wins bids.",
      "Follow up on outstanding estimates every 3 days until you get a yes or no.",
      "Ask every happy client for a referral and a Google review the day you finish.",
      "Track your close rate by lead source and double down on what converts.",
    ],
    pricing: [
      { service_name: "Kitchen Remodel", unit: "project", price_low: 15000, price_high: 45000, notes: "Mid-range full remodel" },
      { service_name: "Bathroom Remodel", unit: "project", price_low: 8000, price_high: 25000, notes: "Includes fixtures and tile" },
      { service_name: "Deck Build", unit: "per sq ft", price_low: 25, price_high: 50, notes: "Pressure-treated to composite" },
      { service_name: "Drywall Installation", unit: "per sq ft", price_low: 2, price_high: 4, notes: "Hang, tape, finish" },
      { service_name: "Interior Painting", unit: "per room", price_low: 300, price_high: 800, notes: "Two coats, standard ceiling" },
    ],
    outreach: [
      { name: "Estimate follow-up", channel: "SMS", body: "Hi {{name}}, this is {{business}} following up on the estimate for your {{service}}. Happy to answer any questions — want to lock in a start date this month?" },
      { name: "New lead intro", channel: "Email", subject: "Your {{service}} estimate", body: "Hi {{name}},\n\nThanks for reaching out about your {{service}}. I'd love to take a look and put together a detailed estimate. What's the best day this week for a quick site visit?\n\nBest,\n{{business}}" },
      { name: "Cold outreach to realtor", channel: "Call Script", body: "Hi {{name}}, I'm a licensed contractor working in {{city}}. I help realtors get listings turnkey fast — punch lists, paint, and repairs. Could I be your go-to for pre-listing work?" },
    ],
    prompts: commonPrompts("general contracting company"),
  },
  cleaning: {
    key: "cleaning",
    label: "Cleaning Service",
    tagline: "Book recurring clients and fill your schedule.",
    pipelineStages: ["New", "Quote Sent", "Trial Clean", "Recurring", "Lost"],
    leadSources: ["Referral", "Google", "Nextdoor", "Facebook", "Flyer", "Repeat Client"],
    coaching: [
      "Push every one-time job toward a recurring plan — recurring revenue is everything.",
      "Text a quote within 15 minutes of an inquiry while intent is hot.",
      "Confirm appointments the day before to cut no-shows.",
      "Ask for referrals after the first spotless clean — that's your happiest moment.",
    ],
    pricing: [
      { service_name: "Standard Home Cleaning", unit: "per visit", price_low: 100, price_high: 180, notes: "Up to 2000 sq ft" },
      { service_name: "Deep Cleaning", unit: "per visit", price_low: 200, price_high: 400, notes: "First-time or seasonal" },
      { service_name: "Move-Out Cleaning", unit: "flat", price_low: 250, price_high: 500, notes: "Empty home turnover" },
      { service_name: "Office Cleaning", unit: "per month", price_low: 400, price_high: 1200, notes: "Recurring commercial" },
      { service_name: "Carpet Cleaning", unit: "per room", price_low: 40, price_high: 75, notes: "Steam extraction" },
    ],
    outreach: [
      { name: "Instant quote", channel: "SMS", body: "Hi {{name}}! Thanks for reaching out to {{business}}. For a {{service}} we're looking at around {{price}}. Want me to grab a spot for you this week?" },
      { name: "Convert to recurring", channel: "SMS", body: "Hi {{name}}, hope your home felt amazing! Most clients love our bi-weekly plan and save 15%. Want me to set up recurring visits?" },
      { name: "Realtor partnership", channel: "Email", subject: "Move-out cleaning partner", body: "Hi {{name}},\n\nI run {{business}} in {{city}} and specialize in move-out and turnover cleans. I'd love to be your reliable partner for listings and rentals. Can I send over my pricing?\n\nThanks,\n{{business}}" },
    ],
    prompts: commonPrompts("residential cleaning service"),
  },
  barbershop: {
    key: "barbershop",
    label: "Barbershop",
    tagline: "Keep chairs full and clients coming back.",
    pipelineStages: ["New", "Booked", "Regular", "VIP", "Lapsed"],
    leadSources: ["Walk-in", "Instagram", "Referral", "Google", "TikTok", "Repeat Client"],
    coaching: [
      "Rebook every client before they leave the chair — aim for 80% rebook rate.",
      "Win back lapsed clients with a text after 5 weeks of no visit.",
      "Post fresh cuts to Instagram daily; tag the client to expand reach.",
      "Offer a referral discount card to every new client.",
    ],
    pricing: [
      { service_name: "Classic Haircut", unit: "service", price_low: 25, price_high: 45, notes: "Cut and style" },
      { service_name: "Beard Trim", unit: "service", price_low: 10, price_high: 25, notes: "Line-up and shape" },
      { service_name: "Hot Towel Shave", unit: "service", price_low: 30, price_high: 50, notes: "Straight razor" },
      { service_name: "Kids Cut", unit: "service", price_low: 15, price_high: 25, notes: "Under 12" },
      { service_name: "Cut + Beard Combo", unit: "service", price_low: 35, price_high: 65, notes: "Full grooming" },
    ],
    outreach: [
      { name: "Rebook reminder", channel: "SMS", body: "Yo {{name}}! It's been a few weeks — time for a fresh cut? Reply with a day and I'll get you in. — {{business}}" },
      { name: "Win-back lapsed", channel: "SMS", body: "Hey {{name}}, we miss you at {{business}}! Come back this week and your next cut is 20% off. Want me to book you?" },
      { name: "New client welcome", channel: "DM", body: "Thanks for the follow! First cut at {{business}} is 15% off. DM me a day/time and I'll lock it in." },
    ],
    prompts: commonPrompts("barbershop"),
  },
  nail_salon: {
    key: "nail_salon",
    label: "Nail Salon",
    tagline: "Fill your book and grow loyal regulars.",
    pipelineStages: ["New", "Booked", "Regular", "VIP", "Lapsed"],
    leadSources: ["Walk-in", "Instagram", "Referral", "Google", "TikTok", "Repeat Client"],
    coaching: [
      "Rebook clients 2-3 weeks out before they leave — gel fills drive recurring visits.",
      "Showcase nail art on Instagram and Stories daily.",
      "Send a birthday-month treat text to build loyalty.",
      "Bundle mani + pedi to raise average ticket.",
    ],
    pricing: [
      { service_name: "Classic Manicure", unit: "service", price_low: 20, price_high: 35, notes: "File, shape, polish" },
      { service_name: "Gel Manicure", unit: "service", price_low: 35, price_high: 55, notes: "Long-lasting gel" },
      { service_name: "Pedicure", unit: "service", price_low: 35, price_high: 60, notes: "Soak, scrub, polish" },
      { service_name: "Acrylic Full Set", unit: "service", price_low: 45, price_high: 80, notes: "Sculpted extensions" },
      { service_name: "Nail Art (per nail)", unit: "per nail", price_low: 5, price_high: 15, notes: "Custom design" },
    ],
    outreach: [
      { name: "Fill reminder", channel: "SMS", body: "Hi {{name}}! Your gel is about due for a fill. Want me to save your usual spot this week at {{business}}?" },
      { name: "Birthday treat", channel: "SMS", body: "Happy birthday month, {{name}}! Enjoy a free nail art upgrade on us at {{business}}. Book anytime this month." },
      { name: "New follower welcome", channel: "DM", body: "Thanks for following {{business}}! New clients get a free design upgrade on the first visit. Want to book?" },
    ],
    prompts: commonPrompts("nail salon"),
  },
  landscaping: {
    key: "landscaping",
    label: "Landscaping Company",
    tagline: "Lock in seasonal contracts and route efficiently.",
    pipelineStages: ["New", "Estimate Sent", "Negotiating", "Contract", "Lost"],
    leadSources: ["Referral", "Google", "Yard Sign", "Facebook", "Nextdoor", "Repeat Client"],
    coaching: [
      "Turn one-time jobs into seasonal maintenance contracts.",
      "Quote within 24 hours and include a recurring option on every estimate.",
      "Batch nearby jobs to cut drive time and boost daily revenue.",
      "Upsell mulch, cleanups, and aeration at seasonal transitions.",
    ],
    pricing: [
      { service_name: "Lawn Mowing", unit: "per visit", price_low: 35, price_high: 80, notes: "Standard residential lot" },
      { service_name: "Spring/Fall Cleanup", unit: "project", price_low: 200, price_high: 600, notes: "Leaf and debris removal" },
      { service_name: "Mulch Installation", unit: "per yard", price_low: 60, price_high: 120, notes: "Delivered and spread" },
      { service_name: "Sod Installation", unit: "per sq ft", price_low: 1, price_high: 3, notes: "Materials and labor" },
      { service_name: "Tree Trimming", unit: "per tree", price_low: 150, price_high: 600, notes: "Depends on size" },
    ],
    outreach: [
      { name: "Seasonal contract offer", channel: "SMS", body: "Hi {{name}}, {{business}} here. Lock in weekly mowing for the season and skip the per-visit rate. Want me to send the plan?" },
      { name: "Estimate follow-up", channel: "SMS", body: "Hi {{name}}, following up on your {{service}} estimate. We have an opening next week — want to get on the schedule?" },
      { name: "Cleanup upsell", channel: "Email", subject: "Time for a fall cleanup?", body: "Hi {{name}},\n\nLeaves are dropping fast. {{business}} can get your yard cleared and ready — want a quick quote for a fall cleanup?\n\nThanks,\n{{business}}" },
    ],
    prompts: commonPrompts("landscaping company"),
  },
  auto_detailing: {
    key: "auto_detailing",
    label: "Auto Detailing",
    tagline: "Book more cars and sell premium packages.",
    pipelineStages: ["New", "Quote Sent", "Booked", "Repeat", "Lost"],
    leadSources: ["Referral", "Instagram", "Google", "Facebook", "TikTok", "Repeat Client"],
    coaching: [
      "Offer a maintenance detail plan to turn one-time washes into monthly revenue.",
      "Post before/after reels — transformation content books cars.",
      "Upsell ceramic coating on every full detail consult.",
      "Text past clients seasonally (salt season, pollen season) to rebook.",
    ],
    pricing: [
      { service_name: "Exterior Wash & Wax", unit: "service", price_low: 50, price_high: 120, notes: "Hand wash and wax" },
      { service_name: "Interior Detail", unit: "service", price_low: 75, price_high: 200, notes: "Vacuum, shampoo, condition" },
      { service_name: "Full Detail", unit: "service", price_low: 150, price_high: 350, notes: "Interior + exterior" },
      { service_name: "Ceramic Coating", unit: "service", price_low: 500, price_high: 1500, notes: "Paint protection" },
      { service_name: "Headlight Restoration", unit: "service", price_low: 50, price_high: 120, notes: "Per pair" },
    ],
    outreach: [
      { name: "Booking confirm + upsell", channel: "SMS", body: "Hi {{name}}, you're booked with {{business}} for a {{service}}! Want to add a ceramic coating for long-term protection? I can include a deal." },
      { name: "Seasonal rebook", channel: "SMS", body: "Hey {{name}}, salt season is rough on paint. Time to get your ride detailed again? {{business}} has openings this week." },
      { name: "New follower offer", channel: "DM", body: "Thanks for following {{business}}! First-time details get 10% off. Send your vehicle type and I'll quote you." },
    ],
    prompts: commonPrompts("auto detailing business"),
  },
  real_estate_investor: {
    key: "real_estate_investor",
    label: "Real Estate Investor",
    tagline: "Work more deals through your acquisition pipeline.",
    pipelineStages: ["Lead", "Contacted", "Offer Made", "Under Contract", "Closed", "Dead"],
    leadSources: ["Direct Mail", "Cold Call", "PPC", "Driving for Dollars", "Referral", "Wholesaler"],
    coaching: [
      "Follow up with motivated sellers 7+ times — most deals close after multiple touches.",
      "Know your max allowable offer before every call: ARV x 0.7 minus repairs.",
      "Build your cash buyers list constantly so you can move contracts fast.",
      "Track cost per lead by marketing channel and cut what doesn't convert.",
    ],
    pricing: [
      { service_name: "Wholesale Assignment Fee", unit: "deal", price_low: 5000, price_high: 20000, notes: "Per assigned contract" },
      { service_name: "Fix & Flip Margin", unit: "deal", price_low: 20000, price_high: 60000, notes: "Target net profit" },
      { service_name: "Rental Cash Flow", unit: "per month", price_low: 150, price_high: 600, notes: "Per door net" },
      { service_name: "BRRRR Refi Pull-Out", unit: "deal", price_low: 10000, price_high: 50000, notes: "Cash recovered on refi" },
      { service_name: "Property Rehab Budget", unit: "project", price_low: 15000, price_high: 75000, notes: "Cosmetic to full gut" },
    ],
    outreach: [
      { name: "Motivated seller follow-up", channel: "SMS", body: "Hi {{name}}, it's {{business}}. Still thinking about selling {{address}}? I can make a fair cash offer with no repairs or fees on your end. Worth a quick chat?" },
      { name: "Cold call opener", channel: "Call Script", body: "Hi {{name}}, I'm a local investor. I came across your property at {{address}} and I buy houses in any condition for cash. Would you consider an offer if the price was right?" },
      { name: "Cash buyer blast", channel: "Email", subject: "Off-market deal in {{city}}", body: "Hi {{name}},\n\nI have an off-market property under contract in {{city}}. ARV {{arv}}, asking {{price}}, estimated repairs {{repairs}}. Want the full deal sheet?\n\n{{business}}" },
    ],
    prompts: commonPrompts("real estate investing business"),
  },
}

export const INDUSTRY_LIST = Object.values(INDUSTRY_PACKS)

export function getPack(industry: string | null | undefined): IndustryPack | null {
  if (!industry) return null
  return INDUSTRY_PACKS[industry as IndustryKey] ?? null
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}
