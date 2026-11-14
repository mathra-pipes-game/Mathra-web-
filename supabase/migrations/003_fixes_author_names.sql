-- Phase 2 fix-up. Run after 002_auth_and_reader.sql.

-- 1. Remove the duplicate constraint added in 002 (the author foreign key already exists from schema.sql).
alter table public.stories drop constraint if exists stories_author_id_fkey_profiles;

-- 2. Let anyone read public profile fields so story pages can show the author's display name.
--    profiles holds no email or secrets (email lives in auth.users), but bio is user-written text,
--    so keep the public surface to the columns listed in the public_profiles view.
drop policy if exists "profiles: public read" on public.profiles;
create policy "profiles: public read" on public.profiles for select using (true);
