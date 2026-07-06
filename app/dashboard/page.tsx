"use client";

import { BadgeDollarSign, BriefcaseBusiness, CalendarClock, ClipboardList, UserRoundPlus } from "lucide-react";
import { OwnerCoach } from "@/components/OwnerCoach";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { useOwnerOps } from "@/components/DataProvider";

function DashboardContent() {
  const { data } = useOwnerOps();
  const today = new Date().toISOString().slice(0, 10);
  const openOpportunities = data.opportunities.filter((opp) => !["won", "lost"].includes(opp.stage));
  const followUpsDue = data.leads.filter((lead) => lead.nextFollowUp && lead.nextFollowUp <= today).length;
  const tasksDue = data.tasks.filter((task) => task.status === "todo" && task.dueDate && task.dueDate <= today).length;
  const estimatedRevenue = openOpportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0);

  return (
    <>
      <SectionHeader
        eyebrow="Command Center"
        title={`Good morning, ${data.profile.ownerName}`}
        description="A practical operating view for leads, deals, follow-ups, pricing, scripts, and the work that moves revenue today."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Leads" value={String(data.leads.length)} detail="Total active lead records" icon={UserRoundPlus} />
        <StatCard label="Open Deals" value={String(openOpportunities.length)} detail="Pipeline not won or lost" icon={BriefcaseBusiness} />
        <StatCard label="Follow-ups" value={String(followUpsDue)} detail="Lead follow-ups due" icon={CalendarClock} />
        <StatCard label="Est. Revenue" value={`$${Math.round(estimatedRevenue).toLocaleString()}`} detail="Weighted open pipeline" icon={BadgeDollarSign} />
        <StatCard label="Tasks Due" value={String(tasksDue)} detail="Open tasks due now" icon={ClipboardList} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="label">Pipeline</p>
              <h2 className="font-black">Opportunities by stage</h2>
            </div>
          </div>
          <div className="grid gap-3">
            {openOpportunities.map((opp) => (
              <div key={opp.id} className="rounded-md border border-line bg-field p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{opp.title}</p>
                  <p className="text-sm font-black text-moss">${opp.value.toLocaleString()}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-moss" style={{ width: `${opp.probability}%` }} />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.08em] text-ink/55">
                  {opp.stage} · {opp.probability}% confidence
                </p>
              </div>
            ))}
          </div>
        </section>
        <OwnerCoach data={data} />
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <PageFrame>
      <DashboardContent />
    </PageFrame>
  );
}
