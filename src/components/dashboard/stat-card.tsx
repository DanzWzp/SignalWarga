import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "emerald",
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  tone?: "emerald" | "blue" | "amber" | "red" | "slate";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className={`rounded-lg p-2.5 ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
      </div>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
