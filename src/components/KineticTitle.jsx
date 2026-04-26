import { useEffect, useRef } from 'react';
import { animate, stagger, split } from 'animejs';

// Text reveal — characters emerge from below through a clipping overflow.
// Each char is wrapped in an overflow-hidden span so the entrance feels like
// letters being lifted out of a stage rather than simply fading in.
const KineticTitle = ({
  text,
  tag: Tag = 'h1',
  className = '',
  delay = 0,
  charDelay = 28,
  // Allow disabling for reduced-motion
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const splitter = split(ref.current);
    const chars = splitter.chars;

    // Wrap each char's parent in an overflow-hidden clip-box so the entrance
    // looks like it's being revealed through a slot.
    chars.forEach(char => {
      const wrapper = document.createElement('span');
      wrapper.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom; line-height:1.1';
      char.parentNode.insertBefore(wrapper, char);
      wrapper.appendChild(char);
    });

    const anim = animate(chars, {
      y:       ['105%', '0%'],
      opacity: [0, 1],
      duration: 700,
      ease:    'spring(1, 90, 14, 0)',
      delay:   stagger(charDelay, { start: delay }),
    });

    return () => {
      anim.revert?.();
      splitter.revert();
    };
  }, [text, delay, charDelay]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  );
};

export default KineticTitle;
