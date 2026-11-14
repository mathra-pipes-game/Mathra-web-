-- MATHRA WORLD database schema (Supabase / PostgreSQL)
-- Run in the Supabase SQL editor, or with the Supabase CLI as a migration.
-- Every table has Row Level Security (RLS) enabled. Anonymous visitors can only read published content
-- and insert contact messages. Admin and writer rights are granted through the profiles.role column.

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
create type user_role as enum ('reader', 'writer', 'moderator', 'admin');
create type content_status as enum ('draft', 'submitted', 'published', 'rejected', 'archived');
create type story_category as enum ('novel', 'love', 'mystery', 'life_lessons', 'knowledge');
create type knowledge_category as enum (
  'science', 'technology', 'history', 'sri_lankan_culture', 'life_lessons',
  'motivation', 'education', 'general_knowledge', 'interesting_facts', 'personal_development'
);
create type media_kind as enum ('photo', 'video');
create type report_status as enum ('open', 'reviewed', 'dismissed', 'actioned');

-- ---------- Profiles (one row per auth user) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text check (char_length(bio) <= 500),
  avatar_url text,
  role user_role not null default 'reader',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Stories and chapters ----------
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]{3,120}$'),
  title text not null check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 2000),
  category story_category not null,
  cover_url text,
  author_id uuid references public.profiles(id) on delete set null,
  is_demo boolean not null default false,
  status content_status not null default 'draft',
  is_featured boolean not null default false,
  publish_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  number int not null check (number >= 1),
  title text not null check (char_length(title) between 1 and 200),
  body text not null default '',
  status content_status not null default 'draft',
  publish_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (story_id, number)
);

-- Likes, bookmarks and reading progress (per user)
create table public.story_likes (
  user_id uuid references public.profiles(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, story_id)
);

create table public.bookmarks (
  user_id uuid references public.profiles(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, story_id)
);

create table public.reading_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  last_chapter_number int not null default 1,
  percent numeric(5,2) not null default 0 check (percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, story_id)
);

-- ---------- Knowledge hub ----------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]{3,120}$'),
  title text not null,
  summary text,
  body text not null default '',
  category knowledge_category not null,
  cover_url text,
  author_id uuid references public.profiles(id) on delete set null,
  is_demo boolean not null default false,
  status content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Photo and video community ----------
create table public.media_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  kind media_kind not null,
  file_url text not null,
  thumbnail_url text,
  caption text check (char_length(caption) <= 1000),
  category knowledge_category,
  status content_status not null default 'submitted',
  created_at timestamptz not null default now()
);

create table public.media_likes (
  user_id uuid references public.profiles(id) on delete cascade,
  media_id uuid references public.media_posts(id) on delete cascade,
  primary key (user_id, media_id)
);

-- ---------- Comments and reports ----------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  media_id uuid references public.media_posts(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  check ((story_id is not null)::int + (media_id is not null)::int = 1)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_comment_id uuid references public.comments(id) on delete cascade,
  target_media_id uuid references public.media_posts(id) on delete cascade,
  target_story_id uuid references public.stories(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 500),
  status report_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ---------- Contact messages (anonymous insert, admin read) ----------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 5 and 254),
  message text not null check (char_length(message) between 10 and 2000),
  user_agent text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Site settings and homepage content ----------
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- Helper: current user's role ----------
create or replace function public.current_role_name()
returns user_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.chapters enable row level security;
alter table public.story_likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reading_progress enable row level security;
alter table public.articles enable row level security;
alter table public.media_posts enable row level security;
alter table public.media_likes enable row level security;
alter table public.comments enable row level security;
alter table public.reports enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- Profiles: public read of safe fields only (use a view for public profiles, see below). Users edit their own row.
create policy "profiles: own read" on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Stories: anyone reads published; authors read/write their own; admins manage all.
create policy "stories: public read published" on public.stories for select
  using (status = 'published' and (publish_at is null or publish_at <= now()));
create policy "stories: author manage own" on public.stories for all
  using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "stories: admin manage all" on public.stories for all
  using (public.current_role_name() = 'admin') with check (public.current_role_name() = 'admin');

-- Chapters: readable when the chapter and its story are published.
create policy "chapters: public read published" on public.chapters for select
  using (
    status = 'published' and (publish_at is null or publish_at <= now())
    and exists (select 1 from public.stories s where s.id = story_id and s.status = 'published')
  );
create policy "chapters: author manage own" on public.chapters for all
  using (exists (select 1 from public.stories s where s.id = story_id and s.author_id = auth.uid()))
  with check (exists (select 1 from public.stories s where s.id = story_id and s.author_id = auth.uid()));
create policy "chapters: admin manage all" on public.chapters for all
  using (public.current_role_name() = 'admin') with check (public.current_role_name() = 'admin');

-- Personal data: only the owner can see or change it.
create policy "likes: own" on public.story_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bookmarks: own" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress: own" on public.reading_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "media likes: own" on public.media_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Articles: public read published.
create policy "articles: public read published" on public.articles for select using (status = 'published');
create policy "articles: admin manage" on public.articles for all
  using (public.current_role_name() = 'admin') with check (public.current_role_name() = 'admin');

-- Media: public read approved; authors manage their own; admins manage all.
create policy "media: public read published" on public.media_posts for select using (status = 'published');
create policy "media: author manage own" on public.media_posts for all
  using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "media: admin manage all" on public.media_posts for all
  using (public.current_role_name() = 'admin') with check (public.current_role_name() = 'admin');

-- Comments: public read visible; logged-in users add their own; authors may delete their own.
create policy "comments: public read visible" on public.comments for select using (is_hidden = false);
create policy "comments: user insert own" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments: author delete own" on public.comments for delete using (auth.uid() = author_id);
create policy "comments: moderator hide" on public.comments for update
  using (public.current_role_name() in ('moderator', 'admin'))
  with check (public.current_role_name() in ('moderator', 'admin'));

-- Reports: anyone signed in can file; only moderators and admins can read.
create policy "reports: user insert" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "reports: moderator read" on public.reports for select
  using (public.current_role_name() in ('moderator', 'admin'));
create policy "reports: moderator update" on public.reports for update
  using (public.current_role_name() in ('moderator', 'admin'))
  with check (public.current_role_name() in ('moderator', 'admin'));

-- Contact: anonymous and signed-in visitors may insert; only admins may read.
create policy "contact: public insert" on public.contact_messages for insert with check (true);
create policy "contact: admin read" on public.contact_messages for select
  using (public.current_role_name() = 'admin');
create policy "contact: admin update" on public.contact_messages for update
  using (public.current_role_name() = 'admin') with check (public.current_role_name() = 'admin');

-- Site settings: public read; admins write.
create policy "settings: public read" on public.site_settings for select using (true);
create policy "settings: admin write" on public.site_settings for all
  using (public.current_role_name() = 'admin') with check (public.current_role_name() = 'admin');

-- Public profile view: exposes only non-private fields. Never expose email or auth data.
create view public.public_profiles as
  select id, username, display_name, bio, avatar_url, created_at
  from public.profiles;
grant select on public.public_profiles to anon, authenticated;

-- ---------- Keep updated_at fresh ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger trg_stories_updated before update on public.stories
  for each row execute function public.touch_updated_at();
create trigger trg_chapters_updated before update on public.chapters
  for each row execute function public.touch_updated_at();
create trigger trg_articles_updated before update on public.articles
  for each row execute function public.touch_updated_at();

-- ---------- Protect role changes: only admins can change roles ----------
-- The own-update policy above already blocks role edits from the client. This trigger adds a second guard.
create or replace function public.guard_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and public.current_role_name() is distinct from 'admin' then
    raise exception 'Only administrators can change user roles';
  end if;
  return new;
end $$;

create trigger trg_guard_role before update on public.profiles
  for each row execute function public.guard_role_change();

-- ---------- Indexes ----------
create index stories_status_published_idx on public.stories (status, published_at desc);
create index stories_author_idx on public.stories (author_id);
create index chapters_story_idx on public.chapters (story_id, number);
create index articles_category_idx on public.articles (category, published_at desc);
create index media_status_created_idx on public.media_posts (status, created_at desc);
create index comments_story_idx on public.comments (story_id, created_at);
create index comments_media_idx on public.comments (media_id, created_at);
create index contact_created_idx on public.contact_messages (created_at desc);
