"use client";

import { CheckCircle2, Cloud, Database, Mail, ShieldCheck, XCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const setupSteps = [
  "Create a Supabase project",
  "Run supabase/schema.sql in the SQL editor",
  "Add NEXT_PUBLIC_SUPABASE_URL in Vercel",
  "Add NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel",
  "Redeploy the app"
];

function AccountContent() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("Database login is not connected yet. Add the Supabase environment variables in Vercel first.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    setMessage(error ? error.message : "Check your email for the login link.");
  }

  return (
    <>
      <SectionHeader
        eyebrow="Account & Data"
        title="Move from demo storage to real saved accounts"
        description="The app works now in browser storage. Connecting Supabase turns it into a real account-based product with cloud data, login, and room for shared proof galleries."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel p-4">
          <div className="flex items-start gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${isSupabaseConfigured ? "bg-moss text-white" : "bg-clay text-white"}`}>
              {isSupabaseConfigured ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </span>
            <div>
              <p className="label">Storage Mode</p>
              <h2 className="font-black">{isSupabaseConfigured ? "Cloud login is configured" : "Demo browser storage"}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                {isSupabaseConfigured
                  ? "Users can request a magic link. The next step is wiring each table to Supabase reads and writes."
                  : "Data is saved in this browser only. It is good for testing, but not enough for real customers across devices."}
              </p>
            </div>
          </div>

          <form onSubmit={sendMagicLink} className="mt-5 space-y-3">
            <label>
              <span className="label mb-1 block">Email</span>
              <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="owner@example.com" />
            </label>
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
              <Mail size={16} />
              Send login link
            </button>
            {message ? <p className="text-sm leading-6 text-ink/70">{message}</p> : null}
          </form>
        </section>

        <section className="panel p-4">
          <div className="mb-4 flex items-center gap-2">
            <Database size={18} />
            <h2 className="font-black">Production Setup Checklist</h2>
          </div>
          <div className="grid gap-2">
            {setupSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-md border border-line bg-field p-3 text-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white font-black">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <section className="panel p-4">
          <Cloud size={20} />
          <h2 className="mt-3 font-black">Cloud Data</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">Accounts let owners keep leads, estimates, proof photos, and scripts across phones and computers.</p>
        </section>
        <section className="panel p-4">
          <ShieldCheck size={20} />
          <h2 className="mt-3 font-black">Trust</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">Real login is needed before charging customers, storing client work, or creating public proof galleries.</p>
        </section>
        <section className="panel p-4">
          <Database size={20} />
          <h2 className="mt-3 font-black">Next Build Step</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">After Supabase keys are added, replace local storage with table reads/writes and add file storage for shareable photo links.</p>
        </section>
      </div>
    </>
  );
}

export default function AccountPage() {
  return (
    <PageFrame>
      <AccountContent />
    </PageFrame>
  );
}
