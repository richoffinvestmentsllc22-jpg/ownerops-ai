"use client";

import { CheckCircle2, Layers3, Search } from "lucide-react";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";
import type { IndustryKey } from "@/lib/types";

const categories: Array<{ label: string; keys: IndustryKey[] }> = [
  {
    label: "Home & Field Trades",
    keys: [
      "general_contractors",
      "hvac_services",
      "plumbing_services",
      "electrical_services",
      "roofing_companies",
      "painting_companies",
      "flooring_installers",
      "handyman_services",
      "appliance_repair",
      "pest_control",
      "landscaping_companies",
      "concrete_masonry",
      "welding_fabrication"
    ]
  },
  {
    label: "Transportation",
    keys: ["heavy_truck_drivers", "moving_companies", "towing_roadside", "auto_detailing_businesses"]
  },
  {
    label: "Creative & Design",
    keys: [
      "graphic_designers",
      "brand_designers",
      "custom_artists",
      "print_sign_shops",
      "photographers_videographers",
      "interior_designers",
      "web_designers"
    ]
  },
  {
    label: "Professional & Local Services",
    keys: ["tax_preparers", "real_estate_investors", "cleaning_services", "barbershops", "nail_salons"]
  }
];

function IndustriesContent() {
  const { data, setData } = useOwnerOps();

  function selectIndustry(industry: IndustryKey) {
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        industry
      }
    }));
  }

  return (
    <>
      <SectionHeader
        eyebrow="Industry Packs"
        title="Choose the operating model that fits the business"
        description="Each pack changes pricing references, scripts, AI prompts, and daily coaching so the app feels built for the work instead of generic CRM software."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-ink text-white">
              <Layers3 size={18} />
            </span>
            <div>
              <p className="label">Active Pack</p>
              <h2 className="text-xl font-black">{industries[data.profile.industry].label}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{industries[data.profile.industry].focus}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-ink/70">
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-moss" />
              Pricing rows and quote ranges
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-moss" />
              Outreach templates for follow-up and reactivation
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-moss" />
              AI prompts for coaching, pricing, and client messages
            </p>
          </div>
        </section>

        <section className="panel p-4">
          <div className="flex items-center gap-2">
            <Search size={18} />
            <h2 className="font-black">Coverage</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            The library now covers trades, tax, trucking, transportation, creative work, and local services. Use this page to switch the whole app into the
            right operating language.
          </p>
        </section>
      </div>

      <div className="mt-5 space-y-5">
        {categories.map((category) => (
          <section key={category.label}>
            <h2 className="mb-3 text-lg font-black">{category.label}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {category.keys.map((key) => {
                const pack = industries[key];
                const active = data.profile.industry === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectIndustry(key)}
                    className={`panel min-h-[136px] p-4 text-left transition hover:border-moss ${active ? "border-moss ring-2 ring-moss/15" : ""}`}
                  >
                    <span className="label">{active ? "Active" : "Industry Pack"}</span>
                    <span className="mt-1 block text-base font-black">{pack.label}</span>
                    <span className="mt-2 block text-sm leading-6 text-ink/65">{pack.focus}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default function IndustriesPage() {
  return (
    <PageFrame>
      <IndustriesContent />
    </PageFrame>
  );
}
