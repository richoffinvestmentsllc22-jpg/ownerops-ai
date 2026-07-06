"use client";

import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: Array<{ label: string; value: string }>;
  format?: (value: T[keyof T], row: T) => string;
};

export function CrudManager<T extends { id: string }>({
  rows,
  setRows,
  fields,
  emptyRow,
  title,
  emptyState,
  filter
}: {
  rows: T[];
  setRows: (rows: T[]) => void;
  fields: FieldConfig<T>[];
  emptyRow: () => T;
  title: string;
  emptyState: string;
  filter?: (row: T) => boolean;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const visibleRows = useMemo(() => (filter ? rows.filter(filter) : rows), [filter, rows]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const exists = rows.some((row) => row.id === editing.id);
    setRows(exists ? rows.map((row) => (row.id === editing.id ? editing : row)) : [editing, ...rows]);
    setEditing(null);
  }

  function updateField(key: keyof T, value: string) {
    if (!editing) return;
    const config = fields.find((field) => field.key === key);
    setEditing({
      ...editing,
      [key]: config?.type === "number" ? Number(value) : value
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black">{title}</h2>
        <button
          type="button"
          onClick={() => setEditing(emptyRow())}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {editing ? (
        <form onSubmit={save} className="panel grid gap-4 p-4 sm:grid-cols-2">
          {fields.map((field) => {
            const value = String(editing[field.key] ?? "");
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
                  <input {...common} type={field.type ?? "text"} />
                )}
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
        </form>
      ) : null}

      <div className="panel overflow-hidden">
        {visibleRows.length === 0 ? (
          <p className="p-5 text-sm text-ink/60">{emptyState}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="border-b border-line bg-field">
                <tr>
                  {fields.slice(0, 5).map((field) => (
                    <th key={String(field.key)} className="px-4 py-3 font-bold">
                      {field.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id} className="border-b border-line/70 last:border-0">
                    {fields.slice(0, 5).map((field) => (
                      <td key={String(field.key)} className="max-w-[260px] px-4 py-3 align-top text-ink/75">
                        <span className="line-clamp-2">
                          {field.format ? field.format(row[field.key], row) : String(row[field.key] ?? "")}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => setEditing(row)}
                          className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => setRows(rows.filter((item) => item.id !== row.id))}
                          className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white text-clay"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
