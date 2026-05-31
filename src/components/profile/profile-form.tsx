"use client";

import { useActionState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { initialActionState } from "@/lib/action-state";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "error" && state.message) toast.error(state.message);
    if (state.status === "success" && state.message) toast.success(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Field label="Nama Lengkap" error={state.fieldErrors?.full_name?.[0]}>
        <Input name="full_name" defaultValue={profile.full_name || ""} />
      </Field>
      <Field label="Nomor Telepon" error={state.fieldErrors?.phone?.[0]}>
        <Input name="phone" defaultValue={profile.phone || ""} placeholder="08xxxxxxxxxx" />
      </Field>
      <Button type="submit" isLoading={pending}>
        <Save className="size-4" />
        Simpan Profil
      </Button>
    </form>
  );
}
