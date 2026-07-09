import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  href
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  href?: string;
}) {
  const content = (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink/60">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-md bg-moss/10 text-moss">
          <Icon size={18} />
        </span>
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs text-ink/55">{detail}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="panel block p-4 transition hover:-translate-y-0.5 hover:border-sky">
        {content}
      </Link>
    );
  }

  return (
    <div className="panel p-4">
      {content}
    </div>
  );
}
