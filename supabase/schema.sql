-- =====================================================================
-- ArmenSTEM — Supabase schema
-- Run this once in the Supabase SQL editor on a fresh project.
-- Idempotent: safe to re-run.
-- =====================================================================

-- Required extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Table: leads (waitlist captures)
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  email         text        not null,
  nom           text        not null,
  classe        text        not null,
  matiere       text,
  source_utm    text,
  created_at    timestamptz not null default now()
);

create index if not exists leads_email_idx       on public.leads (email);
create index if not exists leads_created_at_idx  on public.leads (created_at desc);

-- ---------------------------------------------------------------------
-- Table: trial_bookings (10€ trial bookings)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'trial_booking_status') then
    create type public.trial_booking_status as enum ('pending', 'confirmed', 'cancelled', 'refunded');
  end if;
end$$;

create table if not exists public.trial_bookings (
  id                  uuid primary key default gen_random_uuid(),
  email               text        not null,
  nom                 text        not null,
  classe              text        not null,
  matiere             text        not null,
  prof_souhaite       text,
  creneau_souhaite    text,
  stripe_session_id   text unique,
  status              public.trial_booking_status not null default 'pending',
  created_at          timestamptz not null default now()
);

create index if not exists trial_bookings_email_idx       on public.trial_bookings (email);
create index if not exists trial_bookings_status_idx      on public.trial_bookings (status);
create index if not exists trial_bookings_created_at_idx  on public.trial_bookings (created_at desc);

-- ---------------------------------------------------------------------
-- Row Level Security
-- The API routes use the service-role key, which bypasses RLS. RLS is
-- still enabled and explicitly denies anon/auth roles to ensure that
-- a leaked anon key cannot read the contents of these tables.
-- ---------------------------------------------------------------------
alter table public.leads          enable row level security;
alter table public.trial_bookings enable row level security;

-- No policies = total denial for anon and authenticated roles. The
-- service_role bypasses RLS, so server-side inserts continue to work.
