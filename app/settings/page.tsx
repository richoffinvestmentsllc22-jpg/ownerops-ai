"use client";

import { CheckCircle2, RotateCcw, Save, Sparkles } from "lucide-react";
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
  const { data, setData, syncNow, session } = useOwnerOps();
  const [saveMessage, setSaveMessage] = useState("Browser saves changes as you type. Use Save changes to confirm and sync when signed in.");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  function updateProfile(key: keyof BusinessProfile, value: string) {
    setHasUnsavedChanges(true);
    setSaveMessage("Changes are saved in this browser. Press Save changes to confirm the profile.");
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
    setHasUnsavedChanges(false);
    setSaveMessage(message);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await syncNow();
      setHasUnsavedChanges(false);
      const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setSaveMessage(
        session
          ? `Saved at ${time}. Company info is stored in this browser and synced to cloud.`
          : `Saved at ${time}. Company info is stored in this browser. Sign in on Account to sync across devices.`
      );
    } catch {
      setSaveMessage("Browser save is still active, but cloud sync did not finish. Try Save changes again.");
    } finally {
      setIsSaving(false);
    }
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
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {hasUnsavedChanges ? <Save size={16} /> : <CheckCircle2 size={16} />}
            {isSaving ? "Saving..." : hasUnsavedChanges ? "Save changes" : "Saved"}
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
          <p className={`basis-full text-sm leading-6 ${hasUnsavedChanges ? "font-semibold text-ink" : "text-ink/65"}`}>{saveMessage}</p>
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
