import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Profile, UserRole } from "@/types/database";

export type CurrentUserProfile = {
  user: User;
  profile: Profile;
};

export function getRoleHome(role?: UserRole | null) {
  if (role === "admin") return "/admin";
  if (role === "officer") return "/dashboard/reports";
  return "/dashboard";
}

export const getCurrentUserProfile = cache(async () => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    return { user, profile };
  }

  const fallbackName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] || "Warga SignalWarga";

  const { data: createdProfile } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fallbackName,
      role: "citizen",
    })
    .select("*")
    .single();

  if (!createdProfile) return null;

  return { user, profile: createdProfile };
});

export async function requireUserProfile(allowedRoles?: UserRole[]) {
  const current = await getCurrentUserProfile();

  if (!current) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(current.profile.role)) {
    redirect(getRoleHome(current.profile.role));
  }

  return current;
}
