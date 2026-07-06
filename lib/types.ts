export type IndustryKey =
  | "general_contractors"
  | "cleaning_services"
  | "barbershops"
  | "nail_salons"
  | "landscaping_companies"
  | "auto_detailing_businesses"
  | "real_estate_investors"
  | "tax_preparers"
  | "heavy_truck_drivers"
  | "hvac_services"
  | "plumbing_services"
  | "electrical_services"
  | "roofing_companies"
  | "painting_companies"
  | "flooring_installers"
  | "handyman_services"
  | "appliance_repair"
  | "pest_control"
  | "welding_fabrication"
  | "concrete_masonry"
  | "moving_companies"
  | "towing_roadside"
  | "graphic_designers"
  | "brand_designers"
  | "custom_artists"
  | "print_sign_shops"
  | "photographers_videographers"
  | "interior_designers"
  | "web_designers";

export type BusinessProfile = {
  id: string;
  businessName: string;
  ownerName: string;
  industry: IndustryKey;
  language: "en" | "es" | "fr" | "pt";
  city: string;
  state: string;
  phone: string;
  website: string;
  goal: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

export type Lead = {
  id: string;
  name: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "lost" | "won";
  estimatedValue: number;
  nextFollowUp: string;
  notes: string;
};

export type Opportunity = {
  id: string;
  title: string;
  stage: "lead" | "estimate" | "proposal" | "negotiation" | "won" | "scheduled" | "in_progress" | "completed" | "lost";
  value: number;
  closeDate: string;
  probability: number;
  notes: string;
  sourceLeadId?: string;
  customerId?: string;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "done";
  notes: string;
};

export type ServicePricing = {
  id: string;
  industry: IndustryKey;
  serviceName: string;
  priceLow: number;
  priceHigh: number;
  unit: string;
  notes: string;
};

export type OutreachTemplate = {
  id: string;
  industry: IndustryKey;
  name: string;
  channel: string;
  template: string;
};

export type AiPromptTemplate = {
  id: string;
  industry: IndustryKey;
  name: string;
  useCase: string;
  prompt: string;
};

export type ProofItem = {
  id: string;
  title: string;
  clientName: string;
  service: string;
  industry: IndustryKey;
  beforeImage: string;
  afterImage: string;
  outcome: string;
  notes: string;
  createdAt: string;
};

export type OwnerOpsData = {
  profile: BusinessProfile;
  customers: Customer[];
  leads: Lead[];
  opportunities: Opportunity[];
  tasks: Task[];
  pricing: ServicePricing[];
  outreach: OutreachTemplate[];
  prompts: AiPromptTemplate[];
  proof: ProofItem[];
};
