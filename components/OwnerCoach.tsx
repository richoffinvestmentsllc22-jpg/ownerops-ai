"use client";

import { Lightbulb, PhoneCall, Send, Target } from "lucide-react";
import type { OwnerOpsData } from "@/lib/types";

export function OwnerCoach({ data }: { data: OwnerOpsData }) {
  const overdueTasks = data.tasks.filter((task) => task.status === "todo" && task.dueDate && task.dueDate <= new Date().toISOString().slice(0, 10));
  const proposal = data.opportunities.find((opp) => opp.stage === "proposal" || opp.stage === "negotiation");
  const newLead = data.leads.find((lead) => lead.status === "new");
  const actions = [
    {
      icon: PhoneCall,
      text: newLead ? `Call ${newLead.name} before the day gets noisy.` : "Add one fresh lead source to keep the top of funnel warm."
    },
    {
      icon: Send,
      text: proposal ? `Follow up on ${proposal.title}; it is worth $${proposal.value.toLocaleString()}.` : "Move one estimate into proposal with a clear next step."
    },
    {
      icon: Target,
      text: overdueTasks.length ? `Clear ${overdueTasks.length} due follow-up${overdueTasks.length > 1 ? "s" : ""}.` : "Create tomorrow's first follow-up before closing today."
    }
  ];

  return (
    <section className="panel p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-gold/20 text-ink">
          <Lightbulb size={19} />
        </span>
        <div>
          <p className="label">Daily Coach</p>
          <h2 className="font-black">Next best actions</h2>
        </div>
      </div>
      <div className="grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div key={action.text} className="flex gap-3 rounded-md border border-line bg-field p-3">
              <Icon className="mt-0.5 shrink-0 text-moss" size={18} />
              <p className="text-sm leading-6 text-ink/72">{action.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
