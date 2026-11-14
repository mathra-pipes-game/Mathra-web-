'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SITE } from '@/lib/site';

const NAV = [
  { href: '/', label: 'මුල් පිටුව' },
  { href: '/stories', label: 'කතා' },
  { href: '/knowledge', label: 'දැනුම' },
  { href: '/about', label: 'අප ගැන' },
  { href: '/contact', label: 'සම්බන්ධ වන්න' },
];

export function Navbar({ signedIn, displayName }: { signedIn: boolean; displayName?: string }) {
  const [open, setOpen] = useState(false);
  const account = signedIn
    ? { href: '/library', label: displayName ? `${displayName}` : 'මගේ පුස්තකාලය' }
    : { href: '/auth/login', label: 'ඇතුළු වන්න' };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="ප්‍රධාන සංචාලනය"
        className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3"
      >
        <Link href="/" className="gold-text text-lg font-bold tracking-widest" aria-label={SITE.name}>
          MATHRA WORLD
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sm text-mathra-mist transition hover:text-mathra-gold">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href={account.href} className="glass rounded-full px-4 py-1.5 text-sm text-mathra-gold">
              {account.label}
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="glass flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'මෙනුව වසන්න' : 'මෙනුව විවෘත කරන්න'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-mathra-gold transition ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-5 bg-mathra-gold transition ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-[14px] h-0.5 w-5 bg-mathra-gold transition ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </span>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="glass mx-3 mt-2 rounded-2xl p-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {[...NAV, account].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base text-mathra-mist hover:bg-white/5 hover:text-mathra-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
