"use client";

import { ArrowRight, CheckCircle2, CircleDot, UserRoundPlus } from "lucide-react";
import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import type { Opportunity } from "@/lib/types";
import { activeWorkflowStages, nextStage, stageInfo, stageOptions } from "@/lib/workflow";

function OpportunitiesContent() {
  const { data, setData } = useOwnerOps();
  const activeWork = data.opportunities.filter((opp) => !["completed", "lost"].includes(opp.stage));

  function taskForStage(opportunity: Opportunity, stage: Opportunity["stage"]) {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const titleByStage: Record<Opportunity["stage"], string> = {
      lead: `Qualify ${opportunity.title}`,
      estimate: `Prepare estimate for ${opportunity.title}`,
      proposal: `Send proposal for ${opportunity.title}`,
      negotiation: `Follow up on proposal for ${opportunity.title}`,
      won: `Collect approval details for ${opportunity.title}`,
      scheduled: `Schedule work for ${opportunity.title}`,
      in_progress: `Complete work for ${opportunity.title}`,
      completed: `Ask for review or referral from ${opportunity.title}`,
      lost: `Close out lost opportunity ${opportunity.title}`
    };

    return {
      id: crypto.randomUUID(),
      title: titleByStage[stage],
      dueDate: tomorrow,
      priority: stage === "completed" ? ("medium" as const) : ("high" as const),
      status: "todo" as const,
      notes: `Workflow moved to ${stageInfo(stage).label}. ${stageInfo(stage).detail}`
    };
  }

  function ensureCustomer(opportunity: Opportunity, customers: typeof data.customers, customerId?: string) {
    if (customerId) return customerId;
    const existing = customers.find((customer) => customer.name.toLowerCase() === opportunity.title.toLowerCase());
    return existing?.id ?? crypto.randomUUID();
  }

  function moveOpportunity(opportunity: Opportunity, targetStage: Opportunity["stage"]) {
    setData((current) => {
      const customerId = ["won", "scheduled", "in_progress", "completed"].includes(targetStage) ? ensureCustomer(opportunity, current.customers, opportunity.customerId) : opportunity.customerId;
      const hasCustomer = customerId ? current.customers.some((customer) => customer.id === customerId) : true;
      const nextOpportunity = {
        ...opportunity,
        stage: targetStage,
        probability: stageInfo(targetStage).probability,
        customerId
      };

      return {
        ...current,
        opportunities: current.opportunities.map((opp) => (opp.id === opportunity.id ? nextOpportunity : opp)),
        customers:
          customerId && !hasCustomer
            ? [
                {
                  id: customerId,
                  name: opportunity.title,
                  email: "",
                  phone: "",
                  address: "",
                  notes: `Created from won opportunity. Original value: $${opportunity.value.toLocaleString()}. ${opportunity.notes}`
                },
                ...current.customers
              ]
            : current.customers,
        leads: opportunity.sourceLeadId
          ? current.leads.map((lead) => (lead.id === opportunity.sourceLeadId ? { ...lead, status: targetStage === "lost" ? "lost" : "won" } : lead))
          : current.leads,
        tasks: [taskForStage(opportunity, targetStage), ...current.tasks]
      };
    });
  }

  return (
    <>
      <SectionHeader eyebrow="Sales Pipeline" title="Opportunities and job phases" description="Move work from lead to estimate, proposal, win, scheduled job, in-progress work, and completion." />
      <section className="panel mb-5 overflow-hidden">
        <div className="border-b border-line bg-navy p-4 text-white">
          <div className="flex items-center gap-2">
            <CircleDot size={18} className="text-gold" />
            <h2 className="font-black">Workflow phases</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/70">Use these phases to keep every real client moving until the work is complete.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {activeWorkflowStages.map((stage) => {
            const count = data.opportunities.filter((opp) => opp.stage === stage.key).length;
            return (
              <div key={stage.key} className="rounded-md border border-line bg-field p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-black">{stage.label}</p>
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-ink/65">{count}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/60">{stage.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel mb-5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-moss" />
          <h2 className="font-black">Active work queue</h2>
        </div>
        {activeWork.length ? (
          <div className="grid gap-3">
            {activeWork.map((opp) => {
              const next = nextStage(opp.stage);
              return (
                <div key={opp.id} className="rounded-md border border-line bg-field p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{opp.title}</p>
                      <p className="mt-1 text-sm leading-6 text-ink/65">
                        {stageInfo(opp.stage).label} · ${opp.value.toLocaleString()} · {opp.probability}% confidence
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {next ? (
                        <button
                          type="button"
                          onClick={() => moveOpportunity(opp, next)}
                          className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white"
                        >
                          <ArrowRight size={16} />
                          {stageInfo(opp.stage).nextLabel}
                        </button>
                      ) : null}
                      {!["won", "scheduled", "in_progress", "completed"].includes(opp.stage) ? (
                        <button
                          type="button"
                          onClick={() => moveOpportunity(opp, "won")}
                          className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white"
                        >
                          <UserRoundPlus size={16} />
                          Won client
                        </button>
                      ) : null}
                      {opp.stage !== "lost" ? (
                        <button
                          type="button"
                          onClick={() => moveOpportunity(opp, "lost")}
                          className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-clay"
                        >
                          Lost
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{stageInfo(opp.stage).detail}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-6 text-ink/60">No active opportunities or jobs right now.</p>
        )}
      </section>
      <CrudManager<Opportunity>
        rows={data.opportunities}
        setRows={(opportunities) => setData((current) => ({ ...current, opportunities }))}
        title="Pipeline records"
        emptyState="No opportunities yet."
        emptyRow={() => ({ id: crypto.randomUUID(), title: "", stage: "lead", value: 0, closeDate: "", probability: 40, notes: "" })}
        fields={[
          { key: "title", label: "Title" },
          { key: "stage", label: "Stage", type: "select", options: stageOptions() },
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
