"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import {
  categories,
  categoryLabels,
  statuses,
  statusLabels,
} from "@/lib/constants";

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <form
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const params = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
          const text = String(value);
          if (text && text !== "all") params.set(key, text);
        }

        router.push(`?${params.toString()}`);
      }}
    >
      <Field label="Cari">
        <Input
          name="search"
          defaultValue={searchParams.get("search") || ""}
          placeholder="Judul, alamat, atau deskripsi"
        />
      </Field>
      <Field label="Kategori">
        <Select name="category" defaultValue={searchParams.get("category") || "all"}>
          <option value="all">Semua kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Status">
        <Select name="status" defaultValue={searchParams.get("status") || "all"}>
          <option value="all">Semua status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex items-end">
        <Button type="submit" variant="secondary" className="w-full">
          <Search className="size-4" />
          Filter
        </Button>
      </div>
    </form>
  );
}
