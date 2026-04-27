import { useEffect, useRef } from 'react';
import { animate, createTimeline, createDrawable, stagger } from 'animejs';

const Wordmark = ({ size = 'md', className = '' }) => {
  const pathRef  = useRef(null);
  const starRef  = useRef(null);
  const textRef  = useRef(null);
  const dim  = size === 'lg' ? 30 : size === 'sm' ? 18 : 22;
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-[17px]';

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !pathRef.current) return;

    const drawable = createDrawable(pathRef.current);
    const chars    = textRef.current?.querySelectorAll('.wm-char');

    const tl = createTimeline({ defaults: { ease: 'out(3)' } });

    tl.add(drawable, { draw: ['0 0', '0 1'], duration: 750, ease: 'out(2)' });

    if (starRef.current) {
      tl.add(starRef.current, {
        scale: [0, 1], opacity: [0, 1], duration: 400, ease: 'spring(1, 80, 12, 0)',
      }, '-=200');
    }

    if (chars?.length) {
      tl.add(chars, {
        opacity: [0, 1], y: ['40%', '0%'], duration: 500,
        ease: 'spring(1, 80, 12, 0)', delay: stagger(24),
      }, '-=350');
    }

    return () => tl.revert?.();
  }, [size]);

  const letters = 'Kirneshflix'.split('');

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={dim} height={dim} viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="peak-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd166" />
            <stop offset="100%" stopColor="#f4a261" />
          </linearGradient>
          <filter id="peak-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path
          ref={pathRef}
          d="M3 25 L12 11 L17 18 L21 13 L29 25 Z"
          stroke="url(#peak-grad)"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#peak-glow)"
        />
        <circle ref={starRef} cx="22" cy="6.5" r="1.8" fill="#ffd166" opacity="0.95" style={{ transformOrigin: '22px 6.5px' }} />
      </svg>

      <span ref={textRef} className={`display ${text} text-parchment-50 flex`} aria-label="Kirneshflix">
        {letters.map((l, i) => (
          <span key={i} className="wm-char" style={{ opacity: 0 }}>{l}</span>
        ))}
      </span>
    </div>
  );
};

export default Wordmark;
