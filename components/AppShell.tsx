"use client";

import clsx from "clsx";
import {
  BadgeDollarSign,
  Bot,
  BriefcaseBusiness,
  Calculator,
  Cloud,
  ClipboardList,
  Home,
  Images,
  Layers3,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Settings,
  SquarePen,
  UserRoundPlus,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { industries } from "@/lib/industry-packs";
import { HelpBot } from "@/components/HelpBot";
import { InterfaceGuide } from "@/components/InterfaceGuide";
import type { OwnerOpsData } from "@/lib/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agent", label: "Agent", icon: Bot },
  { href: "/leads", label: "Leads", icon: UserRoundPlus },
  { href: "/opportunities", label: "Pipeline", icon: BriefcaseBusiness },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/customers", label: "Customers", icon: UsersRound },
  { href: "/industries", label: "Industries", icon: Layers3 },
  { href: "/pricing", label: "Pricing", icon: BadgeDollarSign },
  { href: "/estimator", label: "Estimator", icon: SquarePen },
  { href: "/tools", label: "Tools", icon: Calculator },
  { href: "/proof", label: "Proof", icon: Images },
  { href: "/outreach", label: "Outreach", icon: Megaphone },
  { href: "/ai-prompts", label: "AI Prompts", icon: Bot },
  { href: "/support", label: "Support", icon: LifeBuoy },
  { href: "/account", label: "Account", icon: Cloud },
  { href: "/settings", label: "Settings", icon: Settings }
] as const;

export function AppShell({ data, children }: { data: OwnerOpsData; children: React.ReactNode }) {
  const pathname = usePathname();
  const industry = industries[data.profile.industry];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-field/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-md bg-navy text-white shadow-lift">
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold" />
              <span className="text-lg font-black tracking-normal">OO</span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black">OwnerOps AI</span>
              <span className="block truncate text-xs text-ink/60">{data.profile.businessName || "Set up business profile"}</span>
            </span>
          </Link>
          <Link
            href="/settings"
            className="hidden rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink shadow-soft transition hover:border-sky sm:block"
          >
            {industry.label}
          </Link>
          <Link
            href="/settings"
            aria-label="Business profile"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-white sm:hidden"
          >
            <Home size={18} />
          </Link>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-white hover:text-ink"
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>
      <InterfaceGuide data={data} pathname={pathname} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">{children}</main>
      <HelpBot data={data} pathname={pathname} />
    </div>
  );
}
