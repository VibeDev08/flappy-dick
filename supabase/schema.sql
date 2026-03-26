create table if not exists public.leaderboard_entries (
  id text primary key,
  name text not null,
  score integer not null check (score >= 0),
  character_id text not null check (character_id in ('ivory-twin', 'onyx-twin')),
  created_at timestamptz not null default now()
);

create table if not exists public.used_run_tokens (
  token_id text primary key,
  used_at timestamptz not null default now()
);

create index if not exists leaderboard_entries_score_created_idx
  on public.leaderboard_entries (score desc, created_at asc);
