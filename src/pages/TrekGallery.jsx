import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmartImage from '../components/SmartImage';
import MasonryGallery from '../components/MasonryGallery';
import Lightbox from '../components/Lightbox';
import KineticTitle from '../components/KineticTitle';
import CountUp from '../components/CountUp';
import { useTrek } from '../lib/useTrek';
import { useTreks } from '../lib/useTreks';
import TrekCard from '../components/TrekCard';

const TrekGallery = () => {
  const { id } = useParams();
  const { trek, media, loading } = useTrek(id);
  const { treks } = useTreks();
  const [lbIndex, setLbIndex] = useState(null);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  if (loading && !trek) return <Skeleton />;

  if (!trek) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="display text-4xl text-parchment-50">This trek is not on file.</h1>
        <p className="mt-3 font-semibold text-parchment-300">It may have been archived or never added.</p>
        <Link to="/" className="btn-pill btn-ghost mt-8">Return home</Link>
      </div>
    );
  }

  const heroSrc = trek.hero || trek.poster || trek.posterUrl;
  const gallery = media?.length ? media : (trek.gallery || []);
  const normalized = gallery.map((m, i) => ({
    id: m.id || i,
    url: m.url || m.imageUrl || m.posterUrl,
    caption: m.caption || m.title || '',
  }));

  const related = treks.filter(t => t.id !== trek.id).slice(0, 6);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <section ref={ref} className="relative h-[86svh] min-h-[560px] w-full overflow-hidden">
        <motion.div style={{ y: imgY, scale: 1.08 }} className="absolute inset-0">
          <SmartImage src={heroSrc} alt={trek.title} palette={trek.palette} className="h-full w-full" priority />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-dusk-950/30 via-transparent to-dusk-950/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-dusk-950/65 via-dusk-950/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_35%_at_80%_5%,_rgba(255,209,102,0.10),_transparent)]" />

        <motion.div
          style={{ opacity: fade }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 sm:px-8 sm:pb-24"
        >
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-[13px] font-bold text-lantern-300/90 hover:text-lantern-300">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All stories
          </Link>

          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-lantern-500">
            {trek.region || 'Himalaya'}
          </div>
          <KineticTitle
            text={trek.title}
            tag="h1"
            className="display mt-3 text-[14vw] leading-[0.95] sm:text-[72px] md:text-[92px] lg:text-[112px] text-parchment-50"
            delay={200}
            charDelay={30}
          />
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] font-semibold leading-relaxed text-parchment-100/90">
            {trek.tagline || trek.subtitle || trek.description}
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 -mt-10 px-6 sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat label="Altitude"   value={trek.altitudeFt ? `${trek.altitudeFt.toLocaleString()} ft` : '—'} />
          <Stat label="Duration"   value={trek.duration || '—'} />
          <Stat label="Season"     value={trek.season || '—'} />
          <Stat label="Difficulty" value={trek.difficulty || '—'} />
        </div>
      </section>

      {trek.description ? (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-lantern-500">The story</div>
            <p className="display mt-5 text-2xl sm:text-3xl leading-snug text-parchment-100">{trek.description}</p>
          </div>
        </section>
      ) : null}

      <section id="gallery" className="pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-lantern-500">Photographs</div>
              <h2 className="display mt-2 text-3xl sm:text-4xl text-parchment-50">The frames.</h2>
            </div>
            <span className="tabular text-[12px] font-bold text-parchment-400">
              {normalized.length} {normalized.length === 1 ? 'image' : 'images'}
            </span>
          </div>

          {normalized.length > 0 ? (
            <MasonryGallery items={normalized} palette={trek.palette} onOpen={(i) => setLbIndex(i)} />
          ) : (
            <div className="glass rounded-[28px] p-10 text-center">
              <p className="font-semibold text-parchment-200">The gallery for this story is still being selected.</p>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-6 text-[11px] font-bold uppercase tracking-[0.28em] text-lantern-500">Continue exploring</div>
            <div className="flex gap-5 overflow-x-auto scrollbar-none">
              {related.map(r => <TrekCard key={r.id} trek={r} aspect="4/5" />)}
            </div>
          </div>
        </section>
      ) : null}

      <Lightbox items={normalized} index={lbIndex} onClose={() => setLbIndex(null)} onChange={setLbIndex} palette={trek.palette} />
    </motion.div>
  );
};

const Stat = ({ label, value }) => {
  const numeric = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
  const suffix  = String(value || '').replace(/[0-9,.]/g, '').trim();
  const isNum   = isFinite(numeric) && numeric > 0;
  return (
    <div className="glass rounded-2xl px-5 py-4" style={{ background: 'linear-gradient(145deg, rgba(255,244,217,0.08), rgba(255,209,102,0.03))' }}>
      <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-lantern-500/80">{label}</div>
      <div className="mt-1 text-[17px] font-bold text-parchment-50">
        {isNum ? <CountUp value={numeric} suffix={suffix ? ` ${suffix}` : ''} /> : <span className="tabular">{value || '—'}</span>}
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="flex min-h-[80vh] items-center justify-center">
    <div className="flex items-center gap-3 text-parchment-300 text-[13px] font-semibold">
      <div className="h-2 w-2 rounded-full bg-lantern-300 animate-breathe" />
      Loading the story…
    </div>
  </div>
);

export default TrekGallery;
