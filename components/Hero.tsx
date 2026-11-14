'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Starfield } from './Starfield';
import { FloatingBooks } from './FloatingBooks';
import { SITE } from '@/lib/site';

export function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden px-5 pb-20 pt-28 sm:pt-36 lg:pb-28">
      <Starfield />
      <FloatingBooks />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-mathra-violet/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-mathra-blue/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.p {...fadeUp(0.1)} className="mx-auto mb-5 inline-block rounded-full border border-mathra-gold/30 px-4 py-1 text-xs tracking-[0.25em] text-mathra-gold">
          POWERED BY MATHRA
        </motion.p>

        <motion.h1
          {...fadeUp(0.25)}
          className="gold-text text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl"
        >
          {SITE.slogan}
        </motion.h1>

        <motion.p {...fadeUp(0.45)} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mathra-mist sm:text-lg">
          කතා, දැනුම සහ සිහින බෙදාගන්න අපේ ඩිජිටල් ලෝකයට සාදරයෙන් පිළිගනිමු. සියලු ප්‍රකාශිත කතා නොමිලේ කියවිය හැක.
        </motion.p>

        <motion.div {...fadeUp(0.65)} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/stories" className="btn-gold rounded-full px-8 py-3 text-base">
            කතා කියවන්න
          </Link>
          <Link
            href="/about"
            className="glass glass-hover rounded-full px-8 py-3 text-base font-medium"
          >
            අප ගැන
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
