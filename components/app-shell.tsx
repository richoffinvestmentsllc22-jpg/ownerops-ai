"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Target,
  ListChecks,
  Contact,
  DollarSign,
  MessageSquareText,
  Brain,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/opportunities", label: "Pipeline", icon: Target },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/customers", label: "Customers", icon: Contact },
  { href: "/pricing", label: "Pricing Library", icon: DollarSign },
  { href: "/outreach", label: "Outreach Scripts", icon: MessageSquareText },
  { href: "/prompts", label: "AI Prompts", icon: Brain },
]

export function AppShell({
  children,
  businessName,
  industryLabel,
}: {
  children: React.ReactNode
  businessName: string
  industryLabel: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const NavLinks = () => (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const SidebarInner = () => (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2 px-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <span className="font-semibold tracking-tight">OwnerOps AI</span>
      </div>
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
        <p className="truncate text-sm font-medium">{businessName}</p>
        <p className="text-xs text-muted-foreground">{industryLabel}</p>
      </div>
      <NavLinks />
      <Button variant="ghost" className="justify-start text-muted-foreground" onClick={handleLogout}>
        <LogOut className="size-4" /> Log out
      </Button>
    </div>
  )

  return (
    <div className="flex min-h-svh bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background md:block">
        <SidebarInner />
      </aside>

      {/* Mobile header + drawer */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">OwnerOps AI</span>
          </div>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-background shadow-xl">
              <div className="flex justify-end p-2">
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="size-5" />
                </Button>
              </div>
              <SidebarInner />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
