"use client";

import dynamic from "next/dynamic";

import type { Coordinates } from "@/components/map/location-button";

const LeafletMapPicker = dynamic(() => import("@/components/map/leaflet-map-picker"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center rounded-lg border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
      Memuat peta...
    </div>
  ),
});

export function MapPicker({
  value,
  onChange,
}: {
  value: Coordinates;
  onChange: (coordinates: Coordinates) => void;
}) {
  return <LeafletMapPicker value={value} onChange={onChange} />;
}
