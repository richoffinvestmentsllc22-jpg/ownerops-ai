"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import type { Lead } from "@/lib/types";

function LeadsContent() {
  const { data, setData } = useOwnerOps();
  const activeLeads = data.leads.filter((lead) => !["lost", "won"].includes(lead.status));

  function moveLeadToPipeline(lead: Lead) {
    setData((current) => {
      const existingOpportunity = current.opportunities.find((opp) => opp.sourceLeadId === lead.id);
      const opportunityId = existingOpportunity?.id ?? crypto.randomUUID();
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      return {
        ...current,
        leads: current.leads.map((item) => (item.id === lead.id ? { ...item, status: "qualified" } : item)),
        opportunities: existingOpportunity
          ? current.opportunities.map((opp) =>
              opp.id === existingOpportunity.id
                ? { ...opp, stage: opp.stage === "lead" ? "estimate" : opp.stage, value: lead.estimatedValue || opp.value, probability: Math.max(opp.probability, 45) }
                : opp
            )
          : [
              {
                id: opportunityId,
                title: lead.name,
                stage: "estimate",
                value: lead.estimatedValue,
                closeDate: "",
                probability: 45,
                notes: `Converted from lead (${lead.source || "unknown source"}). ${lead.notes}`,
                sourceLeadId: lead.id
              },
              ...current.opportunities
            ],
        tasks: [
          {
            id: crypto.randomUUID(),
            title: `Prepare estimate for ${lead.name}`,
            dueDate: lead.nextFollowUp || tomorrow,
            priority: "high",
            status: "todo",
            notes: `Lead moved into Pipeline. Confirm scope, timeline, decision maker, and estimate details.`
          },
          ...current.tasks
        ]
      };
    });
  }

  return (
    <>
      <SectionHeader eyebrow="Lead Desk" title="Leads" description="Capture demand, qualify it, then move real opportunities into the sales and job workflow." />
      <section className="panel mb-5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-moss" />
          <h2 className="font-black">Move a lead into the next phase</h2>
        </div>
        {activeLeads.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {activeLeads.map((lead) => {
              const alreadyInPipeline = data.opportunities.some((opp) => opp.sourceLeadId === lead.id);
              return (
                <div key={lead.id} className="rounded-md border border-line bg-field p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{lead.name}</p>
                      <p className="mt-1 text-sm leading-6 text-ink/65">
                        {lead.status} · {lead.source || "No source"} · ${lead.estimatedValue.toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => moveLeadToPipeline(lead)}
                      className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white"
                    >
                      <ArrowRight size={16} />
                      {alreadyInPipeline ? "Update pipeline" : "Start estimate"}
                    </button>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{lead.notes || "Add notes so the estimate starts with context."}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-6 text-ink/60">No active leads need conversion right now.</p>
        )}
      </section>
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
