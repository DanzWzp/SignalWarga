"use client";

import { divIcon, type Marker as LeafletMarker } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  ScaleControl,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";

import { LocationButton, type Coordinates } from "@/components/map/location-button";
import { BasemapControl, CoordinatePanel } from "@/components/map/map-controls";
import { MapResizeHandler, MapZoomGuard } from "@/components/map/map-lifecycle";
import { BASEMAPS, DEFAULT_BASEMAP, GIS_CONFIG, type BasemapKey } from "@/lib/gis";

function ChangeView({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.latitude, coordinates.longitude], map.getZoom(), {
      animate: true,
    });
  }, [coordinates.latitude, coordinates.longitude, map]);

  return null;
}

function ClickHandler({
  onChange,
}: {
  onChange: (coordinates: Coordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function LeafletMapPicker({
  value,
  onChange,
}: {
  value: Coordinates;
  onChange: (coordinates: Coordinates) => void;
}) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const [basemap, setBasemap] = useState<BasemapKey>(DEFAULT_BASEMAP);
  const selectedBasemap = BASEMAPS[basemap];
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: "",
        html: '<span class="signal-marker signal-marker--picker" style="--marker-color:#10b981"><span class="signal-marker-dot"></span></span>',
        iconAnchor: [15, 15],
        iconSize: [30, 30],
      }),
    [],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Pilih Titik di Peta</p>
          <p className="text-xs text-slate-500">
            Lokasi hanya diambil saat kamu menekan tombol lokasi atau memilih titik.
          </p>
        </div>
        <LocationButton onLocated={onChange} />
      </div>
      <MapContainer
        center={[value.latitude, value.longitude]}
        zoom={GIS_CONFIG.pickerZoom}
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
        className="h-[460px] w-full"
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
        <ClickHandler onChange={onChange} />
        <ChangeView coordinates={value} />
        <Marker
          draggable
          eventHandlers={{
            dragend() {
              const marker = markerRef.current;
              if (!marker) return;
              const position = marker.getLatLng();
              onChange({ latitude: position.lat, longitude: position.lng });
            },
          }}
          icon={markerIcon}
          position={[value.latitude, value.longitude]}
          ref={markerRef}
        />
        <div className="pointer-events-none absolute left-3 top-3 z-[500] grid gap-2">
          <BasemapControl value={basemap} onChange={setBasemap} />
          <CoordinatePanel
            latitude={value.latitude}
            longitude={value.longitude}
            label="Titik Dipilih"
          />
        </div>
      </MapContainer>
    </div>
  );
}
