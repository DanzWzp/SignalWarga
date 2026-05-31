"use client";

import { Layers, MapPin } from "lucide-react";

import { statusLabels, statusMarkerColors } from "@/lib/constants";
import { BASEMAPS, formatCoordinate, type BasemapKey } from "@/lib/gis";
import { cn } from "@/lib/utils";
import type { ReportStatus } from "@/types/database";

export function BasemapControl({
  value,
  onChange,
}: {
  value: BasemapKey;
  onChange: (value: BasemapKey) => void;
}) {
  return (
    <div className="leaflet-glass-panel pointer-events-auto">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
        <Layers className="size-3.5" />
        Layer
      </div>
      <div className="grid grid-cols-3 gap-1">
        {(Object.keys(BASEMAPS) as BasemapKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-bold transition",
              value === key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100",
            )}
            onClick={() => onChange(key)}
          >
            {BASEMAPS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CoordinatePanel({
  latitude,
  longitude,
  label = "Koordinat",
}: {
  latitude: number;
  longitude: number;
  label?: string;
}) {
  return (
    <div className="leaflet-glass-panel pointer-events-auto min-w-56">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
        <MapPin className="size-3.5" />
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <span className="block text-slate-400">Lat</span>
          <strong className="text-slate-800">{formatCoordinate(latitude)}</strong>
        </div>
        <div className="rounded-md bg-slate-50 px-2 py-1.5">
          <span className="block text-slate-400">Lng</span>
          <strong className="text-slate-800">{formatCoordinate(longitude)}</strong>
        </div>
      </div>
    </div>
  );
}

export function StatusLegend() {
  const statuses = Object.keys(statusLabels) as ReportStatus[];

  return (
    <div className="leaflet-glass-panel pointer-events-auto min-w-44">
      <div className="mb-2 text-xs font-bold uppercase text-slate-500">
        Legenda
      </div>
      <div className="grid gap-1.5">
        {statuses.map((status) => (
          <div key={status} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span
              className="size-2.5 rounded-full ring-2 ring-white"
              style={{ backgroundColor: statusMarkerColors[status] }}
            />
            {statusLabels[status]}
          </div>
        ))}
      </div>
    </div>
  );
}
