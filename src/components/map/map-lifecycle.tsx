"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

export function MapResizeHandler() {
  const map = useMap();
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const refreshSize = () => {
      map.invalidateSize({ pan: false });
    };

    const scheduleRefreshSize = () => {
      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        refreshSize();
        frameRef.current = null;
      });
    };

    const timeouts = [80, 250, 700].map((delay) =>
      window.setTimeout(scheduleRefreshSize, delay),
    );

    const container = map.getContainer();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            scheduleRefreshSize();
          })
        : null;

    observer?.observe(container);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        window.setTimeout(scheduleRefreshSize, 80);
      }
    };

    window.addEventListener("resize", scheduleRefreshSize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      observer?.disconnect();
      window.removeEventListener("resize", scheduleRefreshSize);
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
