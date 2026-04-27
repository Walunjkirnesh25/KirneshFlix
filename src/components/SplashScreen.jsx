import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, stagger, createDrawable } from 'animejs';

const SplashScreen = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const pathRef    = useRef(null);
  const titleRef   = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const tl = createTimeline({ defaults: { ease: 'out(3)' } });
    const drawable = createDrawable(pathRef.current);

    tl.add(drawable, { draw: ['0 0', '0 1'], duration: 900, ease: 'out(2)' });

    const chars = titleRef.current?.querySelectorAll('.splash-char');
    if (chars?.length) {
      tl.add(chars, {
        opacity: [0, 1], y: ['80%', '0%'],
        duration: 700, ease: 'spring(1, 80, 12, 0)', delay: stagger(45),
      }, '-=200');
    }

    tl.add(overlayRef.current, {
      opacity: [1, 0], scale: [1, 1.04], duration: 500, ease: 'out(3)', delay: 450,
      onComplete: () => { setVisible(false); onComplete?.(); },
    });

    return () => tl.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const letters = 'Kirneshflix'.split('');

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #180e3c, #0f0a24 60%, #080614)' }}
      aria-hidden
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-lantern-300 animate-twinkle"
            style={{
              width:  i % 3 === 0 ? '2px' : '1px',
              height: i % 3 === 0 ? '2px' : '1px',
              left:   `${(i * 37 + 11) % 90 + 5}%`,
              top:    `${(i * 53 + 17) % 80 + 5}%`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      <div style={{ filter: 'drop-shadow(0 0 16px rgba(255,209,102,0.5))' }}>
        <svg width="72" height="72" viewBox="0 0 32 32" fill="none">
          <path
            ref={pathRef}
            d="M3 25 L12 11 L17 18 L21 13 L29 25 Z"
            stroke="url(#sp-grad)"
            strokeWidth="1.8"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="sp-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd166" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div
        ref={titleRef}
        className="mt-5 flex overflow-hidden"
        style={{
          fontFamily: '"Nunito", system-ui, sans-serif',
          fontSize: 'clamp(28px, 6vw, 52px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#fffdf5',
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
        className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em]"
        style={{ color: 'rgba(255,209,102,0.7)', opacity: 0 }}
        ref={el => {
          if (!el) return;
          setTimeout(() => animate(el, { opacity: [0, 1], duration: 600, delay: 750 }), 0);
        }}
      >
        Notes from above the clouds
      </p>
    </div>
  );
};

export default SplashScreen;
