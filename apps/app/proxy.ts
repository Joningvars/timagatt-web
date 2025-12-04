import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./src/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/(.*)/dashboard(.*)",
  "/(.*)/timaskraningar(.*)",
  "/(.*)/utgjold(.*)",
  "/(.*)/reikningar(.*)",
  "/(.*)/verkefni(.*)",
]);

const localeAwareSegments = [
  "dashboard",
  "timaskraningar",
  "utgjold",
  "reikningar",
  "verkefni",
];

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Allow API routes to pass through without locale redirection or intl middleware
  if (pathname.startsWith('/api')) {
    // Still protect /api routes if needed, or let them handle their own auth
    return NextResponse.next();
  }

  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocalePrefix) {
    const matchedSegment = localeAwareSegments.find(
      (segment) =>
        pathname === `/${segment}` || pathname.startsWith(`/${segment}/`),
    );

    if (matchedSegment) {
      url.pathname = `/${defaultLocale}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, but DO match API routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
