"use client";

import { UserButton } from "@clerk/nextjs";

export function DashboardUserMenu() {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: "w-8 h-8",
        },
      }}
    />
  );
}


