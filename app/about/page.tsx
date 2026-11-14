import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'අප ගැන',
  description: 'MATHRA WORLD ගැන — දැනුම සහ හොඳ ආදර්ශ සෑම කෙනෙකුටම නොමිලේ සමීප කරවීමේ අරමුණ.',
  alternates: { canonical: '/about' },
};

const MESSAGE_PARAGRAPHS = [
  'MATHRA WORLD යනු හුදෙක් කතාන්දර කියවන තැනක් නොවේ. එය දැනුම සොයන, සිහින දකින, අත්දැකීම් බෙදාගන්නා සහ ජීවිතයට අලුත් අරුතක් සොයා යන මිනිසුන් වෙනුවෙන් නිර්මාණය වූ ලස්සන ඩිජිටල් ලෝකයකි.',
  'එක් කතාවක් කෙනෙකුගේ සිතුවිල්ලක් වෙනස් කළ හැකිය. එක් අදහසක් ජීවිතයක් ආලෝකමත් කළ හැකිය.',
  'අපේ අරමුණ දැනුම සහ හොඳ ආදර්ශ සෑම කෙනෙකුටම නොමිලේ සමීප කරවීමයි.',
];

export default function AboutPage() {
  return (
    <article className="relative isolate mx-auto max-w-3xl px-5 pb-24 pt-32">
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-mathra-gold">ABOUT</p>
        <h1 className="gold-text mt-4 text-4xl font-bold sm:text-5xl">{SITE.name}</h1>
        <p className="mt-4 text-lg text-mathra-mist">{SITE.slogan}</p>
      </header>

      <div className="glass mt-12 space-y-6 p-8 text-lg leading-loose text-mathra-mist sm:p-12">
        {MESSAGE_PARAGRAPHS.map((p, i) => (
          <p key={i} className={i === 1 ? 'gold-text text-xl font-semibold leading-relaxed' : ''}>
            {p}
          </p>
        ))}
      </div>

      <dl className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="glass p-6">
          <dt className="text-sm text-mathra-gold">නිර්මාතෘ</dt>
          <dd className="mt-1 text-lg font-semibold">{SITE.creator}</dd>
        </div>
        <div className="glass p-6">
          <dt className="text-sm text-mathra-gold">බලගැන්වීම</dt>
          <dd className="mt-1 text-lg font-semibold">{SITE.poweredBy}</dd>
        </div>
      </dl>
    </article>
  );
}
