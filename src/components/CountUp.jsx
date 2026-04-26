import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

// Animates a number from 0 to `value` the first time the component enters
// the viewport. Handles comma-formatted integers and an optional suffix.
const CountUp = ({ value, suffix = '', className = '' }) => {
  const ref       = useRef(null);
  const triggered = useRef(false);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (!isFinite(numericValue)) { setDisplay(String(value)); return; }

    if (prefersReduced) { setDisplay(fmt(numericValue)); return; }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      observer.disconnect();

      const obj = { val: 0 };
      animate(obj, {
        val:      numericValue,
        duration: 1600,
        ease:     'out(4)',
        onUpdate: () => setDisplay(fmt(obj.val)),
        onComplete: () => setDisplay(fmt(numericValue)),
      });
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {display}{suffix}
    </span>
  );
};

const fmt = (n) => Math.round(n).toLocaleString('en-IN');

export default CountUp;
