-- Run once in the Supabase SQL editor.
-- Fake sleepless nights, written now and then so the free project never looks idle.
create table public.insomnia (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reason text not null,
  sheep_counted integer not null,
  next_due_at timestamptz not null
);

create index insomnia_created_at_idx on public.insomnia (created_at desc);

-- Only the secret key (server-side, bypasses RLS) ever touches this table.
alter table public.insomnia enable row level security;
revoke all on public.insomnia from anon, authenticated;
