import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { sampleTreks, findTrek } from '../data/treks';

// Load a single trek + its gallery. Firestore first, sample fallback.
export function useTrek(idOrSlug) {
  const fallback = findTrek(idOrSlug, sampleTreks);
  const [trek, setTrek] = useState(fallback || null);
  const [media, setMedia] = useState(fallback?.gallery || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ref = doc(db, 'treks', idOrSlug);
        const snap = await getDoc(ref);
        if (cancelled) return;
        if (snap.exists()) {
          setTrek({ id: snap.id, ...snap.data() });
          const mSnap = await getDocs(collection(db, 'treks', idOrSlug, 'media'));
          if (!cancelled && !mSnap.empty) {
            setMedia(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          }
        }
      } catch {
        // keep fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [idOrSlug]);

  return { trek, media, loading };
}
