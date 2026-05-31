export const REPORTS_CACHE_TAG = "reports";
export const ADMIN_REPORTS_CACHE_TAG = "admin-reports";
export const PUBLIC_REPORTS_CACHE_TAG = "public-reports";

export function reportDetailCacheTag(reportId: string) {
  return `report:${reportId}`;
}
