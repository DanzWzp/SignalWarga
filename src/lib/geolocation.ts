export type LocationFix = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

const CAPTURED_FLAG = "sw:location-captured";
const DASHBOARD_TRIED_FLAG = "sw:dashboard-location-tried";

/**
 * Promisified wrapper around the browser Geolocation API.
 * Rejects when unsupported, denied, or timed out — callers should treat
 * a rejection as "lokasi tidak tersedia" and continue gracefully.
 */
export function getBrowserPosition(timeout = 8000): Promise<LocationFix> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung browser ini."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : undefined,
        }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout, maximumAge: 0 },
    );
  });
}

/** Tandai bahwa lokasi sudah berhasil direkam pada sesi ini. */
export function markLocationCaptured() {
  try {
    sessionStorage.setItem(CAPTURED_FLAG, "1");
  } catch {
    // sessionStorage tidak tersedia — abaikan.
  }
}

export function hasCapturedLocation(): boolean {
  try {
    return sessionStorage.getItem(CAPTURED_FLAG) === "1";
  } catch {
    return false;
  }
}

/** Cegah dashboard meminta izin berulang kali tiap navigasi dalam 1 sesi. */
export function markDashboardLocationTried() {
  try {
    sessionStorage.setItem(DASHBOARD_TRIED_FLAG, "1");
  } catch {
    // abaikan
  }
}

export function hasTriedDashboardLocation(): boolean {
  try {
    return sessionStorage.getItem(DASHBOARD_TRIED_FLAG) === "1";
  } catch {
    return false;
  }
}
