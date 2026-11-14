import { createSupabaseServer } from './supabase-server';

export interface CurrentUser {
  id: string;
  email: string | undefined;
  username: string;
  displayName: string;
  role: 'reader' | 'writer' | 'moderator' | 'admin';
}

// Returns the signed-in user and profile, or null. Never throws for visitors.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    username: profile?.username ?? 'reader',
    displayName: profile?.display_name ?? 'පාඨකයා',
    role: (profile?.role as CurrentUser['role']) ?? 'reader',
  };
}

// Only allow relative in-site redirects, to block open-redirect attacks.
export function safeNextPath(value: FormDataEntryValue | string | null | undefined): string {
  const v = typeof value === 'string' ? value : '';
  if (!v.startsWith('/') || v.startsWith('//') || v.includes('\\')) return '/library';
  return v;
}
