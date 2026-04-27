import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';
import CountUp from './CountUp';
import useScrollStagger from '../hooks/useScrollStagger';

const BentoGrid = ({ treks }) => {
  if (!treks || treks.length === 0) return null;

  const highest = [...treks].sort((a, b) => (b.altitudeFt || 0) - (a.altitudeFt || 0))[0];
  const longest = [...treks].sort((a, b) => {
    const d = (s) => parseInt(String(s?.duration || '').match(/\d+/)?.[0] || '0', 10);
    return d(b) - d(a);
  })[0];
  const winter = treks.find(t => /Dec|Jan|Feb/i.test(t.season || '')) || treks[1];
  const recent = treks[0];

  const gridRef = useScrollStagger({ y: 40, charDelay: 55, threshold: 0.08 });

  return (
    <section className="py-20 sm:py-28" id="journal">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-lantern-500">The Journal</div>
          <h2 className="display mt-3 text-3xl sm:text-4xl text-parchment-50">Small things the mountain said.</h2>
          <p className="mt-3 text-[15px] font-semibold text-parchment-300">
            Not a list, not a leaderboard — just a few frames and facts that would not fit in a scrolling row.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-[repeat(3,minmax(0,180px))]"
        >
          <Tile trek={recent} className="col-span-2 md:col-span-2 md:row-span-2" eyebrow="Recent" title={recent?.title} sub={recent?.tagline || recent?.subtitle} />
          <StatTile className="col-span-1 md:col-span-1 md:row-span-1" eyebrow="Highest" value={highest?.altitudeFt} suffix=" ft" label={highest?.title} to={`/trek/${highest?.id}`} />
          <StatTile className="col-span-1 md:col-span-1 md:row-span-1" eyebrow="Longest" rawValue={longest?.duration} label={longest?.title} to={`/trek/${longest?.id}`} />
          <Tile trek={winter} className="col-span-2 md:col-span-2 md:row-span-1" eyebrow="In winter" title={winter?.title} sub={winter?.season} />
          <QuoteTile className="col-span-2 md:col-span-2 md:row-span-1" />
          <Tile trek={treks[treks.length - 1]} className="col-span-2 md:col-span-2 md:row-span-1" eyebrow="Up next" title={treks[treks.length - 1]?.title} sub={treks[treks.length - 1]?.subtitle} />
        </div>
      </div>
    </section>
  );
};

const Tile = ({ trek, className = '', eyebrow, title, sub }) => {
  if (!trek) return null;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`relative overflow-hidden rounded-[26px] shadow-lift min-h-[200px] ${className}`}
    >
      <Link to={`/trek/${trek.id}`} className="absolute inset-0 block">
        <SmartImage src={trek.poster} alt={trek.title} palette={trek.palette} className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-out hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk-950/85 via-dusk-950/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_30%_at_50%_0%,_rgba(255,209,102,0.08),_transparent)]" />
        <div className="absolute inset-x-5 bottom-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-lantern-300/90">{eyebrow}</div>
          <div className="display mt-1.5 text-xl sm:text-2xl text-parchment-50">{title}</div>
          {sub ? <div className="mt-1 text-[12.5px] font-semibold text-parchment-100/80 line-clamp-1">{sub}</div> : null}
        </div>
      </Link>
    </motion.div>
  );
};

const StatTile = ({ className = '', eyebrow, value, suffix = '', rawValue, label, to }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    className={`relative overflow-hidden rounded-[26px] glass p-5 sm:p-6 min-h-[180px] flex flex-col justify-between ${className}`}
    style={{ background: 'linear-gradient(145deg, rgba(255,244,217,0.09), rgba(255,209,102,0.04))' }}
  >
    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-lantern-500/80">{eyebrow}</div>
    <div>
      <div className="display text-4xl sm:text-5xl text-parchment-50">
        {value != null ? <CountUp value={value} suffix={suffix} /> : <span>{rawValue}</span>}
      </div>
      {to
        ? <Link to={to} className="mt-1 inline-block text-[13px] font-bold text-lantern-300 hover:text-lantern-500 transition-colors">{label} →</Link>
        : <div className="mt-1 text-[13px] font-semibold text-parchment-200">{label}</div>
      }
    </div>
  </motion.div>
);

const QuoteTile = ({ className = '' }) => (
  <div
    className={`relative overflow-hidden rounded-[26px] glass p-6 sm:p-8 flex items-center min-h-[180px] ${className}`}
    style={{ background: 'linear-gradient(135deg, rgba(255,244,217,0.07), rgba(244,162,97,0.04))' }}
  >
    <span className="absolute top-4 left-6 font-serif text-[72px] leading-none text-lantern-300/15 pointer-events-none select-none" aria-hidden>"</span>
    <p className="display text-[18px] sm:text-[20px] leading-snug text-parchment-100 relative z-10">
      "Mountains do not have peaks so much as pauses. This is a record of the pauses."
    </p>
  </div>
);

export default BentoGrid;
