import Link from 'next/link';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServer } from '@/lib/supabase-server';
import { signOutAction } from '@/app/actions/auth';

export const metadata: Metadata = {
  title: 'මගේ පුස්තකාලය',
  robots: { index: false, follow: false },
};

export default async function LibraryPage() {
  const user = await getCurrentUser();
  // Middleware already redirects visitors. This is a second check for safety.
  if (!user) return null;

  const supabase = await createSupabaseServer();
  let bookmarks: any[] = [];
  let progress: any[] = [];
  let history: any[] = [];

  if (supabase) {
    const [b, p] = await Promise.all([
      supabase
        .from('bookmarks')
        .select('created_at, stories(slug, title, description, is_demo)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('reading_progress')
        .select('last_chapter_number, percent, updated_at, stories(slug, title)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20),
    ]);
    bookmarks = b.data ?? [];
    progress = p.data ?? [];
    history = progress;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-32">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-mathra-gold">ආයුබෝවන්</p>
          <h1 className="gold-text mt-1 text-4xl font-bold">{user.displayName}</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/account" className="glass glass-hover rounded-full px-5 py-2 text-sm">ගිණුම</Link>
          <form action={signOutAction}>
            <button type="submit" className="glass glass-hover rounded-full px-5 py-2 text-sm">ඉවත් වන්න</button>
          </form>
        </div>
      </header>

      <Section title="දිගටම කියවන්න">
        {progress.length === 0 ? (
          <Empty text="ඔබ තවම කියවීම ආරම්භ කර නැත." href="/stories" cta="කතා බලන්න" />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {progress.filter((r) => r.stories).map((r) => (
              <li key={r.stories.slug}>
                <Link href={`/stories/${r.stories.slug}/${r.last_chapter_number}`} className="glass glass-hover block p-5">
                  <p className="font-bold text-mathra-gold">{r.stories.title}</p>
                  <p className="mt-1 text-sm text-mathra-mist">කොටස {r.last_chapter_number} · {Math.round(r.percent)}%</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-gradient-to-r from-mathra-violet to-mathra-gold" style={{ width: `${r.percent}%` }} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="සුරැකි කතා">
        {bookmarks.filter((b) => b.stories).length === 0 ? (
          <Empty text="සුරැකි කතා නොමැත." href="/stories" cta="කතා බලන්න" />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {bookmarks.filter((b) => b.stories).map((b) => (
              <li key={b.stories.slug}>
                <Link href={`/stories/${b.stories.slug}`} className="glass glass-hover block p-5">
                  <p className="font-bold text-mathra-gold">{b.stories.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-mathra-mist">{b.stories.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="කියවීමේ ඉතිහාසය">
        {history.length === 0 ? (
          <Empty text="කියවීමේ ඉතිහාසය හිස්ය." href="/stories" cta="කතා බලන්න" />
        ) : (
          <ul className="space-y-2 text-sm text-mathra-mist">
            {history.filter((h) => h.stories).map((h) => (
              <li key={h.stories.slug}>{h.stories.title} — කොටස {h.last_chapter_number}</li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 text-2xl font-bold text-mathra-gold">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="glass p-8 text-center text-mathra-mist">
      <p>{text}</p>
      <Link href={href} className="mt-4 inline-block text-mathra-gold hover:underline">{cta} →</Link>
    </div>
  );
}
