import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';

// Bento-style varied tile grid — the design language Apple has favoured on
// product pages. Each tile is a distinct thought, sized for its weight.
const BentoGrid = ({ treks }) => {
  if (!treks || treks.length === 0) return null;

  // Try to pick meaningful slots; fall back to first-N if unnamed.
  const highest = [...treks].sort((a, b) => (b.altitudeFt || 0) - (a.altitudeFt || 0))[0];
  const longest = [...treks].sort((a, b) => {
    const d = (s) => parseInt(String(s?.duration || '').match(/\d+/)?.[0] || '0', 10);
    return d(b) - d(a);
  })[0];
  const winter = treks.find(t => /Dec|Jan|Feb/i.test(t.season || '')) || treks[1];
  const recent = treks[0];

  return (
    <section className="py-20 sm:py-28" id="journal">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.26em] text-frost-300">
            The Journal
          </div>
          <h2 className="display mt-3 text-3xl sm:text-4xl">
            Small things the mountain said.
          </h2>
          <p className="mt-3 text-[15px] text-frost-300">
            Not a list, not a leaderboard — just a few frames and facts that
            wouldn't fit in a scrolling row.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-[repeat(3,minmax(0,180px))]">
          <Tile
            trek={recent}
            className="col-span-2 md:col-span-2 md:row-span-2"
            eyebrow="Recent"
            title={recent?.title}
            sub={recent?.tagline || recent?.subtitle}
          />

          <StatTile
            className="col-span-1 md:col-span-1 md:row-span-1"
            eyebrow="Highest"
            value={`${highest?.altitudeFt?.toLocaleString()} ft`}
            label={highest?.title}
            to={`/trek/${highest?.id}`}
          />

          <StatTile
            className="col-span-1 md:col-span-1 md:row-span-1"
            eyebrow="Longest"
            value={longest?.duration}
            label={longest?.title}
            to={`/trek/${longest?.id}`}
          />

          <Tile
            trek={winter}
            className="col-span-2 md:col-span-2 md:row-span-1"
            eyebrow="In winter"
            title={winter?.title}
            sub={winter?.season}
          />

          <QuoteTile
            className="col-span-2 md:col-span-2 md:row-span-1"
            text="Mountains do not have peaks so much as pauses. This is a record of the pauses."
          />

          <Tile
            trek={treks[treks.length - 1]}
            className="col-span-2 md:col-span-2 md:row-span-1"
            eyebrow="Up next"
            title={treks[treks.length - 1]?.title}
            sub={treks[treks.length - 1]?.subtitle}
          />
        </div>
      </div>
    </section>
  );
};

const Tile = ({ trek, className = '', eyebrow, title, sub }) => {
  if (!trek) return null;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className={`relative overflow-hidden rounded-[22px] shadow-lift min-h-[200px] ${className}`}
    >
      <Link to={`/trek/${trek.id}`} className="absolute inset-0 block">
        <SmartImage
          src={trek.poster}
          alt={trek.title}
          palette={trek.palette}
          className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-5 bottom-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-frost-200/90">
            {eyebrow}
          </div>
          <div className="display mt-1.5 text-xl sm:text-2xl text-frost-50">{title}</div>
          {sub ? <div className="mt-1 text-[12.5px] text-frost-200/85 line-clamp-1">{sub}</div> : null}
        </div>
      </Link>
    </motion.div>
  );
};

const StatTile = ({ className = '', eyebrow, value, label, to }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ type: 'spring', stiffness: 280, damping: 26 }}
    className={`relative overflow-hidden rounded-[22px] glass p-5 sm:p-6 min-h-[180px] flex flex-col justify-between ${className}`}
  >
    <div className="text-[10px] uppercase tracking-[0.22em] text-frost-300">
      {eyebrow}
    </div>
    <div>
      <div className="display text-4xl sm:text-5xl tabular text-frost-50">{value}</div>
      {to ? (
        <Link to={to} className="mt-1 inline-block text-[13px] text-frost-200 hover:text-frost-50">
          {label} →
        </Link>
      ) : (
        <div className="mt-1 text-[13px] text-frost-200">{label}</div>
      )}
    </div>
  </motion.div>
);

const QuoteTile = ({ className = '', text }) => (
  <div className={`relative overflow-hidden rounded-[22px] glass p-6 sm:p-8 flex items-center min-h-[180px] ${className}`}>
    <p className="display text-[18px] sm:text-[20px] leading-snug text-frost-100">
      “{text}”
    </p>
  </div>
);

export default BentoGrid;
