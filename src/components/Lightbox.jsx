import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Lightbox = ({ items, index, onClose, onChange, palette }) => {
  const open = index !== null && index !== undefined && items?.[index];

  const next = useCallback(() => onChange?.((index + 1) % items.length), [index, items, onChange]);
  const prev = useCallback(() => onChange?.((index - 1 + items.length) % items.length), [index, items, onChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [open, next, prev, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="fixed inset-0 z-[100]"
        >
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${palette?.from || '#0f0a24'} 0%, ${palette?.to || '#180e3c'} 100%)` }}
          />
          <img src={items[index].url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-35 blur-2xl scale-110" />
          <div className="absolute inset-0 bg-dusk-950/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_50%_0%,_rgba(255,209,102,0.06),_transparent)]" />

          <button
            onClick={onClose}
            aria-label="Close"
            className="glass-strong absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full text-parchment-100 hover:text-lantern-300 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {items.length > 1 && <><NavBtn direction="left" onClick={prev} /><NavBtn direction="right" onClick={next} /></>}

          <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center p-6 sm:p-10">
            <motion.img
              key={items[index].url}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              src={items[index].url}
              alt={items[index].caption || ''}
              className="max-h-[82vh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-[0_40px_120px_rgba(8,6,20,0.7)]"
            />
            <div className="mt-5 flex items-center gap-3 text-[12px] font-semibold text-parchment-200/90">
              <span className="tabular">{index + 1} / {items.length}</span>
              {items[index].caption ? (
                <><span className="h-px w-4 bg-lantern-300/40" /><span>{items[index].caption}</span></>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NavBtn = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === 'left' ? 'Previous' : 'Next'}
    className={`glass-strong absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-parchment-100 hover:text-lantern-300 transition-colors ${
      direction === 'left' ? 'left-4 sm:left-8' : 'right-4 sm:right-8'
    }`}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d={direction === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

export default Lightbox;
