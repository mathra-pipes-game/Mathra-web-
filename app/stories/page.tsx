import type { Metadata } from 'next';
import { StoryCard } from '@/components/StoryCard';
import { StoryFilters } from '@/components/StoryFilters';
import { listStories } from '@/lib/stories';

export const metadata: Metadata = {
  title: 'කතා',
  description: 'MATHRA WORLD හි සියලු ප්‍රකාශිත කතා. සියල්ල නොමිලේ කියවිය හැක.',
  alternates: { canonical: '/stories' },
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = '', category } = await searchParams;
  const stories = await listStories({ q, category });

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32">
      <header className="mb-10">
        <h1 className="gold-text text-4xl font-bold">කතා</h1>
        <p className="mt-3 text-mathra-mist">සියලු ප්‍රකාශිත කතා නොමිලේ.</p>
      </header>

      <StoryFilters q={q} category={category} />

      <section aria-live="polite" className="mt-10">
        {stories.length === 0 ? (
          <div className="glass p-10 text-center text-mathra-mist">
            <p className="text-lg">ගැලපෙන කතා හමු නොවීය.</p>
            <p className="mt-2 text-sm">වෙනත් වචනයකින් සොයා බලන්න හෝ වර්ගය වෙනස් කරන්න.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => <StoryCard key={s.slug} story={s} />)}
          </div>
        )}
      </section>
    </div>
  );
}
