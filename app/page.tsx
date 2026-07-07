import Link from "next/link"
import { Button } from "@/components/ui/button"
import { INDUSTRY_LIST } from "@/lib/industry-packs"
import {
  Sparkles,
  Users,
  Target,
  ListChecks,
  DollarSign,
  MessageSquareText,
  Brain,
  ArrowRight,
} from "lucide-react"

const features = [
  { icon: Users, title: "Lead management", desc: "Capture every lead and never let one go cold." },
  { icon: Target, title: "Sales pipeline", desc: "Track opportunities from first contact to closed deal." },
  { icon: ListChecks, title: "Tasks & follow-ups", desc: "Stay on top of the work that actually drives revenue." },
  { icon: DollarSign, title: "Pricing library", desc: "Industry-specific pricing so you always quote with confidence." },
  { icon: MessageSquareText, title: "Outreach scripts", desc: "Proven templates for texts, emails, and calls." },
  { icon: Brain, title: "AI prompt library", desc: "Ready-to-use prompts to power your next AI workflow." },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">OwnerOps AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Built for small service businesses
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              The operating system for your service business
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              Manage leads, follow-ups, pricing, and outreach in one clean app — tuned to your industry with AI-ready
              workflows and daily coaching.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">
                  Start free <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Log in</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
              Everything you need to run and grow
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-medium">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">Industry packs included</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Pick your industry and get pricing, scripts, and coaching tailored to your trade.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {INDUSTRY_LIST.map((pack) => (
              <span key={pack.key} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
                {pack.label}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>OwnerOps AI</span>
          <span>Built as a SaaS MVP starter.</span>
        </div>
      </footer>
    </div>
  )
}
