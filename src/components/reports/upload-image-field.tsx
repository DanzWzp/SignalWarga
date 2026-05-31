"use client";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";

import { Field, Input } from "@/components/ui/field";

export function UploadImageField({ error }: { error?: string }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Field
      label="Foto Bukti"
      error={error}
      hint="Format jpg, png, atau webp. Maksimal 5MB."
    >
      <div className="grid gap-3">
        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50">
          <ImagePlus className="size-5 text-emerald-600" />
          Upload foto laporan
          <Input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setPreview(null);
                return;
              }

              setPreview((current) => {
                if (current) URL.revokeObjectURL(current);
                return URL.createObjectURL(file);
              });
            }}
          />
        </label>
        {preview ? (
          <div
            aria-label="Preview foto laporan"
            className="h-48 rounded-lg border border-slate-200 bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
          />
        ) : null}
      </div>
    </Field>
  );
}
