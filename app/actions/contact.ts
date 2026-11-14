'use server';

import { headers } from 'next/headers';
import { getPublicSupabase } from '@/lib/supabase';

export interface ContactState {
  status: 'idle' | 'success' | 'error';
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Very small in-memory limiter. It resets on each server restart and is not shared
// between instances. Replace with a shared store (e.g. Upstash or a Supabase table) before scaling.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: pretend success so bots do not learn they were caught.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { status: 'success', message: 'ඔබගේ පණිවිඩය ලැබුණි. ස්තූතියි!' };
  }

  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return { status: 'error', message: 'ඉතා වේගයෙන් පණිවිඩ යවයි. කරුණාකර මිනිත්තු කිහිපයකින් නැවත උත්සාහ කරන්න.' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (name.length < 2 || name.length > 80) {
    return { status: 'error', message: 'නම අක්ෂර 2 — 80 අතර විය යුතුය.' };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: 'error', message: 'වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න.' };
  }
  if (message.length < 10 || message.length > 2000) {
    return { status: 'error', message: 'පණිවිඩය අක්ෂර 10 — 2000 අතර විය යුතුය.' };
  }

  const supabase = getPublicSupabase();
  if (!supabase) {
    return {
      status: 'error',
      message: 'සම්බන්ධ වීමේ පද්ධතිය තවම වින්‍යාස කර නැත. පසුව නැවත උත්සාහ කරන්න.',
    };
  }

  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    message,
    user_agent: (h.get('user-agent') ?? '').slice(0, 300),
  });

  if (error) {
    // Log the server-side detail, but show the visitor only a generic message.
    console.error('contact insert failed', error.message);
    return { status: 'error', message: 'පණිවිඩය යැවීමට නොහැකි විය. කරුණාකර පසුව උත්සාහ කරන්න.' };
  }

  return { status: 'success', message: 'ඔබගේ පණිවිඩය ලැබුණි. ඉක්මනින් පිළිතුරු දෙන්නෙමු.' };
}
