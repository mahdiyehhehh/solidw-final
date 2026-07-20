# SolidW

Businesses create their own booking website. Customers book through
WhatsApp or Telegram. No payments inside booking pages. Every page belongs
entirely to the business — SolidW is never shown on it.

## Getting started

```bash
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY /
# SUPABASE_SERVICE_ROLE_KEY from your Supabase project settings
npm run dev
```

Open http://localhost:3000.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4 (CSS-native theme — see `app/globals.css`)
- Framer Motion
- Supabase (auth + database, wired in `lib/supabase/*`)

## Project structure

See the module explanation delivered alongside this codebase for a full
breakdown of every file. In short:

- `app/` — routes, layouts, SEO files
- `app/(auth)/login`, `app/(auth)/signup` — sign in / sign up pages
- `app/auth/callback` — exchanges the email confirmation code for a session
- `app/dashboard` — protected workspace: home, onboarding, business settings
- `components/ui/` — shared design-system primitives (Button, GlassCard,
  Container, SectionHeading, Input, Select, Textarea, Skeleton, EmptyState)
- `components/auth/` — login form, signup form, logout button
- `components/business/` — business onboarding/settings form, logo placeholder
- `components/dashboard/` — sidebar nav, mobile drawer shell, nav icons
- `lib/` — fonts, the `cn()` class helper, Supabase clients, Database types
- `lib/auth/` — auth server actions (`lib/auth/actions.ts`)
- `lib/business/` — business categories, types, queries, server actions
- `supabase/migrations/` — SQL schema + RLS policies
- `middleware.ts` — refreshes the Supabase session on every request and
  redirects based on auth state (signed-out users are bounced from
  `/dashboard` to `/login`; signed-in users are bounced from `/login` and
  `/signup` to `/dashboard`)

## Authentication (Module 2)

Email/password auth via Supabase, using Next.js Server Actions:

- **Sign up** (`/signup`) creates the account and sends a confirmation
  email (`emailRedirectTo` points at `/auth/callback`).
- **Log in** (`/login`) signs in and redirects to `/dashboard` (or the
  `next` param middleware attaches when it bounces an unauthenticated
  visitor).
- **Log out** is a zero-JS form that posts to a server action.
- **Session handling** is entirely cookie-based via `@supabase/ssr`,
  refreshed on every request in `middleware.ts`.

To test signup email confirmation locally, make sure your Supabase
project's Auth settings have `http://localhost:3000/auth/callback` (and
your production origin) listed under **Redirect URLs**.

## Business Workspace (Module 3)

Every account gets exactly one business profile, stored in the
`businesses` table (`supabase/migrations/20260719120000_create_businesses_table.sql`).
Row Level Security means the anon/authenticated Supabase client already
in use (no service role key needed) can only ever read or write the row
matching `auth.uid()`.

**Apply the migration** before using this module — either paste the SQL
file into Supabase Dashboard → SQL Editor → run, or, if you have the
Supabase CLI linked to this project:

```bash
supabase db push
```

**Routes:**

- `/dashboard` — overview of the business profile, or an empty-state
  prompt to start onboarding if none exists yet
- `/dashboard/onboarding` — one-time setup form (redirects to `/dashboard`
  if a business already exists, to avoid duplicates)
- `/dashboard/settings` — edit the existing profile (redirects to
  `/dashboard/onboarding` if nothing's been created yet)

**Fields collected:** business name, type/category (fixed list in
`lib/business/categories.ts`), description, contact email/phone (at
least one required), address/city/country, and an optional logo URL
(falls back to an initials avatar — real file upload via Supabase
Storage is a good candidate for a future module, not built here).

**Loading state:** `app/dashboard/loading.tsx` provides a skeleton shown
automatically by Next.js while any dashboard route's data is fetching.

## Customer Booking MVP (Module 4)

Adds public business pages and a no-account booking flow on top of the
Business Workspace from Module 3.

**Schema (`supabase/migrations/20260720090000_create_booking_mvp.sql`):**

- `businesses.slug` — unique public URL segment, auto-generated from the
  business name by a database trigger the first time a business is
  created. Stable across later name edits (it's a permalink). Business
  rows are now publicly readable (needed for the public page); write
  access is still owner-only.
- `services` — a business's bookable offerings (name, description,
  duration, price, `is_active`). Owners see and manage all of their own
  services; the public can only read active ones.
- `appointments` — customer booking submissions (no account required).
  Anyone can insert a booking for an active service; only the owning
  business can read its own bookings. There's no management UI for
  bookings yet — that's Module 5.

**Routes:**

- `/dashboard/services`, `/dashboard/services/new`,
  `/dashboard/services/[id]/edit` — owner-only service management
  (protected by the existing `/dashboard` middleware guard)
- `/[slug]` — public business page: logo/placeholder, name, description,
  contact details, active services, and an embedded booking form. No
  sign-in required.

**Booking form fields:** service (required), date & time (required, must
be in the future), name & phone (required), email & notes (optional).
Validated both client-side (HTML attributes) and server-side (the
`createAppointment` server action in `lib/appointments/actions.ts`),
with RLS as the final backstop.

See `DEPLOY.md` for migration and deployment steps.
