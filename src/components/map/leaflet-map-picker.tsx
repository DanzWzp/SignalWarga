"use client";

import { divIcon, type Marker as LeafletMarker } from "leaflet";
import { useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { LocationButton, type Coordinates } from "@/components/map/location-button";

function ChangeView({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();
  map.setView([coordinates.latitude, coordinates.longitude], map.getZoom());
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
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: "",
        html: '<span class="signal-marker" style="background:#10b981"></span>',
        iconAnchor: [12, 12],
        iconSize: [24, 24],
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
        zoom={15}
        scrollWheelZoom
        className="h-[420px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
      </MapContainer>
    </div>
  );
}
