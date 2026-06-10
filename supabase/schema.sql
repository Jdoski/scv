-- Free agent board table for scvdig.com
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

create table if not exists public.free_agents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 80),
  email text not null check (char_length(email) <= 120),
  division text not null check (char_length(division) <= 40),
  play_date date not null,
  note text check (char_length(note) <= 500)
);

alter table public.free_agents enable row level security;

-- Anyone can read the board.
create policy "Public read access"
  on public.free_agents for select
  using (true);

-- Anyone can post to the board (validation happens in the app).
create policy "Public insert access"
  on public.free_agents for insert
  with check (true);

-- Note: no public update/delete — remove posts via the Supabase dashboard
-- (Table Editor -> free_agents) if you ever need to moderate.
