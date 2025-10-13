import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TrekPoster = ({ trek }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <Link to={`/trek/${trek.id}`}>
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img
            src={trek.posterUrl}
            alt={trek.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-white text-xl font-bold mb-2">{trek.title}</h3>
              <p className="text-gray-300 text-sm">{trek.description}</p>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 border-2 border-netflix-red opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TrekPoster;
