"use server";

import { revalidatePath, updateTag } from "next/cache";

import {
  ACCEPTED_REPORT_PHOTO_TYPES,
  createReportSchema,
  MAX_REPORT_PHOTO_SIZE,
  updateReportStatusSchema,
  assignReportSchema,
  deleteReportSchema,
} from "@/lib/validations/report";
import {
  formDataToObject,
  type ActionState,
} from "@/lib/action-state";
import { requireUserProfile } from "@/lib/auth";
import { safeFileName } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  ADMIN_REPORTS_CACHE_TAG,
  PUBLIC_REPORTS_CACHE_TAG,
  REPORTS_CACHE_TAG,
  reportDetailCacheTag,
} from "@/lib/cache-tags";
import type { ReportStatus } from "@/types/database";

function invalidateReportCaches(reportId?: string) {
  updateTag(REPORTS_CACHE_TAG);
  updateTag(ADMIN_REPORTS_CACHE_TAG);
  updateTag(PUBLIC_REPORTS_CACHE_TAG);

  if (reportId) {
    updateTag(reportDetailCacheTag(reportId));
  }
}

function revalidateReportPaths(reportId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard/map");
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/map");
  revalidatePath("/peta-laporan");
  revalidatePath("/lapor/[slug]", "page");

  if (reportId) {
    revalidatePath(`/dashboard/reports/${reportId}`);
    revalidatePath(`/admin/reports/${reportId}`);
  }
}

function getReportPhotoStoragePath(photoUrl?: string | null) {
  if (!photoUrl) return null;

  const marker = "/storage/v1/object/public/report-photos/";
  const markerIndex = photoUrl.indexOf(marker);

  if (markerIndex === -1) return null;

  const pathWithQuery = photoUrl.slice(markerIndex + marker.length);
  return decodeURIComponent(pathWithQuery.split("?")[0] || "");
}

export async function uploadReportPhoto(file: File, userId: string) {
  if (!ACCEPTED_REPORT_PHOTO_TYPES.includes(file.type)) {
    throw new Error("Format foto harus jpg, png, atau webp.");
  }

  if (file.size > MAX_REPORT_PHOTO_SIZE) {
    throw new Error("Ukuran foto maksimal 5MB.");
  }

  const supabase = await createServerSupabaseClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}-${safeFileName(
    file.name || `laporan.${extension}`,
  )}`;

  const { error } = await supabase.storage
    .from("report-photos")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("report-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function createReport(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await requireUserProfile();
  const parsed = createReportSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Data laporan belum lengkap.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const photo = formData.get("photo");
  let photoUrl: string | null = null;

  try {
    if (photo instanceof File && photo.size > 0) {
      photoUrl = await uploadReportPhoto(photo, profile.id);
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Foto laporan gagal diupload.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reports")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      priority: parsed.data.priority,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      address: parsed.data.address || null,
      rt: parsed.data.rt || null,
      rw: parsed.data.rw || null,
      kelurahan: parsed.data.kelurahan || null,
      kecamatan: parsed.data.kecamatan || null,
      city: parsed.data.city || null,
      province: parsed.data.province || null,
      postal_code: parsed.data.postal_code || null,
      photo_url: photoUrl,
      status: "pending",
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      status: "error",
      message: error?.message || "Laporan gagal disimpan.",
    };
  }

  await supabase.from("report_updates").insert({
    report_id: data.id,
    user_id: profile.id,
    status: "pending",
    note: "Laporan dibuat dan menunggu verifikasi.",
  });

  invalidateReportCaches(data.id);
  revalidateReportPaths(data.id);

  return {
    status: "success",
    message: "Laporan berhasil dikirim.",
    reportId: data.id,
  };
}

export async function updateReportStatus(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await requireUserProfile(["admin", "officer"]);
  const parsed = updateReportStatusSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Status laporan belum valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: report } = await supabase
    .from("reports")
    .select("id, assigned_to")
    .eq("id", parsed.data.report_id)
    .single();

  if (!report) {
    return { status: "error", message: "Laporan tidak ditemukan." };
  }

  if (profile.role === "officer" && report.assigned_to !== profile.id) {
    return {
      status: "error",
      message: "Petugas hanya dapat memperbarui laporan yang ditugaskan.",
    };
  }

  const { error } = await supabase
    .from("reports")
    .update({
      status: parsed.data.status as ReportStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.report_id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  await supabase.from("report_updates").insert({
    report_id: parsed.data.report_id,
    user_id: profile.id,
    status: parsed.data.status,
    note: parsed.data.note || null,
  });

  invalidateReportCaches(parsed.data.report_id);
  revalidateReportPaths(parsed.data.report_id);

  return {
    status: "success",
    message: "Status laporan berhasil diperbarui.",
  };
}

export async function assignReportToOfficer(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { profile } = await requireUserProfile(["admin"]);
  const parsed = assignReportSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Data penugasan belum valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("reports")
    .update({
      assigned_to: parsed.data.officer_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.report_id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  await supabase.from("report_updates").insert({
    report_id: parsed.data.report_id,
    user_id: profile.id,
    note: "Laporan ditugaskan ke petugas lapangan.",
  });

  invalidateReportCaches(parsed.data.report_id);
  revalidateReportPaths(parsed.data.report_id);

  return {
    status: "success",
    message: "Petugas berhasil ditugaskan.",
  };
}

export async function deleteReport(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserProfile(["admin"]);
  const parsed = deleteReportSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "ID laporan tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("id, photo_url")
    .eq("id", parsed.data.report_id)
    .single();

  if (reportError || !report) {
    return {
      status: "error",
      message: "Laporan tidak ditemukan atau sudah dihapus.",
    };
  }

  const photoPath = getReportPhotoStoragePath(report.photo_url);

  if (photoPath) {
    const { error: storageError } = await supabase.storage
      .from("report-photos")
      .remove([photoPath]);

    if (storageError) {
      console.error("Failed to remove report photo", storageError.message);
    }
  }

  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", parsed.data.report_id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  invalidateReportCaches(parsed.data.report_id);
  revalidateReportPaths(parsed.data.report_id);

  return {
    status: "success",
    message: "Laporan berhasil dihapus.",
    reportId: parsed.data.report_id,
  };
}
