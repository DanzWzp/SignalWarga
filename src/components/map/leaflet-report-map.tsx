"use client";

import { MapContainer, TileLayer } from "react-leaflet";

import { ReportMarker } from "@/components/map/report-marker";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ReportWithProfile } from "@/types/database";

export default function LeafletReportMap({
  reports,
  detailBasePath,
  heightClassName,
}: {
  reports: ReportWithProfile[];
  detailBasePath: "/dashboard/reports" | "/admin/reports";
  heightClassName?: string;
}) {
  const center = reports[0]
    ? [reports[0].latitude, reports[0].longitude]
    : [DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        scrollWheelZoom
        className={cn("h-[560px] w-full", heightClassName)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <ReportMarker
            key={report.id}
            report={report}
            detailBasePath={detailBasePath}
          />
        ))}
      </MapContainer>
    </div>
  );
}
