# Timagatt Monorepo

This repository now hosts two independent Next.js applications:

- `apps/app` – the authenticated SaaS experience that powers `app.timagatt.is`. This app includes Clerk auth, dashboards, TanStack Query, Drizzle, etc.
- `apps/marketing` – the public marketing site that powers `timagatt.is`, rendering the localized landing page without any auth dependencies.

## Getting Started

Install dependencies from the repo root (generates a single workspace lockfile):

```bash
npm install
```

Then run either app:

```bash
# run both dev servers in parallel
npm run dev

# or individually
npm run dev:app
npm run dev:marketing
```

Each application keeps its own `package.json`, Next configuration, middleware, and assets. Shared utilities can live under `packages/` in the future if needed.

## Deployments

- `apps/marketing` → `timagatt.is`
- `apps/app` → `app.timagatt.is`

Configure two separate hosting targets (e.g., Vercel projects) and point the respective domains at each build output. Since both apps use `next-intl`, remember to configure locale domains accordingly.

