-- Module 4: Customer Booking MVP
-- Adds business slugs (public URLs), a services table (owner-managed
-- offerings) and an appointments table (public booking submissions).

-- 1. Business slugs ----------------------------------------------------

alter table public.businesses
  add column if not exists slug text;

create or replace function public.slugify(input text)
returns text
language plpgsql
immutable
as $$
declare
  result text;
begin
  result := lower(trim(input));
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '(^-+)|(-+$)', '', 'g');
  if result is null or result = '' then
    result := 'business';
  end if;
  return result;
end;
$$;

-- Backfill any existing rows with a unique slug derived from their name.
-- (Safe no-op on a fresh database with no businesses yet.)
with numbered as (
  select
    id,
    name,
    row_number() over (partition by public.slugify(name) order by created_at) as rn
  from public.businesses
  where slug is null
)
update public.businesses b
set slug = case
  when n.rn = 1 then public.slugify(b.name)
  else public.slugify(b.name) || '-' || n.rn
end
from numbered n
where b.id = n.id;

-- Reserved path segments that already resolve to app routes — a business
-- can never end up with one of these as its public slug.
create or replace function public.set_business_slug()
returns trigger
language plpgsql
as $$
declare
  reserved constant text[] := array[
    'dashboard', 'login', 'signup', 'auth', 'api',
    'favicon.ico', 'robots.txt', 'sitemap.xml', 'book'
  ];
  base_slug text;
  candidate text;
  suffix int := 1;
begin
  -- Only assign a slug on creation. Slugs are permalinks — once a
  -- business page is shared, its URL must not shift under it, so a
  -- later name change never re-triggers slug generation.
  if new.slug is not null and length(trim(new.slug)) > 0 then
    return new;
  end if;

  base_slug := public.slugify(new.name);
  if base_slug = any(reserved) then
    base_slug := base_slug || '-biz';
  end if;

  candidate := base_slug;
  while exists (
    select 1 from public.businesses
    where slug = candidate
      and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) loop
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists businesses_set_slug on public.businesses;
create trigger businesses_set_slug
  before insert on public.businesses
  for each row
  execute function public.set_business_slug();

alter table public.businesses
  alter column slug set not null;

alter table public.businesses
  drop constraint if exists businesses_slug_length;
alter table public.businesses
  add constraint businesses_slug_length check (char_length(slug) between 1 and 100);

alter table public.businesses
  drop constraint if exists businesses_slug_unique;
alter table public.businesses
  add constraint businesses_slug_unique unique (slug);

-- Public visitors need to be able to open a business's page by slug.
-- Business profile fields aren't sensitive (they're storefront info by
-- design), so this simply opens select up to everyone; owner-only
-- write access is unchanged below.
drop policy if exists "Anyone can view businesses" on public.businesses;
create policy "Anyone can view businesses"
  on public.businesses for select
  to anon, authenticated
  using (true);

-- The original owner-only select policy is now redundant (subsumed by
-- the public one above) but reads are cheap and harmless to leave —
-- however, having both is confusing, so drop the old, narrower one.
drop policy if exists "Users can view their own business" on public.businesses;


-- 2. Services -----------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,

  name text not null,
  description text,
  duration_minutes integer not null,
  price numeric(10, 2) not null,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint services_name_length check (char_length(name) between 2 and 100),
  constraint services_description_length check (
    description is null or char_length(description) <= 500
  ),
  constraint services_duration_range check (
    duration_minutes > 0 and duration_minutes <= 1440
  ),
  constraint services_price_nonnegative check (price >= 0)
);

comment on table public.services is
  'Bookable offerings for a business (Module 4: Customer Booking MVP).';

create index if not exists services_business_id_idx on public.services (business_id);
create index if not exists services_business_active_idx
  on public.services (business_id, is_active);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();

alter table public.services enable row level security;

-- Public visitors can see active services on a business's public page.
create policy "Anyone can view active services"
  on public.services for select
  to anon, authenticated
  using (is_active = true);

-- Owners can see all of their own services, including disabled ones,
-- from their dashboard.
create policy "Business owners can view all their services"
  on public.services for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = services.business_id and b.user_id = auth.uid()
    )
  );

create policy "Business owners can create services"
  on public.services for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.user_id = auth.uid()
    )
  );

create policy "Business owners can update their services"
  on public.services for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = services.business_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.user_id = auth.uid()
    )
  );

create policy "Business owners can delete their services"
  on public.services for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = services.business_id and b.user_id = auth.uid()
    )
  );


-- 3. Appointments (booking submissions) ---------------------------------

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete restrict,

  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  notes text,

  appointment_date date not null,
  appointment_time time not null,

  status text not null default 'pending',

  created_at timestamptz not null default now(),

  constraint appointments_customer_name_length check (
    char_length(customer_name) between 2 and 100
  ),
  constraint appointments_customer_phone_length check (
    char_length(customer_phone) between 5 and 30
  ),
  constraint appointments_notes_length check (
    notes is null or char_length(notes) <= 500
  ),
  constraint appointments_status_valid check (
    status in ('pending', 'confirmed', 'cancelled', 'completed')
  )
);

comment on table public.appointments is
  'Customer booking submissions (Module 4: Customer Booking MVP). No '
  'management UI yet — that is Module 5.';

create index if not exists appointments_business_id_idx on public.appointments (business_id);
create index if not exists appointments_service_id_idx on public.appointments (service_id);
create index if not exists appointments_date_idx on public.appointments (business_id, appointment_date);

alter table public.appointments enable row level security;

-- Anyone (including signed-out customers) can submit a booking, as long
-- as the service they picked is real, active, and actually belongs to
-- the business they're booking with.
create policy "Anyone can submit a booking"
  on public.appointments for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.services s
      where s.id = service_id
        and s.business_id = appointments.business_id
        and s.is_active = true
    )
  );

-- Only the business owner can read their bookings. No management UI
-- consumes this yet (Module 5), but the policy is in place so the data
-- is never exposed beyond its owner.
create policy "Business owners can view their bookings"
  on public.appointments for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = appointments.business_id and b.user_id = auth.uid()
    )
  );
