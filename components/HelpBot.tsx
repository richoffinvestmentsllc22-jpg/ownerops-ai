"use client";

import clsx from "clsx";
import {
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Map,
  Minimize2,
  Sparkles,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { goalRecommendationText } from "@/lib/goal-planner";
import { industries } from "@/lib/industry-packs";
import { stageInfo } from "@/lib/workflow";
import type { OwnerOpsData } from "@/lib/types";

type PageGuide = {
  title: string;
  detail: string;
  steps: string[];
  href: string;
  action: string;
};

const pageGuides: Record<string, PageGuide> = {
  "/dashboard": {
    title: "Dashboard tour",
    detail: "Use this as the daily command center. Check the saved goal, open work, and tasks that need action.",
    steps: ["Review your saved goal.", "Add goal tasks if the panel offers them.", "Open the task or pipeline item that needs attention first."],
    href: "/tasks",
    action: "Open tasks"
  },
  "/agent": {
    title: "Agent tour",
    detail: "Ask the assistant for the next move using your goal, industry, leads, tasks, and pipeline.",
    steps: ["Ask what to do today.", "Ask how to price or follow up.", "Turn useful advice into tasks."],
    href: "/dashboard",
    action: "View goal"
  },
  "/leads": {
    title: "Leads tour",
    detail: "This is where interested people start before they become real jobs or clients.",
    steps: ["Add a name, source, value, and follow-up date.", "Keep notes clear enough to remember the conversation.", "Use Start estimate when the lead is serious."],
    href: "/opportunities",
    action: "Open pipeline"
  },
  "/opportunities": {
    title: "Pipeline tour",
    detail: "Move each job through phases from estimate to completion so nothing gets stuck.",
    steps: ["Find the deal that needs action.", "Use the phase button to move it forward.", "Check Tasks for the follow-up that gets created."],
    href: "/tasks",
    action: "See follow-ups"
  },
  "/tasks": {
    title: "Tasks tour",
    detail: "Tasks are the daily checklist for follow-ups, estimates, prep, client messages, and next steps.",
    steps: ["Work the highest priority item first.", "Mark finished tasks done.", "Add the next follow-up before closing the app."],
    href: "/dashboard",
    action: "Back to dashboard"
  },
  "/customers": {
    title: "Customers tour",
    detail: "Use customers for people who became real clients, repeat buyers, or completed work.",
    steps: ["Keep phone, email, and address clean.", "Add notes that help future follow-up.", "Use pipeline phases to turn won work into customer records."],
    href: "/opportunities",
    action: "Open pipeline"
  },
  "/industries": {
    title: "Industry tour",
    detail: "The industry pack changes pricing, outreach, prompts, and app guidance for your business type.",
    steps: ["Pick the closest industry.", "Review the pricing and scripts it unlocks.", "Go to Settings and save the business goal."],
    href: "/settings",
    action: "Open settings"
  },
  "/pricing": {
    title: "Pricing tour",
    detail: "Use pricing rows as starting points for quotes, packages, and common services.",
    steps: ["Check the range for your service.", "Adjust for labor, materials, travel, and profit.", "Use Estimator when you need a detailed quote."],
    href: "/estimator",
    action: "Open estimator"
  },
  "/estimator": {
    title: "Estimator tour",
    detail: "Build quotes from numbers that update instantly, then copy a clean client message.",
    steps: ["Enter the client name before copying a message.", "Add quantities, costs, markup, and tax.", "Save or move serious quotes into the pipeline."],
    href: "/opportunities",
    action: "Open pipeline"
  },
  "/tools": {
    title: "Tools tour",
    detail: "Use tools for quick business helpers like client messages, calculations, and repeatable actions.",
    steps: ["Pick the tool that matches the job.", "Fill the client or project fields.", "Copy the finished output only after names are filled in."],
    href: "/outreach",
    action: "Open outreach"
  },
  "/proof": {
    title: "Proof tour",
    detail: "Proof keeps wins, before-and-after work, and outcomes ready for marketing and follow-up.",
    steps: ["Add the client or project name.", "Write the result in plain language.", "Use strong proof in outreach and proposals."],
    href: "/outreach",
    action: "Open outreach"
  },
  "/outreach": {
    title: "Outreach tour",
    detail: "Use scripts to contact leads, follow up on quotes, reactivate old clients, and ask for reviews.",
    steps: ["Pick the right template.", "Replace any personal details before sending.", "Create a task for the next follow-up date."],
    href: "/leads",
    action: "Open leads"
  },
  "/ai-prompts": {
    title: "Prompt tour",
    detail: "Prompts help you create better messages, plans, estimates, and business content faster.",
    steps: ["Choose the prompt that matches your job.", "Add real client details.", "Review the answer before using it with a customer."],
    href: "/agent",
    action: "Ask agent"
  },
  "/support": {
    title: "Support tour",
    detail: "Use support when you need help understanding app behavior, testing data, login, or cloud sync.",
    steps: ["Check the FAQ first.", "Look for save, login, or testing notes.", "Use Account when you are ready for cloud sync."],
    href: "/account",
    action: "Open account"
  },
  "/account": {
    title: "Account tour",
    detail: "Use Account for login, cloud sync, and blank testing so friends can try the app without seeing your data.",
    steps: ["Use blank test mode before sharing.", "Log in when you want cloud accounts.", "Confirm sync before charging real users."],
    href: "/support",
    action: "Open support"
  },
  "/settings": {
    title: "Settings tour",
    detail: "Business profile controls personalization across the dashboard, pricing, scripts, and assistant.",
    steps: ["Save business name, owner name, city, and phone.", "Choose the best industry pack.", "Write a goal so tasks and workflows can personalize."],
    href: "/dashboard",
    action: "View dashboard"
  }
};

const tourSteps = [
  {
    title: "Set the business profile",
    detail: "Start in Settings. The business name, owner name, industry, and goal personalize the dashboard, assistant, scripts, and pricing.",
    href: "/settings",
    action: "Open settings"
  },
  {
    title: "Add a lead",
    detail: "A lead is someone who might buy. Add their source, value, notes, and next follow-up so the app can guide the next move.",
    href: "/leads",
    action: "Add lead"
  },
  {
    title: "Move real work into Pipeline",
    detail: "When a lead becomes serious, move it into Pipeline. Then track it from estimate to proposal, won, scheduled, in progress, and completed.",
    href: "/opportunities",
    action: "Open pipeline"
  },
  {
    title: "Use Estimator before sending prices",
    detail: "The Estimator helps build a quote from quantity, cost, markup, tax, and fees. Add the client name before copying a message.",
    href: "/estimator",
    action: "Open estimator"
  },
  {
    title: "Work from Tasks daily",
    detail: "Tasks are where the app turns goals, leads, and pipeline moves into action. Clear what is due, then add the next follow-up.",
    href: "/tasks",
    action: "Open tasks"
  },
  {
    title: "Ask the Agent",
    detail: "The Agent can explain the next move based on the saved goal, selected industry, leads, tasks, and open work.",
    href: "/agent",
    action: "Ask agent"
  }
];

const quickLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/opportunities", label: "Pipeline" },
  { href: "/estimator", label: "Estimator" },
  { href: "/tasks", label: "Tasks" },
  { href: "/support", label: "Support" }
];

function firstOpenDeal(data: OwnerOpsData) {
  return data.opportunities.find((opp) => !["completed", "lost"].includes(opp.stage));
}

export function HelpBot({ data, pathname }: { data: OwnerOpsData; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const activeIndustry = industries[data.profile.industry];
  const currentGuide = pageGuides[pathname] ?? pageGuides["/dashboard"];

  useEffect(() => {
    const hasSeenBot = window.localStorage.getItem("ownerops-helpbot-seen");
    if (!hasSeenBot) {
      setOpen(true);
      window.localStorage.setItem("ownerops-helpbot-seen", "1");
    }
  }, []);

  const personalTip = useMemo(() => {
    const openDeal = firstOpenDeal(data);
    if (!data.profile.goal.trim()) {
      return "Add a goal in Settings so the dashboard and assistant can build a better plan.";
    }
    if (openDeal) {
      return `${openDeal.title} is in ${stageInfo(openDeal.stage).label}. Move it forward or create the next task.`;
    }
    if (data.leads.length) {
      return `${data.leads[0].name} is your next lead to qualify or follow up with.`;
    }
    return goalRecommendationText(data);
  }, [data]);

  const step = tourSteps[tourStep];

  function goBack() {
    setTourStep((current) => (current === 0 ? tourSteps.length - 1 : current - 1));
  }

  function goNext() {
    setTourStep((current) => (current === tourSteps.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3">
      {open ? (
        <aside className="w-[min(100vw-2rem,390px)] overflow-hidden rounded-lg border border-line bg-white shadow-lift">
          <div className="bg-ink p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10">
                  <Bot size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/60">OwnerOps Help Bot</p>
                  <h2 className="truncate text-base font-black">Guided app tour</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close help bot"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Active pack: {activeIndustry.label}. {data.profile.businessName || "Your business profile"} guides what this app shows next.
            </p>
          </div>

          <div className="max-h-[68vh] overflow-y-auto p-4">
            <div className="rounded-md border border-line bg-field p-3">
              <div className="flex items-center gap-2 text-sm font-black">
                <Map size={16} className="text-sky" />
                {currentGuide.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/70">{currentGuide.detail}</p>
              <div className="mt-3 space-y-2">
                {currentGuide.steps.map((item) => (
                  <div key={item} className="flex gap-2 text-sm leading-5 text-ink/75">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-moss" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href={currentGuide.href}
                className="mt-3 inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold transition hover:border-sky"
              >
                {currentGuide.action}
                <ExternalLink size={15} />
              </Link>
            </div>

            <div className="mt-3 rounded-md border border-line bg-white p-3">
              <div className="flex items-center gap-2 text-sm font-black">
                <Sparkles size={16} className="text-gold" />
                Personal next move
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/70">{personalTip}</p>
            </div>

            <div className="mt-3 rounded-md border border-line bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink/45">
                    Step {tourStep + 1} of {tourSteps.length}
                  </p>
                  <h3 className="mt-1 text-sm font-black">{step.title}</h3>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Previous tutorial step"
                    className="grid h-9 w-9 place-items-center rounded-md border border-line bg-field transition hover:border-sky"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next tutorial step"
                    className="grid h-9 w-9 place-items-center rounded-md border border-line bg-field transition hover:border-sky"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/70">{step.detail}</p>
              <Link href={step.href} className="mt-3 inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
                {step.action}
                <ExternalLink size={15} />
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-md border px-3 py-2 text-center text-sm font-bold transition",
                    pathname === link.href ? "border-ink bg-ink text-white" : "border-line bg-field hover:border-sky hover:bg-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Minimize help bot" : "Open help bot"}
        className={clsx(
          "flex h-14 items-center gap-2 rounded-full border border-line px-4 font-black shadow-lift transition",
          open ? "bg-white text-ink hover:border-sky" : "bg-ink text-white hover:bg-navy"
        )}
      >
        {open ? <Minimize2 size={19} /> : <HelpCircle size={20} />}
        <span>{open ? "Hide" : "Help"}</span>
      </button>
    </div>
  );
}
