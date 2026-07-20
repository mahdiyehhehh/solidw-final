-- Module 3: Business Workspace
-- One business profile per authenticated user. RLS ensures a user can
-- only ever see or modify the business row that belongs to them.

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,

  name text not null,
  category text not null,
  description text,

  contact_email text,
  contact_phone text,

  address text,
  city text not null,
  country text not null,

  logo_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint businesses_name_length
    check (char_length(name) between 2 and 80),
  constraint businesses_description_length
    check (description is null or char_length(description) <= 600),
  constraint businesses_contact_required
    check (contact_email is not null or contact_phone is not null)
);

comment on table public.businesses is
  'One business profile per authenticated user (Module 3: Business Workspace).';

create index if not exists businesses_user_id_idx on public.businesses (user_id);

-- Keep updated_at current on every row update. Shared helper — safe to
-- reuse for future tables that need the same behavior.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
  before update on public.businesses
  for each row
  execute function public.set_updated_at();

-- Row Level Security --------------------------------------------------

alter table public.businesses enable row level security;

create policy "Users can view their own business"
  on public.businesses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own business"
  on public.businesses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own business"
  on public.businesses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own business"
  on public.businesses for delete
  using (auth.uid() = user_id);
