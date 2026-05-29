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

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full guide on:
- Branch and PR workflow
- Code style conventions
- How to report issues