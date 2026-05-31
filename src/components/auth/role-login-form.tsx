"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { LogIn, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";

import {
  adminLoginAction,
  officerLoginAction,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { initialActionState } from "@/lib/action-state";

export function RoleLoginForm({ role }: { role: "admin" | "officer" }) {
  const isAdmin = role === "admin";
  const [state, formAction, pending] = useActionState(
    isAdmin ? adminLoginAction : officerLoginAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      <Field label="Email" error={state.fieldErrors?.email?.[0]}>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder={isAdmin ? "admin@email.com" : "petugas@email.com"}
        />
      </Field>

      <Field label="Password" error={state.fieldErrors?.password?.[0]}>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
        />
      </Field>

      <Button type="submit" className="mt-2 w-full" isLoading={pending}>
        {isAdmin ? <ShieldCheck className="size-4" /> : <UserCheck className="size-4" />}
        {isAdmin ? "Masuk Admin" : "Masuk Petugas"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Ingin masuk sebagai warga?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Masuk warga
        </Link>
      </p>
      <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <LogIn className="size-3.5" />
        Role akun diverifikasi setelah autentikasi Supabase.
      </p>
    </form>
  );
}
