import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingForm } from "@/components/onboarding-form"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: business } = await supabase.from("businesses").select("id").eq("user_id", user.id).maybeSingle()

  if (business) redirect("/dashboard")

  return (
    <div className="min-h-svh bg-muted/40 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <OnboardingForm />
      </div>
    </div>
  )
}
