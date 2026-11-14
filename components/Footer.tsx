import Link from 'next/link';
import { SITE, SOCIAL_LINKS } from '@/lib/site';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-mathra-gold/15 bg-mathra-ink/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="gold-text text-xl font-bold tracking-widest">MATHRA WORLD</p>
          <p className="mt-3 text-sm leading-relaxed text-mathra-mist">{SITE.slogan}</p>
          <p className="mt-4 text-xs text-mathra-mist/80">
            නිර්මාතෘ: <span className="text-mathra-gold">{SITE.creator}</span> · Powered by {SITE.poweredBy}
          </p>
        </div>

        <nav aria-label="පාදක සංචාලනය">
          <p className="mb-3 text-sm font-semibold text-mathra-gold">ඉක්මන් සබැඳි</p>
          <ul className="space-y-2 text-sm text-mathra-mist">
            <li><Link className="hover:text-mathra-gold" href="/stories">කතා</Link></li>
            <li><Link className="hover:text-mathra-gold" href="/knowledge">දැනුම</Link></li>
            <li><Link className="hover:text-mathra-gold" href="/about">අප ගැන</Link></li>
            <li><Link className="hover:text-mathra-gold" href="/contact">සම්බන්ධ වන්න</Link></li>
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-sm font-semibold text-mathra-gold">අපව අනුගමනය කරන්න</p>
          <ul className="flex gap-3">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`MATHRA WORLD on ${s.label}`}
                  className="glass glass-hover flex h-12 w-12 items-center justify-center text-sm font-bold text-mathra-gold"
                >
                  {s.short}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-mathra-mist/70">© {new Date().getFullYear()} MATHRA WORLD. සියලු හිමිකම් ඇවිරිණි.</p>
        </div>
      </div>
    </footer>
  );
}
