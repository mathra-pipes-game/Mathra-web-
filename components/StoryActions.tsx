'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toggleBookmarkAction, toggleLikeAction } from '@/app/actions/library';

interface Props {
  storyId: string;
  storySlug: string;
  signedIn: boolean;
  initialLiked: boolean;
  initialBookmarked: boolean;
  initialLikes: number;
}

export function StoryActions({ storyId, storySlug, signedIn, initialLiked, initialBookmarked, initialLikes }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <p className="text-sm text-mathra-mist">
        කැමති කතා ලකුණු කිරීමට සහ සුරැකීමට{' '}
        <Link href={`/auth/login?next=/stories/${storySlug}`} className="text-mathra-gold hover:underline">
          ඇතුළු වන්න
        </Link>
        . කතාව නොමිලේ කියවිය හැක.
      </p>
    );
  }

  const onLike = () =>
    startTransition(async () => {
      const r = await toggleLikeAction(storyId, storySlug);
      if (r.ok) {
        setLiked(!liked);
        setLikes((n) => n + (liked ? -1 : 1));
      } else setMessage(r.message ?? '');
    });

  const onBookmark = () =>
    startTransition(async () => {
      const r = await toggleBookmarkAction(storyId, storySlug);
      if (r.ok) setBookmarked(!bookmarked);
      else setMessage(r.message ?? '');
    });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onLike} disabled={pending} aria-pressed={liked}
        className="glass glass-hover rounded-full px-5 py-2 text-sm disabled:opacity-60">
        {liked ? '♥' : '♡'} {likes}
      </button>
      <button type="button" onClick={onBookmark} disabled={pending} aria-pressed={bookmarked}
        className="glass glass-hover rounded-full px-5 py-2 text-sm disabled:opacity-60">
        {bookmarked ? 'සුරකින ලදී ✓' : 'සුරකින්න'}
      </button>
      {message && <span role="status" className="text-sm text-red-300">{message}</span>}
    </div>
  );
}
