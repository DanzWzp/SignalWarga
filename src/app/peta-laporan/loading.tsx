import { PageLoading } from "@/components/ui/page-loading";

export default function PublicMapLoading() {
  return (
    <PageLoading
      title="Memuat peta laporan"
      description="Mengambil data publik anonim dan menyiapkan layer peta."
    />
  );
}
