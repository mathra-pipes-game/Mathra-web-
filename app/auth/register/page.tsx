import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'ලියාපදිංචි වන්න',
  alternates: { canonical: '/auth/register' },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-5 pb-24 pt-32">
      <div className="glass p-8">
        <h1 className="gold-text mb-8 text-center text-3xl font-bold">ලියාපදිංචි වන්න</h1>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
