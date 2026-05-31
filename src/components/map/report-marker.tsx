"use client";

import Link from "next/link";
import { divIcon } from "leaflet";
import { memo, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import {
  CategoryBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { statusMarkerColors } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { MappableReport } from "@/types/database";

function ReportMarkerComponent({
  report,
  detailBasePath,
}: {
  report: MappableReport;
  detailBasePath?: string;
}) {
  const position = useMemo(
    () => [report.latitude, report.longitude] as [number, number],
    [report.latitude, report.longitude],
  );
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: "",
        html: `<span class="signal-marker signal-marker--report" style="--marker-color:${statusMarkerColors[report.status]}"><span class="signal-marker-dot"></span></span>`,
        iconAnchor: [15, 15],
        iconSize: [30, 30],
      }),
    [report.status],
  );

  return (
    <Marker
      icon={markerIcon}
      position={position}
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
          {detailBasePath ? (
            <Link
              href={`${detailBasePath}/${report.id}`}
              className="mt-3 inline-flex text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Detail Laporan
            </Link>
          ) : null}
        </div>
      </Popup>
    </Marker>
  );
}

export const ReportMarker = memo(
  ReportMarkerComponent,
  (previous, next) =>
    previous.detailBasePath === next.detailBasePath &&
    previous.report.id === next.report.id &&
    previous.report.status === next.report.status &&
    previous.report.category === next.report.category &&
    previous.report.priority === next.report.priority &&
    previous.report.latitude === next.report.latitude &&
    previous.report.longitude === next.report.longitude &&
    previous.report.updated_at === next.report.updated_at,
);
