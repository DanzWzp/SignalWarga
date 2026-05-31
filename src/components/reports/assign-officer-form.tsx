"use client";

import { useActionState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";

import { assignReportToOfficer } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { initialActionState } from "@/lib/action-state";
import type { Profile } from "@/types/database";

export function AssignOfficerForm({
  reportId,
  officers,
  assignedTo,
}: {
  reportId: string;
  officers: Profile[];
  assignedTo?: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    assignReportToOfficer,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "error" && state.message) toast.error(state.message);
    if (state.status === "success" && state.message) toast.success(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="report_id" value={reportId} />
      <Field label="Tugaskan Petugas" error={state.fieldErrors?.officer_id?.[0]}>
        <Select name="officer_id" defaultValue={assignedTo || ""}>
          <option value="" disabled>
            Pilih petugas
          </option>
          {officers.map((officer) => (
            <option key={officer.id} value={officer.id}>
              {officer.full_name || "Petugas"}
            </option>
          ))}
        </Select>
      </Field>
      <Button type="submit" variant="secondary" isLoading={pending}>
        <UserCheck className="size-4" />
        Simpan Penugasan
      </Button>
    </form>
  );
}
