-- Phase 2 migration: profile creation on sign-up, chapter bookmarks, author name helper.
-- Run after supabase/schema.sql.

-- ---------- Create a profile automatically when someone signs up ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  uname text;
begin
  uname := lower(coalesce(new.raw_user_meta_data->>'username', ''));
  if uname !~ '^[a-z0-9_]{3,30}$' then
    uname := 'reader_' || substr(replace(new.id::text, '-', ''), 1, 10);
  end if;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    uname,
    left(coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), uname), 80)
  )
  on conflict (id) do nothing;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Chapter bookmarks (per user) ----------
create table if not exists public.chapter_bookmarks (
  user_id uuid references public.profiles(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

alter table public.chapter_bookmarks enable row level security;
create policy "chapter bookmarks: own" on public.chapter_bookmarks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Show the author's display name on public story pages ----------
-- Exposes only display_name, through the public_profiles view that already hides private fields.
alter table public.stories
  add constraint stories_author_id_fkey_profiles
  foreign key (author_id) references public.profiles(id) on delete set null
  not valid;

create index if not exists chapter_bookmarks_user_idx on public.chapter_bookmarks (user_id);
create index if not exists reading_progress_user_idx on public.reading_progress (user_id, updated_at desc);
