import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmartImage from './SmartImage';

// Apple-style "Featured Film" card — full-width cinema frame with parallax
// on the image and a refined caption block. Made for one, singular story.
const FeaturedStory = ({ trek }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  if (!trek) return null;

  return (
    <section ref={ref} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-frost-300">
          <span className="h-px w-6 bg-frost-400" />
          Featured Story
        </div>

        <div className="relative overflow-hidden rounded-[32px] shadow-glass">
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

            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.26em] text-frost-200/90">
                {trek.region}
              </div>
              <h3 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl text-frost-50">
                {trek.title}
              </h3>
              <p className="mt-3 text-[15px] sm:text-[16px] text-frost-200/90 max-w-lg">
                {trek.tagline || trek.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-frost-200/85">
                <Meta label="Altitude"  value={`${trek.altitudeFt?.toLocaleString()} ft`} />
                <Meta label="Duration"  value={trek.duration} />
                <Meta label="Season"    value={trek.season} />
                <Meta label="Grade"     value={trek.difficulty} />
              </div>

              <div className="mt-8 flex gap-3">
                <Link to={`/trek/${trek.id}`} className="btn-pill btn-primary">
                  Open the story
                </Link>
                <Link to={`/trek/${trek.id}#gallery`} className="btn-pill btn-ghost">
                  See the photographs
                </Link>
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
    <span className="text-[10px] uppercase tracking-[0.22em] text-frost-400">
      {label}
    </span>
    <span className="tabular text-frost-100">{value}</span>
  </div>
);

export default FeaturedStory;
