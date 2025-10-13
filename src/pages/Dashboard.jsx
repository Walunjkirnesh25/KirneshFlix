import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTrek, setShowAddTrek] = useState(false);
  const [newTrek, setNewTrek] = useState({ title: '', description: '', posterFile: null });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ progress: 0, uploaded: 0, total: 0 });
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchTreks();
  }, [currentUser, navigate]);

  const fetchTreks = async () => {
    try {
      const treksCollection = collection(db, 'treks');
      const treksSnapshot = await getDocs(treksCollection);
      const treksList = treksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTreks(treksList);
    } catch (error) {
      console.error('Error fetching treks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrek = async (e) => {
    e.preventDefault();
    if (!newTrek.posterFile) return;

    setUploading(true);
    setUploadProgress({ progress: 0, uploaded: 0, total: 0 });
    try {
      // Compress image before upload
      const compressedFile = await compressImage(newTrek.posterFile);

      // Upload poster to Firebase Storage with progress tracking
      const posterRef = ref(storage, `trek-posters/${Date.now()}-${newTrek.posterFile.name}`);
      const uploadTask = uploadBytesResumable(posterRef, compressedFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress({
            progress: Math.round(progress),
            uploaded: snapshot.bytesTransferred,
            total: snapshot.totalBytes
          });
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadError(`Upload failed: ${error.message}`);
          setUploading(false);
        },
        async () => {
          const posterUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Add trek to Firestore
          await addDoc(collection(db, 'treks'), {
            title: newTrek.title,
            description: newTrek.description,
            posterUrl,
            createdAt: new Date()
          });

          setNewTrek({ title: '', description: '', posterFile: null });
          setShowAddTrek(false);
          setUploadProgress({ progress: 0, uploaded: 0, total: 0 });
          setUploadError('');
          setUploading(false);
          fetchTreks();
        }
      );
    } catch (error) {
      console.error('Error adding trek:', error);
      setUploading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        let { width, height } = img;
        const maxSize = 1200;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', 0.8); // 80% quality
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleDeleteTrek = async (trekId, posterUrl) => {
    if (!confirm('Are you sure you want to delete this trek?')) return;

    try {
      // Delete poster from storage
      const posterRef = ref(storage, posterUrl);
      await deleteObject(posterRef);

      // Delete trek from Firestore
      await deleteDoc(doc(db, 'treks', trekId));

      fetchTreks();
    } catch (error) {
      console.error('Error deleting trek:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your trek galleries</p>
        </motion.div>

        <div className="mb-8">
          <button
            onClick={() => setShowAddTrek(!showAddTrek)}
            className="bg-netflix-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            {showAddTrek ? 'Cancel' : 'Add New Trek'}
          </button>
        </div>

        {showAddTrek && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddTrek}
            className="bg-gray-800 p-6 rounded-lg mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Add New Trek</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trek Title
                </label>
                <input
                  type="text"
                  value={newTrek.title}
                  onChange={(e) => setNewTrek({ ...newTrek, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  placeholder="e.g., Kedarkantha Trek"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTrek.description}
                  onChange={(e) => setNewTrek({ ...newTrek, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  placeholder="Brief description of the trek"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poster Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewTrek({ ...newTrek, posterFile: e.target.files[0] })}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-netflix-red file:text-white hover:file:bg-red-700"
                />
              </div>
              {uploading && (
                <div className="mb-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-netflix-red h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">
                    Uploading... {uploadProgress.progress}% ({(uploadProgress.uploaded / 1024 / 1024).toFixed(2)} MB / {(uploadProgress.total / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
              {uploadError && (
                <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
                  <p className="text-sm text-red-300">{uploadError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-netflix-red text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Add Trek'}
              </button>
            </div>
          </motion.form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treks.map((trek) => (
            <motion.div
              key={trek.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <img
                src={trek.posterUrl}
                alt={trek.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{trek.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{trek.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/trek/${trek.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Gallery
                  </button>
                  <button
                    onClick={() => handleDeleteTrek(trek.id, trek.posterUrl)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
