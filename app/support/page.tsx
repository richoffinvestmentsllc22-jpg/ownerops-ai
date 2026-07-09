"use client";

import { AlertTriangle, CheckCircle2, Copy, HelpCircle, LifeBuoy, Mail, RefreshCw, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";

type TesterFeedback = {
  id: string;
  name: string;
  role: string;
  rating: string;
  useful: string;
  confusing: string;
  expected: string;
  stuck: string;
  createdAt: string;
};

const FEEDBACK_KEY = "ownerops-tester-feedback";

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
  const [feedback, setFeedback] = useState<TesterFeedback[]>([]);
  const [form, setForm] = useState({
    name: "",
    role: "Business owner",
    rating: "4",
    useful: "",
    confusing: "",
    expected: "",
    stuck: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      setFeedback(JSON.parse(window.localStorage.getItem(FEEDBACK_KEY) ?? "[]") as TesterFeedback[]);
    } catch {
      setFeedback([]);
    }
  }, []);

  const feedbackSummary = useMemo(
    () =>
      feedback
        .map(
          (item, index) =>
            `${index + 1}. ${item.name || "Anonymous"} (${item.role}) - ${item.rating}/5\nUseful: ${item.useful || "Not answered"}\nConfusing: ${item.confusing || "Not answered"}\nExpected: ${item.expected || "Not answered"}\nStuck: ${item.stuck || "Not answered"}`
        )
        .join("\n\n"),
    [feedback]
  );

  function saveFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.useful.trim() && !form.confusing.trim() && !form.stuck.trim()) {
      setMessage("Add at least one useful, confusing, or stuck note before saving feedback.");
      return;
    }
    const nextFeedback = [
      {
        id: crypto.randomUUID(),
        ...form,
        createdAt: new Date().toISOString()
      },
      ...feedback
    ];
    setFeedback(nextFeedback);
    window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(nextFeedback));
    setForm({
      name: "",
      role: "Business owner",
      rating: "4",
      useful: "",
      confusing: "",
      expected: "",
      stuck: ""
    });
    setMessage("Feedback saved in this browser. Use Copy feedback to send it back.");
  }

  async function copyFeedback() {
    await navigator.clipboard?.writeText(feedbackSummary || "No tester feedback saved yet.");
    setMessage("Feedback copied.");
  }

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Mail size={20} className="mt-1 text-sky" />
            <div>
              <p className="label">Tester feedback</p>
              <h2 className="font-black">Collect what confused testers</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Save tester notes here, then copy the summary when you are ready to review patterns.
              </p>
            </div>
          </div>
          <button type="button" onClick={copyFeedback} className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
            <Copy size={16} />
            Copy feedback
          </button>
        </div>
        <form onSubmit={saveFeedback} className="mt-4 grid gap-3 lg:grid-cols-2">
          <label>
            <span className="label mb-1 block">Tester name</span>
            <input className="field" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Optional" />
          </label>
          <label>
            <span className="label mb-1 block">Tester type</span>
            <select className="field" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
              <option>Business owner</option>
              <option>Friend or family</option>
              <option>Contractor</option>
              <option>Food vendor</option>
              <option>Makeup artist</option>
              <option>Other tester</option>
            </select>
          </label>
          <label>
            <span className="label mb-1 block">Overall rating</span>
            <select className="field" value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}>
              <option value="5">5 - ready to keep testing</option>
              <option value="4">4 - useful with small fixes</option>
              <option value="3">3 - promising but confusing</option>
              <option value="2">2 - hard to use</option>
              <option value="1">1 - not useful yet</option>
            </select>
          </label>
          <label>
            <span className="label mb-1 block">What felt useful?</span>
            <textarea className="field" rows={3} value={form.useful} onChange={(event) => setForm((current) => ({ ...current, useful: event.target.value }))} />
          </label>
          <label>
            <span className="label mb-1 block">What felt confusing?</span>
            <textarea className="field" rows={3} value={form.confusing} onChange={(event) => setForm((current) => ({ ...current, confusing: event.target.value }))} />
          </label>
          <label>
            <span className="label mb-1 block">What did you expect to happen?</span>
            <textarea className="field" rows={3} value={form.expected} onChange={(event) => setForm((current) => ({ ...current, expected: event.target.value }))} />
          </label>
          <label className="lg:col-span-2">
            <span className="label mb-1 block">Where did you get stuck?</span>
            <textarea className="field" rows={3} value={form.stuck} onChange={(event) => setForm((current) => ({ ...current, stuck: event.target.value }))} />
          </label>
          <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
              <Send size={16} />
              Save feedback
            </button>
            <p className="text-sm leading-6 text-ink/65">{message || `${feedback.length} feedback note${feedback.length === 1 ? "" : "s"} saved in this browser.`}</p>
          </div>
        </form>
        {feedback.length ? (
          <div className="mt-4 grid gap-2">
            {feedback.slice(0, 3).map((item) => (
              <article key={item.id} className="rounded-md border border-line bg-field p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black">{item.name || "Anonymous tester"}</p>
                  <p className="text-sm font-bold text-moss">{item.rating}/5</p>
                </div>
                <p className="mt-1 text-sm leading-6 text-ink/65">{item.confusing || item.useful || item.stuck}</p>
              </article>
            ))}
          </div>
        ) : null}
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
