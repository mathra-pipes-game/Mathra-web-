// DEMONSTRATION CONTENT ONLY.
// These are original sample stories written for MATHRA WORLD to demonstrate the layout.
// They are marked isDemo: true. Do not copy copyrighted novels or existing authors' work here.
// Later phases will move this content into Supabase and remove the static file.

export type CategoryKey = 'novel' | 'love' | 'mystery' | 'life-lessons' | 'knowledge';

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  novel: 'සිංහල නවකථා',
  love: 'ආදර කතා',
  mystery: 'අභිරහස් සහ ත්‍රාසය',
  'life-lessons': 'ජීවන පාඩම්',
  knowledge: 'දැනුම සහ අධ්‍යාපනය',
};

export interface Chapter {
  number: number;
  title: string;
  body: string[];
}

export interface Story {
  slug: string;
  title: string;
  author: string;
  description: string;
  category: CategoryKey;
  coverGradient: string;
  publishedAt: string; // ISO date
  likes: number;
  isDemo: true;
  chapters: Chapter[];
}

export const STORIES: Story[] = [
  {
    slug: 'sanda-eliye-rahasya',
    title: 'සඳ එළියේ රහස',
    author: 'MATHRA WORLD (demo)',
    description: 'ගමක එක් රාත්‍රියක අතුරුදහන් වූ ලිපිකරුවෙකුගේ රහස සොයා යන දරුණු ත්‍රාසකර කතාවකි.',
    category: 'mystery',
    coverGradient: 'linear-gradient(140deg, #2a0f4a, #7c3aed 60%, #3b82f6)',
    publishedAt: '2026-10-01',
    likes: 128,
    isDemo: true,
    chapters: [
      {
        number: 1,
        title: 'ආරම්භය',
        body: [
          'සඳ එළිය වැටුණු ගම්මානයේ එක් රාත්‍රියක ලිපිකරු සුනිල් අතුරුදහන් විය.',
          'ඔහුගේ මේසය මත තිබුණේ අර්ධ වශයෙන් ලියූ ලිපියක් පමණි.',
        ],
      },
      {
        number: 2,
        title: 'අභිරහස',
        body: [
          'ලිපියේ අවසාන වාක්‍යය ගම්මානයේ පැරණි ළිඳ ගැන සඳහන් කළේය.',
          'ගම්වාසීන් එය ගැන කතා කළද කිසිවෙක් ළිඳ ළඟට යාමට බිය වූහ.',
        ],
      },
      {
        number: 3,
        title: 'නොසිතූ හමුවීම',
        body: [
          'ළිඳ ළඟ දී තරුණ ගුරුවරියක් වන නිලූකා ලිපිකරුගේ බ්‍රෝච් එකක් සොයා ගත්තාය.',
          'එය ඇයගේ පවුලේ පැරණි රහසක් හෙළි කිරීමට ආරම්භ කළේය.',
        ],
      },
      {
        number: 4,
        title: 'අවසානය',
        body: [
          'සත්‍යය හෙළි වූ විට, ගමේ සැඟවුණු වැරැද්ද එළියට ආවේය.',
          'නමුත් ඒ සඳ එළියේ නොපෙනුණු ආදරය ගැන ද එකවර ප්‍රකාශ විය.',
        ],
      },
    ],
  },
  {
    slug: 'gammanaye-hada',
    title: 'ගම්මානයේ හඬ',
    author: 'MATHRA WORLD (demo)',
    description: 'ඉවසීම සහ කරුණාව ගම්මානයක ජීවිතය වෙනස් කරන ආකාරය ගැන සරල කතාවකි.',
    category: 'life-lessons',
    coverGradient: 'linear-gradient(140deg, #3a1a1a, #b57a1e 55%, #e5b84b)',
    publishedAt: '2026-10-12',
    likes: 97,
    isDemo: true,
    chapters: [
      {
        number: 1,
        title: 'පළමු පාඩම',
        body: ['ගම්මානයේ වැවට යන පාරේ වැඩිහිටි අම්මා දිනපතා ළමයින්ට කතා කීවාය.'],
      },
      {
        number: 2,
        title: 'ඉවසීම',
        body: ['වේගයෙන් යාමට වඩා ඉවසීමෙන් යාම ගම්වාසීන්ට වැදගත් බව ඇය ඉගැන්වූවාය.'],
      },
      {
        number: 3,
        title: 'කරුණාව',
        body: ['එක් දවසක් ළමයෙක් තම පන්ති මිතුරාට බත් පැකට් එකක් බෙදා දුන්නේය.'],
      },
    ],
  },
  {
    slug: 'nava-arunu',
    title: 'නව අරුණ',
    author: 'MATHRA WORLD (demo)',
    description: 'කඳු ගම්මානයක තරුණයෙකු තම පවුලේ ඉරණම වෙනස් කිරීමට යන සාහසික ගමන.',
    category: 'novel',
    coverGradient: 'linear-gradient(140deg, #0b1a3a, #3b82f6 55%, #7c3aed)',
    publishedAt: '2026-11-02',
    likes: 74,
    isDemo: true,
    chapters: [
      {
        number: 1,
        title: 'කඳු මුදුනේ උදාව',
        body: ['අරුණ නම් තරුණයා හැම උදෑසනකම කඳු මුදුනට නැග උදාව බලා සිටියේය.'],
      },
      {
        number: 2,
        title: 'ගමන ආරම්භය',
        body: ['පවුලේ ඉරණම වෙනස් කිරීමට ඔහු නගරයට යන ගමන් මගට පා තැබුවේය.'],
      },
      {
        number: 3,
        title: 'අලුත් ආරම්භය',
        body: ['අවසානයේ ඔහුට ලැබුණේ ගමට නව ආලෝකයක් ගෙනදෙන අවස්ථාවකි.'],
      },
    ],
  },
];

export interface Article {
  slug: string;
  title: string;
  category: 'science' | 'technology' | 'history' | 'culture' | 'motivation' | 'education';
  summary: string;
  readingMinutes: number;
  isDemo: true;
}

export const KNOWLEDGE_CATEGORIES = [
  'විද්‍යාව',
  'තාක්ෂණය',
  'ඉතිහාසය',
  'ශ්‍රී ලාංකීය සංස්කෘතිය',
  'ජීවන පාඩම්',
  'අභිප්‍රේරණය',
  'අධ්‍යාපනය',
  'පොදු දැනුම',
  'රසවත් කරුණු',
  'පෞද්ගලික සංවර්ධනය',
];

export function storyReadingMinutes(story: Story): number {
  const words = story.chapters
    .flatMap((c) => c.body)
    .join(' ')
    .split(/\s+/).length;
  // Sinhala reading pace is approximated conservatively for demo purposes.
  return Math.max(3, Math.round(words / 120) + story.chapters.length * 2);
}
