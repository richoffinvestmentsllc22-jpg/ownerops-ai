"use client";

import clsx from "clsx";
import { CheckCircle2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { industries } from "@/lib/industry-packs";
import type { IndustryKey } from "@/lib/types";

export const industryCategories: Array<{ label: string; keys: IndustryKey[] }> = [
  {
    label: "Trades",
    keys: [
      "general_contractors",
      "hvac_services",
      "plumbing_services",
      "electrical_services",
      "roofing_companies",
      "painting_companies",
      "flooring_installers",
      "handyman_services",
      "appliance_repair",
      "pest_control",
      "landscaping_companies",
      "concrete_masonry",
      "welding_fabrication"
    ]
  },
  {
    label: "Transportation",
    keys: ["heavy_truck_drivers", "moving_companies", "towing_roadside", "auto_detailing_businesses"]
  },
  {
    label: "Creative",
    keys: [
      "graphic_designers",
      "brand_designers",
      "custom_artists",
      "print_sign_shops",
      "photographers_videographers",
      "interior_designers",
      "web_designers"
    ]
  },
  {
    label: "Local Services",
    keys: ["tax_preparers", "real_estate_investors", "cleaning_services", "barbershops", "nail_salons"]
  }
];

export function IndustryPicker({
  activeIndustry,
  onSelect,
  compact = false
}: {
  activeIndustry: IndustryKey;
  onSelect: (industry: IndustryKey) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const normalizedQuery = query.trim().toLowerCase();

  const visibleIndustries = useMemo(() => {
    const categoryKeys =
      activeCategory === "All"
        ? Object.keys(industries)
        : industryCategories.find((category) => category.label === activeCategory)?.keys ?? [];

    return (categoryKeys as IndustryKey[]).filter((key) => {
      const pack = industries[key];
      return !normalizedQuery || `${pack.label} ${pack.focus}`.toLowerCase().includes(normalizedQuery);
    });
  }, [activeCategory, normalizedQuery]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-xl items-center gap-2 rounded-md border border-line bg-white px-3 py-2">
          <Search size={16} className="text-ink/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search industries"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["All", ...industryCategories.map((category) => category.label)].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={clsx(
                "shrink-0 rounded-md border px-3 py-2 text-sm font-bold transition",
                activeCategory === category ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/70 hover:border-sky hover:text-ink"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={clsx("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
        {visibleIndustries.map((key) => {
          const pack = industries[key];
          const active = activeIndustry === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={clsx(
                "group min-h-[112px] rounded-md border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-sky",
                active ? "border-moss ring-2 ring-moss/20" : "border-line"
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="label">{active ? "Active pack" : "Industry pack"}</span>
                  <span className="mt-1 block text-base font-black text-ink">{pack.label}</span>
                </span>
                {active ? <CheckCircle2 size={18} className="shrink-0 text-moss" /> : null}
              </span>
              <span className="mt-2 block text-sm leading-6 text-ink/65">{pack.focus}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
