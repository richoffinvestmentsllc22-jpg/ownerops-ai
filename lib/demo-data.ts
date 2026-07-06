import { seedOutreach, seedPricing, seedPrompts } from "@/lib/industry-packs";
import type { OwnerOpsData } from "@/lib/types";

export const demoData: OwnerOpsData = {
  profile: {
    id: "profile-1",
    businessName: "OwnerOps Demo Co.",
    ownerName: "Jordan Owner",
    industry: "cleaning_services",
    city: "Austin",
    state: "TX",
    phone: "555-010-4488",
    website: "https://example.com",
    goal: "Reach $25k/month in recurring revenue with cleaner follow-up and better pricing."
  },
  customers: [
    {
      id: "customer-1",
      name: "Maya Johnson",
      email: "maya@example.com",
      phone: "555-210-8820",
      address: "1410 Westview Ave",
      notes: "Prefers text. Interested in biweekly recurring service."
    },
    {
      id: "customer-2",
      name: "Northside Property Group",
      email: "ops@northside.example",
      phone: "555-611-1400",
      address: "88 Market Street",
      notes: "Property manager for 38 rental units."
    }
  ],
  leads: [
    {
      id: "lead-1",
      name: "Website quote request",
      source: "Website",
      status: "new",
      estimatedValue: 1200,
      nextFollowUp: new Date().toISOString().slice(0, 10),
      notes: "Needs same-week walkthrough."
    },
    {
      id: "lead-2",
      name: "Instagram DM referral",
      source: "Instagram",
      status: "contacted",
      estimatedValue: 450,
      nextFollowUp: "",
      notes: "Asked for before and after examples."
    }
  ],
  opportunities: [
    {
      id: "opp-1",
      title: "July recurring cleaning package",
      stage: "proposal",
      value: 2400,
      closeDate: "",
      probability: 65,
      notes: "Send revised scope with appliance add-on."
    },
    {
      id: "opp-2",
      title: "Move-out clean for duplex",
      stage: "estimate",
      value: 850,
      closeDate: "",
      probability: 45,
      notes: "Waiting on photos."
    }
  ],
  tasks: [
    {
      id: "task-1",
      title: "Call new website lead",
      dueDate: new Date().toISOString().slice(0, 10),
      priority: "high",
      status: "todo",
      notes: "Ask budget, timing, bedrooms, bathrooms."
    },
    {
      id: "task-2",
      title: "Send follow-up to old quote",
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      priority: "medium",
      status: "todo",
      notes: "Use polite urgency template."
    }
  ],
  pricing: seedPricing,
  outreach: seedOutreach,
  prompts: seedPrompts
};
