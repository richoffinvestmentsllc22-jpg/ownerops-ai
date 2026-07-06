"use client";

import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import type { Lead } from "@/lib/types";

function LeadsContent() {
  const { data, setData } = useOwnerOps();
  return (
    <>
      <SectionHeader eyebrow="Lead Desk" title="Leads" description="Capture new demand, track the source, and keep follow-up from slipping." />
      <CrudManager<Lead>
        rows={data.leads}
        setRows={(leads) => setData((current) => ({ ...current, leads }))}
        title="Lead records"
        emptyState="No leads yet."
        emptyRow={() => ({ id: crypto.randomUUID(), name: "", source: "", status: "new", estimatedValue: 0, nextFollowUp: "", notes: "" })}
        fields={[
          { key: "name", label: "Name" },
          { key: "source", label: "Source" },
          { key: "status", label: "Status", type: "select", options: ["new", "contacted", "qualified", "lost", "won"].map((value) => ({ label: value, value })) },
          { key: "estimatedValue", label: "Est. Value", type: "number", format: (value) => `$${Number(value).toLocaleString()}` },
          { key: "nextFollowUp", label: "Follow-up", type: "date" },
          { key: "notes", label: "Notes", type: "textarea" }
        ]}
      />
    </>
  );
}

export default function LeadsPage() {
  return (
    <PageFrame>
      <LeadsContent />
    </PageFrame>
  );
}
