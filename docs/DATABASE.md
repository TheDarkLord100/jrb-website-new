# Database Reference

All dynamic content is stored in Supabase (Postgres). This document describes
every table, its fields, and how they relate to each other. Query functions
live in `src/lib/supabase/queries/`, one file per domain (see the README's
project structure section).

---

## Conventions used across (almost) every table

- **`is_visible` (boolean)** — where present, RLS restricts public reads to
  `is_visible = true` (see [Access Control](#access-control)). Toggling this
  off in the Supabase Dashboard hides a row without deleting it. A handful of
  tables (`people`, `labs`, `lab_images`, junction tables) don't have this
  column and are simply readable in full — add it if per-row hiding is ever
  needed there.
- **`display_order` (int, nullable)** — controls ascending sort order within
  a table/section. `null` sorts last (Postgres default `NULLS LAST` for
  ascending order).
- **`updated_at` (timestamptz)** — auto-touched on every `UPDATE` by a shared
  trigger function, `set_updated_at()` (defined once in
  `supabase/schema.sql`, attached per-table). Used to compute "Last updated"
  labels in the UI (e.g. the Admissions page) from real data instead of a
  manually-typed date that's easy to forget to bump.
- **Markdown fields** — any column documented as "markdown" is rendered
  through `src/components/ui/Markdown.tsx` (`react-markdown` + `remark-gfm`),
  never as raw HTML. Safe to edit directly as plain text in the Dashboard's
  table editor.
- **`icon` (text)** — where present, stores a `lucide-react` icon component
  name (e.g. `"Compass"`, `"Users"`), resolved at render time via
  `src/lib/lucideIconMap.ts`. Adding a new icon means adding an entry to that
  map, not just typing the name into the database — an unrecognized name
  silently falls back to a plain circle rather than crashing.

---

## People & Research

### `people`

Single table for all roles — role-specific fields are nullable.

| Column | Type | Applies to | Notes |
|---|---|---|---|
| id | uuid | All | Primary key |
| name | text | All | |
| image_url | text | All | |
| webmail | text \| null | All | |
| link | text \| null | All | Personal or profile page URL |
| role | text | All | `'faculty'` \| `'student'` \| `'postdoc'` \| `'alumni'` |
| year | text \| null | Student, Postdoc, Alumni | e.g. `'2025-27'`, used for filtering |
| department | text \| null | Faculty | |
| office_contact | text \| null | Faculty | |
| research_interest | text \| null | Faculty | Displayed on their profile |
| focus | text[] | Faculty | Search keywords — not displayed publicly |
| priority | int \| null | All | Lower shows first; null sorts last |
| special_designation | text \| null | All | e.g. "Coordinator, CoE-BIRD" |

Sorted alphabetically by `name` at query time.

### `labs`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| name | text | |
| slug | text | Used for the `/research/facilities/[slug]` route. **Required** for `generateStaticParams` at build time — see the gotcha noted in the README |
| category | text | `'perception'` \| `'dynamics'` \| `'human'` \| `'manufacturing'` |
| location | text \| null | |
| faculty_lead | text \| null | |
| coordinator | text \| null | Faculty or student — shown only if present |
| research_areas | text[] \| null | |
| description | text \| null | |
| external_url | text \| null | If set, the listing links out instead of to the internal detail page |
| cover_image_url | text \| null | Listing-grid thumbnail |
| priority | int \| null | Lower shows first; null sorts last |

Listing (`getLabs`) sorts alphabetically by `name`; the detail page (`getLabBySlug`) looks up a single row by `slug`.

### `lab_images`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| lab_id | uuid | FK → `labs.id` |
| image_url | text | |
| caption | text \| null | |
| display_order | int \| null | |

### `lab_announcements`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| lab_id | uuid | FK → `labs.id` |
| title | text | |
| description | text \| null | |
| date | date \| null | |
| is_important | boolean | |
| is_visible | boolean | |

Sorted newest-first by `date`.

### `theme_faculty` / `theme_labs` (junction tables)

Many-to-many links between a research theme and `people` / `labs` — a
person or lab can belong to more than one theme, and a theme can list
multiple people/labs.

| Column | Type | Notes |
|---|---|---|
| theme_slug | text | e.g. `'human-robotics'`, `'soft-bio-robotics'`, `'field-robotics'`, `'cross-cutting'` — matches the route segment under `/research/themes/[slug]` |
| person_id | uuid | (`theme_faculty` only) FK → `people.id` |
| lab_id | uuid | (`theme_labs` only) FK → `labs.id` |

Queried via a Supabase relational select (`.select('people(*)')` /
`.select('labs(*)')`) filtered by `theme_slug`, so the page always shows the
real, current person/lab row rather than a name that can drift out of sync.

---

## Announcements

### `announcements`

Unified table for News, Events, and Admissions announcements — filtered by
`type` per page, or read in full (newest-first) for the homepage.

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| type | text | `'news'` \| `'event'` \| `'admission'` |
| title | text | |
| description | text | Markdown |
| date | date | |
| link_text | text \| null | |
| hyperlink | text \| null | |
| is_important | boolean | |
| image_urls | text[] \| null | Shown as a thumbnail on Event cards and a gallery in the modal |
| is_visible | boolean | |

---

## Admissions

### `admission_sections`

One row per content block on the Admissions page (Important Announcements,
Selection Schedule, etc.).

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| title | text | |
| body_markdown | text | Markdown |
| display_order | int \| null | |
| is_visible | boolean | |
| updated_at | timestamptz | Drives the page's "Last updated" label (max across all rows) |

### `admission_links`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| label | text | |
| href | text | |
| display_order | int \| null | |
| is_visible | boolean | |

---

## M.Tech Programme (`/academics/mtech`)

### `mtech_sections`

Prose content blocks — multiple rows can share a `section_key` (e.g. all
five "Why Choose JRB" sub-sections).

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| section_key | text | `'overview'` \| `'outcomes'` \| `'why-jrb'` \| `'electives-intro'` \| `'projects-intro'` |
| title | text \| null | Sub-heading, used by `'why-jrb'` rows only |
| body_markdown | text | Markdown |
| display_order | int \| null | |
| is_visible | boolean | |

### `mtech_credit_categories`

The Curriculum Structure summary table.

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| category | text | e.g. "Programme Core" |
| description | text | |
| credits | int | |
| display_order | int \| null | |
| is_visible | boolean | |

### `mtech_courses`

Single flat table backing three different views at once — the standalone
Core Courses table, the standalone Projects table, and the Semester-wise
Plan — filtered by `category` and grouped by `semester` respectively, so all
three stay in sync from one source.

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| code | text \| null | |
| title | text | |
| category | text | `'core'` \| `'project'` \| `'elective_slot'` \| `'open_category'` |
| semester | text \| null | `'Semester I'` … `'Semester IV'`, `'Winter Break'`, `'Summer Term'` |
| l | int \| null | Lecture hours |
| t | int \| null | Tutorial hours |
| p | int \| null | Practical hours |
| credits | int | |
| is_break_component | boolean | Drives the amber accordion accent for Winter Break / Summer Term |
| display_order | int \| null | |
| is_visible | boolean | |

### `mtech_specializations`

Icon + title + description cards under "Areas of Specialization".

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| title | text | |
| description | text | |
| icon | text | lucide-react icon name |
| display_order | int \| null | |
| is_visible | boolean | |

> **Note:** a `mtech_career_pathways` table (same shape as
> `mtech_specializations`) was created earlier in this project's history but
> the Career Pathways section was subsequently removed from the page by
> design — the table may still exist in Supabase but nothing reads from it.

---

## IDSR / Minor Degree (`/academics/minor`)

The route is `/academics/minor`, but the page itself covers the
Interdisciplinary Specialization in Robotics (IDSR) — an undergraduate
programme, not a postgraduate minor. (The Navbar's link label for this route
is worth double-checking against that.)

### `idsr_sections`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| section_key | text | `'overview'` \| `'learning-approach'` |
| body_markdown | text | Markdown |
| display_order | int \| null | |
| is_visible | boolean | |

### `idsr_curriculum_structure`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| component | text | |
| description | text | |
| is_highlighted | boolean | `true` for the "Total Credits" row |
| display_order | int \| null | |
| is_visible | boolean | |

### `idsr_core_courses`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| course | text | |
| code | text \| null | |
| ltp | text \| null | e.g. `'3-0-0'` |
| credits | int \| null | |
| display_order | int \| null | |
| is_visible | boolean | |

### `idsr_electives`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| label | text | |
| display_order | int \| null | |
| is_visible | boolean | |

---

## Industry & Partnerships (`/industry`)

### `industry_tiers`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| tier_number | text | e.g. `'Tier 1'` |
| title | text | |
| icon | text | lucide-react icon name |
| items | text[] | Bullet list |
| display_order | int \| null | |
| is_visible | boolean | |

> Content here is currently placeholder/illustrative — see the README's
> known-gaps section.

### `collaborators`

Backs both the Industry page and the homepage's `Collaborators` marquee
(same component, reused).

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| name | text \| null | Nullable — the 13 seeded logo files don't have confirmed company names attached yet |
| logo_url | text | Static file path under `/Assets/collab_logos/`, not Supabase Storage |
| website_url | text \| null | |
| display_order | int \| null | |
| is_visible | boolean | |

---

## Access Control

RLS is enabled on every table below with a public `select`-only policy —
never `insert`/`update`/`delete` for the anon key. All writes happen through
the authenticated Supabase Dashboard.

| Table | Public read | Admin |
|---|---|---|
| people | Read all | Full CRUD |
| labs | Read all | Full CRUD |
| lab_images | Read all | Full CRUD |
| lab_announcements | Read where `is_visible = true` | Full CRUD |
| theme_faculty / theme_labs | Read all | Full CRUD |
| announcements | Read where `is_visible = true` | Full CRUD |
| admission_sections / admission_links | Read where `is_visible = true` | Full CRUD |
| mtech_* (all 4 tables) | Read where `is_visible = true` | Full CRUD |
| idsr_* (all 4 tables) | Read where `is_visible = true` | Full CRUD |
| industry_tiers / collaborators | Read where `is_visible = true` | Full CRUD |

---

## Edge Functions

### `send-contact-email`

Receives a submission from both the general `/contact` form and the
Industry page's collaboration form, and emails it via Resend.

**Required secrets** (Edge Functions → Secrets in the Supabase Dashboard):

| Secret | Notes |
|---|---|
| `RESEND_API_KEY` | From resend.com → API Keys |
| `CONTACT_RECIPIENT_EMAIL` | The address Resend delivers to. Swappable via the secret alone — no redeploy needed |

Deploy with:

```bash
supabase functions deploy send-contact-email
```