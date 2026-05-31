"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { updateReportStatus } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { initialActionState } from "@/lib/action-state";
import { statuses, statusLabels } from "@/lib/constants";
import type { ReportStatus } from "@/types/database";

export function StatusUpdateForm({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: ReportStatus;
}) {
  const [state, formAction, pending] = useActionState(
    updateReportStatus,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "error" && state.message) toast.error(state.message);
    if (state.status === "success" && state.message) toast.success(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="report_id" value={reportId} />
      <Field label="Ubah Status" error={state.fieldErrors?.status?.[0]}>
        <Select name="status" defaultValue={currentStatus}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Catatan Update" error={state.fieldErrors?.note?.[0]}>
        <Textarea name="note" placeholder="Tambahkan konteks perubahan status" />
      </Field>
      <Button type="submit" isLoading={pending}>
        <CheckCircle2 className="size-4" />
        Simpan Status
      </Button>
    </form>
  );
}
