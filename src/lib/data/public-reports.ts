import { unstable_cache } from "next/cache";

import {
  PUBLIC_REPORTS_CACHE_TAG,
  REPORTS_CACHE_TAG,
} from "@/lib/cache-tags";
import {
  isSupabaseConfigured,
  SUPABASE_SERVICE_ROLE_KEY,
} from "@/lib/supabase/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type {
  PublicReport,
  ReportCategory,
  ReportStatus,
} from "@/types/database";

export type PublicReportQuery = {
  category?: ReportCategory | "all";
  status?: ReportStatus | "all";
  search?: string;
  limit?: number;
};

export const getCachedPublicReports = unstable_cache(
  async (filters: PublicReportQuery = {}) => {
    if (!isSupabaseConfigured || !SUPABASE_SERVICE_ROLE_KEY) return [];

    const supabase = createAdminSupabaseClient();

    let query = supabase
      .from("public_reports")
      .select("*")
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
      console.error("Failed to fetch public reports", error);
      return [];
    }

    return (data || []) as PublicReport[];
  },
  ["public-reports"],
  {
    tags: [REPORTS_CACHE_TAG, PUBLIC_REPORTS_CACHE_TAG],
    revalidate: 120,
  },
);
