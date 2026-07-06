"use client";

import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";
import type { AiPromptTemplate, IndustryKey } from "@/lib/types";

function PromptsContent() {
  const { data, setData } = useOwnerOps();
  const industryOptions = Object.entries(industries).map(([value, pack]) => ({ value, label: pack.label }));
  return (
    <>
      <SectionHeader
        eyebrow="Future AI Layer"
        title="AI Prompt Templates"
        description="Reusable prompts for coaching, pricing checks, quote follow-ups, lead scoring, and future AI automations."
      />
      <CrudManager<AiPromptTemplate>
        rows={data.prompts}
        setRows={(prompts) => setData((current) => ({ ...current, prompts }))}
        filter={(row) => row.industry === data.profile.industry}
        title="Prompt records"
        emptyState="No prompt templates for this industry yet."
        emptyRow={() => ({ id: crypto.randomUUID(), industry: data.profile.industry, name: "", useCase: "", prompt: "" })}
        fields={[
          { key: "name", label: "Name" },
          { key: "useCase", label: "Use Case" },
          { key: "industry", label: "Industry", type: "select", options: industryOptions, format: (value) => industries[value as IndustryKey].label },
          { key: "prompt", label: "Prompt", type: "textarea" }
        ]}
      />
    </>
  );
}

export default function AiPromptsPage() {
  return (
    <PageFrame>
      <PromptsContent />
    </PageFrame>
  );
}
