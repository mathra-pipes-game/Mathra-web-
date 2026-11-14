'use client';

import { useActionState } from 'react';
import { submitContact, type ContactState } from '@/app/actions/contact';

const initial: ContactState = { status: 'idle', message: '' };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <form action={action} className="space-y-5" noValidate>
      {/* Honeypot: hidden from people, filled in only by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-mathra-mist">නම</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none transition focus:border-mathra-gold"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-mathra-mist">ඊමේල්</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none transition focus:border-mathra-gold"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-mathra-mist">පණිවිඩය</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none transition focus:border-mathra-gold"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-gold w-full rounded-full px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'යවමින්...' : 'පණිවිඩය යවන්න'}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`text-sm ${state.status === 'error' ? 'text-red-300' : 'text-mathra-gold'}`}
      >
        {state.message}
      </p>
    </form>
  );
}
