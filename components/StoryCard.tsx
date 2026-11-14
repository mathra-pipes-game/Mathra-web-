import Link from 'next/link';
import type { Story } from '@/data/sample-content';
import { storyReadingMinutes, CATEGORY_LABELS } from '@/data/sample-content';

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.slug}`} className="glass glass-hover group block overflow-hidden">
      <div
        className="relative flex h-44 items-end p-5"
        style={{ background: story.coverGradient }}
      >
        <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-mathra-gold backdrop-blur">
          {CATEGORY_LABELS[story.category]}
        </span>
        {story.isDemo && (
          <span className="absolute right-4 top-4 rounded-full bg-mathra-gold/90 px-2 py-0.5 text-[10px] font-bold text-black">
            DEMO
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-mathra-gold transition group-hover:text-white">{story.title}</h3>
        <p className="mt-1 text-sm text-mathra-mist">{story.author}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-mathra-mist/90">{story.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mathra-mist/80">
          <span>කොටස් {story.chapters.length}</span>
          <span>කියවීමේ කාලය විනාඩි {storyReadingMinutes(story)}</span>
          <span>♥ {story.likes}</span>
        </div>
      </div>
    </Link>
  );
}
