import { useEffect, useRef } from 'react';
import { animate, createTimeline, createDrawable, stagger } from 'animejs';

// The mountain peak draws itself every time the nav mounts, then the wordmark
// text characters fade in with a brief stagger. Keeps the entry feel alive
// across page navigations.
const Wordmark = ({ size = 'md', className = '' }) => {
  const pathRef  = useRef(null);
  const textRef  = useRef(null);
  const dim  = size === 'lg' ? 28 : size === 'sm' ? 16 : 20;
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base';

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !pathRef.current) return;

    const drawable = createDrawable(pathRef.current);
    const chars    = textRef.current?.querySelectorAll('.wm-char');

    const tl = createTimeline({ defaults: { ease: 'out(3)' } });

    tl.add(drawable, {
      draw:     ['0 0', '0 1'],
      duration: 650,
      ease:     'out(2)',
    });

    if (chars?.length) {
      tl.add(chars, {
        opacity:  [0, 1],
        y:        ['30%', '0%'],
        duration: 400,
        delay:    stagger(22),
      }, '-=300');
    }

    return () => tl.revert?.();
  }, [size]);

  const letters = 'Kirneshflix'.split('');

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={dim} height={dim} viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="peak-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f5f7" />
            <stop offset="100%" stopColor="#9ec8ff" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d="M3 25 L12 11 L17 18 L21 13 L29 25 Z"
          stroke="url(#peak-grad)"
          strokeWidth="1.8"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="22" cy="7.5" r="1.6" fill="#f5f5f7" opacity="0.9" />
      </svg>

      <span ref={textRef} className={`display ${text} text-frost-50 flex`} aria-label="Kirneshflix">
        {letters.map((l, i) => (
          <span key={i} className="wm-char" style={{ opacity: 0 }}>{l}</span>
        ))}
      </span>
    </div>
  );
};

export default Wordmark;
