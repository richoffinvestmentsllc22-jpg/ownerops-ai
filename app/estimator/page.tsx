"use client";

import { Calculator, Copy, Hammer, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";

const trades = {
  remodeling: { label: "Remodeling / General", unit: "sq ft", material: 38, laborHours: 0.55, complexity: 1.25, margin: 35 },
  roofing: { label: "Roofing", unit: "square", material: 145, laborHours: 1.8, complexity: 1.15, margin: 32 },
  painting: { label: "Painting", unit: "sq ft", material: 0.8, laborHours: 0.025, complexity: 1.1, margin: 40 },
  flooring: { label: "Flooring", unit: "sq ft", material: 3.75, laborHours: 0.07, complexity: 1.15, margin: 35 },
  concrete: { label: "Concrete", unit: "sq ft", material: 4.5, laborHours: 0.08, complexity: 1.2, margin: 34 },
  electrical: { label: "Electrical", unit: "opening", material: 45, laborHours: 1.1, complexity: 1.25, margin: 38 },
  plumbing: { label: "Plumbing", unit: "fixture", material: 125, laborHours: 2.2, complexity: 1.25, margin: 38 },
  hvac: { label: "HVAC", unit: "system", material: 4200, laborHours: 18, complexity: 1.2, margin: 35 }
} as const;

const complexityOptions = [
  { label: "Simple", value: 1 },
  { label: "Normal", value: 1.15 },
  { label: "Difficult", value: 1.35 },
  { label: "High risk / occupied / tight access", value: 1.6 }
];

function EstimatorContent() {
  const { data } = useOwnerOps();
  const [tradeKey, setTradeKey] = useState<keyof typeof trades>("remodeling");
  const trade = trades[tradeKey];
  const [inputs, setInputs] = useState({
    quantity: 500,
    materialRate: trade.material,
    laborHoursPerUnit: trade.laborHours,
    laborRate: 65,
    overheadPercent: 12,
    targetMargin: trade.margin,
    complexity: trade.complexity,
    contingencyPercent: 8
  });

  function selectTrade(next: keyof typeof trades) {
    const defaults = trades[next];
    setTradeKey(next);
    setInputs((current) => ({
      ...current,
      materialRate: defaults.material,
      laborHoursPerUnit: defaults.laborHours,
      targetMargin: defaults.margin,
      complexity: defaults.complexity
    }));
  }

  function updateInput(key: keyof typeof inputs, value: string) {
    setInputs((current) => ({ ...current, [key]: Number(value) }));
  }

  const estimate = useMemo(() => {
    const material = inputs.quantity * inputs.materialRate * inputs.complexity;
    const laborHours = inputs.quantity * inputs.laborHoursPerUnit * inputs.complexity;
    const labor = laborHours * inputs.laborRate;
    const direct = material + labor;
    const overhead = direct * (inputs.overheadPercent / 100);
    const contingency = direct * (inputs.contingencyPercent / 100);
    const cost = direct + overhead + contingency;
    const quote = inputs.targetMargin < 100 ? cost / (1 - inputs.targetMargin / 100) : cost;
    const profit = quote - cost;
    return { material, laborHours, labor, overhead, contingency, cost, quote, profit };
  }, [inputs]);

  const quoteMessage =
    data.profile.language === "es"
      ? `Hola {{first_name}}, para este alcance de ${trade.label.toLowerCase()}, mi precio estimado es $${Math.round(estimate.quote).toLocaleString()}. Esto incluye materiales, mano de obra, gastos generales, contingencia y margen para completar el trabajo correctamente. El siguiente paso es confirmar medidas, acceso y fecha de inicio.`
      : `Hi {{first_name}}, for this ${trade.label.toLowerCase()} scope, my estimated price is $${Math.round(estimate.quote).toLocaleString()}. That includes materials, labor, overhead, contingency, and margin to do the job correctly. The next step is confirming measurements, access, and start date.`;

  return (
    <>
      <SectionHeader
        eyebrow="Construction Estimator"
        title="Price the work before it prices you"
        description="A simple estimator for contractors who know the work but need help protecting labor, materials, overhead, risk, and profit."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <section className="panel p-4">
          <div className="mb-4 flex items-center gap-2">
            <Hammer size={18} />
            <h2 className="font-black">Estimate Inputs</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="label mb-1 block">Trade</span>
              <select className="field" value={tradeKey} onChange={(event) => selectTrade(event.target.value as keyof typeof trades)}>
                {Object.entries(trades).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label mb-1 block">Quantity ({trade.unit})</span>
              <input className="field" type="number" value={inputs.quantity} onChange={(event) => updateInput("quantity", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Material per {trade.unit}</span>
              <input className="field" type="number" value={inputs.materialRate} onChange={(event) => updateInput("materialRate", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Labor hours per {trade.unit}</span>
              <input className="field" type="number" step="0.01" value={inputs.laborHoursPerUnit} onChange={(event) => updateInput("laborHoursPerUnit", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Labor rate / hour</span>
              <input className="field" type="number" value={inputs.laborRate} onChange={(event) => updateInput("laborRate", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Complexity</span>
              <select className="field" value={inputs.complexity} onChange={(event) => updateInput("complexity", event.target.value)}>
                {complexityOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label mb-1 block">Overhead %</span>
              <input className="field" type="number" value={inputs.overheadPercent} onChange={(event) => updateInput("overheadPercent", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Contingency %</span>
              <input className="field" type="number" value={inputs.contingencyPercent} onChange={(event) => updateInput("contingencyPercent", event.target.value)} />
            </label>
            <label>
              <span className="label mb-1 block">Target Profit Margin %</span>
              <input className="field" type="number" value={inputs.targetMargin} onChange={(event) => updateInput("targetMargin", event.target.value)} />
            </label>
          </div>
        </section>

        <section className="panel p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calculator size={18} />
            <h2 className="font-black">Recommended Price</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-line bg-field p-3">
              <p className="label">Materials</p>
              <p className="mt-1 text-xl font-black">${Math.round(estimate.material).toLocaleString()}</p>
            </div>
            <div className="rounded-md border border-line bg-field p-3">
              <p className="label">Labor</p>
              <p className="mt-1 text-xl font-black">${Math.round(estimate.labor).toLocaleString()}</p>
            </div>
            <div className="rounded-md border border-line bg-field p-3">
              <p className="label">Labor Hours</p>
              <p className="mt-1 text-xl font-black">{Math.round(estimate.laborHours).toLocaleString()}</p>
            </div>
            <div className="rounded-md border border-line bg-field p-3">
              <p className="label">True Cost</p>
              <p className="mt-1 text-xl font-black">${Math.round(estimate.cost).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 rounded-md border border-line bg-ink p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">Quote at or above</p>
            <p className="mt-1 text-3xl font-black">${Math.round(estimate.quote).toLocaleString()}</p>
            <p className="mt-2 text-sm text-white/70">Projected profit: ${Math.round(estimate.profit).toLocaleString()}</p>
          </div>
          <div className="mt-4 rounded-md border border-line bg-field p-3 text-sm leading-6 text-ink/75">{quoteMessage}</div>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(quoteMessage)}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white"
          >
            <Copy size={16} />
            Copy client message
          </button>
        </section>
      </div>

      <section className="panel mt-5 p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert size={20} className="mt-1 text-clay" />
          <div>
            <h2 className="font-black">Why this matters</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              A lot of construction pricing fails because owners charge for labor and material but forget overhead, access difficulty, callbacks, weather,
              cleanup, travel, financing delays, and profit. This estimator forces those numbers into the quote before the client sees it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function EstimatorPage() {
  return (
    <PageFrame>
      <EstimatorContent />
    </PageFrame>
  );
}
