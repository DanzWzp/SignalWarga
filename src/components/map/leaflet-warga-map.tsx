"use client";

import { latLngBounds } from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  ScaleControl,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";

import { BasemapControl } from "@/components/map/map-controls";
import { MapResizeHandler, MapZoomGuard } from "@/components/map/map-lifecycle";
import { WargaMarker } from "@/components/map/warga-marker";
import { BASEMAPS, DEFAULT_BASEMAP, GIS_CONFIG, type BasemapKey } from "@/lib/gis";
import { cn } from "@/lib/utils";
import type { WargaLocation } from "@/types/database";

function FitWargaBounds({ locations }: { locations: WargaLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], 16);
      return;
    }

    const bounds = latLngBounds(
      locations.map((location) => [location.latitude, location.longitude]),
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }, [map, locations]);

  return null;
}

export default function LeafletWargaMap({
  locations,
  heightClassName,
}: {
  locations: WargaLocation[];
  heightClassName?: string;
}) {
  const [basemap, setBasemap] = useState<BasemapKey>(DEFAULT_BASEMAP);
  const selectedBasemap = BASEMAPS[basemap];
  const center = locations[0]
    ? [locations[0].latitude, locations[0].longitude]
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
        <FitWargaBounds locations={locations} />
        {locations.map((location) => (
          <WargaMarker key={location.user_id} location={location} />
        ))}
        <div className="pointer-events-none absolute left-3 top-3 z-[500] grid gap-2">
          <BasemapControl value={basemap} onChange={setBasemap} />
        </div>
      </MapContainer>
    </div>
  );
}
