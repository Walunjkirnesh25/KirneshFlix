import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmartImage from './SmartImage';

const FeaturedStory = ({ trek }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  if (!trek) return null;

  return (
    <section ref={ref} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-lantern-500">
          <span className="h-px w-6 bg-lantern-500/60" />
          Featured Story
        </div>

        <div className="relative overflow-hidden rounded-[36px] shadow-lift">
          <div className="relative aspect-[16/10] sm:aspect-[16/8]">
            <motion.div style={{ y: imageY }} className="absolute inset-[-8%]">
              <SmartImage
                src={trek.hero || trek.poster}
                alt={trek.title}
                palette={trek.palette}
                className="h-full w-full"
                priority
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-r from-dusk-950/85 via-dusk-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-dusk-950/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_-10%,_rgba(255,209,102,0.1),_transparent)]" />

            <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-2xl">
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-lantern-300/90">
                {trek.region}
              </div>
              <h3 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl text-parchment-50">
                {trek.title}
              </h3>
              <p className="mt-3 text-[15px] sm:text-[16px] font-semibold text-parchment-100/90 max-w-lg">
                {trek.tagline || trek.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-parchment-200/85">
                <Meta label="Altitude" value={`${trek.altitudeFt?.toLocaleString()} ft`} />
                <Meta label="Duration" value={trek.duration} />
                <Meta label="Season"   value={trek.season} />
                <Meta label="Grade"    value={trek.difficulty} />
              </div>

              <div className="mt-8 flex gap-3">
                <Link to={`/trek/${trek.id}`} className="btn-pill btn-primary">Open the story</Link>
                <Link to={`/trek/${trek.id}#gallery`} className="btn-pill btn-ghost">See the photographs</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Meta = ({ label, value }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-lantern-500/80">{label}</span>
    <span className="tabular font-semibold text-parchment-100">{value}</span>
  </div>
);

export default FeaturedStory;
