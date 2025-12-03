"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className:
          "bg-white border border-slate-200 shadow-lg shadow-slate-200/60 text-slate-900 font-medium",
      }}
    />
  );
}


