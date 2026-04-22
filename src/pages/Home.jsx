import { useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedStory from '../components/FeaturedStory';
import StoryRow from '../components/StoryRow';
import BentoGrid from '../components/BentoGrid';
import { useTreks } from '../lib/useTreks';
import { collections as sampleCollections } from '../data/treks';

const Home = () => {
  const { treks, source } = useTreks();

  const featured = useMemo(
    () => treks.find(t => t.featured) || treks[0],
    [treks]
  );

  // Build a secondary feature distinct from the primary, for rhythm.
  const secondary = useMemo(
    () => treks.find(t => t.featured && t.id !== featured?.id) || treks[1] || null,
    [treks, featured]
  );

  // Resolve collection trek IDs against the active dataset.
  const resolveCollection = (c) => ({
    ...c,
    items: c.trekIds
      .map(id => treks.find(t => t.id === id || t.slug === id))
      .filter(Boolean),
  });

  const activeCollections = useMemo(() => {
    if (source === 'firestore') {
      // Build organic collections from the firestore data so we don't rely on
      // sample-only IDs. A single "Recently added" row is enough for truth.
      return [{
        id: 'recent',
        title: 'Recently added',
        subtitle: 'The newest stories.',
        items: treks.slice(0, 10),
      }];
    }
    return sampleCollections.map(resolveCollection).filter(c => c.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treks, source]);

  return (
    <div className="relative">
      <HeroSection featured={featured} />

      <section id="stories" className="relative z-[2] -mt-10 sm:-mt-16" />

      {activeCollections.map((c, i) => (
        <StoryRow
          key={c.id}
          title={c.title}
          subtitle={c.subtitle}
          treks={c.items}
          aspect={i === 0 ? '3/4' : '4/5'}
        />
      ))}

      {secondary ? <FeaturedStory trek={secondary} /> : null}

      <BentoGrid treks={treks} />

      <Credo />
    </div>
  );
};

const Credo = () => (
  <section id="about" className="py-24 sm:py-32">
    <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
      <div className="text-[11px] uppercase tracking-[0.26em] text-frost-300">
        A note from Kirnesh
      </div>
      <p className="display mt-6 text-3xl sm:text-4xl leading-tight">
        I don't photograph mountains. I photograph <span className="text-alpine-300">time</span>,
        passing over them.
      </p>
      <p className="mt-6 text-[16px] leading-relaxed text-frost-200/90">
        Kirneshflix is a quiet place to put the photographs I care most about —
        organised like stories, paced like a film. Every trek here is one I've
        walked; every frame, one I'll still defend ten years from now.
      </p>
    </div>
  </section>
);

export default Home;
