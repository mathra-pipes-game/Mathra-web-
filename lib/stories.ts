import { createSupabaseServer } from './supabase-server';
import {
  STORIES,
  type CategoryKey,
  type Chapter,
  type Story,
} from '@/data/sample-content';

// A story is "live" when it came from the database and can be liked, bookmarked and tracked.
export type LiveStory = Story & { id?: string };

// Maps site category keys ('life-lessons') to database enum values ('life_lessons').
const toDbCategory = (key: CategoryKey) => key.replace(/-/g, '_');
const fromDbCategory = (value: string): CategoryKey => value.replace(/_/g, '-') as CategoryKey;

// Escapes characters that have meaning in PostgREST filter syntax.
const cleanSearch = (q: string) => q.replace(/[%_,()*\\]/g, ' ').trim().slice(0, 100);

// Database body text uses blank lines between paragraphs.
const splitBody = (body: string): string[] =>
  body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

function fromRow(row: any): LiveStory {
  const chapters: Chapter[] = (row.chapters ?? [])
    .filter((c: any) => c.status === 'published')
    .sort((a: any, b: any) => a.number - b.number)
    .map((c: any) => ({ number: c.number, title: c.title, body: splitBody(c.body ?? '') }));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author?.display_name ?? 'MATHRA WORLD',
    description: row.description ?? '',
    category: fromDbCategory(row.category),
    coverGradient: 'linear-gradient(140deg, #2a0f4a, #7c3aed 60%, #3b82f6)',
    publishedAt: (row.published_at ?? row.created_at ?? '').slice(0, 10),
    likes: row.story_likes?.[0]?.count ?? 0,
    isDemo: row.is_demo === true,
    chapters,
  };
}

const STORY_SELECT =
  'id, slug, title, description, category, is_demo, published_at, created_at, ' +
  'author:profiles!stories_author_id_fkey(display_name), story_likes(count), ' +
  'chapters(number, title, body, status)';

export async function listStories(opts: { q?: string; category?: string } = {}): Promise<LiveStory[]> {
  const supabase = await createSupabaseServer();
  if (supabase) {
    let query = supabase
      .from('stories')
      .select(STORY_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    const q = cleanSearch(opts.q ?? '');
    if (q) query = query.ilike('title', `%${q}%`);
    if (opts.category && (['novel', 'love', 'mystery', 'life-lessons', 'knowledge'] as string[]).includes(opts.category)) {
      query = query.eq('category', toDbCategory(opts.category as CategoryKey));
    }

    const { data, error } = await query;
    if (!error && data) return data.map(fromRow);
  }

  // Fallback: demo content, filtered the same way.
  const q = (opts.q ?? '').trim().toLowerCase();
  return STORIES.filter(
    (s) =>
      (!opts.category || s.category === opts.category) &&
      (!q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
  );
}

export async function getStory(slug: string): Promise<LiveStory | null> {
  const supabase = await createSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase
      .from('stories')
      .select(STORY_SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (!error && data) return fromRow(data);
  }
  return STORIES.find((s) => s.slug === slug) ?? null;
}

export function storyReadingMinutesFor(story: Story): number {
  const words = story.chapters.flatMap((c) => c.body).join(' ').split(/\s+/).length;
  return Math.max(3, Math.round(words / 120) + story.chapters.length * 2);
}
