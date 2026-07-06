"use client";

import { Calculator, CheckSquare, Copy, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import { industries } from "@/lib/industry-packs";

const checklistItems = [
  "Lead source and contact details are captured",
  "Scope, deliverables, or load details are written clearly",
  "Price includes materials, labor, fuel, fees, or revision risk",
  "Deposit, payment terms, and expiration date are clear",
  "Next follow-up date is scheduled before sending"
];

function ToolsContent() {
  const { data } = useOwnerOps();
  const industry = industries[data.profile.industry];
  const pricingRows = data.pricing.filter((row) => row.industry === data.profile.industry);
  const [selectedService, setSelectedService] = useState(pricingRows[0]?.id ?? "");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [costs, setCosts] = useState({ revenue: 2500, labor: 600, materials: 350, fuel: 150, fees: 125, targetMargin: 45 });
  const selected = pricingRows.find((row) => row.id === selectedService) ?? pricingRows[0];
  const totalCost = costs.labor + costs.materials + costs.fuel + costs.fees;
  const profit = costs.revenue - totalCost;
  const margin = costs.revenue > 0 ? Math.round((profit / costs.revenue) * 100) : 0;
  const recommendedMinimum = costs.targetMargin < 100 ? Math.ceil(totalCost / (1 - costs.targetMargin / 100)) : totalCost;
  const pricingPosition = selected
    ? recommendedMinimum < selected.priceLow
      ? "below the low end of your current range"
      : recommendedMinimum > selected.priceHigh
        ? "above the high end of your current range"
        : "inside your current range"
    : "ready after you add pricing rows";
  const clientOptions = useMemo(
    () => [
      ...data.leads.map((lead) => ({ id: `lead:${lead.id}`, name: lead.name, type: "Lead" })),
      ...data.customers.map((customer) => ({ id: `customer:${customer.id}`, name: customer.name, type: "Customer" }))
    ],
    [data.customers, data.leads]
  );
  const clientFirstName = (clientName.trim().split(/\s+/)[0] || "there").replace(/[{}]/g, "");
  const quoteText = useMemo(() => {
    if (!selected) return "Add pricing rows for this industry to generate a quote starter.";
    if (data.profile.language === "es") {
      return `Hola ${clientFirstName}, según el alcance para ${selected.serviceName}, un rango realista inicial es $${selected.priceLow.toLocaleString()}-$${selected.priceHigh.toLocaleString()} por ${selected.unit}. ${selected.notes}. Si ese rango funciona, el siguiente paso es confirmar los detalles y reservar una fecha de inicio.`;
    }
    return `Hi ${clientFirstName}, based on the scope for ${selected.serviceName}, a realistic starting range is $${selected.priceLow.toLocaleString()}-$${selected.priceHigh.toLocaleString()} per ${selected.unit}. ${selected.notes}. If that range works, the next step is confirming details and locking in a start date.`;
  }, [clientFirstName, data.profile.language, selected]);

  function updateCost(key: keyof typeof costs, value: string) {
    setCosts((current) => ({ ...current, [key]: Math.max(0, Number(value)) }));
  }

  function selectClient(nextId: string) {
    setSelectedClientId(nextId);
    const selectedClient = clientOptions.find((client) => client.id === nextId);
    if (selectedClient) setClientName(selectedClient.name);
  }

  function copyQuoteText() {
    navigator.clipboard?.writeText(quoteText);
    setCopyMessage(`Copied quote for ${clientFirstName}.`);
  }

  return (
    <>
      <SectionHeader
        eyebrow="Operator Tools"
        title={`${industry.label} quote and profit desk`}
        description="A practical workspace for pricing conversations, margin checks, and pre-send quality control."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel p-4">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={18} />
            <h2 className="font-black">Quote Starter</h2>
          </div>
          <label>
            <span className="label mb-1 block">Service or package</span>
            <select className="field" value={selected?.id ?? ""} onChange={(event) => setSelectedService(event.target.value)}>
              {pricingRows.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.serviceName}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="label mb-1 block">Lead or customer</span>
              <select className="field" value={selectedClientId} onChange={(event) => selectClient(event.target.value)}>
                <option value="">Type a client name</option>
                {clientOptions.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.type})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="label mb-1 block">Client name for quote</span>
              <input
                className="field"
                value={clientName}
                onChange={(event) => {
                  setSelectedClientId("");
                  setClientName(event.target.value);
                }}
                placeholder="Example: Marcus"
              />
            </label>
          </div>
          <div className="mt-4 rounded-md border border-line bg-field p-3 text-sm leading-6 text-ink/75">{quoteText}</div>
          <button
            type="button"
            onClick={copyQuoteText}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white"
          >
            <Copy size={16} />
            Copy quote
          </button>
          {copyMessage ? <p className="mt-2 text-sm leading-6 text-moss">{copyMessage}</p> : null}
        </section>

        <section className="panel p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calculator size={18} />
            <h2 className="font-black">Profit Check</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["revenue", "Revenue"],
              ["labor", "Labor"],
              ["materials", "Materials / Parts"],
              ["fuel", "Fuel / Travel"],
              ["fees", "Fees / Overhead"],
              ["targetMargin", "Target Margin %"]
            ].map(([key, label]) => (
              <label key={key}>
                <span className="label mb-1 block">{label}</span>
                <input className="field" type="number" min="0" value={costs[key as keyof typeof costs]} onChange={(event) => updateCost(key as keyof typeof costs, event.target.value)} />
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-line bg-field p-3">
              <p className="label">Cost</p>
              <p className="mt-1 text-xl font-black">${totalCost.toLocaleString()}</p>
            </div>
            <div className="rounded-md border border-line bg-field p-3">
              <p className="label">Profit</p>
              <p className="mt-1 text-xl font-black">${profit.toLocaleString()}</p>
            </div>
            <div className="rounded-md border border-line bg-field p-3">
              <p className="label">Margin</p>
              <p className="mt-1 text-xl font-black">{margin}%</p>
            </div>
          </div>
          <div className="mt-4 rounded-md border border-line bg-white p-3">
            <p className="label">Recommended minimum</p>
            <p className="mt-1 text-2xl font-black">${recommendedMinimum.toLocaleString()}</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              At a {costs.targetMargin}% target margin, this price is {pricingPosition}. Use this to avoid quoting work that looks busy but loses money.
            </p>
          </div>
        </section>
      </div>

      <section className="panel mt-5 p-4">
        <div className="mb-4 flex items-center gap-2">
          <CheckSquare size={18} />
          <h2 className="font-black">Trust Checklist</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {checklistItems.map((item) => (
            <label key={item} className="flex min-h-[88px] gap-2 rounded-md border border-line bg-field p-3 text-sm leading-5 text-ink/75">
              <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-moss" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>
    </>
  );
}

export default function ToolsPage() {
  return (
    <PageFrame>
      <ToolsContent />
    </PageFrame>
  );
}
