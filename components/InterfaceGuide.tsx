"use client";

import { Compass } from "lucide-react";
import Link from "next/link";
import { industries } from "@/lib/industry-packs";
import type { OwnerOpsData } from "@/lib/types";

const guideByPath: Record<string, { title: string; detail: string; href: string; action: string }> = {
  "/dashboard": {
    title: "Start with the goal, then work the next task.",
    detail: "Use the dashboard goal panel to add personalized tasks, then move one active workflow forward.",
    href: "/tasks",
    action: "Open tasks"
  },
  "/leads": {
    title: "Qualify the lead before it becomes real work.",
    detail: "When a lead looks serious, use Start estimate to move it into Pipeline and create the next follow-up.",
    href: "/opportunities",
    action: "Open pipeline"
  },
  "/opportunities": {
    title: "Move work one phase at a time.",
    detail: "Use the phase buttons to go from estimate to proposal, won, scheduled, in progress, and completed.",
    href: "/tasks",
    action: "See follow-ups"
  },
  "/settings": {
    title: "Personalization starts here.",
    detail: "The business type and saved goal control pricing rows, scripts, coaching, and suggested tasks.",
    href: "/dashboard",
    action: "View dashboard"
  },
  "/industries": {
    title: "Pick the closest business model.",
    detail: "The selected pack changes pricing, scripts, prompts, and the assistant's operating advice.",
    href: "/settings",
    action: "Set goal"
  },
  "/agent": {
    title: "Ask about the goal or the next workflow step.",
    detail: "The agent reads the saved goal, active industry, leads, tasks, and pipeline state.",
    href: "/dashboard",
    action: "View goal"
  }
};

export function InterfaceGuide({ data, pathname }: { data: OwnerOpsData; pathname: string }) {
  const guide = guideByPath[pathname];
  if (!guide) return null;

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-sky/10 text-sky">
            <Compass size={17} />
          </span>
          <div>
            <p className="text-sm font-black">{guide.title}</p>
            <p className="mt-1 text-sm leading-6 text-ink/65">
              {guide.detail} Active pack: {industries[data.profile.industry].label}.
            </p>
          </div>
        </div>
        <Link href={guide.href} className="inline-flex shrink-0 justify-center rounded-md border border-line bg-field px-3 py-2 text-sm font-bold">
          {guide.action}
        </Link>
      </div>
    </section>
  );
}
