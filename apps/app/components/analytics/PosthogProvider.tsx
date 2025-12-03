"use client";

import { useEffect, useRef } from "react";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

type PosthogProviderProps = {
  children: React.ReactNode;
};

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com";

export function PosthogAnalyticsProvider({ children }: PosthogProviderProps) {
  const hasInitialized = useRef(false);
  const isConfigured = Boolean(POSTHOG_KEY);

  useEffect(() => {
    if (!isConfigured || hasInitialized.current) {
      return;
    }

    posthog.init(POSTHOG_KEY as string, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      autocapture: true,
    });

    hasInitialized.current = true;
  }, [isConfigured]);

  if (!isConfigured) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[PostHog] NEXT_PUBLIC_POSTHOG_KEY not set. Analytics disabled.",
      );
    }
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}


