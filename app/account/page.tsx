import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccountForm } from '@/components/AccountForm';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServer } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'ගිණුම',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?next=/account');

  const supabase = await createSupabaseServer();
  const { data: profile } = supabase
    ? await supabase.from('profiles').select('bio').eq('id', user.id).maybeSingle()
    : { data: null };

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-32">
      <h1 className="gold-text mb-8 text-4xl font-bold">ගිණුම</h1>

      <dl className="glass mb-8 space-y-4 p-6 text-sm">
        <div>
          <dt className="text-mathra-gold">පරිශීලක නාමය</dt>
          <dd className="mt-1">@{user.username}</dd>
        </div>
        <div>
          <dt className="text-mathra-gold">ඊමේල්</dt>
          <dd className="mt-1 text-mathra-mist">{user.email}</dd>
        </div>
      </dl>

      <section className="glass p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-bold">පැතිකඩ සංස්කරණය</h2>
        <AccountForm displayName={user.displayName} bio={profile?.bio ?? ''} />
      </section>
    </div>
  );
}
