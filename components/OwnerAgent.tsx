"use client";

import { Bot, CheckCircle2, ClipboardList, HelpCircle, Lightbulb, Send, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { goalRecommendationText, suggestedGoalTasks } from "@/lib/goal-planner";
import { industries } from "@/lib/industry-packs";
import { stageInfo } from "@/lib/workflow";
import type { OwnerOpsData } from "@/lib/types";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function buildAgentAnswer(question: string, data: OwnerOpsData) {
  const prompt = question.toLowerCase();
  const openDeals = data.opportunities.filter((opp) => !["completed", "lost"].includes(opp.stage));
  const hotLead = data.leads.find((lead) => lead.status === "new") ?? data.leads[0];
  const nextTask = data.tasks.find((task) => task.status === "todo") ?? data.tasks[0];
  const pipelineValue = openDeals.reduce((sum, opp) => sum + opp.value, 0);
  const activeIndustry = industries[data.profile.industry].label;

  if (prompt.includes("price") || prompt.includes("estimate") || prompt.includes("quote")) {
    return `Use the Estimator first, then save the quote to Pipeline. For ${activeIndustry}, make sure the price includes material, labor, overhead, contingency, and profit. Your open pipeline currently totals ${money(pipelineValue)}.`;
  }

  if (prompt.includes("lead") || prompt.includes("follow")) {
    return hotLead
      ? `Start with ${hotLead.name}. Status is ${hotLead.status}, estimated value is ${money(hotLead.estimatedValue)}, and the next follow-up date is ${hotLead.nextFollowUp || "not set"}. Add a task if you need a reminder.`
      : "Add one lead with source, value, notes, and follow-up date. Then the Dashboard and Daily Coach will have better recommendations.";
  }

  if (prompt.includes("login") || prompt.includes("save") || prompt.includes("sync") || prompt.includes("account")) {
    return "Go to Account, enter an email, and use the login link or code. Browser data saves immediately; cloud sync starts after login. Use Blank test when you want to test without old sample info.";
  }

  if (prompt.includes("industry") || prompt.includes("business type")) {
    return `Your active pack is ${activeIndustry}. Use Settings or Industries to switch it. That changes pricing rows, outreach scripts, AI prompt templates, and coaching language.`;
  }

  if (prompt.includes("task") || prompt.includes("today")) {
    return nextTask
      ? `Your next task is "${nextTask.title}" with ${nextTask.priority} priority. Mark it done when complete, then add the next follow-up so the workflow keeps moving.`
      : "Create one task for the next action you want done today. Good examples: call a lead, send estimate, collect photos, or follow up on a proposal.";
  }

  if (prompt.includes("goal") || prompt.includes("plan") || prompt.includes("personal")) {
    return goalRecommendationText(data);
  }

  return `Here is the best next step: make sure the profile is filled in, pick the right industry pack, add one lead, create one task, and try the Estimator. For ${activeIndustry}, the app will work best when records include notes, value, and a next follow-up.`;
}

export function OwnerAgent({ data }: { data: OwnerOpsData }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const activeIndustry = industries[data.profile.industry];
  const openDeals = data.opportunities.filter((opp) => !["completed", "lost"].includes(opp.stage));
  const goalTasks = useMemo(() => suggestedGoalTasks(data), [data]);
  const today = new Date().toISOString().slice(0, 10);
  const dueTasks = data.tasks.filter((task) => task.status === "todo" && task.dueDate && task.dueDate <= today);
  const setupScore = [
    Boolean(data.profile.businessName),
    Boolean(data.profile.ownerName),
    data.leads.length > 0,
    data.tasks.length > 0,
    openDeals.length > 0
  ].filter(Boolean).length;

  const recommendations = useMemo(
    () => [
      {
        title: "Tighten the profile",
        detail: data.profile.businessName ? `${data.profile.businessName} is using the ${activeIndustry.label} pack.` : "Add business name, owner name, phone, city, and goal.",
        href: "/settings"
      },
      {
        title: "Move one lead forward",
        detail: data.leads[0] ? `${data.leads[0].name} is marked ${data.leads[0].status}. Move qualified leads into Pipeline when they become real.` : "Add a lead so the dashboard can coach follow-up.",
        href: "/leads"
      },
      {
        title: "Move the workflow",
        detail: openDeals[0] ? `${openDeals[0].title} is in ${stageInfo(openDeals[0].stage).label}. Use Pipeline to move it to the next phase.` : "Use Pipeline to move real work from estimate through completion.",
        href: "/opportunities"
      },
      {
        title: "Clear today's work",
        detail: dueTasks.length ? `${dueTasks.length} task${dueTasks.length === 1 ? "" : "s"} due now.` : "No due tasks right now. Add tomorrow's follow-up before you close the app.",
        href: "/tasks"
      },
      {
        title: "Follow the saved goal",
        detail: goalTasks[0] ? goalTasks[0].title : goalRecommendationText(data),
        href: "/dashboard"
      }
    ],
    [activeIndustry.label, data, data.leads, data.profile.businessName, dueTasks.length, goalTasks, openDeals]
  );

  function askAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnswer(buildAgentAnswer(question, data));
  }

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-line bg-navy p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-white/10">
            <Bot size={20} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/60">OwnerOps Agent</p>
            <h2 className="font-black">Active help for the next move</h2>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-gold" style={{ width: `${setupScore * 20}%` }} />
        </div>
        <p className="mt-2 text-sm text-white/70">Setup strength: {setupScore}/5</p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          {recommendations.map((item) => (
            <Link key={item.title} href={item.href} className="block rounded-md border border-line bg-field p-3 transition hover:border-sky hover:bg-white">
              <span className="flex items-center gap-2 font-black">
                <CheckCircle2 size={16} className="text-moss" />
                {item.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-ink/65">{item.detail}</span>
            </Link>
          ))}
        </div>

        <div className="rounded-md border border-line bg-white p-3">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={17} className="text-sky" />
            <h3 className="font-black">Ask what to do next</h3>
          </div>
          <form onSubmit={askAgent} className="space-y-3">
            <textarea
              className="field"
              rows={4}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: What should I do today based on my goal? How should I price this job?"
            />
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
              <Send size={16} />
              Ask agent
            </button>
          </form>
          {answer ? (
            <div className="mt-3 rounded-md border border-line bg-field p-3 text-sm leading-6 text-ink/75">
              <div className="mb-1 flex items-center gap-2 font-black text-ink">
                <Lightbulb size={16} className="text-gold" />
                Recommendation
              </div>
              {answer}
            </div>
          ) : (
            <div className="mt-3 rounded-md border border-line bg-field p-3 text-sm leading-6 text-ink/65">
              <div className="mb-1 flex items-center gap-2 font-black text-ink">
                <HelpCircle size={16} className="text-sky" />
                Try asking
              </div>
              “What should I do today?”, “How do I save data?”, or “How should I price this estimate?”
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
