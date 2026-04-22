import { useState } from 'react';
import { motion } from 'framer-motion';

// CSS columns-based masonry. Each image renders at natural aspect inside a
// rounded frame; a palette gradient sits behind it so slow loads still look
// intentional. Clicking a frame opens the lightbox.
const MasonryGallery = ({ items, palette, onOpen }) => {
  return (
    <div className="columns-1 gap-4 sm:columns-2 md:gap-5 lg:columns-3">
      {items.map((item, i) => (
        <MasonryItem
          key={item.id || i}
          item={item}
          index={i}
          palette={palette}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

const MasonryItem = ({ item, index, palette, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const bg = `linear-gradient(135deg, ${palette?.from || '#14161c'} 0%, ${palette?.to || '#2a2e38'} 100%)`;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="mb-4 md:mb-5 break-inside-avoid"
    >
      <button
        type="button"
        onClick={() => onOpen?.(index)}
        className="group relative block w-full overflow-hidden rounded-[18px] shadow-lift focus:outline-none"
        style={{ background: bg }}
        aria-label={item.caption || 'Open photograph'}
      >
        <img
          src={item.url}
          alt={item.caption || ''}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`block h-auto w-full img-blur-up ${loaded ? 'loaded' : ''} transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]`}
        />
        {item.caption ? (
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-[12.5px] text-frost-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {item.caption}
          </figcaption>
        ) : null}
      </button>
    </motion.figure>
  );
};

export default MasonryGallery;
