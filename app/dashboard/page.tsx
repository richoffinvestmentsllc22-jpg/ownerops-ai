"use client";

import {
  BadgeDollarSign,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Goal,
  Images,
  Layers3,
  LifeBuoy,
  PlusCircle,
  Settings,
  ShieldCheck,
  SquarePen,
  UserRoundPlus
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { OwnerCoach } from "@/components/OwnerCoach";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { useOwnerOps } from "@/components/DataProvider";
import { goalSummary, suggestedGoalTasks } from "@/lib/goal-planner";
import { stageInfo } from "@/lib/workflow";

function DashboardContent() {
  const { data, setData, session } = useOwnerOps();
  const [goalMessage, setGoalMessage] = useState("");
  const [goalDraft, setGoalDraft] = useState(data.profile.goal);
  const today = new Date().toISOString().slice(0, 10);
  const openOpportunities = data.opportunities.filter((opp) => !["completed", "lost"].includes(opp.stage));
  const activeJobs = data.opportunities.filter((opp) => ["scheduled", "in_progress"].includes(opp.stage)).length;
  const followUpsDue = data.leads.filter((lead) => lead.nextFollowUp && lead.nextFollowUp <= today).length;
  const tasksDue = data.tasks.filter((task) => task.status === "todo" && task.dueDate && task.dueDate <= today).length;
  const estimatedRevenue = openOpportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0);
  const summary = goalSummary(data);
  const goalTasks = useMemo(() => suggestedGoalTasks(data), [data]);
  const setupSteps = [
    {
      title: "Business profile",
      detail: data.profile.businessName && data.profile.ownerName ? `${data.profile.businessName} is ready.` : "Add business and owner name.",
      complete: Boolean(data.profile.businessName && data.profile.ownerName),
      href: "/settings"
    },
    {
      title: "Industry pack",
      detail: "Pricing, scripts, prompts, and guidance use this pack.",
      complete: Boolean(data.profile.industry),
      href: "/industries"
    },
    {
      title: "Saved goal",
      detail: data.profile.goal ? "Goal is powering suggested tasks." : "Add one clear owner goal.",
      complete: Boolean(data.profile.goal),
      href: "/settings"
    },
    {
      title: "First lead",
      detail: data.leads.length ? `${data.leads.length} lead${data.leads.length === 1 ? "" : "s"} captured.` : "Add a real or test lead.",
      complete: data.leads.length > 0,
      href: "/leads"
    },
    {
      title: "Pipeline flow",
      detail: openOpportunities.length ? `${openOpportunities.length} active workflow${openOpportunities.length === 1 ? "" : "s"}.` : "Move a serious lead into Pipeline.",
      complete: openOpportunities.length > 0,
      href: "/opportunities"
    },
    {
      title: "Cloud account",
      detail: session ? "Cloud account is signed in." : "Use Account before charging real users.",
      complete: Boolean(session),
      href: "/account"
    }
  ];
  const completedSetup = setupSteps.filter((step) => step.complete).length;
  const profileBasicsReady = Boolean(data.profile.businessName && data.profile.ownerName && data.profile.industry);
  const shouldPromptForGoal = profileBasicsReady && !data.profile.goal.trim();

  function addGoalTasks() {
    if (!goalTasks.length) {
      setGoalMessage("Goal tasks are already in your task list.");
      return;
    }
    setData((current) => ({ ...current, tasks: [...goalTasks, ...current.tasks] }));
    setGoalMessage(`${goalTasks.length} personalized task${goalTasks.length === 1 ? "" : "s"} added.`);
  }

  function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanGoal = goalDraft.trim();
    if (!cleanGoal) {
      setGoalMessage("Enter a goal first so OwnerOps can personalize the next tasks.");
      return;
    }
    setData((current) => {
      const nextData = {
        ...current,
        profile: {
          ...current.profile,
          goal: cleanGoal
        }
      };
      const nextGoalTasks = suggestedGoalTasks(nextData);
      return {
        ...nextData,
        tasks: nextGoalTasks.length ? [...nextGoalTasks, ...nextData.tasks] : nextData.tasks
      };
    });
    setGoalMessage("Goal saved. Personalized tasks are ready on the Tasks screen.");
  }

  function addStarterTask() {
    const title = data.profile.goal.trim() ? `Move goal forward: ${data.profile.goal.trim().slice(0, 52)}` : "Plan today's next business move";
    if (data.tasks.some((task) => task.title === title && task.status === "todo")) {
      setGoalMessage("That starter task is already in your task list.");
      return;
    }
    setData((current) => ({
      ...current,
      tasks: [
        {
          id: crypto.randomUUID(),
          title,
          dueDate: today,
          priority: "high",
          status: "todo",
          notes: "Created from Dashboard. Edit this task with the exact action, client, or follow-up needed."
        },
        ...current.tasks
      ]
    }));
    setGoalMessage("Starter task added. Open Tasks to edit the details.");
  }

  return (
    <>
      <SectionHeader
        eyebrow="Command Center"
        title={`Good morning, ${data.profile.ownerName || "Owner"}`}
        description="A practical operating view for leads, deals, follow-ups, pricing, scripts, and the work that moves revenue today."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Leads" value={String(data.leads.length)} detail="Open lead records" icon={UserRoundPlus} href="/leads" />
        <StatCard label="Open Work" value={String(openOpportunities.length)} detail={`${activeJobs} scheduled or in progress`} icon={BriefcaseBusiness} href="/opportunities" />
        <StatCard label="Follow-ups" value={String(followUpsDue)} detail="Lead follow-ups due" icon={CalendarClock} href="/leads" />
        <StatCard label="Est. Revenue" value={`$${Math.round(estimatedRevenue).toLocaleString()}`} detail="Weighted open pipeline" icon={BadgeDollarSign} href="/pricing" />
        <StatCard label="Tasks Due" value={String(tasksDue)} detail="Open tasks due now" icon={ClipboardList} href="/tasks" />
      </div>

      {shouldPromptForGoal ? (
        <section className="panel mt-6 overflow-hidden">
          <div className="border-b border-line bg-ink p-4 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10">
                <Goal size={18} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/60">Goal needed</p>
                <h2 className="font-black">Set the goal before the app builds the workflow</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Your profile and industry are ready. Add one clear revenue, booking, lead, or completion goal so OwnerOps can create better tasks and guidance.
            </p>
          </div>
          <form onSubmit={saveGoal} className="grid gap-3 p-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <label>
              <span className="label mb-1 block">Owner goal</span>
              <textarea
                className="field"
                rows={3}
                value={goalDraft}
                onChange={(event) => setGoalDraft(event.target.value)}
                placeholder="Example: Book 10 catering events this month, reach $25k/month, or close 5 qualified jobs in 30 days."
              />
            </label>
            <button type="submit" className="inline-flex justify-center rounded-md bg-moss px-4 py-2 text-sm font-black text-white">
              Save goal
            </button>
          </form>
        </section>
      ) : null}

      <section className="panel mt-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-sky" />
              <p className="label">Setup Guide</p>
            </div>
            <h2 className="mt-1 text-xl font-black">{completedSetup}/{setupSteps.length} launch basics complete</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Use this checklist to turn the app from a demo into a clean tester experience.
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-line lg:w-64">
            <div className="h-full bg-sky" style={{ width: `${(completedSetup / setupSteps.length) * 100}%` }} />
          </div>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {setupSteps.map((step) => (
            <Link key={step.title} href={step.href} className="rounded-md border border-line bg-field p-3 transition hover:border-sky hover:bg-white">
              <span className="flex items-center gap-2 font-black">
                <CheckCircle2 size={16} className={step.complete ? "text-moss" : "text-ink/25"} />
                {step.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-ink/65">{step.detail}</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addStarterTask}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white"
          >
            <ClipboardList size={16} />
            Create starter task
          </button>
          <button
            type="button"
            onClick={addGoalTasks}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold"
          >
            <PlusCircle size={16} />
            Add goal tasks
          </button>
          <Link href="/tasks" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
            Open tasks
          </Link>
          <Link href="/leads" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
            Add lead
          </Link>
        </div>
      </section>

      <section className="panel mt-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <Goal size={18} className="text-moss" />
              <p className="label">Saved Goal</p>
            </div>
            <h2 className="mt-2 text-xl font-black">{summary.goal}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              OwnerOps uses this goal with the active industry pack to suggest tasks, lead moves, quote follow-ups, and workflow steps.
            </p>
          </div>
          <button
            type="button"
            onClick={addGoalTasks}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white"
          >
            <PlusCircle size={16} />
            Add goal tasks
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-line bg-field p-3">
            <p className="label">Weighted Pipeline</p>
            <p className="mt-1 text-2xl font-black">${Math.round(summary.weightedValue).toLocaleString()}</p>
          </div>
          <div className="rounded-md border border-line bg-field p-3">
            <p className="label">Active Workflows</p>
            <p className="mt-1 text-2xl font-black">{summary.activeOpportunities}</p>
          </div>
          <div className="rounded-md border border-line bg-field p-3">
            <p className="label">Open Tasks</p>
            <p className="mt-1 text-2xl font-black">{summary.openTasks}</p>
          </div>
        </div>
        {goalTasks.length ? (
          <div className="mt-4 grid gap-2 lg:grid-cols-3">
            {goalTasks.map((task) => (
              <div key={task.title} className="rounded-md border border-line bg-white p-3">
                <p className="font-black">{task.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink/65">{task.notes}</p>
              </div>
            ))}
          </div>
        ) : null}
        {goalMessage ? <p className="mt-3 text-sm font-semibold text-moss">{goalMessage}</p> : null}
      </section>

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
                  {stageInfo(opp.stage).label} · {opp.probability}% confidence
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
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-navy text-white">
              <Bot size={18} />
            </span>
            <div>
              <p className="label">Active Agent</p>
              <h2 className="font-black">Ask what to do next</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                The agent reads the current workspace and gives practical next steps for leads, estimates, tasks, saving, and setup.
              </p>
              <Link href="/agent" className="mt-3 inline-flex rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
                Open agent
              </Link>
            </div>
          </div>
        </section>
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
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gold text-ink">
              <SquarePen size={18} />
            </span>
            <div>
              <p className="label">Estimator</p>
              <h2 className="font-black">Build quotes that include overhead and profit</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                For construction trades, estimate by quantity, material, labor hours, complexity, overhead, contingency, and target margin.
              </p>
              <Link href="/estimator" className="mt-3 inline-flex rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
                Open estimator
              </Link>
            </div>
          </div>
        </section>
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-sky text-white">
              <Images size={18} />
            </span>
            <div>
              <p className="label">Proof</p>
              <h2 className="font-black">Save before-and-after photos for follow-up</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Use visual proof with leads, quotes, social posts, and reactivation messages so clients can see why the price makes sense.
              </p>
              <Link href="/proof" className="mt-3 inline-flex rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
                Open proof library
              </Link>
            </div>
          </div>
        </section>
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-ink">
              <LifeBuoy size={18} />
            </span>
            <div>
              <p className="label">Support</p>
              <h2 className="font-black">Give testers a place to get unstuck</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                FAQ and troubleshooting explain login, saving, blank tests, voice input, industry packs, and estimates.
              </p>
              <Link href="/support" className="mt-3 inline-flex rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
                Open support
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
