"use client";

import { demoData } from "@/lib/demo-data";
import type { OwnerOpsData } from "@/lib/types";

const STORAGE_KEY = "ownerops-ai-data";

export function loadOwnerOpsData(): OwnerOpsData {
  if (typeof window === "undefined") return demoData;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return demoData;

  try {
    return JSON.parse(stored) as OwnerOpsData;
  } catch {
    return demoData;
  }
}

export function saveOwnerOpsData(data: OwnerOpsData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetOwnerOpsData() {
  window.localStorage.removeItem(STORAGE_KEY);
}
