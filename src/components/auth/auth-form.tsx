"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { LogIn, MapPin, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { loginAction, registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { initialActionState } from "@/lib/action-state";
import { getBrowserPosition, markLocationCaptured } from "@/lib/geolocation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [state, formAction, pending] = useActionState(
    isLogin ? loginAction : registerAction,
    initialActionState,
  );
  const [locating, setLocating] = useState(false);

  async function submitLoginWithLocation(formData: FormData) {
    setLocating(true);
    try {
      const fix = await getBrowserPosition();
      formData.set("latitude", String(fix.latitude));
      formData.set("longitude", String(fix.longitude));
      if (typeof fix.accuracy === "number") {
        formData.set("accuracy", String(fix.accuracy));
      }
      markLocationCaptured();
    } catch {
      // Izin lokasi ditolak / tidak tersedia — login tetap dilanjutkan.
    } finally {
      setLocating(false);
    }

    formAction(formData);
  }

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <form
      action={isLogin ? undefined : formAction}
      onSubmit={
        isLogin
          ? (event) => {
              event.preventDefault();
              void submitLoginWithLocation(new FormData(event.currentTarget));
            }
          : undefined
      }
      className="grid gap-4"
    >
      {!isLogin ? (
        <Field
          label="Nama Lengkap"
          error={state.fieldErrors?.full_name?.[0]}
        >
          <Input name="full_name" autoComplete="name" placeholder="Nama kamu" />
        </Field>
      ) : null}

      <Field label="Email" error={state.fieldErrors?.email?.[0]}>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
        />
      </Field>

      <Field
        label="Password"
        error={state.fieldErrors?.password?.[0]}
        hint={isLogin ? undefined : "Minimal 8 karakter, berisi huruf dan angka."}
      >
        <Input
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          placeholder="Password"
        />
      </Field>

      <Button
        type="submit"
        className="mt-2 w-full"
        isLoading={pending || locating}
      >
        {isLogin ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
        {locating ? "Mengambil lokasi..." : isLogin ? "Masuk" : "Daftar"}
      </Button>

      {isLogin ? (
        <p className="-mt-1 flex items-start gap-1.5 text-xs text-slate-400">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
          Saat masuk, kami meminta izin lokasi untuk verifikasi kehadiran.
          Login tetap bisa walau izin lokasi ditolak.
        </p>
      ) : null}

      <p className="text-center text-sm text-slate-500">
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          {isLogin ? "Daftar sekarang" : "Masuk"}
        </Link>
      </p>
    </form>
  );
}
