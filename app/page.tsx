import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { StoryCard } from '@/components/StoryCard';
import { STORIES, CATEGORY_LABELS, KNOWLEDGE_CATEGORIES } from '@/data/sample-content';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'මුල් පිටුව',
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const featured = STORIES.slice(0, 3);
  const recent = [...STORIES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const popular = [...STORIES].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <Hero />

      <section aria-labelledby="welcome" className="mx-auto max-w-4xl px-5 text-center">
        <h2 id="welcome" className="gold-text text-3xl font-bold sm:text-4xl">
          MATHRA WORLD වෙත සාදරයෙන් පිළිගනිමු
        </h2>
        <p className="mt-5 leading-relaxed text-mathra-mist">
          මෙය හුදෙක් කතා කියවන තැනක් නොවේ. දැනුම සොයන, සිහින දකින සහ අත්දැකීම් බෙදාගන්නා ප්‍රජාවක් සඳහා නිර්මාණය වූ ඩිජිටල් ලෝකයකි.
        </p>
      </section>

      <Section title="විශේෂාංගගත කතා" href="/stories">
        {featured.map((s) => <StoryCard key={s.slug} story={s} />)}
      </Section>

      <Section title="ජනප්‍රිය කතා" href="/stories">
        {popular.map((s) => <StoryCard key={s.slug} story={s} />)}
      </Section>

      <Section title="අලුතින් ප්‍රකාශිත කතා" href="/stories">
        {recent.map((s) => <StoryCard key={s.slug} story={s} />)}
      </Section>

      <section aria-labelledby="genres" className="mx-auto max-w-6xl px-5 py-16">
        <h2 id="genres" className="mb-8 text-2xl font-bold text-mathra-gold sm:text-3xl">කතා වර්ග</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((key) => (
            <li key={key}>
              <Link href={`/stories?category=${key}`} className="glass glass-hover block p-6 text-center font-medium">
                {CATEGORY_LABELS[key]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="knowledge" className="mx-auto max-w-6xl px-5 py-16">
        <div className="glass relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mathra-gold/10 blur-3xl" />
          <h2 id="knowledge" className="gold-text text-3xl font-bold">දැනුම් මධ්‍යස්ථානය</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-mathra-mist">
            නිවැරදි, අධ්‍යාපනික සහ ප්‍රයෝජනවත් ලිපි. විද්‍යාව, තාක්ෂණය, ඉතිහාසය සහ ශ්‍රී ලාංකීය සංස්කෘතිය ඇතුළු විෂයයන්.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {KNOWLEDGE_CATEGORIES.map((c) => (
              <li key={c} className="rounded-full border border-mathra-gold/25 px-3 py-1 text-xs text-mathra-mist">
                {c}
              </li>
            ))}
          </ul>
          <Link href="/knowledge" className="btn-gold mt-8 inline-block rounded-full px-6 py-2.5 text-sm">
            දැනුම බලන්න
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-10 text-center text-sm text-mathra-mist/80">
        <p>
          ඉහත දැක්වෙන කතා සියල්ලම <span className="text-mathra-gold">demonstration content</span> වේ. ඒවා මෙම වේදිකාව පෙන්වීමට නිර්මාණය කළ මුල් කතා ය.
        </p>
      </section>
    </>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  const id = title.replace(/\s+/g, '-');
  return (
    <section aria-labelledby={id} className="mx-auto max-w-6xl px-5 py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 id={id} className="text-2xl font-bold text-mathra-gold sm:text-3xl">{title}</h2>
        <Link href={href} className="text-sm text-mathra-mist transition hover:text-mathra-gold">
          සියල්ල බලන්න →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
