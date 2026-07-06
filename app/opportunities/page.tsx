"use client";

import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import type { Opportunity } from "@/lib/types";

function OpportunitiesContent() {
  const { data, setData } = useOwnerOps();
  return (
    <>
      <SectionHeader eyebrow="Sales Pipeline" title="Opportunities" description="Move work from lead to estimate to proposal, then close it cleanly." />
      <CrudManager<Opportunity>
        rows={data.opportunities}
        setRows={(opportunities) => setData((current) => ({ ...current, opportunities }))}
        title="Pipeline records"
        emptyState="No opportunities yet."
        emptyRow={() => ({ id: crypto.randomUUID(), title: "", stage: "lead", value: 0, closeDate: "", probability: 40, notes: "" })}
        fields={[
          { key: "title", label: "Title" },
          { key: "stage", label: "Stage", type: "select", options: ["lead", "estimate", "proposal", "negotiation", "won", "lost"].map((value) => ({ label: value, value })) },
          { key: "value", label: "Value", type: "number", format: (value) => `$${Number(value).toLocaleString()}` },
          { key: "probability", label: "Probability", type: "number", format: (value) => `${value}%` },
          { key: "closeDate", label: "Close Date", type: "date" },
          { key: "notes", label: "Notes", type: "textarea" }
        ]}
      />
    </>
  );
}

export default function OpportunitiesPage() {
  return (
    <PageFrame>
      <OpportunitiesContent />
    </PageFrame>
  );
}
