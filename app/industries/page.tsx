"use client";

import { CheckCircle2, Layers3, Search } from "lucide-react";
import { IndustryPicker } from "@/components/IndustryPicker";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";
import type { IndustryKey } from "@/lib/types";

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

      <section className="panel mt-5 p-4">
        <IndustryPicker activeIndustry={data.profile.industry} onSelect={selectIndustry} />
      </section>
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
