"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { INDUSTRY_LIST } from "@/lib/industry-packs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [industry, setIndustry] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!industry) return
    setSaving(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { error } = await supabase.from("businesses").insert({
      user_id: user.id,
      name,
      industry,
      city: city || null,
      phone: phone || null,
      email: email || null,
      website: website || null,
    })

    if (error) {
      toast.error(error.message)
      setSaving(false)
      return
    }
    toast.success("Business created")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">OwnerOps AI</span>
      </div>

      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Choose your industry pack</CardTitle>
            <CardDescription>
              We&apos;ll tailor your pricing library, outreach scripts, pipeline, and coaching to your trade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {INDUSTRY_LIST.map((pack) => {
                const active = industry === pack.key
                return (
                  <button
                    key={pack.key}
                    type="button"
                    onClick={() => setIndustry(pack.key)}
                    className={`flex flex-col rounded-lg border p-4 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{pack.label}</span>
                      {active && <Check className="size-4 text-primary" />}
                    </div>
                    <span className="mt-1 text-sm text-muted-foreground">{pack.tagline}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button disabled={!industry} onClick={() => setStep(2)}>
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Set up your business profile</CardTitle>
            <CardDescription>Tell us a bit about your business. You can edit this later in Settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Business name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Services" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Austin, TX" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Business email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@acme.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="acme.com" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Creating..." : "Create business"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
