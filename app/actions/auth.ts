'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';
import { safeNextPath } from '@/lib/auth';

export interface AuthState {
  status: 'idle' | 'error' | 'info';
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

const NOT_CONFIGURED: AuthState = {
  status: 'error',
  message: 'ගිණුම් පද්ධතිය තවම වින්‍යාස කර නැත.',
};

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = safeNextPath(formData.get('next'));

  if (!EMAIL_RE.test(email) || password.length < 1) {
    return { status: 'error', message: 'ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.' };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Generic message on purpose: do not reveal whether the email exists.
    return { status: 'error', message: 'ඊමේලය හෝ මුරපදය වැරදියි.' };
  }
  redirect(next);
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get('username') ?? '').trim().toLowerCase();
  const displayName = String(formData.get('display_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!USERNAME_RE.test(username)) {
    return { status: 'error', message: 'පරිශීලක නාමය අකුරු (a-z), ඉලක්කම් සහ _ පමණක්, අක්ෂර 3–30 විය යුතුය.' };
  }
  if (displayName.length < 1 || displayName.length > 80) {
    return { status: 'error', message: 'සංදර්ශන නම අක්ෂර 1–80 අතර විය යුතුය.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න.' };
  }
  if (password.length < 8 || password.length > 72) {
    return { status: 'error', message: 'මුරපදය අක්ෂර 8–72 අතර විය යුතුය.' };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return NOT_CONFIGURED;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: displayName },
    },
  });

  if (error) {
    return { status: 'error', message: 'ගිණුම සෑදීමට නොහැකි විය. වෙනත් ඊමේලයක් හෝ පරිශීලක නාමයක් උත්සාහ කරන්න.' };
  }

  // If email confirmation is enabled in Supabase, there is no session yet.
  if (!data.session) {
    return {
      status: 'info',
      message: 'ඔබගේ ඊමේලය තහවුරු කරන්න. තහවුරු කිරීමේ සබැඳිය ඔබට එවා ඇත.',
    };
  }
  redirect('/library');
}

export async function signOutAction() {
  const supabase = await createSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  redirect('/');
}

export async function updateProfileAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const displayName = String(formData.get('display_name') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();

  if (displayName.length < 1 || displayName.length > 80) {
    return { status: 'error', message: 'සංදර්ශන නම අක්ෂර 1–80 අතර විය යුතුය.' };
  }
  if (bio.length > 500) {
    return { status: 'error', message: 'බැඳීම අක්ෂර 500 ට වඩා නොවිය යුතුය.' };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return NOT_CONFIGURED;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: 'කරුණාකර නැවත ඇතුළු වන්න.' };

  // RLS limits this update to the user's own row. Role changes are blocked by trigger.
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName, bio })
    .eq('id', user.id);

  if (error) return { status: 'error', message: 'සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න.' };
  return { status: 'info', message: 'වෙනස්කම් සුරකින ලදී.' };
}
