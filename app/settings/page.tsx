"use client";

import { RotateCcw, Save, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { IndustryPicker } from "@/components/IndustryPicker";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { useOwnerOps } from "@/components/DataProvider";
import { blankData } from "@/lib/blank-data";
import { demoData } from "@/lib/demo-data";
import type { BusinessProfile, IndustryKey } from "@/lib/types";

function SettingsContent() {
  const { data, setData, syncNow } = useOwnerOps();
  const [saveMessage, setSaveMessage] = useState("Changes save in this browser automatically.");

  function updateProfile(key: keyof BusinessProfile, value: string) {
    setSaveMessage("Unsaved cloud changes. Browser copy is updating...");
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value
      }
    }));
  }

  function resetWorkspace(nextData: typeof demoData, message: string) {
    setData(nextData);
    setSaveMessage(message);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await syncNow();
    setSaveMessage("Saved. Company info is stored in this browser and synced to cloud when signed in.");
  }

  return (
    <>
      <SectionHeader
        eyebrow="Business Profile"
        title="Settings"
        description="Set your industry pack and business context. OwnerOps AI uses this to shape pricing, scripts, prompts, and coaching."
      />
      <form onSubmit={save} className="panel grid gap-4 p-4 sm:grid-cols-2">
        {[
          ["businessName", "Business Name"],
          ["ownerName", "Owner Name"]
        ].map(([key, label]) => (
          <label key={key}>
            <span className="label mb-1 block">{label}</span>
            <span className="flex items-center gap-2">
              <input
                className="field"
                value={String(data.profile[key as keyof BusinessProfile] ?? "")}
                onChange={(event) => updateProfile(key as keyof BusinessProfile, event.target.value)}
              />
              <VoiceInputButton
                label={label}
                onTranscript={(text) => updateProfile(key as keyof BusinessProfile, `${data.profile[key as keyof BusinessProfile] ?? ""} ${text}`.trim())}
              />
            </span>
          </label>
        ))}
        <label>
          <span className="label mb-1 block">Client Message Language</span>
          <select className="field" value={data.profile.language} onChange={(event) => updateProfile("language", event.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="pt">Portuguese</option>
          </select>
        </label>
        {[
          ["phone", "Phone"],
          ["city", "City"],
          ["state", "State"],
          ["website", "Website"]
        ].map(([key, label]) => (
          <label key={key} className={key === "website" ? "sm:col-span-2" : ""}>
            <span className="label mb-1 block">{label}</span>
            <span className="flex items-center gap-2">
              <input
                className="field"
                value={String(data.profile[key as keyof BusinessProfile] ?? "")}
                onChange={(event) => updateProfile(key as keyof BusinessProfile, event.target.value)}
              />
              <VoiceInputButton
                label={label}
                onTranscript={(text) => updateProfile(key as keyof BusinessProfile, `${data.profile[key as keyof BusinessProfile] ?? ""} ${text}`.trim())}
              />
            </span>
          </label>
        ))}
        <label className="sm:col-span-2">
          <span className="label mb-1 block">Owner Goal</span>
          <span className="flex items-start gap-2">
            <textarea className="field" rows={4} value={data.profile.goal} onChange={(event) => updateProfile("goal", event.target.value)} />
            <VoiceInputButton label="Owner Goal" onTranscript={(text) => updateProfile("goal", `${data.profile.goal} ${text}`.trim())} />
          </span>
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white">
            <Save size={16} />
            Save changes
          </button>
          <button
            type="button"
            onClick={() => resetWorkspace(demoData, "Demo data restored.")}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold"
          >
            <RotateCcw size={16} />
            Reset demo data
          </button>
          <button
            type="button"
            onClick={() => resetWorkspace(blankData, "Blank tester workspace started in this browser.")}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold"
          >
            <Sparkles size={16} />
            Start blank test
          </button>
          <p className="basis-full text-sm leading-6 text-ink/65">{saveMessage}</p>
        </div>
      </form>

      <section className="panel mt-5 p-4">
        <div className="mb-4">
          <p className="label">Industry Pack</p>
          <h2 className="mt-1 text-lg font-black">Pick the business type</h2>
        </div>
        <IndustryPicker activeIndustry={data.profile.industry} onSelect={(industry: IndustryKey) => updateProfile("industry", industry)} />
      </section>
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
