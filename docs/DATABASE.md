# Database Reference

All dynamic content is stored in Supabase (Postgres). This document describes the tables, their fields, and how they relate to each other.

---

## Tables

### `hero_settings`
Stores a single row with the global mission statement shown across all hero slides.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| mission_statement | TEXT | Displayed at the top of the hero section on all slides |

> Only one row should exist in this table.

---

### `hero_slides`
Each row is one slide in the homepage hero carousel.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| image_url | TEXT | Background image of the slide |
| title | TEXT | Shown bottom-left on the slide |
| description | TEXT | Shown below the title |
| order | INT | Controls carousel sequence (ascending) |
| is_active | BOOLEAN | Inactive slides are not shown publicly |

---

### `announcements`
News and events shown on the homepage and announcements page.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | TEXT | |
| description | TEXT | |
| link_text | TEXT | Label for the hyperlink e.g. "Read more" |
| hyperlink | TEXT | URL the link points to |
| date | DATE | |
| is_important | BOOLEAN | Used to highlight urgent announcements |
| type | TEXT | `'news'` or `'event'` |
| is_visible | BOOLEAN | Hidden rows are not shown publicly |

---

### `labs`
Each row represents one lab.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | |
| category | TEXT | |
| description | TEXT | |
| location | TEXT | e.g. `'Block IV, Room 301'` |
| faculty | TEXT | Faculty lead name(s) |
| research_areas | TEXT | |

---

### `lab_images`
Images belonging to a lab.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| lab_id | UUID | Foreign key → `labs.id` |
| image_url | TEXT | |
| caption | TEXT | |
| order | INT | Controls display order |

> Deleting a lab automatically deletes all its images.

---

### `lab_announcements`
Announcements scoped to a specific lab.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| lab_id | UUID | Foreign key → `labs.id` |
| title | TEXT | |
| description | TEXT | |
| link_text | TEXT | |
| hyperlink | TEXT | |
| date | DATE | |
| is_important | BOOLEAN | |
| is_visible | BOOLEAN | Hidden rows are not shown publicly |

> Deleting a lab automatically deletes all its announcements.

---

### `people`
Single table for all roles. Role-specific fields are nullable.

| Column | Type | Applies to | Notes |
|---|---|---|---|
| id | UUID | All | Primary key |
| name | TEXT | All | |
| image_url | TEXT | All | |
| webmail | TEXT | All | |
| link | TEXT | All | Personal or profile page URL |
| role | TEXT | All | `'faculty'` `'student'` `'postdoc'` `'alumni'` |
| year | TEXT | Student, Postdoc, Alumni | e.g. `'2025-27'`, used for filtering |
| department | TEXT | Faculty | |
| office_contact | TEXT | Faculty | |
| research_interest | TEXT | Faculty | Displayed on their profile |
| focus | TEXT[] | Faculty | Keyword array used for search — not displayed publicly |

---

## Access Control

| Table | Public | Admin |
|---|---|---|
| hero_settings | Read all | Full CRUD |
| hero_slides | Read where `is_active = true` | Full CRUD |
| announcements | Read where `is_visible = true` | Full CRUD |
| labs | Read all | Full CRUD |
| lab_images | Read all | Full CRUD |
| lab_announcements | Read where `is_visible = true` | Full CRUD |
| people | Read all | Full CRUD |