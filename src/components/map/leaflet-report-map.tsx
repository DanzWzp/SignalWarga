"use client";

import { latLngBounds } from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import type { MappableReport } from "@/types/database";

const MARKER_VIEWPORT_PADDING = 0.35;
const MAX_RENDERED_MARKERS = 700;
const CURSOR_UPDATE_INTERVAL = 120;

function areSetsEqual(first: Set<string>, second: Set<string>) {
  if (first.size !== second.size) return false;

  for (const value of first) {
    if (!second.has(value)) return false;
  }

  return true;
}

function FitReportBounds({ reports }: { reports: MappableReport[] }) {
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

function CursorCoordinatePanel() {
  const [cursor, setCursor] = useState<[number, number]>(GIS_CONFIG.center);
  const frameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  useMapEvents({
    mousemove(event) {
      const now = performance.now();
      if (now - lastUpdateRef.current < CURSOR_UPDATE_INTERVAL) return;

      lastUpdateRef.current = now;
      const nextCursor: [number, number] = [event.latlng.lat, event.latlng.lng];

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        setCursor(nextCursor);
        frameRef.current = null;
      });
    },
  });

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute bottom-8 right-3 z-[500]">
      <CoordinatePanel
        latitude={cursor[0]}
        longitude={cursor[1]}
        label="Cursor"
      />
    </div>
  );
}

function VisibleReportMarkers({
  reports,
  detailBasePath,
}: {
  reports: MappableReport[];
  detailBasePath?: string;
}) {
  const map = useMap();
  const [visibleReportIds, setVisibleReportIds] = useState<Set<string>>(
    () => new Set(reports.slice(0, MAX_RENDERED_MARKERS).map((report) => report.id)),
  );

  const updateVisibleReports = useCallback(() => {
    const bounds = map.getBounds().pad(MARKER_VIEWPORT_PADDING);
    const visibleIds = new Set<string>();

    for (const report of reports) {
      if (!bounds.contains([report.latitude, report.longitude])) continue;

      visibleIds.add(report.id);
      if (visibleIds.size >= MAX_RENDERED_MARKERS) break;
    }

    setVisibleReportIds((currentIds) =>
      areSetsEqual(currentIds, visibleIds) ? currentIds : visibleIds,
    );
  }, [map, reports]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateVisibleReports);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [updateVisibleReports]);

  useMapEvents({
    moveend: updateVisibleReports,
    zoomend: updateVisibleReports,
  });

  const visibleReports = useMemo(
    () => reports.filter((report) => visibleReportIds.has(report.id)),
    [reports, visibleReportIds],
  );

  return (
    <>
      {visibleReports.map((report) => (
        <ReportMarker
          key={report.id}
          report={report}
          detailBasePath={detailBasePath}
        />
      ))}
    </>
  );
}

export default function LeafletReportMap({
  reports,
  detailBasePath,
  heightClassName,
}: {
  reports: MappableReport[];
  detailBasePath?: string;
  heightClassName?: string;
}) {
  const [basemap, setBasemap] = useState<BasemapKey>(DEFAULT_BASEMAP);
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
        preferCanvas
        zoomControl={false}
        wheelDebounceTime={80}
        wheelPxPerZoomLevel={90}
        zoomAnimation
        zoomSnap={0.5}
        markerZoomAnimation={false}
        scrollWheelZoom
        className={cn("h-[560px] w-full", heightClassName)}
      >
        <TileLayer
          key={basemap}
          attribution={selectedBasemap.attribution}
          maxZoom={selectedBasemap.maxZoom}
          maxNativeZoom={selectedBasemap.maxZoom}
          keepBuffer={3}
          updateInterval={180}
          updateWhenIdle
          updateWhenZooming={false}
          url={selectedBasemap.url}
        />
        <MapResizeHandler />
        <MapZoomGuard maxZoom={selectedBasemap.maxZoom} />
        <ZoomControl position="bottomright" />
        <ScaleControl imperial={false} position="bottomleft" />
        <FitReportBounds reports={reports} />
        <VisibleReportMarkers
          reports={reports}
          detailBasePath={detailBasePath}
        />
        <div className="pointer-events-none absolute left-3 top-3 z-[500] grid gap-2">
          <BasemapControl value={basemap} onChange={setBasemap} />
          <StatusLegend />
        </div>
        <CursorCoordinatePanel />
      </MapContainer>
    </div>
  );
}
