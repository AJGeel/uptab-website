-- Run once in the Supabase SQL editor.
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (category in ('bug', 'idea', 'praise', 'other')),
  rating smallint check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 2000),
  email text check (char_length(email) <= 254),
  version text check (char_length(version) <= 32),
  user_agent text check (char_length(user_agent) <= 300)
);

create index feedback_created_at_idx on public.feedback (created_at desc);

-- RLS is on and everything is revoked, then anon gets exactly one thing back:
-- inserting the six columns a visitor fills in (not id or created_at). The
-- publishable key can't read, update or delete, so leaking it only allows spam.
-- Reading uses the secret key on the server, which bypasses RLS.
alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;
grant insert (category, rating, message, email, version, user_agent) on public.feedback to anon;
create policy "Anyone can send feedback" on public.feedback for insert to anon with check (true);
