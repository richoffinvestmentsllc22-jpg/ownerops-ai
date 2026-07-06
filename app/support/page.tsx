"use client";

import { AlertTriangle, CheckCircle2, HelpCircle, LifeBuoy, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";

const faqs = [
  {
    question: "Do testers need a password?",
    answer: "No. They go to Account, enter an email, and use the login link or code. It is passwordless login."
  },
  {
    question: "Why do I see old company info?",
    answer: "The app saves browser data locally. Use Account or Settings, then choose Blank test to clear that browser workspace."
  },
  {
    question: "Will one tester see another tester's data?",
    answer: "Not unless they use the same browser/account. Each browser has its own local workspace, and signed-in users sync to their own Supabase user."
  },
  {
    question: "How do I change industry?",
    answer: "Go to Settings or Industries, search for the business type, then select the pack. Pricing, outreach, prompts, and coaching adjust around that pack."
  },
  {
    question: "How do I save estimates?",
    answer: "Open Estimator, enter the job numbers, then choose Save to pipeline. It creates an opportunity and a follow-up task."
  },
  {
    question: "Does voice dictation work everywhere?",
    answer: "Voice buttons work in supported browsers such as Chrome. The browser may ask for microphone permission the first time."
  }
];

const troubleshooting = [
  "Refresh the page if the app feels stale after a deploy.",
  "Use Account -> Blank test if old test data is in the way.",
  "If login email does not arrive, check spam and confirm the email was typed correctly.",
  "If cloud sync says setup needs attention, test browser storage first and check Supabase later.",
  "If voice does not start, use Chrome and allow microphone access."
];

function SupportContent() {
  return (
    <>
      <SectionHeader
        eyebrow="Support"
        title="Help, FAQ, and troubleshooting"
        description="A quick support center for testers so they can understand login, saving, industry packs, estimates, and basic fixes without calling you first."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-navy text-white">
              <LifeBuoy size={19} />
            </span>
            <div>
              <p className="label">Fast Support</p>
              <h2 className="font-black">Start here when something feels off</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                This is a tester support page. It explains what is expected, what is still MVP behavior, and where to go next.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/agent" className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
                  <HelpCircle size={16} />
                  Ask agent
                </Link>
                <Link href="/account" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
                  <ShieldCheck size={16} />
                  Account help
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-clay" />
            <h2 className="font-black">Troubleshooting</h2>
          </div>
          <div className="grid gap-2">
            {troubleshooting.map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-line bg-field p-3 text-sm leading-6 text-ink/72">
                <RefreshCw size={16} className="mt-1 shrink-0 text-sky" />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 grid gap-3 lg:grid-cols-2">
        {faqs.map((faq) => (
          <article key={faq.question} className="panel p-4">
            <div className="flex gap-3">
              <CheckCircle2 size={18} className="mt-1 shrink-0 text-moss" />
              <div>
                <h2 className="font-black">{faq.question}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/65">{faq.answer}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="panel mt-5 p-4">
        <div className="flex items-start gap-3">
          <Mail size={20} className="mt-1 text-sky" />
          <div>
            <h2 className="font-black">Tester feedback prompt</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Ask testers to send back what felt confusing, what felt useful, what they expected to happen, and where they got stuck.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SupportPage() {
  return (
    <PageFrame>
      <SupportContent />
    </PageFrame>
  );
}
