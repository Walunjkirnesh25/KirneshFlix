import { useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { animate } from 'animejs';
import SmartImage from './SmartImage';
import KineticTitle from './KineticTitle';

const HeroSection = ({ featured }) => {
  const ref     = useRef(null);
  const imgRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const imageY     = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);
  const textY      = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const fade       = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const src = featured?.hero || featured?.poster;

  const handleMouseMove = useCallback((e) => {
    const el  = ref.current;
    const img = imgRef.current;
    if (!el || !img) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = (e.clientX - left - width  / 2) / width;
    const ny = (e.clientY - top  - height / 2) / height;
    animate(img, { x: nx * 28, y: ny * 18, duration: 1100, ease: 'out(3)' });
  }, []);

  const handleMouseLeave = useCallback(() => {
    animate(imgRef.current, { x: 0, y: 0, duration: 1000, ease: 'spring(1, 80, 10, 0)' });
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
        <div ref={imgRef} className="h-full w-full will-change-transform">
          <SmartImage
            src={src}
            alt={featured?.title || 'Mountain hero'}
            palette={featured?.palette}
            className="h-full w-full"
            priority
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-dusk-950/30 via-transparent to-dusk-950/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-dusk-950/70 via-dusk-950/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_85%_0%,_rgba(255,209,102,0.12),_transparent)]" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:px-8 sm:pb-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.28em] text-lantern-300/90"
        >
          <span className="h-px w-5 bg-lantern-300/70" />
          Kirneshflix — A photography journal
        </motion.span>

        <div className="mt-5">
          <KineticTitle
            text="Notes from"
            tag="div"
            className="display text-[13vw] leading-[0.95] sm:text-[88px] md:text-[104px] lg:text-[124px] text-parchment-50"
            delay={350}
            charDelay={26}
          />
          <KineticTitle
            text="above the clouds."
            tag="div"
            className="display text-[13vw] leading-[0.95] sm:text-[88px] md:text-[104px] lg:text-[124px] text-parchment-50"
            delay={650}
            charDelay={22}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-6 max-w-xl text-[17px] font-semibold leading-relaxed text-parchment-100/90"
        >
          A cinematic journal of altitude. Stories from the high Himalaya —
          light, weather, and the small, quiet things the mountains say when you listen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-8 flex flex-wrap gap-4"
        >
          {featured ? (
            <Link to={`/trek/${featured.id}`} className="btn-pill btn-primary">
              Watch {featured.title}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : null}
          <a href="#stories" className="btn-pill btn-ghost">Browse stories</a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        style={{ opacity: fade }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-lantern-300/70">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-6 w-px bg-lantern-300/50"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
