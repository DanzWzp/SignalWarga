"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteReport } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { initialActionState } from "@/lib/action-state";

export function DeleteReportButton({
  reportId,
  reportTitle,
  redirectTo,
  size = "sm",
}: {
  reportId: string;
  reportTitle: string;
  redirectTo?: string;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        variant="danger"
        size={size}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" />
        Hapus
      </Button>
      <Modal open={open} title="Hapus Laporan" onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-slate-600">
            Laporan <span className="font-semibold text-slate-950">{reportTitle}</span>{" "}
            akan dihapus permanen dari database. Timeline laporan juga ikut
            terhapus.
          </p>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);

              startTransition(async () => {
                const result = await deleteReport(initialActionState, formData);

                if (result.status === "error") {
                  toast.error(result.message || "Laporan gagal dihapus.");
                  return;
                }

                toast.success(result.message || "Laporan berhasil dihapus.");
                setOpen(false);

                if (redirectTo) {
                  router.push(redirectTo);
                } else {
                  router.refresh();
                }
              });
            }}
          >
            <input type="hidden" name="report_id" value={reportId} />
            <Button type="submit" variant="danger" isLoading={pending}>
              <Trash2 className="size-4" />
              Ya, Hapus
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Batal
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}
