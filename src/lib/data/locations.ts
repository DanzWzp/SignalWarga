import "server-only";

import { unstable_cache } from "next/cache";

import { USER_LOCATIONS_CACHE_TAG } from "@/lib/cache-tags";
import { reverseGeocode } from "@/lib/reverse-geocode";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { WargaLocation } from "@/types/database";

type ServerSupabaseClient = Awaited<
  ReturnType<typeof createServerSupabaseClient>
>;

export type LocationInput = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  source?: "login" | "dashboard";
};

const wargaLocationSelect =
  "*, profile:profiles!user_locations_user_id_fkey(id, full_name, avatar_url, phone, role)";

/**
 * Upsert lokasi terakhir warga. Reverse-geocode bersifat best-effort
 * (timeout pendek) supaya tidak memperlambat login bila Nominatim lambat.
 * `client` boleh dioper dari server action yang sudah terautentikasi.
 */
export async function saveWargaLocation(
  userId: string,
  input: LocationInput,
  client?: ServerSupabaseClient,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  if (!Number.isFinite(input.latitude) || !Number.isFinite(input.longitude)) {
    return false;
  }

  const supabase = client ?? (await createServerSupabaseClient());

  let geo: Awaited<ReturnType<typeof reverseGeocode>> | null = null;
  try {
    geo = await reverseGeocode(
      input.latitude,
      input.longitude,
      AbortSignal.timeout(3500),
    );
  } catch {
    geo = null;
  }

  const { error } = await supabase.from("user_locations").upsert(
    {
      user_id: userId,
      latitude: input.latitude,
      longitude: input.longitude,
      accuracy: input.accuracy ?? null,
      address: geo?.address || null,
      kelurahan: geo?.kelurahan || null,
      kecamatan: geo?.kecamatan || null,
      city: geo?.city || null,
      province: geo?.province || null,
      source: input.source ?? "login",
      recorded_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("Failed to save warga location", error);
    return false;
  }

  return true;
}

/** Semua lokasi warga (untuk dashboard admin). Dibaca via service role. */
export const getWargaLocations = unstable_cache(
  async () => {
    if (!isSupabaseConfigured) return [];

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("user_locations")
      .select(wargaLocationSelect)
      .order("recorded_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch warga locations", error);
      return [];
    }

    return (data || []) as unknown as WargaLocation[];
  },
  ["warga-locations"],
  {
    tags: [USER_LOCATIONS_CACHE_TAG],
    revalidate: 30,
  },
);
