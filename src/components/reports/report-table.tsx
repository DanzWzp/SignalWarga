import Link from "next/link";

import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { DeleteReportButton } from "@/components/reports/delete-report-button";
import { formatDate } from "@/lib/utils";
import type { ReportWithProfile } from "@/types/database";

export function ReportTable({
  reports,
  detailBasePath,
  canDelete = false,
}: {
  reports: ReportWithProfile[];
  detailBasePath: "/dashboard/reports" | "/admin/reports";
  canDelete?: boolean;
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
              {canDelete ? <th className="px-4 py-3">Aksi</th> : null}
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
                    {[
                      report.address,
                      report.kelurahan,
                      report.kecamatan,
                    ]
                      .filter(Boolean)
                      .join(", ") || report.description}
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
                {canDelete ? (
                  <td className="px-4 py-4">
                    <DeleteReportButton
                      reportId={report.id}
                      reportTitle={report.title}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
