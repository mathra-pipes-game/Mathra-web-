'use client';

import { useState } from 'react';

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState('');

  const share = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus('සබැඳිය පිටපත් කරන ලදී');
    } catch {
      // User cancelled the share sheet, or clipboard is blocked.
      setStatus('');
    }
    window.setTimeout(() => setStatus(''), 2500);
  };

  return (
    <button type="button" onClick={share} className="glass glass-hover rounded-full px-5 py-2 text-sm">
      බෙදාගන්න {status && <span className="ml-2 text-mathra-gold">{status}</span>}
    </button>
  );
}
