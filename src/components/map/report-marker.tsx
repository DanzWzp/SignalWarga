"use client";

import Link from "next/link";
import { divIcon } from "leaflet";
import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import {
  CategoryBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { statusMarkerColors } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { ReportWithProfile } from "@/types/database";

export function ReportMarker({
  report,
  detailBasePath,
}: {
  report: ReportWithProfile;
  detailBasePath: "/dashboard/reports" | "/admin/reports";
}) {
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: "",
        html: `<span class="signal-marker" style="background:${statusMarkerColors[report.status]}"></span>`,
        iconAnchor: [12, 12],
        iconSize: [24, 24],
      }),
    [report.status],
  );

  return (
    <Marker
      icon={markerIcon}
      position={[report.latitude, report.longitude]}
    >
      <Popup>
        <div className="w-64">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={report.status} />
            <CategoryBadge category={report.category} />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-950">{report.title}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {report.description}
          </p>
          <p className="mt-2 text-xs text-slate-400">{formatDate(report.created_at)}</p>
          <Link
            href={`${detailBasePath}/${report.id}`}
            className="mt-3 inline-flex text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Detail Laporan
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
