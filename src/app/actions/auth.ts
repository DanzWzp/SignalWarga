"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  formDataToObject,
  type ActionState,
} from "@/lib/action-state";
import { getRoleHome } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, SITE_URL } from "@/lib/supabase/env";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { UserRole } from "@/types/database";

async function ensureProfile(userId: string, fullName?: string | null) {
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profile) return profile;

  const { data } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name: fullName || "Warga SignalWarga",
      role: "citizen",
    })
    .select("*")
    .single();

  return data;
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(formDataToObject(formData));

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data masuk.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: "Email atau password tidak cocok.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await ensureProfile(
        user.id,
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : user.email?.split("@")[0],
      )
    : null;

  revalidatePath("/", "layout");
  redirect(getRoleHome(profile?.role));
}

async function loginWithRequiredRole(
  formData: FormData,
  requiredRole: Extract<UserRole, "admin" | "officer">,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(formDataToObject(formData));

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data masuk.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: "Email atau password tidak cocok.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await ensureProfile(
        user.id,
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : user.email?.split("@")[0],
      )
    : null;

  if (profile?.role !== requiredRole) {
    await supabase.auth.signOut();

    return {
      status: "error",
      message:
        requiredRole === "admin"
          ? "Akun ini bukan admin. Gunakan akun admin yang sudah diberi role."
          : "Akun ini bukan petugas. Gunakan akun officer yang sudah diberi role.",
    };
  }

  revalidatePath("/", "layout");
  redirect(getRoleHome(profile.role));
}

export async function adminLoginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return loginWithRequiredRole(formData, "admin");
}

export async function officerLoginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return loginWithRequiredRole(formData, "officer");
}

export async function registerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse(formDataToObject(formData));

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "Supabase belum dikonfigurasi. Isi environment variables terlebih dahulu.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data daftar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.session && data.user) {
    await ensureProfile(data.user.id, parsed.data.full_name);
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    status: "success",
    message:
      "Akun berhasil dibuat. Jika konfirmasi email aktif, cek inbox sebelum masuk.",
  };
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
