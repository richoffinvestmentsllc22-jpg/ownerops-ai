"use client";

import { RotateCcw, Save } from "lucide-react";
import { FormEvent } from "react";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";
import { demoData } from "@/lib/demo-data";
import type { BusinessProfile, IndustryKey } from "@/lib/types";

function SettingsContent() {
  const { data, setData } = useOwnerOps();

  function updateProfile(key: keyof BusinessProfile, value: string) {
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value
      }
    }));
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <>
      <SectionHeader
        eyebrow="Business Profile"
        title="Settings"
        description="Set your industry pack and business context. OwnerOps AI uses this to shape pricing, scripts, prompts, and coaching."
      />
      <form onSubmit={save} className="panel grid gap-4 p-4 sm:grid-cols-2">
        <label>
          <span className="label mb-1 block">Business Name</span>
          <input className="field" value={data.profile.businessName} onChange={(event) => updateProfile("businessName", event.target.value)} />
        </label>
        <label>
          <span className="label mb-1 block">Owner Name</span>
          <input className="field" value={data.profile.ownerName} onChange={(event) => updateProfile("ownerName", event.target.value)} />
        </label>
        <label>
          <span className="label mb-1 block">Industry Pack</span>
          <select className="field" value={data.profile.industry} onChange={(event) => updateProfile("industry", event.target.value as IndustryKey)}>
            {Object.entries(industries).map(([value, pack]) => (
              <option key={value} value={value}>
                {pack.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label mb-1 block">Client Message Language</span>
          <select className="field" value={data.profile.language} onChange={(event) => updateProfile("language", event.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="pt">Portuguese</option>
          </select>
        </label>
        <label>
          <span className="label mb-1 block">Phone</span>
          <input className="field" value={data.profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} />
        </label>
        <label>
          <span className="label mb-1 block">City</span>
          <input className="field" value={data.profile.city} onChange={(event) => updateProfile("city", event.target.value)} />
        </label>
        <label>
          <span className="label mb-1 block">State</span>
          <input className="field" value={data.profile.state} onChange={(event) => updateProfile("state", event.target.value)} />
        </label>
        <label className="sm:col-span-2">
          <span className="label mb-1 block">Website</span>
          <input className="field" value={data.profile.website} onChange={(event) => updateProfile("website", event.target.value)} />
        </label>
        <label className="sm:col-span-2">
          <span className="label mb-1 block">Owner Goal</span>
          <textarea className="field" rows={4} value={data.profile.goal} onChange={(event) => updateProfile("goal", event.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white">
            <Save size={16} />
            Saved
          </button>
          <button
            type="button"
            onClick={() => setData(demoData)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold"
          >
            <RotateCcw size={16} />
            Reset demo data
          </button>
        </div>
      </form>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(industries).map(([key, pack]) => (
          <div key={key} className="panel p-4">
            <p className="font-black">{pack.label}</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">{pack.focus}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <PageFrame>
      <SettingsContent />
    </PageFrame>
  );
}
