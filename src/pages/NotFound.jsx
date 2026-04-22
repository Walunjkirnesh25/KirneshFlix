import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg text-center"
      >
        <div className="text-[11px] uppercase tracking-[0.26em] text-frost-300">
          404 — Off trail
        </div>
        <h1 className="display mt-4 text-5xl sm:text-6xl">
          This path doesn't lead anywhere.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-frost-300">
          Not every wrong turn is a bad one. But this one isn't a trek — it's a
          broken link. Let's walk back.
        </p>
        <Link to="/" className="btn-pill btn-primary mt-10">
          Return to base camp
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
