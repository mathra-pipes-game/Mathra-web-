import Link from 'next/link';
import { CATEGORY_LABELS, type CategoryKey } from '@/data/sample-content';

// Plain GET form: works without JavaScript, and the URL can be shared.
export function StoryFilters({ q, category }: { q: string; category?: string }) {
  const keys = Object.keys(CATEGORY_LABELS) as CategoryKey[];

  return (
    <div className="space-y-6">
      <form role="search" action="/stories" method="get" className="flex flex-col gap-3 sm:flex-row">
        {category && <input type="hidden" name="category" value={category} />}
        <label htmlFor="q" className="sr-only">කතා සොයන්න</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          maxLength={100}
          placeholder="කතා නම හෝ විස්තරය අනුව සොයන්න..."
          className="flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-3 text-base outline-none focus:border-mathra-gold"
        />
        <button type="submit" className="btn-gold rounded-full px-7 py-3 text-sm">සොයන්න</button>
      </form>

      <nav aria-label="කතා වර්ග">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link href={q ? `/stories?q=${encodeURIComponent(q)}` : '/stories'}
              aria-current={!category ? 'page' : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm ${!category ? 'border-mathra-gold bg-mathra-gold/15 text-mathra-gold' : 'border-white/10 text-mathra-mist hover:border-mathra-gold/50'}`}>
              සියල්ල
            </Link>
          </li>
          {keys.map((k) => {
            const active = category === k;
            const href = `/stories?${new URLSearchParams({ ...(q ? { q } : {}), category: k }).toString()}`;
            return (
              <li key={k}>
                <Link href={href} aria-current={active ? 'page' : undefined}
                  className={`rounded-full border px-4 py-1.5 text-sm ${active ? 'border-mathra-gold bg-mathra-gold/15 text-mathra-gold' : 'border-white/10 text-mathra-mist hover:border-mathra-gold/50'}`}>
                  {CATEGORY_LABELS[k]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
