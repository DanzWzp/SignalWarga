"use client";

import dynamic from "next/dynamic";

import type { WargaLocation } from "@/types/database";

const LeafletWargaMap = dynamic(
  () => import("@/components/map/leaflet-warga-map"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[560px] place-items-center rounded-lg border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
        Memuat peta lokasi warga...
      </div>
    ),
  },
);

export function WargaLocationMap({
  locations,
  heightClassName,
}: {
  locations: WargaLocation[];
  heightClassName?: string;
}) {
  return (
    <LeafletWargaMap locations={locations} heightClassName={heightClassName} />
  );
}
