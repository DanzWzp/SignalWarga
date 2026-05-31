"use client";

import { Toaster } from "sonner";

import { ServiceWorkerRegister } from "@/components/providers/service-worker-register";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ServiceWorkerRegister />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
}
