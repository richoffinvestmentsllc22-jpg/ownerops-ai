"use client";

import { BadgeDollarSign, BriefcaseBusiness, CalendarClock, ClipboardList, Layers3, ShieldCheck, UserRoundPlus } from "lucide-react";
import Link from "next/link";
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

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-ink text-white">
              <Layers3 size={18} />
            </span>
            <div>
              <p className="label">Industry System</p>
              <h2 className="font-black">Use a pack built for the real business model</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Switch between trades, trucking, tax, creative services, and local service packs. Each pack changes pricing, scripts, prompts, and coaching.
              </p>
              <Link href="/industries" className="mt-3 inline-flex rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
                Manage industry pack
              </Link>
            </div>
          </div>
        </section>
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-moss text-white">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="label">Trust Layer</p>
              <h2 className="font-black">Price and follow up with a cleaner process</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Use the operator tools to draft quotes, check profit margin, and confirm the details that make a small business look professional.
              </p>
              <Link href="/tools" className="mt-3 inline-flex rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
                Open tools
              </Link>
            </div>
          </div>
        </section>
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
