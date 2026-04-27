import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import useMagnetic from '../hooks/useMagnetic';

const TrekCard = ({ trek, aspect = '3/4' }) => {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic({ maxTiltX: 7, maxTiltY: 10, liftZ: 6 });

  const aspectClass =
    aspect === '3/4'   ? 'aspect-[3/4]'
    : aspect === '4/5' ? 'aspect-[4/5]'
    : aspect === '16/9'? 'aspect-[16/9]'
    : 'aspect-square';

  return (
    <div className="w-[280px] flex-shrink-0 sm:w-[320px] lg:w-[360px]" style={{ perspective: '900px' }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative cursor-pointer will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Link to={`/trek/${trek.id}`} className="block focus:outline-none" aria-label={`${trek.title} — open gallery`}>
          <div className={`relative ${aspectClass} overflow-hidden rounded-[28px] shadow-lift`}>
            <SmartImage
              src={trek.poster}
              alt={trek.title}
              palette={trek.palette}
              className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dusk-950/85 via-dusk-950/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,_rgba(255,209,102,0.06),_transparent)]" />

            <div className="absolute left-5 right-5 bottom-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-lantern-300/90">
                <span>{trek.region?.split(',')[0]}</span>
                <span className="h-px w-3 bg-lantern-300/50" />
                <span className="tabular">{trek.altitudeFt?.toLocaleString()} ft</span>
              </div>
              <h3 className="display mt-2 text-[22px] text-parchment-50">{trek.title}</h3>
              <p className="mt-1 text-[13px] font-semibold text-parchment-100/80 line-clamp-2">
                {trek.subtitle || trek.tagline}
              </p>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-lantern-300/0 transition-all duration-300 group-hover:ring-lantern-300/30" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TrekCard;
