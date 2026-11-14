'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signInAction, signUpAction, type AuthState } from '@/app/actions/auth';

const initial: AuthState = { status: 'idle', message: '' };

export function AuthForm({ mode, next }: { mode: 'login' | 'register'; next?: string }) {
  const [state, action, pending] = useActionState(
    mode === 'login' ? signInAction : signUpAction,
    initial,
  );

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none transition focus:border-mathra-gold';

  return (
    <form action={action} className="space-y-5" noValidate>
      {mode === 'login' && <input type="hidden" name="next" value={next ?? '/library'} />}

      {mode === 'register' && (
        <>
          <div>
            <label htmlFor="username" className="mb-2 block text-sm text-mathra-mist">පරිශීලක නාමය</label>
            <input id="username" name="username" type="text" required minLength={3} maxLength={30}
              autoComplete="username" className={inputClass} placeholder="your_name" />
          </div>
          <div>
            <label htmlFor="display_name" className="mb-2 block text-sm text-mathra-mist">සංදර්ශන නම</label>
            <input id="display_name" name="display_name" type="text" required maxLength={80}
              autoComplete="name" className={inputClass} />
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-mathra-mist">ඊමේල්</label>
        <input id="email" name="email" type="email" required maxLength={254}
          autoComplete="email" inputMode="email" className={inputClass} />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-mathra-mist">මුරපදය</label>
        <input id="password" name="password" type="password" required
          minLength={mode === 'register' ? 8 : 1} maxLength={72}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={inputClass} />
      </div>

      <button type="submit" disabled={pending}
        className="btn-gold w-full rounded-full px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? 'රැඳී සිටින්න...' : mode === 'login' ? 'ඇතුළු වන්න' : 'ගිණුම සාදන්න'}
      </button>

      <p role="status" aria-live="polite"
        className={`text-sm ${state.status === 'error' ? 'text-red-300' : 'text-mathra-gold'}`}>
        {state.message}
      </p>

      <p className="text-center text-sm text-mathra-mist">
        {mode === 'login' ? (
          <>ගිණුමක් නැද්ද? <Link href="/auth/register" className="text-mathra-gold hover:underline">ලියාපදිංචි වන්න</Link></>
        ) : (
          <>දැනටමත් ගිණුමක් ඇද්ද? <Link href="/auth/login" className="text-mathra-gold hover:underline">ඇතුළු වන්න</Link></>
        )}
      </p>
    </form>
  );
}
