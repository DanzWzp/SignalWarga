"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
