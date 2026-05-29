# Contributing

This document is for anyone looking to contribute to the IIT Delhi Robotics Department website. It covers how the codebase is structured, how to run it locally, and how to work with the repository.

---

## Running Locally

```bash
git clone https://github.com/TheDarkLord100/jrb-website-new.git
cd jrb-website-new
npm install
cp .env.example .env.local   # fill in Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Branch Strategy

There is one main branch — `master`.

- `master` is the production branch. It is deployed manually to the Apache server and also synced to Vercel for preview builds.
- Work directly on `master` for now. Once the project stabilises, a `dev` branch will be introduced for active development before merging into `master`.

---

## Codebase Overview

### `src/app/`
Contains all the pages and routes using Next.js App Router. Each folder is a route — for example `src/app/people/` maps to `/people`. `layout.tsx` at the root wraps every page with the navbar and footer.

### `src/components/`
All reusable UI lives here, split into three folders:
- `ui/` — small primitives like buttons, cards, badges
- `layout/` — navbar and footer
- `sections/` — larger page-level sections like the hero carousel or announcements block

### `src/lib/supabase/`
- `client.ts` — initialises the Supabase client using environment variables
- `queries.ts` — all database fetch functions are defined here. Any time you need to read from the database, add a function here rather than writing inline queries in components.

### `src/types/`
Shared TypeScript interfaces. If you add a new table or field to the database, update the types here to match.

### `src/styles/`
Global CSS and Tailwind directives. Avoid adding custom CSS here unless it cannot be done with Tailwind utilities.

### `docs/`
Project documentation — database schema, setup guides, and deployment instructions. Update these if you make changes to the database or deployment process.

---

## Database

All dynamic content is managed through Supabase. See [`docs/DATABASE.md`](./docs/DATABASE.md) for the full table structure and field descriptions.

If you need Supabase credentials to run the project locally, contact the project maintainer.

---

## Building for Production

```bash
npm run build
```

This generates an `/out` directory of static files that gets deployed to the Apache server. See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for deployment steps.

---

## Useful Commands

```bash
npm run dev          # Start local dev server
npm run build        # Build static export → /out
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run format       # Format code with Prettier
```

---

## Questions

Reach out to the current maintainer via the repository or department webmail before making large structural changes.