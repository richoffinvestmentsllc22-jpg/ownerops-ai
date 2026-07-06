import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="panel p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink/60">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-md bg-moss/10 text-moss">
          <Icon size={18} />
        </span>
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs text-ink/55">{detail}</p>
    </div>
  );
}
