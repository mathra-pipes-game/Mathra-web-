'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServer } from '@/lib/supabase-server';

export interface ActionResult {
  ok: boolean;
  message?: string;
}

const LOGIN_FIRST: ActionResult = { ok: false, message: 'මෙය භාවිත කිරීමට ඇතුළු වන්න.' };
const NOT_LIVE: ActionResult = { ok: false, message: 'මෙම කතාව ගිණුම් ක්‍රියා සඳහා සම්බන්ධ කර නැත.' };

const isUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

async function requireUser() {
  const supabase = await createSupabaseServer();
  if (!supabase) return { supabase: null, userId: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null };
}

export async function toggleLikeAction(storyId: string, storySlug: string): Promise<ActionResult> {
  if (!isUuid(storyId)) return NOT_LIVE;
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return LOGIN_FIRST;

  const { data: existing } = await supabase
    .from('story_likes')
    .select('story_id')
    .eq('user_id', userId)
    .eq('story_id', storyId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from('story_likes').delete().eq('user_id', userId).eq('story_id', storyId)
    : await supabase.from('story_likes').insert({ user_id: userId, story_id: storyId });

  if (error) return { ok: false, message: 'ක්‍රියාව සම්පූර්ණ කළ නොහැකි විය.' };
  revalidatePath(`/stories/${storySlug}`);
  return { ok: true };
}

export async function toggleBookmarkAction(storyId: string, storySlug: string): Promise<ActionResult> {
  if (!isUuid(storyId)) return NOT_LIVE;
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return LOGIN_FIRST;

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('story_id')
    .eq('user_id', userId)
    .eq('story_id', storyId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from('bookmarks').delete().eq('user_id', userId).eq('story_id', storyId)
    : await supabase.from('bookmarks').insert({ user_id: userId, story_id: storyId });

  if (error) return { ok: false, message: 'ක්‍රියාව සම්පූර්ණ කළ නොහැකි විය.' };
  revalidatePath(`/stories/${storySlug}`);
  revalidatePath('/library');
  return { ok: true };
}

export async function toggleChapterBookmarkAction(
  chapterId: string,
  storySlug: string,
  chapterNumber: number,
): Promise<ActionResult> {
  if (!isUuid(chapterId)) return NOT_LIVE;
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return LOGIN_FIRST;

  const { data: existing } = await supabase
    .from('chapter_bookmarks')
    .select('chapter_id')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from('chapter_bookmarks').delete().eq('user_id', userId).eq('chapter_id', chapterId)
    : await supabase.from('chapter_bookmarks').insert({ user_id: userId, chapter_id: chapterId });

  if (error) return { ok: false, message: 'ක්‍රියාව සම්පූර්ණ කළ නොහැකි විය.' };
  revalidatePath(`/stories/${storySlug}/${chapterNumber}`);
  revalidatePath('/library');
  return { ok: true };
}

// Saves where the reader is. Silently does nothing for visitors who are not signed in.
export async function saveProgressAction(
  storyId: string,
  chapterNumber: number,
  percent: number,
): Promise<ActionResult> {
  if (!isUuid(storyId) || !Number.isInteger(chapterNumber) || chapterNumber < 1) return NOT_LIVE;
  const { supabase, userId } = await requireUser();
  if (!supabase || !userId) return { ok: false };

  const clamped = Math.min(100, Math.max(0, Math.round(percent * 100) / 100));
  const { error } = await supabase.from('reading_progress').upsert(
    {
      user_id: userId,
      story_id: storyId,
      last_chapter_number: chapterNumber,
      percent: clamped,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,story_id' },
  );
  return { ok: !error };
}
