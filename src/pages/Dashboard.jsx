import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState({ title: '', description: '', posterFile: null });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, uploaded: 0, total: 0 });
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    fetchTreks();
  }, [currentUser, navigate]);

  const fetchTreks = async () => {
    try {
      const snap = await getDocs(collection(db, 'treks'));
      setTreks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const compressImage = (file) =>
    new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const maxSize = 1600;
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width; canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', 0.85);
      };
      img.src = URL.createObjectURL(file);
    });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!draft.posterFile) return;
    setUploading(true); setProgress({ pct: 0, uploaded: 0, total: 0 }); setUploadError('');
    try {
      const compressed = await compressImage(draft.posterFile);
      const posterRef = ref(storage, `trek-posters/${Date.now()}-${draft.posterFile.name}`);
      const task = uploadBytesResumable(posterRef, compressed);
      task.on('state_changed',
        (snap) => {
          const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress({ pct: Math.round(pct), uploaded: snap.bytesTransferred, total: snap.totalBytes });
        },
        (err) => { console.error(err); setUploadError(`Upload failed: ${err.message}`); setUploading(false); },
        async () => {
          const posterUrl = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, 'treks'), {
            title: draft.title, description: draft.description,
            posterUrl, poster: posterUrl, hero: posterUrl, createdAt: new Date(),
          });
          setDraft({ title: '', description: '', posterFile: null });
          setProgress({ pct: 0, uploaded: 0, total: 0 });
          setComposing(false); setUploading(false); fetchTreks();
        }
      );
    } catch (err) { console.error(err); setUploading(false); }
  };

  const handleDelete = async (trekId, posterUrl) => {
    if (!confirm('Remove this story? This cannot be undone.')) return;
    try {
      if (posterUrl) { try { await deleteObject(ref(storage, posterUrl)); } catch { /* ignore */ } }
      await deleteDoc(doc(db, 'treks', trekId));
      fetchTreks();
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-parchment-300">
        <div className="flex items-center gap-3 text-[13px] font-semibold">
          <div className="h-2 w-2 rounded-full bg-lantern-300 animate-breathe" />
          Opening the studio…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100svh] pt-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-lantern-500">Studio</div>
            <h1 className="display mt-2 text-4xl sm:text-5xl text-parchment-50">Your archive.</h1>
            <p className="mt-2 font-semibold text-parchment-300">Add stories, edit metadata, curate the collections that open the app.</p>
          </div>
          <button onClick={() => setComposing(v => !v)} className={`btn-pill ${composing ? 'btn-ghost' : 'btn-primary'}`}>
            {composing ? 'Close composer' : '＋ New story'}
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {composing && (
            <motion.form
              onSubmit={handleAdd}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              className="glass-strong mb-10 rounded-[28px] p-6 sm:p-8 shadow-glass"
            >
              <h2 className="display text-2xl text-parchment-50">A new story</h2>
              <p className="mt-1 text-[13px] font-semibold text-parchment-300">
                Start with a title and a single hero image. You can add a full gallery after.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Title" placeholder="e.g. Kedarkantha" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
                <FileField label="Hero image" file={draft.posterFile} onChange={(f) => setDraft({ ...draft, posterFile: f })} />
                <div className="sm:col-span-2">
                  <TextAreaField label="Description" rows={3} placeholder="A few sentences on the feeling of the trek." value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} required />
                </div>
              </div>

              {uploading && (
                <div className="mt-6">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-lantern-300/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #ffd166, #f4a261)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.pct}%` }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                  <p className="mt-2 text-[12px] tabular font-semibold text-parchment-300">
                    Uploading · {progress.pct}% · {(progress.uploaded/1024/1024).toFixed(2)} MB / {(progress.total/1024/1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-[13px] font-semibold text-coral">{uploadError}</div>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <button type="submit" disabled={uploading} className="btn-pill btn-primary disabled:opacity-60">
                  {uploading ? 'Uploading…' : 'Publish story'}
                </button>
                <button type="button" onClick={() => setComposing(false)} className="btn-pill btn-ghost">Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {treks.length === 0 ? (
          <div className="glass rounded-[28px] p-10 text-center">
            <p className="display text-xl text-parchment-50">Your archive is empty — for now.</p>
            <p className="mt-2 text-[14px] font-semibold text-parchment-300">
              Until you add your own stories, the public site shows a curated sample.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treks.map((t) => (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                className="glass overflow-hidden rounded-[24px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={t.poster || t.posterUrl} alt={t.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dusk-950/70 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="display text-lg text-parchment-50">{t.title}</h3>
                  <p className="mt-1 text-[13px] font-semibold text-parchment-300 line-clamp-2">{t.description || t.subtitle || '—'}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Link to={`/trek/${t.id}`} className="btn-pill btn-ghost text-[12px] py-1.5 px-3">Open</Link>
                    <button
                      onClick={() => handleDelete(t.id, t.poster || t.posterUrl)}
                      className="btn-pill text-[12px] py-1.5 px-3 bg-coral/12 text-coral border border-coral/25 hover:bg-coral/22 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, ...rest }) => (
  <label className="block">
    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-parchment-300">{label}</span>
    <input {...rest} className="w-full rounded-2xl border border-lantern-300/10 bg-lantern-300/5 px-4 py-3 text-[15px] font-semibold text-parchment-50 placeholder-parchment-400 transition focus:border-lantern-300/40 focus:outline-none" />
  </label>
);

const TextAreaField = ({ label, ...rest }) => (
  <label className="block">
    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-parchment-300">{label}</span>
    <textarea {...rest} className="w-full rounded-2xl border border-lantern-300/10 bg-lantern-300/5 px-4 py-3 text-[15px] font-semibold text-parchment-50 placeholder-parchment-400 transition focus:border-lantern-300/40 focus:outline-none" />
  </label>
);

const FileField = ({ label, file, onChange }) => (
  <label className="block">
    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-parchment-300">{label}</span>
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-lantern-300/20 bg-lantern-300/[0.03] px-4 py-3">
      <input type="file" accept="image/*" required onChange={(e) => onChange(e.target.files[0])} className="block w-full text-[13px] font-semibold text-parchment-300 file:mr-4 file:rounded-full file:border-0 file:bg-lantern-300/15 file:px-3 file:py-1.5 file:text-[12px] file:font-bold file:text-lantern-300 hover:file:bg-lantern-300/25" />
      {file ? <span className="tabular text-[12px] font-semibold text-parchment-300">{(file.size/1024/1024).toFixed(1)} MB</span> : null}
    </div>
  </label>
);

export default Dashboard;
