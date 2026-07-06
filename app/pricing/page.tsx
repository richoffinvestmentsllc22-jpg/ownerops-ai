"use client";

import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";
import type { IndustryKey, ServicePricing } from "@/lib/types";

function PricingContent() {
  const { data, setData } = useOwnerOps();
  const industryOptions = Object.entries(industries).map(([value, pack]) => ({ value, label: pack.label }));
  return (
    <>
      <SectionHeader
        eyebrow="Pricing Library"
        title={`${industries[data.profile.industry].label} Pricing`}
        description="Reference starting ranges, units, and pricing notes. Edit these into your own market rules over time."
      />
      <CrudManager<ServicePricing>
        rows={data.pricing}
        setRows={(pricing) => setData((current) => ({ ...current, pricing }))}
        filter={(row) => row.industry === data.profile.industry}
        title="Service pricing"
        emptyState="No pricing rows for this industry yet."
        emptyRow={() => ({ id: crypto.randomUUID(), industry: data.profile.industry, serviceName: "", priceLow: 0, priceHigh: 0, unit: "job", notes: "" })}
        fields={[
          { key: "serviceName", label: "Service" },
          { key: "priceLow", label: "Low", type: "number", format: (value) => `$${Number(value).toLocaleString()}` },
          { key: "priceHigh", label: "High", type: "number", format: (value) => `$${Number(value).toLocaleString()}` },
          { key: "unit", label: "Unit" },
          { key: "industry", label: "Industry", type: "select", options: industryOptions, format: (value) => industries[value as IndustryKey].label },
          { key: "notes", label: "Notes", type: "textarea" }
        ]}
      />
    </>
  );
}

export default function PricingPage() {
  return (
    <PageFrame>
      <PricingContent />
    </PageFrame>
  );
}
