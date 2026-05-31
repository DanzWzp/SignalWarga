"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { MapPin, Phone, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { WargaLocationMap } from "@/components/map/warga-location-map";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input } from "@/components/ui/field";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { formatCoordinate } from "@/lib/gis";
import { formatDate } from "@/lib/utils";
import type { WargaLocation } from "@/types/database";

const wargaLocationSelect =
  "*, profile:profiles!user_locations_user_id_fkey(id, full_name, avatar_url, phone, role)";

export function WargaLocationExplorer({
  initialLocations,
}: {
  initialLocations: WargaLocation[];
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function refreshLocations() {
      const { data, error } = await supabase
        .from("user_locations")
        .select(wargaLocationSelect)
        .order("recorded_at", { ascending: false });

      if (error) {
        toast.error("Realtime aktif, tapi gagal menyegarkan lokasi warga.");
        return;
      }

      setLocations((data || []) as unknown as WargaLocation[]);
    }

    const channel = supabase
      .channel("warga-locations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_locations" },
        () => {
          void refreshLocations();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filteredLocations = useMemo(() => {
    const needle = deferredSearch.trim().toLowerCase();
    if (!needle) return locations;

    return locations.filter((location) => {
      return (
        (location.profile?.full_name || "").toLowerCase().includes(needle) ||
        (location.address || "").toLowerCase().includes(needle) ||
        (location.kelurahan || "").toLowerCase().includes(needle) ||
        (location.kecamatan || "").toLowerCase().includes(needle) ||
        (location.city || "").toLowerCase().includes(needle)
      );
    });
  }, [deferredSearch, locations]);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="grid gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <Field label="Cari warga / lokasi">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, alamat, kelurahan, kecamatan, kota"
                className="pl-9"
              />
            </div>
          </Field>
        </div>
        <WargaLocationMap
          locations={filteredLocations}
          heightClassName="h-[620px]"
        />
      </section>

      <aside className="grid max-h-[760px] gap-3 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-700">
          <Users className="size-4 text-indigo-600" />
          {filteredLocations.length} warga terdeteksi
        </div>

        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => {
            const area = [
              location.kelurahan,
              location.kecamatan,
              location.city,
            ]
              .filter(Boolean)
              .join(", ");
            const lowAccuracy =
              typeof location.accuracy === "number" && location.accuracy > 100;

            return (
              <article
                key={location.user_id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-950">
                    {location.profile?.full_name || "Warga"}
                  </h3>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatDate(location.recorded_at)}
                  </span>
                </div>

                {location.address ? (
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-600">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    {location.address}
                  </p>
                ) : null}
                {area ? (
                  <p className="mt-1 text-xs text-slate-500">{area}</p>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>
                    {formatCoordinate(location.latitude)},{" "}
                    {formatCoordinate(location.longitude)}
                  </span>
                  {typeof location.accuracy === "number" ? (
                    <span className={lowAccuracy ? "text-amber-600" : undefined}>
                      ±{Math.round(location.accuracy)} m
                      {lowAccuracy ? " (akurasi rendah)" : ""}
                    </span>
                  ) : null}
                </div>

                {location.profile?.phone ? (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="size-3.5 text-slate-400" />
                    {location.profile.phone}
                  </p>
                ) : null}

                <a
                  href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Buka di Google Maps
                </a>
              </article>
            );
          })
        ) : (
          <EmptyState
            title="Belum ada lokasi warga"
            description="Lokasi muncul setelah warga login dan mengizinkan akses lokasi."
          />
        )}
      </aside>
    </div>
  );
}
