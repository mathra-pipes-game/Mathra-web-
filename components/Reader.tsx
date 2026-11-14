'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
import { saveProgressAction, toggleChapterBookmarkAction } from '@/app/actions/library';
import { ShareButton } from './ShareButton';
import type { Chapter } from '@/data/sample-content';

interface Props {
  storyTitle: string;
  storySlug: string;
  storyId?: string;
  chapter: Chapter;
  chapterId?: string;
  total: number;
  prevHref: string | null;
  nextHref: string | null;
  signedIn: boolean;
  initialBookmarked: boolean;
}

const SIZES = [16, 18, 20, 22, 24, 28];
const LS_SIZE = 'mathra-reader-size';
const LS_THEME = 'mathra-reader-theme';

export function Reader(p: Props) {
  const [sizeIdx, setSizeIdx] = useState(2);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scroll, setScroll] = useState(0);
  const [bookmarked, setBookmarked] = useState(p.initialBookmarked);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const lastSaved = useRef(0);

  // Load the viewer's own preferences (stored in this browser only).
  useEffect(() => {
    try {
      const s = Number(localStorage.getItem(LS_SIZE));
      if (s >= 0 && s < SIZES.length) setSizeIdx(s);
      const t = localStorage.getItem(LS_THEME);
      if (t === 'light' || t === 'dark') setTheme(t);
    } catch {
      // Storage can be blocked; defaults still work.
    }
  }, []);

  // Reading progress indicator and periodic save.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      setScroll(Math.min(100, Math.max(0, pct)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!p.storyId) return;
    const now = Date.now();
    // Throttle: at most one save every 8 seconds, and only if progress moved.
    if (now - lastSaved.current < 8000) return;
    lastSaved.current = now;
    const overall = ((p.chapter.number - 1 + scroll / 100) / p.total) * 100;
    saveProgressAction(p.storyId, p.chapter.number, overall).catch(() => {});
  }, [scroll, p.storyId, p.chapter.number, p.total]);

  const changeSize = (dir: 1 | -1) => {
    setSizeIdx((i) => {
      const next = Math.min(SIZES.length - 1, Math.max(0, i + dir));
      try { localStorage.setItem(LS_SIZE, String(next)); } catch {}
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(LS_THEME, next); } catch {}
      return next;
    });
  };

  const onBookmark = () => {
    if (!p.chapterId) return;
    startTransition(async () => {
      const r = await toggleChapterBookmarkAction(p.chapterId!, p.storySlug, p.chapter.number);
      if (r.ok) setBookmarked((b) => !b);
      else setMessage(r.message ?? '');
    });
  };

  const isLight = theme === 'light';
  const pageClass = isLight
    ? 'bg-[#f7f1e3] text-[#2a1d0e] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]'
    : 'bg-[#120a20]/80 text-[#f1ecff] border border-mathra-gold/20 shadow-[0_30px_80px_-30px_rgba(124,58,237,0.5)]';

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 h-1 bg-white/5" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-mathra-violet to-mathra-gold transition-[width] duration-200" style={{ width: `${scroll}%` }} />
      </div>
      <div role="progressbar" aria-label="කියවීමේ ප්‍රගතිය" aria-valuemin={0} aria-valuemax={100}
        aria-valuenow={Math.round(scroll)} className="sr-only">{Math.round(scroll)}%</div>

      <div className="mx-auto max-w-2xl px-5 pb-24 pt-28">
        <div className="glass mb-6 flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
          <div className="flex items-center gap-2" role="group" aria-label="අකුරු ප්‍රමාණය">
            <button type="button" onClick={() => changeSize(-1)} disabled={sizeIdx === 0}
              className="glass rounded-lg px-3 py-1.5 disabled:opacity-40" aria-label="අකුරු කුඩා කරන්න">A−</button>
            <button type="button" onClick={() => changeSize(1)} disabled={sizeIdx === SIZES.length - 1}
              className="glass rounded-lg px-3 py-1.5 disabled:opacity-40" aria-label="අකුරු විශාල කරන්න">A+</button>
          </div>
          <button type="button" onClick={toggleTheme} className="glass rounded-lg px-3 py-1.5">
            {isLight ? 'රාත්‍රී මාදිලිය' : 'දින මාදිලිය'}
          </button>
          <div className="flex items-center gap-2">
            {p.signedIn && p.chapterId ? (
              <button type="button" onClick={onBookmark} disabled={pending} aria-pressed={bookmarked}
                className="glass rounded-lg px-3 py-1.5 disabled:opacity-60">
                {bookmarked ? 'කොටස සුරකින ලදී ✓' : 'කොටස සුරකින්න'}
              </button>
            ) : null}
            <ShareButton title={`${p.storyTitle} — ${p.chapter.title}`} path={`/stories/${p.storySlug}/${p.chapter.number}`} />
          </div>
        </div>
        {message && <p role="status" className="mb-4 text-sm text-red-300">{message}</p>}

        <article className={`rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14 ${pageClass}`}
          style={{ fontSize: SIZES[sizeIdx], lineHeight: 1.9 }}>
          <p className="mb-2 text-center text-xs tracking-[0.3em] opacity-60">
            කොටස {p.chapter.number} / {p.total}
          </p>
          <h1 className="mb-8 text-center text-[1.6em] font-bold text-mathra-gold">{p.chapter.title}</h1>
          {p.chapter.body.map((para, i) => (
            <p key={i} className="mb-5 indent-8">{para}</p>
          ))}
          <p className="mt-10 text-center opacity-60">— අවසානය —</p>
        </article>

        <nav aria-label="කොටස් සංචාලනය" className="mt-8 grid grid-cols-2 gap-4">
          {p.prevHref ? (
            <Link href={p.prevHref} className="glass glass-hover rounded-2xl p-4 text-center">← පෙර කොටස</Link>
          ) : <span />}
          {p.nextHref ? (
            <Link href={p.nextHref} className="btn-gold rounded-2xl p-4 text-center">ඊළඟ කොටස →</Link>
          ) : (
            <Link href={`/stories/${p.storySlug}`} className="glass glass-hover rounded-2xl p-4 text-center">කතාව අවසන් ✓</Link>
          )}
        </nav>
      </div>
    </>
  );
}
