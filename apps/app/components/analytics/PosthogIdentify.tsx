"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";

const hasPosthog = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function PosthogIdentify() {
  const { user } = useUser();
  const lastIdentified = useRef<string | null>(null);

  useEffect(() => {
    if (!hasPosthog || !user?.id) {
      return;
    }

    if (lastIdentified.current === user.id) {
      return;
    }

    posthog.identify(user.id, {
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName ?? undefined,
    });

    lastIdentified.current = user.id;
  }, [user?.id, user?.primaryEmailAddress?.emailAddress, user?.fullName]);

  return null;
}


