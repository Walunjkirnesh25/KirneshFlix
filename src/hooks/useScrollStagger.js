import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

// Triggers a staggered entrance animation on direct children of `ref` the
// first time the container enters the viewport. Children start invisible (set
// in the initial params) so there's no flash before JS runs.
const useScrollStagger = ({
  y         = 50,
  opacity   = [0, 1],
  duration  = 650,
  charDelay = 80,
  ease      = 'out(3)',
  threshold = 0.15,
} = {}) => {
  const ref       = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const children = Array.from(container.children);
    if (!children.length) return;

    // Pre-hide children so they don't flash at full opacity before the animation
    if (!prefersReduced) {
      children.forEach(c => { c.style.opacity = '0'; });
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      observer.disconnect();

      if (prefersReduced) {
        children.forEach(c => { c.style.opacity = '1'; });
        return;
      }

      animate(children, {
        opacity,
        y:        [y, 0],
        duration,
        ease,
        delay:    stagger(charDelay),
      });
    }, { threshold });

    observer.observe(container);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
};

export default useScrollStagger;
