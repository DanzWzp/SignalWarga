"use server";

import { revalidatePath } from "next/cache";

import {
  formDataToObject,
  type ActionState,
} from "@/lib/action-state";
import { requireUserProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/auth";

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await requireUserProfile();
  const parsed = profileSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Data profil belum valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
    })
    .eq("id", profile.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/profile");

  return {
    status: "success",
    message: "Profil berhasil diperbarui.",
  };
}
