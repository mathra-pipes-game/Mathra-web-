// Central brand and contact configuration.
// Only the links the creator supplied are listed here. Do not add invented accounts or addresses.

export const SITE = {
  name: 'MATHRA WORLD',
  slogan: 'කතාන්දරයකින් ලෝකයක් වෙනස් කරමු...',
  description:
    'MATHRA WORLD — සිංහල කතා, ඩිජිටල් පුස්තකාලය, දැනුම සහ නිර්මාණ ප්‍රජාව. නිර්මාතෘ Denuwan. Powered by MATHRA.',
  creator: 'Denuwan',
  poweredBy: 'MATHRA',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
} as const;

export const SOCIAL_LINKS = [
  {
    key: 'github',
    label: 'GitHub',
    short: 'GH',
    href: 'https://github.com/denuvan-akash',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    short: 'TT',
    href: 'https://www.tiktok.com/@mathra_quotes_1',
  },
] as const;
