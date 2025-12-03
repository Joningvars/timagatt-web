"use client";

import { Settings2 } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

type SidebarSettingsButtonProps = {
  label: string;
};

export function SidebarSettingsButton({ label }: SidebarSettingsButtonProps) {
  const { openUserProfile } = useClerk();

  return (
    <button
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
      onClick={() => openUserProfile?.()}
      type="button"
    >
      <Settings2 className="h-4 w-4" strokeWidth={1.5} />
      {label}
    </button>
  );
}


