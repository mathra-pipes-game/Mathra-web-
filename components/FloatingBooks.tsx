// Pure CSS 3D books: no WebGL, so they run smoothly on phones.
// The spin is disabled automatically under prefers-reduced-motion (see globals.css).

const BOOKS = [
  { hue: '#7c3aed', x: '-10%', y: '8%', size: 150, delay: '0s' },
  { hue: '#3b82f6', x: '55%', y: '-4%', size: 120, delay: '1.4s' },
  { hue: '#e5b84b', x: '20%', y: '55%', size: 96, delay: '2.6s' },
];

export function FloatingBooks() {
  return (
    <div aria-hidden="true" className="book-scene pointer-events-none absolute inset-0">
      {BOOKS.map((b, i) => (
        <div
          key={i}
          className="animate-float-y absolute"
          style={{ left: b.x, top: b.y, animationDelay: b.delay }}
        >
          <div className="book-3d" style={{ width: b.size, height: b.size * 1.35 }}>
            <div
              className="book-face"
              style={{
                background: `linear-gradient(145deg, ${b.hue}, #120726 85%)`,
                boxShadow: `0 0 40px -6px ${b.hue}aa`,
              }}
            />
            <div
              className="book-spine"
              style={{ background: `linear-gradient(90deg, #e5b84b, ${b.hue})` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
