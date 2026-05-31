import type { LatLngBoundsExpression } from "leaflet";

import { DEFAULT_MAP_CENTER } from "@/lib/constants";

export type BasemapKey = "voyager" | "osm" | "satellite";

export const INDONESIA_BOUNDS = [
  [-11.2, 94.5],
  [6.5, 141.1],
] as const satisfies LatLngBoundsExpression;

export const GIS_CONFIG = {
  center: [DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude] as [
    number,
    number,
  ],
  defaultZoom: 13,
  pickerZoom: 16,
  minZoom: 5,
  maxZoom: 20,
  maxBounds: INDONESIA_BOUNDS,
  maxBoundsViscosity: 0.85,
};

export const BASEMAPS: Record<
  BasemapKey,
  {
    label: string;
    url: string;
    attribution: string;
    maxZoom: number;
  }
> = {
  voyager: {
    label: "Rute",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
  },
  osm: {
    label: "OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    label: "Satelit",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 19,
  },
};

export const DEFAULT_BASEMAP: BasemapKey = "voyager";

export function formatCoordinate(value: number) {
  return value.toFixed(6);
}
