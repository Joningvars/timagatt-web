"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PosthogAnalyticsProvider } from "@/components/analytics/PosthogProvider";
import { PosthogIdentify } from "@/components/analytics/PosthogIdentify";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PosthogAnalyticsProvider>
      <QueryClientProvider client={queryClient}>
        <PosthogIdentify />
        {children}
      </QueryClientProvider>
    </PosthogAnalyticsProvider>
  );
}

