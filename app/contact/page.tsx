import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { SITE, SOCIAL_LINKS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'සම්බන්ධ වන්න',
  description: 'MATHRA WORLD වෙත පණිවිඩයක් යවන්න.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 pt-32 lg:grid-cols-5">
      <section className="lg:col-span-2">
        <p className="text-xs tracking-[0.3em] text-mathra-gold">CONTACT</p>
        <h1 className="gold-text mt-3 text-4xl font-bold">සම්බන්ධ වන්න</h1>
        <p className="mt-4 leading-relaxed text-mathra-mist">
          ප්‍රශ්න, යෝජනා, හෝ ලේඛන ඉදිරිපත් කිරීම් සඳහා පහත පෝරමය භාවිත කරන්න.
        </p>

        <div className="glass mt-8 space-y-4 p-6 text-sm">
          <div>
            <p className="text-mathra-gold">නිර්මාතෘ</p>
            <p className="mt-1 text-base">{SITE.creator}</p>
          </div>
          <div>
            <p className="text-mathra-gold">ඊමේල්</p>
            <p className="mt-1 text-mathra-mist">
              {SITE.contactEmail || 'ඊමේල් ලිපිනය වින්‍යාස කිරීමෙන් පසු මෙහි පෙන්වනු ඇත.'}
            </p>
          </div>
          <div>
            <p className="text-mathra-gold">සමාජ මාධ්‍ය</p>
            <ul className="mt-2 space-y-2">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mathra-mist underline-offset-4 hover:text-mathra-gold hover:underline"
                  >
                    {s.label}: {s.href.replace('https://', '')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="glass p-6 sm:p-8 lg:col-span-3">
        <ContactForm />
      </section>
    </div>
  );
}
