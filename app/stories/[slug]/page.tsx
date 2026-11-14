import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { StoryActions } from '@/components/StoryActions';
import { ShareButton } from '@/components/ShareButton';
import { getStory, storyReadingMinutesFor } from '@/lib/stories';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServer } from '@/lib/supabase-server';
import { CATEGORY_LABELS } from '@/data/sample-content';
import { SITE } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: 'කතාව හමු නොවීය' };
  return {
    title: story.title,
    description: story.description,
    alternates: { canonical: `/stories/${slug}` },
    openGraph: { title: story.title, description: story.description, type: 'book', url: `${SITE.url}/stories/${slug}` },
  };
}

export default async function StoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const user = await getCurrentUser();
  const supabase = await createSupabaseServer();

  let liked = false;
  let bookmarked = false;
  let progress: { last_chapter_number: number; percent: number } | null = null;

  if (user && supabase && story.id) {
    const [{ data: like }, { data: bm }, { data: prog }] = await Promise.all([
      supabase.from('story_likes').select('story_id').eq('user_id', user.id).eq('story_id', story.id).maybeSingle(),
      supabase.from('bookmarks').select('story_id').eq('user_id', user.id).eq('story_id', story.id).maybeSingle(),
      supabase.from('reading_progress').select('last_chapter_number, percent').eq('user_id', user.id).eq('story_id', story.id).maybeSingle(),
    ]);
    liked = !!like;
    bookmarked = !!bm;
    progress = prog;
  }

  const firstChapter = story.chapters[0]?.number ?? 1;
  const resume = progress?.last_chapter_number ?? null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: story.title,
    description: story.description,
    author: { '@type': 'Person', name: story.author },
    inLanguage: 'si',
    isAccessibleForFree: true,
    datePublished: story.publishedAt,
  };

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="glass overflow-hidden">
        <div className="h-48 sm:h-64" style={{ background: story.coverGradient }} aria-hidden="true" />
        <div className="p-6 sm:p-10">
          <p className="text-sm text-mathra-gold">{CATEGORY_LABELS[story.category]}</p>
          <h1 className="gold-text mt-2 text-3xl font-bold sm:text-5xl">{story.title}</h1>
          <p className="mt-2 text-mathra-mist">{story.author}</p>
          <p className="mt-6 leading-relaxed text-mathra-mist">{story.description}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-mathra-mist">
            <div><dt className="inline">කොටස්: </dt><dd className="inline text-white">{story.chapters.length}</dd></div>
            <div><dt className="inline">කියවීමේ කාලය: </dt><dd className="inline text-white">විනාඩි {storyReadingMinutesFor(story)}</dd></div>
            <div><dt className="inline">ප්‍රකාශිත දිනය: </dt><dd className="inline text-white">{story.publishedAt}</dd></div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/stories/${slug}/${resume ?? firstChapter}`} className="btn-gold rounded-full px-7 py-3 text-sm">
              {resume ? `දිගටම කියවන්න (කොටස ${resume})` : 'කියවීම ආරම්භ කරන්න'}
            </Link>
            <ShareButton title={story.title} path={`/stories/${slug}`} />
          </div>

          {progress && (
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-mathra-mist">
                <span>කියවීමේ ප්‍රගතිය</span>
                <span>{Math.round(progress.percent)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gradient-to-r from-mathra-violet to-mathra-gold" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-white/10 pt-6">
            <StoryActions
              storyId={story.id ?? ''}
              storySlug={slug}
              signedIn={!!user && !!story.id}
              initialLiked={liked}
              initialBookmarked={bookmarked}
              initialLikes={story.likes}
            />
          </div>
        </div>
      </div>

      <section aria-labelledby="chapters" className="mt-12">
        <h2 id="chapters" className="mb-6 text-2xl font-bold text-mathra-gold">කොටස්</h2>
        <ol className="space-y-3">
          {story.chapters.map((c) => (
            <li key={c.number}>
              <Link href={`/stories/${slug}/${c.number}`}
                className="glass glass-hover flex items-center gap-5 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-mathra-gold/40 text-mathra-gold">
                  {c.number}
                </span>
                <span className="font-medium">{c.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
