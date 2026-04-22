import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';

// Cinematic opener. A single photograph fills the viewport, drifts slowly as
// you scroll, and a restrained wordmark/tagline breathes into view. No
// auto-play video — weight comes from typography and composition, not noise.
const HeroSection = ({ featured }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY    = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);
  const textY     = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const fade      = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const src = featured?.hero || featured?.poster;

  return (
    <section
      ref={ref}
      className="relative h-screen h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <SmartImage
          src={src}
          alt={featured?.title || 'Mountain hero'}
          palette={featured?.palette}
          className="h-full w-full"
          priority
        />
      </motion.div>

      {/* Vignette + bottom gradient that never flattens the photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-ink-900/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.45)_100%)]" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:px-8 sm:pb-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] uppercase tracking-[0.28em] text-frost-200/90"
        >
          Kirneshflix — A photography journal
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="display mt-5 text-[13vw] leading-[0.95] sm:text-[88px] md:text-[104px] lg:text-[124px]"
        >
          Notes from
          <br />
          above the clouds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-[17px] leading-relaxed text-frost-200/90"
        >
          A cinematic journal of altitude. Stories from the high Himalaya —
          light, weather, and the small, quiet things the mountains say when
          you listen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {featured ? (
            <Link to={`/trek/${featured.id}`} className="btn-pill btn-primary">
              Watch {featured.title}
              <Arrow />
            </Link>
          ) : null}
          <a href="#stories" className="btn-pill btn-ghost">
            Browse stories
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-frost-200/70">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-6 w-px bg-frost-200/60"
          />
        </div>
      </motion.div>
    </section>
  );
};

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HeroSection;
