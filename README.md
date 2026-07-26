# IIT Delhi Robotics Department Website

Official website for the **Centre of Excellence on Biologically Inspired Robots and Drones (CoE-BIRD)** at IIT Delhi — built with Next.js, Tailwind CSS, and Supabase.

> **Repo:** https://github.com/TheDarkLord100/jrb-website-new
> **Live site:** https://robotics.iitd.ac.in

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres, Row Level Security) |
| Backend logic | Supabase Edge Functions (Deno) |
| Content | `react-markdown` + `remark-gfm` for Markdown-authored fields |
| 3D | Three.js / React Three Fiber (homepage hero point cloud) |
| Icons | Lucide React |
| Email | Resend (via the `send-contact-email` Edge Function) |

---

## Project Structure

```
src/
├── app/                     # Pages and routes (Next.js App Router)
│   ├── about/
│   ├── academics/
│   │   ├── admissions/
│   │   ├── minor/           # IDSR page (route name predates the content — see docs/DATABASE.md)
│   │   └── mtech/
│   ├── contact/
│   ├── events/
│   ├── industry/
│   ├── people/
│   └── research/
│       ├── facilities/
│       │   └── [slug]/      # generateStaticParams — see the gotcha below
│       └── themes/
│           ├── cross-cutting/
│           ├── field-robotics/
│           ├── human-robotics/
│           └── soft-bio-robotics/
│
├── components/
│   ├── ui/                  # Primitives: Card, Pill, PageHeading, SectionHeading,
│   │                           Accordion, Markdown, TocNav, AnnouncementModal, ContentBlocks
│   ├── layout/               # Navbar (+ navItems.ts, DesktopNav, MobileDrawer), Footer
│   └── sections/              # Page-specific content, grouped by feature:
│       ├── home/               #   Hero, ResearchDomains, NewsAndAnnouncements,
│       │                       #   IndustryConnect, FeaturedProjectsCarousel, Collaborators
│       ├── hero/                #   Three.js point cloud internals (shared by Hero + StaticPointCloud)
│       ├── people/               #   PeopleDirectory, PeopleSkeleton
│       ├── research/             #   ResearchLabs, LabDetail(+Skeleton), VerticalPage, StaticPointCloud
│       ├── academics/             #   AdmissionsContent, IdsrContent, MtechContent
│       ├── events/                 #   EventsList, AnnouncementSidebar (shared with Admissions)
│       ├── industry/                #   IndustryTiers, IndustryContactForm
│       ├── about/                    #   AboutGallery
│       └── contact/                   #   ContactForm
│
├── lib/
│   ├── hooks/                 # Every `use*` data hook (one per Supabase query group)
│   ├── supabase/
│   │   ├── client.ts          # Supabase client -- returns `null` if env vars are missing,
│   │   │                        never throws at import time (would break the static build)
│   │   └── queries/            # Query functions, one file per domain, re-exported via index.ts
│   ├── announcements.ts        # formatAnnouncementDate() utility
│   ├── contact.ts              # sendContactMessage() -- invokes the send-contact-email Edge Function
│   ├── stripMarkdown.ts        # Rough plain-text preview for card excerpts of Markdown content
│   └── lucideIconMap.ts        # Maps a DB-stored icon name string to a lucide-react component
│
└── types/                       # One file per data domain, mirrors docs/DATABASE.md

supabase/
└── functions/
    └── send-contact-email/       # Deno Edge Function, see docs/DATABASE.md for required secrets

docs/
└── DATABASE.md                    # Schema reference: every table, column, and RLS policy
                                     # (descriptive only -- no runnable SQL is checked into the repo)
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
**Supabase Dashboard → Project Settings → API** — use the **publishable** key, not the legacy anon key.

### 4. Set up the database (first time only)

The database schema isn't checked into this repo. Use [`docs/DATABASE.md`](./docs/DATABASE.md) as the reference for every table, column, and access-control policy this project expects, and create them in your own Supabase project's SQL Editor. Reach out to whoever set up the original project if you need the exact existing schema rather than recreating it from the reference doc.

### 5. Deploy the Edge Function

```bash
supabase functions deploy send-contact-email
```

Then set its required secrets under **Edge Functions → Secrets** in the Dashboard — see [`docs/DATABASE.md`](./docs/DATABASE.md#edge-functions) for exactly which ones.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building & Deployment

This project uses Next.js static export (`output: 'export'`), which compiles the site into plain HTML/CSS/JS files — no Node.js required on the server.

### Build

```bash
npm run build
```

This generates an `/out` directory containing all static files.

### Deploy to Server

Copy the `/out` directory to the web server, e.g.:

```bash
rsync -avz --delete out/ user@server:/var/www/robotics/html/
```

> **Note:** there's no `docs/DEPLOYMENT.md` in this repo yet, despite this section implying more detail exists — a previous version of this README referenced one that was never actually written. If there's a specific Apache vhost config, deploy pipeline, or server path this project relies on, that should get written down properly rather than left as a dangling reference.

---

## A build-time gotcha worth knowing

Any `[slug]` dynamic route (currently just `/research/facilities/[slug]`) needs `generateStaticParams`. Under `output: 'export'`, an **empty array returned from it fails the entire build** — not just that route — so it always needs a fallback placeholder param if the underlying table could ever be empty.

---

## Other Commands

```bash
npm run lint          # Run ESLint
npm run typecheck      # Run TypeScript checks
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without writing changes
```

---

## Known gaps / next steps

- **Projects section** — a `projects` table (+ `theme_projects` junction, mirroring `theme_faculty`/`theme_labs`) is planned but not yet built; needs real project write-ups, leads, and links before seeding.
- **"For Students" gated resource section** — designed (passphrase-gate pattern, checked server-side in an Edge Function so the resource list itself is never in the public bundle) but not yet implemented; waiting on real content and a passphrase.
- **`collaborators.name`** — the 13 seeded logos are unlabeled files; real company names haven't been confirmed yet.
- **Industry page tier content** (`industry_tiers`) is intentionally placeholder/illustrative, not a real published programme.