# IIT Delhi Robotics Department Website

Official website for the **Centre of Excellence on Biologically Inspired Robots and Drones (BIRD)** at IIT Delhi — built with Next.js, Tailwind CSS, and Supabase.

> **Repo:** https://github.com/TheDarkLord100/jrb-website-new
> **Live site:** https://robotics.iitd.ac.in

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres + Auth) |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/          # Pages and routes
├── components/   # Reusable UI components
│   ├── ui/       # Primitives (buttons, cards, etc.)
│   ├── layout/   # Navbar, Footer
│   └── sections/ # Page sections
├── lib/
│   └── supabase/ # Supabase client and query functions
├── types/        # TypeScript interfaces
└── styles/       # Global CSS

docs/             # Setup and deployment guides
.github/          # CI workflows and issue templates
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/TheDarkLord100/jrb-website-new.git
cd jrb-website-new
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials in `.env.local`. Find them at:
**Supabase Dashboard → Project Settings → API**

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building & Deployment

This project uses Next.js static export (`output: 'export'`), which compiles the site into plain HTML/CSS/JS files served by Apache — no Node.js required on the server.

### Build
```bash
npm run build
```
This generates an `/out` directory containing all static files.

### Deploy to Server
Copy the `/out` directory to the Apache server:
```bash
rsync -avz --delete out/ user@server:/var/www/robotics/html/
```

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for the full Apache configuration guide.

---

## Other Commands

```bash
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript checks
npm run format      # Format code with Prettier
```

---

## Merge Notes (this pass)

This pass ported all content pages from the previous static-HTML rebuild into
this project's Tailwind/`src` structure, following the Navbar's existing route
map and design system (dark `#001A23` header, yellow-400 accents):

- **Pages added:** `/about`, `/research/themes` (+ 4 detail pages under
  `/research/themes/{human-robotics,soft-bio-robotics,field-robotics,cross-cutting}`),
  `/research/facilities`, `/people`, `/academics/mtech`, `/academics/minor`,
  `/academics/admissions`, `/events`, `/contact`
- **`src/components/ui/`**: `PageHeading`, `SectionHeading`, `Card`, `Pill`,
  `Tag`, `Accordion`, `AnnouncementModal`
- **`src/components/sections/`**: `Hero`, `ResearchDomains`,
  `NewsAndAnnouncements`, `Collaborators`, `VerticalPage` + `ProjectAccordion`
  (research field pages), `ResearchLabs`, `PeopleDirectory`, `EventsAccordion`,
  `ContactForm`, `AdmissionAnnouncements`
- **`src/types/`**: `announcement.ts` and `person.ts`, both shaped to match
  `docs/DATABASE.md` exactly so swapping in real Supabase queries later is a
  drop-in change rather than a rewrite.
- **`src/lib/announcements.ts`** and **`src/lib/people-data.ts`**: seed/adapter
  data. `announcements.ts` currently adapts the same public Gist JSON the old
  site used into the `announcements` table shape — there's a `TODO(supabase)`
  comment marking exactly where to swap in a real query.  `people-data.ts` is
  static seed data (55 people) ported from the old site, shaped to match the
  `people` table.

### Known gaps / next steps
- Supabase isn't wired up yet (per your message, that's the next phase). The
  `announcements` and `people` data already match the DB schema shape, so
  `src/lib/supabase/queries.ts` should be able to replace `announcements.ts`
  and `people-data.ts` without touching any components.
- `hero_settings`/`hero_slides` are still hardcoded in `Hero.tsx` — same story,
  shaped to match the table so it's a straightforward swap.
- `labs`/`lab_images`/`lab_announcements` aren't wired to Supabase yet either;
  `ResearchLabs.tsx` has static seed data.
- Font: this repo uses `next/font/google` (Inter), which needs to reach
  `fonts.googleapis.com` at build time — that's blocked in the sandbox this was
  built in, so the build here was verified with the font import temporarily
  stripped. It's restored in the delivered code; run `npm run build` locally to
  confirm (should just work with normal internet access).
- I left `src/components/layout/Navbar.tsx` and `Footer.tsx` as you had them —
  didn't touch your existing work there.
