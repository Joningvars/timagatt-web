"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PosthogAnalyticsProvider } from "@/components/analytics/PosthogProvider";
import { PosthogIdentify } from "@/components/analytics/PosthogIdentify";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children, theme }: { children: React.ReactNode; theme?: string }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PosthogAnalyticsProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme={theme || "system"}
          enableSystem
          disableTransitionOnChange
        >
          <PosthogIdentify />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </PosthogAnalyticsProvider>
  );
}

