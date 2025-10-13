import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Gallery from '../components/Gallery';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const TrekGallery = () => {
  const { id } = useParams();
  const [trek, setTrek] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrekAndMedia = async () => {
      try {
        // Fetch trek details
        const trekDoc = await getDoc(doc(db, 'treks', id));
        if (trekDoc.exists()) {
          setTrek({ id: trekDoc.id, ...trekDoc.data() });
        }

        // Fetch media for this trek
        const mediaCollection = collection(db, 'treks', id, 'media');
        const mediaSnapshot = await getDocs(mediaCollection);
        const mediaList = mediaSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMedia(mediaList);
      } catch (error) {
        console.error('Error fetching trek and media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrekAndMedia();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl font-bold text-white">Trek not found</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-20"
    >
      {/* Hero section for the trek */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden mb-12">
        <img
          src={trek.posterUrl}
          alt={trek.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {trek.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {trek.description}
          </motion.p>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Gallery
          </motion.h2>

          {media.length > 0 ? (
            <Gallery media={media} />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No media available for this trek yet.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default TrekGallery;
