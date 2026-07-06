"use client";

import { Copy, ImagePlus, Link2, Plus, Share2, Trash2 } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";
import type { ProofItem } from "@/lib/types";

const emptyProof = (industry: ProofItem["industry"]): ProofItem => ({
  id: crypto.randomUUID(),
  title: "",
  clientName: "",
  service: "",
  industry,
  beforeImage: "",
  afterImage: "",
  outcome: "",
  notes: "",
  createdAt: new Date().toISOString()
});

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(String(reader.result ?? ""));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.onerror = () => resolve(String(reader.result ?? ""));
      image.src = String(reader.result ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ProofImage({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-field">
      <div className="flex h-44 items-center justify-center bg-field sm:h-52">
        {src ? <img src={src} alt={label} className="h-full w-full object-cover" /> : <ImagePlus className="text-ink/35" size={34} />}
      </div>
      <p className="border-t border-line bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-ink/55">{label}</p>
    </div>
  );
}

function ProofContent() {
  const { data, setData } = useOwnerOps();
  const [editing, setEditing] = useState<ProofItem | null>(null);
  const [formError, setFormError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const proofRows = data.proof.filter((item) => item.industry === data.profile.industry);
  const industry = industries[data.profile.industry];
  const activeProof = proofRows[0];
  function makeProofMessage(item: ProofItem | undefined) {
    if (!item) return "Add a before/after proof item, then copy a short client-ready message from here.";
    if (data.profile.language === "es") {
      return `Aquí tiene un antes y después de ${item.service || "un trabajo reciente"}${item.clientName ? ` para ${item.clientName}` : ""}. ${item.outcome || "Esto muestra el tipo de resultado que buscamos entregar."} ¿Quiere que le mande una cotización o el próximo horario disponible?`;
    }
    if (data.profile.language === "fr") {
      return `Voici un avant-après de ${item.service || "un projet récent"}${item.clientName ? ` pour ${item.clientName}` : ""}. ${item.outcome || "Cela montre le type de résultat que nous cherchons à livrer."} Voulez-vous que je vous envoie un devis ou le prochain créneau disponible?`;
    }
    if (data.profile.language === "pt") {
      return `Aqui está um antes e depois de ${item.service || "um trabalho recente"}${item.clientName ? ` para ${item.clientName}` : ""}. ${item.outcome || "Isso mostra o tipo de resultado que buscamos entregar."} Quer que eu envie uma cotação ou o próximo horário disponível?`;
    }
    return `Here is a quick before-and-after from ${item.service || "a recent job"}${item.clientName ? ` for ${item.clientName}` : ""}. ${item.outcome || "This shows the kind of result we aim to deliver."} Want me to send a quote or next available time?`;
  }

  const proofMessage = useMemo(() => makeProofMessage(activeProof), [activeProof, data.profile.language]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (!editing.title.trim()) {
      setFormError("Title is required before saving proof.");
      return;
    }
    const exists = data.proof.some((item) => item.id === editing.id);
    setData((current) => ({
      ...current,
      proof: exists ? current.proof.map((item) => (item.id === editing.id ? editing : item)) : [editing, ...current.proof]
    }));
    setEditing(null);
    setFormError("");
  }

  function updateField(key: keyof ProofItem, value: string) {
    setFormError("");
    setEditing((current) => (current ? { ...current, [key]: value } : current));
  }

  async function updateImage(key: "beforeImage" | "afterImage", event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await readImage(file);
    updateField(key, image);
  }

  function deleteProof(id: string) {
    setData((current) => ({ ...current, proof: current.proof.filter((item) => item.id !== id) }));
    setPendingDeleteId(null);
  }

  function proofLink(item: ProofItem) {
    return `${window.location.origin}${window.location.pathname}?proof=${item.id}`;
  }

  function copyProofPackage(item: ProofItem) {
    const packageText = `${makeProofMessage(item)}\n\nProof link: ${proofLink(item)}\n\nNote: photo records are stored in this OwnerOps workspace. Attach the before/after photos when sending outside the app.`;
    navigator.clipboard?.writeText(packageText);
  }

  async function shareProof(item: ProofItem) {
    const text = `${makeProofMessage(item)}\n${proofLink(item)}`;
    if (navigator.share) {
      await navigator.share({ title: item.title || "Before and after proof", text });
    } else {
      navigator.clipboard?.writeText(text);
    }
  }

  return (
    <>
      <SectionHeader
        eyebrow="Proof Library"
        title={`${industry.label} before-and-after photos`}
        description="Save proof photos, outcomes, and ready-to-send messages so leads can see the result before they decide."
      />

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="panel p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="label">Sales proof</p>
              <h2 className="font-black">Client-ready message</h2>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(proofMessage)}
              className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>
          <div className="mt-4 rounded-md border border-line bg-field p-3 text-sm leading-6 text-ink/75">{proofMessage}</div>
          <button
            type="button"
            onClick={() => {
              setPendingDeleteId(null);
              setFormError("");
              setEditing(emptyProof(data.profile.industry));
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white"
          >
            <Plus size={16} />
            Add proof
          </button>
        </section>

        {editing ? (
          <form onSubmit={save} className="panel grid gap-4 p-4 sm:grid-cols-2">
            <label>
              <span className="label mb-1 block">Title</span>
              <input className="field" required value={editing.title} onChange={(event) => updateField("title", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Client or Lead</span>
              <input className="field" value={editing.clientName} onChange={(event) => updateField("clientName", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Service</span>
              <input className="field" value={editing.service} onChange={(event) => updateField("service", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Before Photo</span>
              <input className="field" type="file" accept="image/*" onChange={(event) => updateImage("beforeImage", event)} />
            </label>
            <label>
              <span className="label mb-1 block">After Photo</span>
              <input className="field" type="file" accept="image/*" onChange={(event) => updateImage("afterImage", event)} />
            </label>
            <label className="sm:col-span-2">
              <span className="label mb-1 block">Outcome</span>
              <textarea className="field" rows={3} value={editing.outcome} onChange={(event) => updateField("outcome", event.target.value)} />
            </label>
            <label className="sm:col-span-2">
              <span className="label mb-1 block">Private Notes</span>
              <textarea className="field" rows={3} value={editing.notes} onChange={(event) => updateField("notes", event.target.value)} />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" className="rounded-md bg-moss px-3 py-2 text-sm font-bold text-white">
                Save proof
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
                Cancel
              </button>
            </div>
            {formError ? <p className="rounded-md border border-clay/30 bg-clay/10 px-3 py-2 text-sm font-semibold text-clay sm:col-span-2">{formError}</p> : null}
          </form>
        ) : (
          <section className="panel p-4">
            <p className="label">What makes this unique</p>
            <h2 className="mt-1 font-black">Proof should sit next to pricing</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Price objections get easier when the quote is backed by visual proof. Use these records for follow-ups, proposals, social posts, and repeat
              customer campaigns.
            </p>
          </section>
        )}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {proofRows.map((item) => (
          <article key={item.id} className="panel p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="label">{item.service || industry.label}</p>
                <h2 className="font-black">{item.title || "Untitled proof item"}</h2>
                <p className="mt-1 text-sm text-ink/60">{item.clientName || "No client attached"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingDeleteId(null);
                    setFormError("");
                    setEditing(item);
                  }}
                  className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold"
                >
                  Edit
                </button>
                <button type="button" aria-label="Copy proof package" onClick={() => copyProofPackage(item)} className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white">
                  <Link2 size={15} />
                </button>
                <button type="button" aria-label="Share proof" onClick={() => shareProof(item)} className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white">
                  <Share2 size={15} />
                </button>
                {pendingDeleteId === item.id ? (
                  <>
                    <button type="button" onClick={() => deleteProof(item.id)} className="rounded-md bg-clay px-3 py-2 text-xs font-black text-white">
                      Confirm
                    </button>
                    <button type="button" onClick={() => setPendingDeleteId(null)} className="rounded-md border border-line bg-white px-3 py-2 text-xs font-black">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" aria-label="Delete proof" onClick={() => setPendingDeleteId(item.id)} className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white text-clay">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ProofImage src={item.beforeImage} label="Before" />
              <ProofImage src={item.afterImage} label="After" />
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/70">{item.outcome || "Add an outcome that explains what changed and why it matters."}</p>
          </article>
        ))}
      </div>
    </>
  );
}

export default function ProofPage() {
  return (
    <PageFrame>
      <ProofContent />
    </PageFrame>
  );
}
