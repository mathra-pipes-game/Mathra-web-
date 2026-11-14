'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Shown once per page load; removed quickly so it never blocks reading.
    const t = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-mathra-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          <div className="relative h-20 w-20">
            <div className="loader-orbit absolute inset-0 rounded-full border-2 border-transparent border-t-mathra-gold border-r-mathra-violet" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-mathra-violet/60 to-mathra-blue/40 blur-[2px]" />
          </div>
          <p className="gold-text mt-6 text-2xl font-bold tracking-widest">MATHRA WORLD</p>
          <p className="mt-2 text-sm text-mathra-mist">පූරණය වෙමින්...</p>
          <span className="sr-only">Loading</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
