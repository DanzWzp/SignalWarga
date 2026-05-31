export const REPORTS_CACHE_TAG = "reports";
export const ADMIN_REPORTS_CACHE_TAG = "admin-reports";
export const PUBLIC_REPORTS_CACHE_TAG = "public-reports";
export const USER_LOCATIONS_CACHE_TAG = "user-locations";

export function reportDetailCacheTag(reportId: string) {
  return `report:${reportId}`;
}
