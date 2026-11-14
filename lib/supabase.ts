import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Uses only the public anon key. Row Level Security in supabase/schema.sql decides what it can do.
// Returns null when the environment is not configured, so the site still builds and runs.
export function getPublicSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
