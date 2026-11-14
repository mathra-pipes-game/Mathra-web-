import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Reader } from '@/components/Reader';
import { getStory } from '@/lib/stories';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServer } from '@/lib/supabase-server';

type Params = Promise<{ slug: string; chapter: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, chapter } = await params;
  const story = await getStory(slug);
  const ch = story?.chapters.find((c) => c.number === Number(chapter));
  if (!story || !ch) return { title: 'කොටස හමු නොවීය' };
  return {
    title: `${story.title} — ${ch.title}`,
    description: ch.body[0]?.slice(0, 150),
    alternates: { canonical: `/stories/${slug}/${ch.number}` },
    robots: { index: false, follow: true },
  };
}

export default async function ReaderPage({ params }: { params: Params }) {
  const { slug, chapter } = await params;
  const number = Number(chapter);
  if (!Number.isInteger(number) || number < 1) notFound();

  const story = await getStory(slug);
  if (!story) notFound();

  const ch = story.chapters.find((c) => c.number === number);
  if (!ch) notFound();

  const idx = story.chapters.findIndex((c) => c.number === number);
  const prev = idx > 0 ? story.chapters[idx - 1] : null;
  const next = idx < story.chapters.length - 1 ? story.chapters[idx + 1] : null;

  // Chapter IDs and bookmark state exist only for database-backed stories.
  const user = await getCurrentUser();
  const supabase = await createSupabaseServer();
  let chapterId: string | undefined;
  let bookmarked = false;

  if (story.id && supabase) {
    const { data: row } = await supabase
      .from('chapters')
      .select('id')
      .eq('story_id', story.id)
      .eq('number', number)
      .maybeSingle();
    chapterId = row?.id;

    if (user && chapterId) {
      const { data: bm } = await supabase
        .from('chapter_bookmarks')
        .select('chapter_id')
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)
        .maybeSingle();
      bookmarked = !!bm;
    }
  }

  return (
    <Reader
      storyTitle={story.title}
      storySlug={slug}
      storyId={story.id}
      chapter={ch}
      chapterId={chapterId}
      total={story.chapters.length}
      prevHref={prev ? `/stories/${slug}/${prev.number}` : null}
      nextHref={next ? `/stories/${slug}/${next.number}` : null}
      signedIn={!!user}
      initialBookmarked={bookmarked}
    />
  );
}
