"use client";

import { Copy } from "lucide-react";
import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";
import type { IndustryKey, OutreachTemplate } from "@/lib/types";

function OutreachContent() {
  const { data, setData } = useOwnerOps();
  const industryOptions = Object.entries(industries).map(([value, pack]) => ({ value, label: pack.label }));
  const currentTemplates = data.outreach.filter((row) => row.industry === data.profile.industry);
  return (
    <>
      <SectionHeader
        eyebrow="Script Builder"
        title="Outreach Templates"
        description="Save follow-up scripts for SMS, email, DMs, voicemail, and reactivation campaigns."
      />
      <div className="mb-5 grid gap-3 lg:grid-cols-3">
        {currentTemplates.slice(0, 3).map((template) => (
          <article key={template.id} className="panel p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="label">{template.channel}</p>
                <h2 className="font-black">{template.name}</h2>
              </div>
              <button
                type="button"
                aria-label="Copy script"
                onClick={() => navigator.clipboard.writeText(template.template)}
                className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white"
              >
                <Copy size={15} />
              </button>
            </div>
            <p className="whitespace-pre-line text-sm leading-6 text-ink/70">{template.template}</p>
          </article>
        ))}
      </div>
      <CrudManager<OutreachTemplate>
        rows={data.outreach}
        setRows={(outreach) => setData((current) => ({ ...current, outreach }))}
        filter={(row) => row.industry === data.profile.industry}
        title="Script records"
        emptyState="No outreach templates for this industry yet."
        emptyRow={() => ({ id: crypto.randomUUID(), industry: data.profile.industry, name: "", channel: "SMS", template: "" })}
        fields={[
          { key: "name", label: "Name" },
          { key: "channel", label: "Channel" },
          { key: "industry", label: "Industry", type: "select", options: industryOptions, format: (value) => industries[value as IndustryKey].label },
          { key: "template", label: "Template", type: "textarea" }
        ]}
      />
    </>
  );
}

export default function OutreachPage() {
  return (
    <PageFrame>
      <OutreachContent />
    </PageFrame>
  );
}
