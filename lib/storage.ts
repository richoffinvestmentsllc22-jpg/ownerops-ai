"use client";

import { demoData } from "@/lib/demo-data";
import { seedOutreach, seedPricing, seedPrompts } from "@/lib/industry-packs";
import type { OwnerOpsData } from "@/lib/types";

const STORAGE_KEY = "ownerops-ai-data";

export function loadOwnerOpsData(): OwnerOpsData {
  if (typeof window === "undefined") return demoData;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return demoData;

  try {
    return hydrateOwnerOpsData(JSON.parse(stored) as OwnerOpsData);
  } catch {
    return demoData;
  }
}

function mergeById<T extends { id: string }>(current: T[] | undefined, seeds: T[]): T[] {
  const rows = current ?? [];
  const existingIds = new Set(rows.map((row) => row.id));
  return [...rows, ...seeds.filter((row) => !existingIds.has(row.id))];
}

function hydrateOwnerOpsData(data: OwnerOpsData): OwnerOpsData {
  return {
    ...demoData,
    ...data,
    profile: { ...demoData.profile, ...data.profile },
    customers: data.customers ?? demoData.customers,
    leads: data.leads ?? demoData.leads,
    opportunities: data.opportunities ?? demoData.opportunities,
    tasks: data.tasks ?? demoData.tasks,
    pricing: mergeById(data.pricing, seedPricing),
    outreach: mergeById(data.outreach, seedOutreach),
    prompts: mergeById(data.prompts, seedPrompts),
    proof: data.proof ?? demoData.proof
  };
}

export function saveOwnerOpsData(data: OwnerOpsData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetOwnerOpsData() {
  window.localStorage.removeItem(STORAGE_KEY);
}
