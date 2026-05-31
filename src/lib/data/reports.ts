import { unstable_cache } from "next/cache";

import {
  ADMIN_REPORTS_CACHE_TAG,
  REPORTS_CACHE_TAG,
} from "@/lib/cache-tags";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  Profile,
  Report,
  ReportCategory,
  ReportDetail,
  ReportStatus,
  ReportWithProfile,
} from "@/types/database";

const reportListSelect =
  "*, profiles:profiles!reports_created_by_fkey(id, full_name, avatar_url, role)";

export type ReportQuery = {
  category?: ReportCategory | "all";
  status?: ReportStatus | "all";
  search?: string;
  createdBy?: string;
  assignedTo?: string;
  limit?: number;
};

export async function getReports(filters: ReportQuery = {}) {
  if (!isSupabaseConfigured) return [];

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("reports")
    .select(reportListSelect)
    .order("created_at", { ascending: false });

  if (filters.limit) query = query.limit(filters.limit);
  if (filters.createdBy) query = query.eq("created_by", filters.createdBy);
  if (filters.assignedTo) query = query.eq("assigned_to", filters.assignedTo);
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.search) {
    const term = filters.search.replaceAll("%", "").replaceAll(",", " ");
    query = query.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,address.ilike.%${term}%,kelurahan.ilike.%${term}%,kecamatan.ilike.%${term}%,city.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch reports", error);
    return [];
  }

  return (data || []) as ReportWithProfile[];
}

export const getCachedAdminReports = unstable_cache(
  async (filters: ReportQuery = {}) => {
    if (!isSupabaseConfigured) return [];

    const supabase = createAdminSupabaseClient();

    let query = supabase
      .from("reports")
      .select(reportListSelect)
      .order("created_at", { ascending: false });

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }
    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters.search) {
      const term = filters.search.replaceAll("%", "").replaceAll(",", " ");
      query = query.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,address.ilike.%${term}%,kelurahan.ilike.%${term}%,kecamatan.ilike.%${term}%,city.ilike.%${term}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch cached admin reports", error);
      return [];
    }

    return (data || []) as ReportWithProfile[];
  },
  ["admin-reports"],
  {
    tags: [REPORTS_CACHE_TAG, ADMIN_REPORTS_CACHE_TAG],
    revalidate: 60,
  },
);

export async function getReportById(id: string) {
  if (!isSupabaseConfigured) return null;

  const supabase = await createServerSupabaseClient();

  const { data: report, error } = await supabase
    .from("reports")
    .select(
      "*, profiles:profiles!reports_created_by_fkey(id, full_name, avatar_url, role, phone), assigned_profile:profiles!reports_assigned_to_fkey(id, full_name, role)",
    )
    .eq("id", id)
    .single();

  if (error || !report) {
    return null;
  }

  const { data: updates } = await supabase
    .from("report_updates")
    .select("*, profiles:user_id(id, full_name, role)")
    .eq("report_id", id)
    .order("created_at", { ascending: true });

  return {
    ...(report as ReportDetail),
    report_updates: (updates || []) as ReportDetail["report_updates"],
  };
}

export async function getDashboardStats(profile: Profile) {
  const reports =
    profile.role === "admin"
      ? await getCachedAdminReports()
      : profile.role === "officer"
        ? await getReports({ assignedTo: profile.id })
        : await getReports({ createdBy: profile.id });

  const byStatus = reports.reduce(
    (acc, report) => {
      acc[report.status] += 1;
      return acc;
    },
    {
      pending: 0,
      verified: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    } satisfies Record<ReportStatus, number>,
  );

  const byCategory = reports.reduce(
    (acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    },
    {} as Record<ReportCategory, number>,
  );

  return {
    total: reports.length,
    byStatus,
    byCategory,
    latest: reports.slice(0, 5),
  };
}

export async function getOfficers() {
  if (!isSupabaseConfigured) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "officer")
    .order("full_name");

  if (error) {
    console.error("Failed to fetch officers", error);
    return [];
  }

  return (data || []) as Profile[];
}

export function countResolvedReports(reports: Pick<Report, "status">[]) {
  return reports.filter((report) => report.status === "resolved").length;
}
