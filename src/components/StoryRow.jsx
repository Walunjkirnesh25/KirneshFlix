import { useRef } from 'react';
import TrekCard from './TrekCard';

// Horizontal scroll-snap row. Chevron controls appear on hover (desktop),
// invisible on touch. Generous left padding to match the page grid.
const StoryRow = ({ title, subtitle, treks, aspect = '3/4' }) => {
  const ref = useRef(null);

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.82, 320);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <section className="relative group/row py-10 sm:py-14">
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between px-6 sm:px-8">
        <div>
          <h2 className="display text-2xl sm:text-3xl tracking-tightest">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-[14px] text-frost-300">{subtitle}</p>
          ) : null}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Chevron direction="left"  onClick={() => scrollBy(-1)} />
          <Chevron direction="right" onClick={() => scrollBy( 1)} />
        </div>
      </div>

      <div
        ref={ref}
        className="snap-row scrollbar-none flex gap-5 overflow-x-auto px-6 pb-4 sm:px-8"
      >
        {treks.map((trek) => (
          <TrekCard key={trek.id} trek={trek} aspect={aspect} />
        ))}
        <div className="w-2 flex-shrink-0" aria-hidden />
      </div>
    </section>
  );
};

const Chevron = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
    className="glass grid h-9 w-9 place-items-center rounded-full text-frost-100 hover:text-frost-50 hover:bg-white/15 transition"
  >
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={direction === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default StoryRow;
