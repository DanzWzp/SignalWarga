"use client";

import dynamic from "next/dynamic";

import type { ReportWithProfile } from "@/types/database";

const LeafletReportMap = dynamic(
  () => import("@/components/map/leaflet-report-map"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[560px] place-items-center rounded-lg border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
        Memuat peta laporan...
      </div>
    ),
  },
);

export function ReportMap({
  reports,
  detailBasePath,
  heightClassName,
}: {
  reports: ReportWithProfile[];
  detailBasePath: "/dashboard/reports" | "/admin/reports";
  heightClassName?: string;
}) {
  return (
    <LeafletReportMap
      reports={reports}
      detailBasePath={detailBasePath}
      heightClassName={heightClassName}
    />
  );
}
