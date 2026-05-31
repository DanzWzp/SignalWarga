"use client";

import { useEffect, useRef } from "react";

import { recordWargaLocation } from "@/app/actions/location";
import {
  getBrowserPosition,
  hasCapturedLocation,
  hasTriedDashboardLocation,
  markDashboardLocationTried,
  markLocationCaptured,
} from "@/lib/geolocation";

/**
 * Headless: dipasang di dashboard warga sebagai fallback bila lokasi belum
 * sempat ditangkap saat login (izin ditolak/terlewat). Hanya mencoba sekali
 * per sesi agar tidak meminta izin berulang.
 */
export function LocationCapture() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (hasCapturedLocation()) return;
    if (hasTriedDashboardLocation()) return;
    markDashboardLocationTried();

    let cancelled = false;

    void (async () => {
      try {
        const fix = await getBrowserPosition();
        if (cancelled) return;

        const result = await recordWargaLocation({
          latitude: fix.latitude,
          longitude: fix.longitude,
          accuracy: fix.accuracy,
          source: "dashboard",
        });

        if (result.ok) markLocationCaptured();
      } catch {
        // Izin lokasi ditolak / tidak tersedia — diabaikan.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
