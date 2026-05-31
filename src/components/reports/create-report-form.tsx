"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPinned, Send } from "lucide-react";
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
import { reverseGeocode } from "@/lib/reverse-geocode";

type LocationFields = {
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postal_code: string;
};

const emptyLocationFields: LocationFields = {
  address: "",
  rt: "",
  rw: "",
  kelurahan: "",
  kecamatan: "",
  city: "",
  province: "",
  postal_code: "",
};

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
  const [locationFields, setLocationFields] =
    useState<LocationFields>(emptyLocationFields);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState(
    "Pilih titik di peta untuk membaca alamat administratif.",
  );

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state.status === "success" && state.reportId) {
      toast.success(state.message || "Laporan berhasil dikirim.");
      router.push(`/dashboard/reports/${state.reportId}`);
    }
  }, [router, state]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsResolvingLocation(true);
      setLocationStatus("Membaca alamat dari titik peta...");

      try {
        const result = await reverseGeocode(
          coordinates.latitude,
          coordinates.longitude,
          controller.signal,
        );

        setLocationFields({
          address: result.address,
          rt: result.rt,
          rw: result.rw,
          kelurahan: result.kelurahan,
          kecamatan: result.kecamatan,
          city: result.city,
          province: result.province,
          postal_code: result.postalCode,
        });
        setLocationStatus(
          result.kecamatan || result.kelurahan || result.address
            ? "Alamat administratif diisi otomatis dari titik peta."
            : "Alamat titik ini belum lengkap di data peta. Kamu bisa isi manual.",
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLocationStatus(
          "Alamat otomatis belum tersedia. Kamu tetap bisa isi RT/RW/Kecamatan manual.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsResolvingLocation(false);
        }
      }
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [coordinates.latitude, coordinates.longitude]);

  function updateLocationField<Key extends keyof LocationFields>(
    key: Key,
    value: LocationFields[Key],
  ) {
    setLocationFields((current) => ({
      ...current,
      [key]: value,
    }));
  }

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

        <section className="grid gap-4 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-600 text-white">
                <MapPinned className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Alamat Administratif
                </h2>
                <p className="text-xs leading-5 text-slate-500">
                  {locationStatus}
                </p>
              </div>
            </div>
            {isResolvingLocation ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                <Loader2 className="size-3.5 animate-spin" />
                GIS aktif
              </span>
            ) : null}
          </div>

          <Field label="Alamat / Patokan" error={state.fieldErrors?.address?.[0]}>
            <Input
              name="address"
              value={locationFields.address}
              onChange={(event) =>
                updateLocationField("address", event.target.value)
              }
              placeholder="Nama jalan atau patokan terdekat"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="RT"
              error={state.fieldErrors?.rt?.[0]}
              hint="Jika data peta tidak punya RT, isi manual."
            >
              <Input
                name="rt"
                value={locationFields.rt}
                onChange={(event) => updateLocationField("rt", event.target.value)}
                placeholder="Contoh: 003"
              />
            </Field>
            <Field
              label="RW"
              error={state.fieldErrors?.rw?.[0]}
              hint="Jika data peta tidak punya RW, isi manual."
            >
              <Input
                name="rw"
                value={locationFields.rw}
                onChange={(event) => updateLocationField("rw", event.target.value)}
                placeholder="Contoh: 005"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Kelurahan / Desa"
              error={state.fieldErrors?.kelurahan?.[0]}
            >
              <Input
                name="kelurahan"
                value={locationFields.kelurahan}
                onChange={(event) =>
                  updateLocationField("kelurahan", event.target.value)
                }
                placeholder="Kelurahan atau desa"
              />
            </Field>
            <Field label="Kecamatan" error={state.fieldErrors?.kecamatan?.[0]}>
              <Input
                name="kecamatan"
                value={locationFields.kecamatan}
                onChange={(event) =>
                  updateLocationField("kecamatan", event.target.value)
                }
                placeholder="Kecamatan"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
            <Field label="Kota / Kabupaten" error={state.fieldErrors?.city?.[0]}>
              <Input
                name="city"
                value={locationFields.city}
                onChange={(event) =>
                  updateLocationField("city", event.target.value)
                }
                placeholder="Kota atau kabupaten"
              />
            </Field>
            <Field label="Provinsi" error={state.fieldErrors?.province?.[0]}>
              <Input
                name="province"
                value={locationFields.province}
                onChange={(event) =>
                  updateLocationField("province", event.target.value)
                }
                placeholder="Provinsi"
              />
            </Field>
            <Field label="Kode Pos" error={state.fieldErrors?.postal_code?.[0]}>
              <Input
                name="postal_code"
                value={locationFields.postal_code}
                onChange={(event) =>
                  updateLocationField("postal_code", event.target.value)
                }
                placeholder="902xx"
              />
            </Field>
          </div>
        </section>

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
