import Link from "next/link";

import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { formatDate } from "@/lib/utils";
import type { ReportWithProfile } from "@/types/database";

export function ReportTable({
  reports,
  detailBasePath,
}: {
  reports: ReportWithProfile[];
  detailBasePath: "/dashboard/reports" | "/admin/reports";
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Laporan</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Prioritas</th>
              <th className="px-4 py-3">Pelapor</th>
              <th className="px-4 py-3">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <Link
                    href={`${detailBasePath}/${report.id}`}
                    className="font-semibold text-slate-950 hover:text-emerald-700"
                  >
                    {report.title}
                  </Link>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {report.address || report.description}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <CategoryBadge category={report.category} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-4">
                  <PriorityBadge priority={report.priority} />
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {report.profiles?.full_name || "Warga"}
                </td>
                <td className="px-4 py-4 text-slate-500">
                  {formatDate(report.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
