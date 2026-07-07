import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell"
import { getPack } from "@/lib/industry-packs"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!business) redirect("/onboarding")

  const pack = getPack(business.industry)

  return (
    <AppShell businessName={business.name} industryLabel={pack?.label ?? "Business"}>
      {children}
    </AppShell>
  )
}
