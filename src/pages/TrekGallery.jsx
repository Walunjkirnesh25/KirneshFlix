import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmartImage from '../components/SmartImage';
import MasonryGallery from '../components/MasonryGallery';
import Lightbox from '../components/Lightbox';
import { useTrek } from '../lib/useTrek';
import { useTreks } from '../lib/useTreks';
import TrekCard from '../components/TrekCard';

const TrekGallery = () => {
  const { id } = useParams();
  const { trek, media, loading } = useTrek(id);
  const { treks } = useTreks();
  const [lbIndex, setLbIndex] = useState(null);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  if (loading && !trek) {
    return <Skeleton />;
  }

  if (!trek) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="display text-4xl">This trek isn't on file.</h1>
        <p className="mt-3 text-frost-300">It may have been archived or never added.</p>
        <Link to="/" className="btn-pill btn-ghost mt-8">Return home</Link>
      </div>
    );
  }

  const heroSrc = trek.hero || trek.poster || trek.posterUrl;
  const gallery = media?.length ? media : (trek.gallery || []);
  // Normalize admin-uploaded shapes to the gallery shape we render.
  const normalized = gallery.map((m, i) => ({
    id: m.id || i,
    url: m.url || m.imageUrl || m.posterUrl,
    caption: m.caption || m.title || '',
  }));

  const related = treks.filter(t => t.id !== trek.id).slice(0, 6);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Cinematic hero */}
      <section ref={ref} className="relative h-[86svh] min-h-[560px] w-full overflow-hidden">
        <motion.div style={{ y: imgY, scale: 1.08 }} className="absolute inset-0">
          <SmartImage
            src={heroSrc}
            alt={trek.title}
            palette={trek.palette}
            className="h-full w-full"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-ink-900/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

        <motion.div
          style={{ opacity: fade }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 sm:px-8 sm:pb-24"
        >
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-[13px] text-frost-200/90 hover:text-frost-50">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All stories
          </Link>

          <div className="text-[11px] uppercase tracking-[0.26em] text-frost-200/90">
            {trek.region || 'Himalaya'}
          </div>
          <h1 className="display mt-3 text-[14vw] leading-[0.95] sm:text-[72px] md:text-[92px] lg:text-[112px]">
            {trek.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-frost-200/90">
            {trek.tagline || trek.subtitle || trek.description}
          </p>
        </motion.div>
      </section>

      {/* Story stats strip */}
      <section className="relative z-10 -mt-10 px-6 sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat label="Altitude"  value={trek.altitudeFt ? `${trek.altitudeFt.toLocaleString()} ft` : '—'} />
          <Stat label="Duration"  value={trek.duration || '—'} />
          <Stat label="Season"    value={trek.season || '—'} />
          <Stat label="Difficulty" value={trek.difficulty || '—'} />
        </div>
      </section>

      {/* Body copy */}
      {trek.description ? (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            <div className="text-[11px] uppercase tracking-[0.26em] text-frost-300">
              The story
            </div>
            <p className="display mt-5 text-2xl sm:text-3xl leading-snug text-frost-100">
              {trek.description}
            </p>
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      <section id="gallery" className="pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-frost-300">
                Photographs
              </div>
              <h2 className="display mt-2 text-3xl sm:text-4xl">The frames.</h2>
            </div>
            <span className="tabular text-[12px] text-frost-400">
              {normalized.length} {normalized.length === 1 ? 'image' : 'images'}
            </span>
          </div>

          {normalized.length > 0 ? (
            <MasonryGallery
              items={normalized}
              palette={trek.palette}
              onOpen={(i) => setLbIndex(i)}
            />
          ) : (
            <div className="glass rounded-3xl p-10 text-center">
              <p className="text-frost-200">The gallery for this story is still being selected.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-6 text-[11px] uppercase tracking-[0.26em] text-frost-300">
              Continue watching
            </div>
            <div className="flex gap-5 overflow-x-auto scrollbar-none">
              {related.map(r => (
                <TrekCard key={r.id} trek={r} aspect="4/5" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Lightbox
        items={normalized}
        index={lbIndex}
        onClose={() => setLbIndex(null)}
        onChange={setLbIndex}
        palette={trek.palette}
      />
    </motion.div>
  );
};

const Stat = ({ label, value }) => (
  <div className="glass rounded-2xl px-5 py-4">
    <div className="text-[10px] uppercase tracking-[0.22em] text-frost-400">{label}</div>
    <div className="mt-1 tabular text-[17px] text-frost-50">{value}</div>
  </div>
);

const Skeleton = () => (
  <div className="flex min-h-[80vh] items-center justify-center">
    <div className="flex items-center gap-3 text-frost-300 text-[13px]">
      <div className="h-2 w-2 rounded-full bg-frost-300 animate-breathe" />
      Loading the story…
    </div>
  </div>
);

export default TrekGallery;
