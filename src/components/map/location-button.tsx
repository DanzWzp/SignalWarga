"use client";

import { LocateFixed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function LocationButton({
  onLocated,
}: {
  onLocated: (coordinates: Coordinates) => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      isLoading={loading}
      onClick={() => {
        if (!navigator.geolocation) {
          toast.error("Browser tidak mendukung geolocation.");
          return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLoading(false);
            onLocated({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            toast.success("Lokasi berhasil diambil.");
          },
          () => {
            setLoading(false);
            toast.error(
              "Izin lokasi ditolak. Kamu tetap bisa memilih titik manual di peta.",
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      }}
    >
      <LocateFixed className="size-4" />
      Gunakan Lokasi Saya
    </Button>
  );
}
