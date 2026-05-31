"use client";

import { latLngBounds } from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  ScaleControl,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";

import { BasemapControl, CoordinatePanel, StatusLegend } from "@/components/map/map-controls";
import { MapResizeHandler, MapZoomGuard } from "@/components/map/map-lifecycle";
import { ReportMarker } from "@/components/map/report-marker";
import { BASEMAPS, DEFAULT_BASEMAP, GIS_CONFIG, type BasemapKey } from "@/lib/gis";
import { cn } from "@/lib/utils";
import type { ReportWithProfile } from "@/types/database";

function FitReportBounds({ reports }: { reports: ReportWithProfile[] }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length === 0) return;

    if (reports.length === 1) {
      map.setView([reports[0].latitude, reports[0].longitude], 15);
      return;
    }

    const bounds = latLngBounds(
      reports.map((report) => [report.latitude, report.longitude]),
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }, [map, reports]);

  return null;
}

function CursorCoordinate({
  onMove,
}: {
  onMove: (coordinates: [number, number]) => void;
}) {
  useMapEvents({
    mousemove(event) {
      onMove([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

export default function LeafletReportMap({
  reports,
  detailBasePath,
  heightClassName,
}: {
  reports: ReportWithProfile[];
  detailBasePath: "/dashboard/reports" | "/admin/reports";
  heightClassName?: string;
}) {
  const [basemap, setBasemap] = useState<BasemapKey>(DEFAULT_BASEMAP);
  const [cursor, setCursor] = useState<[number, number]>(GIS_CONFIG.center);
  const selectedBasemap = BASEMAPS[basemap];
  const center = reports[0]
    ? [reports[0].latitude, reports[0].longitude]
    : GIS_CONFIG.center;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <MapContainer
        center={center as [number, number]}
        zoom={GIS_CONFIG.defaultZoom}
        minZoom={GIS_CONFIG.minZoom}
        maxZoom={selectedBasemap.maxZoom}
        maxBounds={GIS_CONFIG.maxBounds}
        maxBoundsViscosity={GIS_CONFIG.maxBoundsViscosity}
        zoomControl={false}
        wheelDebounceTime={80}
        wheelPxPerZoomLevel={90}
        zoomAnimation
        zoomSnap={0.5}
        scrollWheelZoom
        className={cn("h-[560px] w-full", heightClassName)}
      >
        <TileLayer
          key={basemap}
          attribution={selectedBasemap.attribution}
          maxZoom={selectedBasemap.maxZoom}
          maxNativeZoom={selectedBasemap.maxZoom}
          keepBuffer={4}
          updateWhenIdle={false}
          url={selectedBasemap.url}
        />
        <MapResizeHandler />
        <MapZoomGuard maxZoom={selectedBasemap.maxZoom} />
        <ZoomControl position="bottomright" />
        <ScaleControl imperial={false} position="bottomleft" />
        <FitReportBounds reports={reports} />
        <CursorCoordinate onMove={setCursor} />
        {reports.map((report) => (
          <ReportMarker
            key={report.id}
            report={report}
            detailBasePath={detailBasePath}
          />
        ))}
        <div className="pointer-events-none absolute left-3 top-3 z-[500] grid gap-2">
          <BasemapControl value={basemap} onChange={setBasemap} />
          <StatusLegend />
        </div>
        <div className="pointer-events-none absolute bottom-8 right-3 z-[500]">
          <CoordinatePanel
            latitude={cursor[0]}
            longitude={cursor[1]}
            label="Cursor"
          />
        </div>
      </MapContainer>
    </div>
  );
}
