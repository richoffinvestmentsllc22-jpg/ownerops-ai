"use client";

import { CheckCircle2, ChevronRight, ClipboardList, Goal, UserRoundPlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { OwnerOpsData } from "@/lib/types";

const STORAGE_KEY = "ownerops-onboarding-minimized";

export function OnboardingWizard({ data, pathname }: { data: OwnerOpsData; pathname: string }) {
  const [minimized, setMinimized] = useState(true);

  const steps = useMemo(
    () => [
      {
        title: "Profile",
        detail: data.profile.businessName && data.profile.ownerName ? "Business info is ready." : "Add business and owner name.",
        complete: Boolean(data.profile.businessName && data.profile.ownerName),
        href: "/settings"
      },
      {
        title: "Industry",
        detail: data.profile.industry ? "Industry pack is selected." : "Choose the closest business type.",
        complete: Boolean(data.profile.industry),
        href: "/industries"
      },
      {
        title: "Goal",
        detail: data.profile.goal ? "Goal is saved." : "Enter the first business goal.",
        complete: Boolean(data.profile.goal),
        href: "/dashboard"
      },
      {
        title: "First lead",
        detail: data.leads.length ? `${data.leads.length} lead${data.leads.length === 1 ? "" : "s"} saved.` : "Add or test the first lead.",
        complete: data.leads.length > 0,
        href: "/leads"
      }
    ],
    [data]
  );

  const completeCount = steps.filter((step) => step.complete).length;
  const allComplete = completeCount === steps.length;
  const nextStep = steps.find((step) => !step.complete) ?? steps[steps.length - 1];

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setMinimized(saved === "1" || allComplete);
  }, [allComplete]);

  if (allComplete || pathname === "/account") return null;

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => {
          window.localStorage.removeItem(STORAGE_KEY);
          setMinimized(false);
        }}
        className="fixed bottom-20 left-4 z-30 inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-line bg-white px-4 py-3 text-sm font-black shadow-lift transition hover:border-sky"
      >
        <Goal size={17} className="text-sky" />
        Setup {completeCount}/{steps.length}
      </button>
    );
  }

  return (
    <aside className="fixed bottom-20 left-4 z-30 w-[min(100vw-2rem,420px)] overflow-hidden rounded-lg border border-line bg-white shadow-lift">
      <div className="flex items-start justify-between gap-3 border-b border-line bg-field p-4">
        <div>
          <p className="label">First-run setup</p>
          <h2 className="mt-1 font-black">Finish the basics before testing</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            OwnerOps gets smarter after profile, industry, goal, and first lead are in place.
          </p>
        </div>
        <button
          type="button"
          aria-label="Minimize setup guide"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "1");
            setMinimized(true);
          }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-white"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4">
        <div className="h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-sky" style={{ width: `${(completeCount / steps.length) * 100}%` }} />
        </div>
        <div className="mt-3 grid gap-2">
          {steps.map((step) => (
            <Link key={step.title} href={step.href} className="flex items-start gap-3 rounded-md border border-line bg-field p-3 transition hover:border-sky hover:bg-white">
              <CheckCircle2 size={17} className={step.complete ? "mt-0.5 shrink-0 text-moss" : "mt-0.5 shrink-0 text-ink/25"} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black">{step.title}</span>
                <span className="mt-1 block text-sm leading-5 text-ink/65">{step.detail}</span>
              </span>
              <ChevronRight size={16} className="mt-1 shrink-0 text-ink/35" />
            </Link>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={nextStep.href} className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
            <Goal size={16} />
            Continue setup
          </Link>
          <Link href="/leads" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
            <UserRoundPlus size={16} />
            Add lead
          </Link>
          <Link href="/tasks" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
            <ClipboardList size={16} />
            Tasks
          </Link>
        </div>
      </div>
    </aside>
  );
}
