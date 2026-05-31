"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { createReport } from "@/app/actions/reports";
import { MapPicker } from "@/components/map/map-picker";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { UploadImageField } from "@/components/reports/upload-image-field";
import {
  categories,
  categoryLabels,
  DEFAULT_MAP_CENTER,
  priorities,
  priorityLabels,
} from "@/lib/constants";
import { initialActionState } from "@/lib/action-state";

export function CreateReportForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createReport,
    initialActionState,
  );
  const [coordinates, setCoordinates] = useState({
    latitude: DEFAULT_MAP_CENTER.latitude,
    longitude: DEFAULT_MAP_CENTER.longitude,
  });

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state.status === "success" && state.reportId) {
      toast.success(state.message || "Laporan berhasil dikirim.");
      router.push(`/dashboard/reports/${state.reportId}`);
    }
  }, [router, state]);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <input type="hidden" name="latitude" value={coordinates.latitude} />
      <input type="hidden" name="longitude" value={coordinates.longitude} />

      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <Field label="Judul Laporan" error={state.fieldErrors?.title?.[0]}>
          <Input name="title" placeholder="Contoh: Jalan berlubang di depan pasar" />
        </Field>

        <Field label="Deskripsi" error={state.fieldErrors?.description?.[0]}>
          <Textarea
            name="description"
            placeholder="Jelaskan kondisi, dampak, dan patokan lokasi sejelas mungkin."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori" error={state.fieldErrors?.category?.[0]}>
            <Select name="category" defaultValue="jalan_rusak">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Prioritas" error={state.fieldErrors?.priority?.[0]}>
            <Select name="priority" defaultValue="medium">
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priorityLabels[priority]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Alamat / Patokan" error={state.fieldErrors?.address?.[0]}>
          <Input
            name="address"
            placeholder="Nama jalan, RT/RW, kelurahan, atau patokan terdekat"
          />
        </Field>

        <UploadImageField />

        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
          SignalWarga tidak melakukan pelacakan latar belakang. Koordinat hanya
          disimpan saat kamu mengirim laporan ini.
        </div>

        <Button type="submit" size="lg" isLoading={pending}>
          <Send className="size-4" />
          Kirim Laporan
        </Button>
      </div>

      <div className="grid gap-4 self-start">
        <MapPicker value={coordinates} onChange={setCoordinates} />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-medium text-slate-500">Latitude</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {coordinates.latitude.toFixed(6)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-medium text-slate-500">Longitude</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {coordinates.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
