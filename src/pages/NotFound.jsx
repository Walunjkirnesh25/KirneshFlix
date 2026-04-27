import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="flex min-h-screen min-h-[100svh] items-center justify-center px-6 pt-20">
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className="max-w-lg text-center"
    >
      <div className="mb-6 flex justify-center" aria-hidden>
        <svg width="80" height="56" viewBox="0 0 80 56" fill="none" style={{ filter: 'drop-shadow(0 0 16px rgba(255,209,102,0.3))' }}>
          <defs>
            <linearGradient id="nf-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd166" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>
          </defs>
          <path d="M6 48 L28 14 L40 28 L52 18 L74 48 Z" stroke="url(#nf-grad)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 3" />
        </svg>
      </div>

      <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-lantern-500">404 — Off trail</div>
      <h1 className="display mt-4 text-5xl sm:text-6xl text-parchment-50">This path does not lead anywhere.</h1>
      <p className="mt-5 text-[15px] font-semibold leading-relaxed text-parchment-300">
        Not every wrong turn is a bad one. But this one is not a trek — it is a broken link. Let us walk back.
      </p>
      <Link to="/" className="btn-pill btn-primary mt-10 inline-flex">Return to base camp</Link>
    </motion.div>
  </div>
);

export default NotFound;
