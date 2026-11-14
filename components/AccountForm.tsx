'use client';

import { useActionState } from 'react';
import { updateProfileAction, type AuthState } from '@/app/actions/auth';

const initial: AuthState = { status: 'idle', message: '' };

export function AccountForm({ displayName, bio }: { displayName: string; bio: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, initial);
  const inputClass =
    'w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none focus:border-mathra-gold';

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label htmlFor="display_name" className="mb-2 block text-sm text-mathra-mist">සංදර්ශන නම</label>
        <input id="display_name" name="display_name" defaultValue={displayName} required maxLength={80} className={inputClass} />
      </div>
      <div>
        <label htmlFor="bio" className="mb-2 block text-sm text-mathra-mist">බැඳීම</label>
        <textarea id="bio" name="bio" defaultValue={bio} maxLength={500} rows={4} className={inputClass} />
      </div>
      <button type="submit" disabled={pending}
        className="btn-gold rounded-full px-6 py-2.5 text-sm disabled:opacity-60">
        {pending ? 'සුරකිමින්...' : 'සුරකින්න'}
      </button>
      <p role="status" aria-live="polite"
        className={`text-sm ${state.status === 'error' ? 'text-red-300' : 'text-mathra-gold'}`}>
        {state.message}
      </p>
    </form>
  );
}
