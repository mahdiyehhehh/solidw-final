# Deploying SolidW (Module 4: Customer Booking MVP)

This module adds business slugs, services, and a public booking flow on
top of the existing Foundation / Authentication / Business Workspace
modules. No new dependencies were introduced — same stack as before.

## 1. Environment variables

Same three variables as prior modules — nothing new to add for this
module. Set these in `.env.local` for local dev and in your Vercel
project settings for deployment:

| Variable                          | Where to find it                                         |
| ---------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`         | Supabase Dashboard → Project Settings → API                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | Supabase Dashboard → Project Settings → API                |
| `SUPABASE_SERVICE_ROLE_KEY`        | Supabase Dashboard → Project Settings → API (server-only — never expose to the client or commit it) |

```bash
cp .env.local.example .env.local
# fill in the three values above
```

## 2. Supabase migration steps

This module ships one new migration:
`supabase/migrations/20260720090000_create_booking_mvp.sql`. It:

- Adds a unique `slug` column to `businesses` (auto-generated from the
  business name by a trigger — nothing to change in the app to use it)
  and opens read access to businesses publicly (needed for the public
  booking page).
- Creates the `services` table (owner-managed, RLS-scoped to the
  owning business) with public read access to active services only.
- Creates the `appointments` table (public can insert a booking request
  for an active service; only the owning business can read its own
  bookings — there's no read/management UI for this yet, that's
  Module 5).

**Option A — Supabase CLI (recommended):**

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

**Option B — SQL editor:**

Open the Supabase Dashboard → SQL Editor, paste the contents of
`supabase/migrations/20260720090000_create_booking_mvp.sql`, and run
it. (If this is a fresh project that hasn't run the Module 3 migration
yet, run `20260719120000_create_businesses_table.sql` first — this
migration depends on the `businesses` table and its `set_updated_at()`
helper function already existing.)

After migrating, regenerate types if you use the Supabase CLI's
codegen instead of the hand-written `lib/supabase/database.types.ts`:

```bash
supabase gen types typescript --linked > lib/supabase/database.types.ts
```

## 3. Verify locally

```bash
npm install
npm run dev
```

- Sign in, set up a business (or use an existing one) — it now gets a
  slug automatically. Check `/dashboard/services` to add a service.
- Visit `/<your-business-slug>` in an incognito window (signed out) and
  submit a test booking.

## 4. Vercel deployment steps

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New Project** → import the repo.
3. Framework preset: Next.js (auto-detected).
4. Add the three environment variables from step 1 under **Project
   Settings → Environment Variables** (apply to Production, Preview,
   and Development as needed).
5. Deploy.
6. In Supabase → Authentication → URL Configuration, add your Vercel
   deployment URL (and any preview URLs you use) to the allowed redirect
   URLs so auth/email flows keep working.

## What's intentionally not in this module

Per the Module 4 scope: no appointment management dashboard, no status
updates, no notifications, no payments, no subscriptions, no analytics,
no calendar integrations. The `appointments` table and its owner-read
RLS policy are in place so Module 5 can build directly on top without
another migration for the core data model.
