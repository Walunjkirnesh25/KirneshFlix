import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';

// A restrained story card. Large image, soft shadow, metadata that appears
// on hover via a considered vibrancy layer — not a full black scrim.
const TrekCard = ({ trek, aspect = '3/4' }) => {
  const aspectClass =
    aspect === '3/4' ? 'aspect-[3/4]'
      : aspect === '4/5' ? 'aspect-[4/5]'
      : aspect === '16/9' ? 'aspect-[16/9]'
      : 'aspect-square';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="group relative w-[280px] flex-shrink-0 sm:w-[320px] lg:w-[360px]"
    >
      <Link
        to={`/trek/${trek.id}`}
        className="block focus:outline-none"
        aria-label={`${trek.title} — open gallery`}
      >
        <div className={`relative ${aspectClass} overflow-hidden rounded-[22px] shadow-lift`}>
          <SmartImage
            src={trek.poster}
            alt={trek.title}
            palette={trek.palette}
            className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />

          {/* Graceful bottom gradient for caption legibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Meta, always visible but subtle */}
          <div className="absolute left-5 right-5 bottom-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-frost-200/90">
              <span>{trek.region?.split(',')[0]}</span>
              <span className="h-px w-3 bg-frost-200/50" />
              <span className="tabular">{trek.altitudeFt?.toLocaleString()} ft</span>
            </div>
            <h3 className="display mt-2 text-2xl text-frost-50">{trek.title}</h3>
            <p className="mt-1 text-[13px] text-frost-200/85 line-clamp-2">
              {trek.subtitle || trek.tagline}
            </p>
          </div>

          {/* Hairline border over the image on hover — Apple's "selected" feel */}
          <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-white/25" />
        </div>
      </Link>
    </motion.div>
  );
};

export default TrekCard;
