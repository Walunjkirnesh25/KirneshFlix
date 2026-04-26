import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

// A soft radial alpine-blue glow that follows the cursor across the whole
// page. Pure CSS pointer-events:none so it never interferes with clicks.
const CursorGlow = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) { el.style.display = 'none'; return; }

    let currentAnim = null;

    const onMove = (e) => {
      currentAnim?.pause();
      currentAnim = animate(el, {
        left:    e.clientX,
        top:     e.clientY,
        opacity: 1,
        duration: 900,
        ease:    'out(3)',
      });
    };

    const onLeave = () => {
      animate(el, { opacity: 0, duration: 600 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        width:           '520px',
        height:          '520px',
        borderRadius:    '50%',
        background:      'radial-gradient(circle, rgba(95,180,255,0.10) 0%, transparent 70%)',
        transform:       'translate(-50%, -50%)',
        pointerEvents:   'none',
        zIndex:          0,
        opacity:         0,
        willChange:      'left, top',
      }}
    />
  );
};

export default CursorGlow;
