import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-netflix-red mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-6">Lost in the Mountains</h2>
        <p className="text-gray-400 text-xl mb-8 max-w-md mx-auto">
          The page you're looking for seems to have wandered off the trail.
        </p>
        <Link
          to="/"
          className="inline-block bg-netflix-red text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
