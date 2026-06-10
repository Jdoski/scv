-- Database schema for scvdig.com
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- Safe to run multiple times, including on a database created from an
-- earlier version of this file (it migrates the old columns).

-- ============ Free agent board ============
create table if not exists public.free_agents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 80),
  email text not null check (char_length(email) <= 120),
  divisions text[] not null default '{}',
  play_date date not null
);

-- Migrations from earlier versions of this schema.
alter table public.free_agents drop column if exists note;
alter table public.free_agents drop column if exists division;
alter table public.free_agents add column if not exists divisions text[] not null default '{}';

-- Hashed passcode chosen by the poster, used to remove their own entry.
alter table public.free_agents drop column if exists delete_token;
alter table public.free_agents add column if not exists passcode_hash text not null default '';

-- Keep the passcode hash private: the public API roles can read every column
-- EXCEPT passcode_hash. (The app's queries list columns explicitly for this.)
revoke select on public.free_agents from anon, authenticated;
grant select (id, created_at, name, email, divisions, play_date)
  on public.free_agents to anon, authenticated;

alter table public.free_agents enable row level security;

drop policy if exists "Public read access" on public.free_agents;
create policy "Public read access"
  on public.free_agents for select
  using (true);

drop policy if exists "Public insert access" on public.free_agents;
create policy "Public insert access"
  on public.free_agents for insert
  with check (true);

-- No public update/delete: post removal happens on the /admin page, which
-- uses the service role key and bypasses row level security.

-- ============ Tournament dates ============
-- Divisions are not stored per-tournament: the app derives them from the
-- day of week (Saturdays = Men's + Women's, Sundays = Revco).
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  play_date date not null unique
);

-- Migration from earlier versions of this schema.
alter table public.tournaments drop column if exists divisions;

alter table public.tournaments enable row level security;

drop policy if exists "Public read access" on public.tournaments;
create policy "Public read access"
  on public.tournaments for select
  using (true);

-- No public writes: tournaments are managed from /admin via the service role key.
