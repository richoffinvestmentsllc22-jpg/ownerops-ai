import { seedOutreach, seedPricing, seedPrompts } from "@/lib/industry-packs";
import type { OwnerOpsData } from "@/lib/types";

export const blankData: OwnerOpsData = {
  profile: {
    id: "profile-blank",
    businessName: "",
    ownerName: "",
    industry: "general_contractors",
    language: "en",
    city: "",
    state: "",
    phone: "",
    website: "",
    goal: ""
  },
  customers: [],
  leads: [],
  opportunities: [],
  tasks: [],
  pricing: seedPricing,
  outreach: seedOutreach,
  prompts: seedPrompts,
  proof: []
};
