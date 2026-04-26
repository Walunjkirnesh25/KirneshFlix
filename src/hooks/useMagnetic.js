import { useRef, useCallback } from 'react';
import { animate } from 'animejs';

// 3-D magnetic tilt. The element rotates toward the cursor and snaps back
// with a spring on mouseleave. Apply the returned ref to the element you want
// to tilt; wrap it in a parent with `style={{ perspective: '800px' }}`.
const useMagnetic = ({
  maxTiltX = 10,
  maxTiltY = 14,
  liftZ    = 8,
  duration = 350,
} = {}) => {
  const ref  = useRef(null);
  const anim = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = ((e.clientX - left) / width  - 0.5) * 2;   // -1 → +1
    const ny = ((e.clientY - top)  / height - 0.5) * 2;

    anim.current?.pause();
    anim.current = animate(el, {
      rotateY:         nx * maxTiltY,
      rotateX:         -ny * maxTiltX,
      translateZ:      liftZ,
      duration,
      ease: 'out(3)',
    });
  }, [maxTiltX, maxTiltY, liftZ, duration]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    anim.current?.pause();
    anim.current = animate(el, {
      rotateY:    0,
      rotateX:    0,
      translateZ: 0,
      duration:   500,
      ease:       'spring(1, 80, 10, 0)',
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
};

export default useMagnetic;
