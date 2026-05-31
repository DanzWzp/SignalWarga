"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import { USER_LOCATIONS_CACHE_TAG } from "@/lib/cache-tags";
import { getCurrentUserProfile } from "@/lib/auth";
import { saveWargaLocation } from "@/lib/data/locations";

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().nonnegative().optional(),
  source: z.enum(["login", "dashboard"]).optional(),
});

export async function recordWargaLocation(input: {
  latitude: number;
  longitude: number;
  accuracy?: number;
  source?: "login" | "dashboard";
}): Promise<{ ok: boolean }> {
  const parsed = locationSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  const current = await getCurrentUserProfile();
  if (!current || current.profile.role !== "citizen") {
    return { ok: false };
  }

  const saved = await saveWargaLocation(current.user.id, {
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    accuracy: parsed.data.accuracy ?? null,
    source: parsed.data.source ?? "dashboard",
  });

  if (saved) {
    updateTag(USER_LOCATIONS_CACHE_TAG);
    revalidatePath("/admin/locations");
  }

  return { ok: saved };
}
