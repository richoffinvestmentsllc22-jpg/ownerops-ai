"use client";

import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { VoiceInputButton } from "@/components/VoiceInputButton";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: Array<{ label: string; value: string }>;
  format?: (value: T[keyof T], row: T) => string;
  required?: boolean;
};

export function CrudManager<T extends { id: string }>({
  rows,
  setRows,
  fields,
  emptyRow,
  title,
  emptyState,
  filter,
  onSave
}: {
  rows: T[];
  setRows: (rows: T[]) => void;
  fields: FieldConfig<T>[];
  emptyRow: () => T;
  title: string;
  emptyState: string;
  filter?: (row: T) => boolean;
  onSave?: (row: T, rows: T[]) => T[];
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const [formError, setFormError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const visibleRows = useMemo(() => (filter ? rows.filter(filter) : rows), [filter, rows]);
  const requiredFields = useMemo(() => {
    const explicit = fields.filter((field) => field.required);
    return explicit.length > 0 ? explicit : fields.slice(0, 1);
  }, [fields]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const missing = requiredFields.find((field) => String(editing[field.key] ?? "").trim() === "");
    if (missing) {
      setFormError(`${missing.label} is required before saving.`);
      return;
    }
    const exists = rows.some((row) => row.id === editing.id);
    const nextRows = exists ? rows.map((row) => (row.id === editing.id ? editing : row)) : [editing, ...rows];
    setRows(onSave ? onSave(editing, nextRows) : nextRows);
    setEditing(null);
    setFormError("");
  }

  function updateField(key: keyof T, value: string) {
    if (!editing) return;
    const config = fields.find((field) => field.key === key);
    setFormError("");
    setEditing({
      ...editing,
      [key]: config?.type === "number" ? Math.max(0, Number(value)) : value
    });
  }

  function confirmDelete(row: T) {
    setRows(rows.filter((item) => item.id !== row.id));
    setPendingDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-white p-3 shadow-soft">
        <div>
          <h2 className="text-lg font-black">{title}</h2>
          <p className="mt-1 text-sm text-ink/55">{visibleRows.length} record{visibleRows.length === 1 ? "" : "s"}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormError("");
            setPendingDeleteId(null);
            setEditing(emptyRow());
          }}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {editing ? (
        <form onSubmit={save} className="panel grid gap-4 p-4 sm:grid-cols-2">
          {fields.map((field) => {
            const value = String(editing[field.key] ?? "");
            const canDictate = field.type !== "number" && field.type !== "date" && field.type !== "select";
            const common = {
              id: String(field.key),
              value,
              onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                updateField(field.key, event.target.value),
              className: "field"
            };
            return (
              <label key={String(field.key)} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <span className="label mb-1 block">{field.label}</span>
                <span className="flex items-start gap-2">
                  <span className="min-w-0 flex-1">
                    {field.type === "textarea" ? (
                      <textarea {...common} rows={4} />
                    ) : field.type === "select" ? (
                      <select {...common}>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        {...common}
                        type={field.type ?? "text"}
                        min={field.type === "number" ? 0 : undefined}
                      />
                    )}
                  </span>
                  {canDictate ? (
                    <VoiceInputButton
                      label={field.label}
                      onTranscript={(text) => updateField(field.key, value ? `${value} ${text}` : text)}
                    />
                  ) : null}
                </span>
              </label>
            );
          })}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-bold text-white">
              <Save size={16} />
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
          {formError ? <p className="rounded-md border border-clay/30 bg-clay/10 px-3 py-2 text-sm font-semibold text-clay sm:col-span-2">{formError}</p> : null}
        </form>
      ) : null}

      <div className="panel overflow-hidden">
        {visibleRows.length === 0 ? (
          <p className="p-5 text-sm text-ink/60">{emptyState}</p>
        ) : (
          <>
          <div className="grid gap-3 p-3 md:hidden">
            {visibleRows.map((row) => {
              const titleField = fields[0];
              const detailFields = fields.slice(1, 5);
              return (
                <article key={row.id} className="rounded-md border border-line bg-white p-3 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label">{titleField.label}</p>
                      <h3 className="mt-1 line-clamp-2 font-black">
                        {titleField.format ? titleField.format(row[titleField.key], row) : String(row[titleField.key] ?? "")}
                      </h3>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        aria-label="Edit"
                        onClick={() => {
                          setPendingDeleteId(null);
                          setFormError("");
                          setEditing(row);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-md border border-line bg-field"
                      >
                        <Edit3 size={15} />
                      </button>
                      {pendingDeleteId === row.id ? null : (
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => setPendingDeleteId(row.id)}
                          className="grid h-9 w-9 place-items-center rounded-md border border-line bg-field text-clay"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {detailFields.map((field) => (
                      <div key={String(field.key)} className="rounded-md border border-line bg-field p-2">
                        <p className="text-[0.68rem] font-black uppercase tracking-[0.08em] text-ink/45">{field.label}</p>
                        <p className="mt-1 line-clamp-3 text-sm leading-5 text-ink/75">
                          {field.format ? field.format(row[field.key], row) : String(row[field.key] ?? "") || "Not set"}
                        </p>
                      </div>
                    ))}
                  </div>
                  {pendingDeleteId === row.id ? (
                    <div className="mt-3 rounded-md border border-clay/25 bg-clay/10 p-3">
                      <p className="text-sm font-bold text-clay">Delete this record?</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => confirmDelete(row)}
                          className="rounded-md bg-clay px-3 py-2 text-xs font-black text-white"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(null)}
                          className="rounded-md border border-line bg-white px-3 py-2 text-xs font-black"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="border-b border-line bg-ink text-white">
                <tr>
                  {fields.slice(0, 5).map((field) => (
                    <th key={String(field.key)} className="px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white/75">
                      {field.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-white/75">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, index) => (
                  <tr key={row.id} className={`border-b border-line/70 last:border-0 ${index % 2 === 0 ? "bg-white" : "bg-field/55"}`}>
                    {fields.slice(0, 5).map((field) => (
                      <td key={String(field.key)} className="max-w-[260px] px-4 py-3 align-top text-ink/75">
                        <span className="line-clamp-2 rounded-md">
                          {field.format ? field.format(row[field.key], row) : String(row[field.key] ?? "")}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => {
                            setPendingDeleteId(null);
                            setFormError("");
                            setEditing(row);
                          }}
                          className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white"
                        >
                          <Edit3 size={15} />
                        </button>
                        {pendingDeleteId === row.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => confirmDelete(row)}
                              className="rounded-md bg-clay px-3 py-2 text-xs font-black text-white"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(null)}
                              className="rounded-md border border-line bg-white px-3 py-2 text-xs font-black"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            aria-label="Delete"
                            onClick={() => setPendingDeleteId(row.id)}
                            className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white text-clay"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
