// Deterministic star positions so server and client render identical markup (no hydration mismatch).
// Count is kept low to protect mobile performance. CSS handles the animation and reduced-motion.

const STARS = Array.from({ length: 70 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r1 = seed / 233280;
  const r2 = ((seed * 7) % 1000) / 1000;
  const r3 = ((seed * 13) % 1000) / 1000;
  return {
    id: i,
    top: `${(r1 * 100).toFixed(2)}%`,
    left: `${(r2 * 100).toFixed(2)}%`,
    size: 1 + Math.round(r3 * 2),
    delay: `${(r3 * 5).toFixed(2)}s`,
  };
});

export function Starfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
    </div>
  );
}
