"use client";

import { divIcon } from "leaflet";
import { memo, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import { formatCoordinate } from "@/lib/gis";
import { formatDate } from "@/lib/utils";
import type { WargaLocation } from "@/types/database";

const WARGA_MARKER_COLOR = "#6366f1";

function describeArea(location: WargaLocation) {
  return [location.kelurahan, location.kecamatan, location.city]
    .filter(Boolean)
    .join(", ");
}

function WargaMarkerComponent({ location }: { location: WargaLocation }) {
  const position = useMemo(
    () => [location.latitude, location.longitude] as [number, number],
    [location.latitude, location.longitude],
  );

  const markerIcon = useMemo(
    () =>
      divIcon({
        className: "",
        html: `<span class="signal-marker" style="--marker-color:${WARGA_MARKER_COLOR}"><span class="signal-marker-dot"></span></span>`,
        iconAnchor: [15, 15],
        iconSize: [30, 30],
      }),
    [],
  );

  const name = location.profile?.full_name || "Warga";
  const area = describeArea(location);

  return (
    <Marker icon={markerIcon} position={position}>
      <Popup>
        <div className="w-64">
          <h3 className="text-sm font-bold text-slate-950">{name}</h3>
          {location.address ? (
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {location.address}
            </p>
          ) : null}
          {area ? <p className="mt-1 text-xs text-slate-500">{area}</p> : null}

          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-slate-50 px-2 py-1.5">
              <dt className="text-slate-400">Lat</dt>
              <dd className="font-semibold text-slate-800">
                {formatCoordinate(location.latitude)}
              </dd>
            </div>
            <div className="rounded-md bg-slate-50 px-2 py-1.5">
              <dt className="text-slate-400">Lng</dt>
              <dd className="font-semibold text-slate-800">
                {formatCoordinate(location.longitude)}
              </dd>
            </div>
          </dl>

          {typeof location.accuracy === "number" ? (
            <p className="mt-2 text-xs text-slate-500">
              Akurasi ±{Math.round(location.accuracy)} m
            </p>
          ) : null}
          {location.profile?.phone ? (
            <p className="mt-1 text-xs text-slate-500">
              Telp: {location.profile.phone}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-slate-400">
            Login: {formatDate(location.recorded_at)}
          </p>

          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Buka di Google Maps
          </a>
        </div>
      </Popup>
    </Marker>
  );
}

export const WargaMarker = memo(
  WargaMarkerComponent,
  (previous, next) =>
    previous.location.user_id === next.location.user_id &&
    previous.location.latitude === next.location.latitude &&
    previous.location.longitude === next.location.longitude &&
    previous.location.recorded_at === next.location.recorded_at,
);
