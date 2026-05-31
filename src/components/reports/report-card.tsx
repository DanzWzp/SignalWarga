import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";

import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { formatDate } from "@/lib/utils";
import type { ReportWithProfile } from "@/types/database";

export function ReportCard({
  report,
  href,
}: {
  report: ReportWithProfile;
  href: string;
}) {
  const locationText =
    [
      report.address,
      report.rt ? `RT ${report.rt}` : null,
      report.rw ? `RW ${report.rw}` : null,
      report.kelurahan,
      report.kecamatan,
    ]
      .filter(Boolean)
      .join(", ") ||
    `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`;

  return (
    <Link
      href={href}
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={report.status} />
        <CategoryBadge category={report.category} />
        <PriorityBadge priority={report.priority} />
      </div>
      <div>
        <h3 className="line-clamp-2 text-base font-semibold text-slate-950">
          {report.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {report.description}
        </p>
      </div>
      <div className="grid gap-2 text-sm text-slate-500">
        <span className="flex items-center gap-2">
          <MapPin className="size-4 text-emerald-600" />
          {locationText}
        </span>
        <span className="flex items-center gap-2">
          <CalendarClock className="size-4 text-blue-600" />
          {formatDate(report.created_at)}
        </span>
      </div>
    </Link>
  );
}
