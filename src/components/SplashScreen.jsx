import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, stagger, createDrawable } from 'animejs';

// First-load splash. The mountain peak draws itself, "Kirneshflix" letters
// cascade in with spring overshoot, then the whole overlay collapses away.
// sessionStorage prevents it showing on every navigation.
const SplashScreen = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const pathRef    = useRef(null);
  const titleRef   = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const tl = createTimeline({ defaults: { ease: 'out(3)' } });
    const drawable = createDrawable(pathRef.current);

    // 1. Draw the mountain path
    tl.add(drawable, {
      draw: ['0 0', '0 1'],
      duration: 900,
      ease: 'out(2)',
    });

    // 2. Stagger-in the title characters
    const chars = titleRef.current?.querySelectorAll('.splash-char');
    if (chars?.length) {
      tl.add(chars, {
        opacity:   [0, 1],
        y:         ['80%', '0%'],
        duration:  700,
        ease:      'spring(1, 80, 12, 0)',
        delay:     stagger(45),
      }, '-=200');
    }

    // 3. Hold, then collapse the overlay
    tl.add(overlayRef.current, {
      opacity:  [1, 0],
      scale:    [1, 1.04],
      duration: 500,
      ease:     'out(3)',
      delay:    400,
      onComplete: () => {
        setVisible(false);
        onComplete?.();
      },
    });

    return () => tl.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const letters = 'Kirneshflix'.split('');

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: '#0a0a0c' }}
      aria-hidden
    >
      {/* Animated mountain mark */}
      <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
        <path
          ref={pathRef}
          d="M3 25 L12 11 L17 18 L21 13 L29 25 Z"
          stroke="url(#sp-grad)"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="sp-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f5f7" />
            <stop offset="100%" stopColor="#9ec8ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Title with per-character wrapping */}
      <div
        ref={titleRef}
        className="mt-5 flex overflow-hidden"
        style={{
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
          fontSize: 'clamp(28px, 6vw, 48px)',
          fontWeight: 600,
          letterSpacing: '-0.035em',
          color: '#f5f5f7',
        }}
      >
        {letters.map((l, i) => (
          <span
            key={i}
            className="splash-char inline-block"
            style={{ opacity: 0, display: l === ' ' ? 'inline' : 'inline-block', minWidth: l === ' ' ? '0.3em' : undefined }}
          >
            {l}
          </span>
        ))}
      </div>

      <p
        className="mt-3 text-[11px] uppercase tracking-[0.28em]"
        style={{ color: 'rgba(161,161,166,0.8)', opacity: 0 }}
        ref={el => {
          if (!el) return;
          setTimeout(() =>
            animate(el, { opacity: [0, 1], duration: 600, delay: 700 }), 0);
        }}
      >
        Notes from above the clouds
      </p>
    </div>
  );
};

export default SplashScreen;
