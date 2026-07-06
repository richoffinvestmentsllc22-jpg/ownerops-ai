# OwnerOps AI

OwnerOps AI is a SaaS MVP for small service business owners. It combines a business profile, industry packs, lead management, a sales pipeline, task follow-ups, pricing references, outreach scripts, and future AI prompt templates.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase database/auth-ready schema
- Local browser storage fallback for demo use before Supabase is connected

## MVP Features

- Business profile with industry pack selection
- Dashboard with leads, open opportunities, follow-ups due, estimated revenue, and tasks due
- CRUD screens for leads, customers, opportunities, tasks, service pricing, outreach templates, and AI prompt templates
- Industry pack library for trades, trucking, tax preparers, creative/design businesses, transportation, beauty, real estate, and local services
- Construction estimator for quantity, labor, materials, overhead, contingency, and target margin
- Operator tools for quote starters, profit checks, and pre-send trust checklists
- Before-and-after proof library for saving project photos and copy-ready client messages
- Image compression for saved proof photos
- Print/PDF quote export from the estimator
- English, Spanish, French, and Portuguese client-facing quote/proof messages
- Account/data readiness page for Supabase login and cloud storage setup
- Supabase SQL schema with row level security policies

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm dev
```

Open `http://localhost:3000`.

If you prefer npm, `npm install` and `npm run dev` also work; pnpm is the locked setup in this repo.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and anon key:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The current MVP uses local browser storage for an immediately usable demo. The schema and Supabase client are included so the next build step can swap local CRUD persistence for authenticated Supabase reads/writes.

## Database Tables

- `business_profiles`
- `customers`
- `leads`
- `opportunities`
- `tasks`
- `service_pricing`
- `outreach_templates`
- `ai_prompt_templates`

## Suggested Next Steps

- Add Supabase auth screens.
- Replace local storage mutations with Supabase CRUD calls.
- Add Airtable import/export after Supabase persistence is stable.
- Connect AI prompt templates to model-backed generation for coaching, pricing, and scripts.
