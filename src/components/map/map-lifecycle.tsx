"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const refreshSize = () => {
      map.invalidateSize({ pan: false });
    };

    const timeouts = [80, 250, 700].map((delay) =>
      window.setTimeout(refreshSize, delay),
    );

    const container = map.getContainer();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.requestAnimationFrame(refreshSize);
          })
        : null;

    observer?.observe(container);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        window.setTimeout(refreshSize, 80);
      }
    };

    window.addEventListener("resize", refreshSize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      observer?.disconnect();
      window.removeEventListener("resize", refreshSize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [map]);

  return null;
}

export function MapZoomGuard({ maxZoom }: { maxZoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxZoom(maxZoom);

    if (map.getZoom() > maxZoom) {
      map.setZoom(maxZoom, { animate: false });
    }
  }, [map, maxZoom]);

  return null;
}
