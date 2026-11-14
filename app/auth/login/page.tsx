import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';
import { safeNextPath } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'ඇතුළු වන්න',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-5 pb-24 pt-32">
      <div className="glass p-8">
        <h1 className="gold-text mb-8 text-center text-3xl font-bold">ඇතුළු වන්න</h1>
        <AuthForm mode="login" next={safeNextPath(next)} />
      </div>
    </div>
  );
}
