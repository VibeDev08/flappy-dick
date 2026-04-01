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

alter table public.leaderboard_entries enable row level security;
alter table public.used_run_tokens enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leaderboard_entries'
      and policyname = 'service_role_full_access_leaderboard_entries'
  ) then
    create policy service_role_full_access_leaderboard_entries
      on public.leaderboard_entries
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'used_run_tokens'
      and policyname = 'service_role_full_access_used_run_tokens'
  ) then
    create policy service_role_full_access_used_run_tokens
      on public.used_run_tokens
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end
$$;

create index if not exists leaderboard_entries_score_created_idx
  on public.leaderboard_entries (score desc, created_at asc);
