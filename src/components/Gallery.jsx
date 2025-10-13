import { motion } from 'framer-motion';

const Gallery = ({ media }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative group cursor-pointer overflow-hidden rounded-lg"
        >
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <video
              src={item.url}
              className="w-full h-64 object-cover"
              controls
              muted
            />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <h4 className="text-white text-lg font-semibold">{item.title}</h4>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Gallery;
