import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { sampleTreks } from '../data/treks';

// Load treks from Firestore; fall back to curated sample content when the
// collection is empty, offline, or errors. Admin-uploaded treks always win.
export function useTreks() {
  const [treks, setTreks] = useState(sampleTreks);
  const [source, setSource] = useState('sample'); // 'sample' | 'firestore'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'treks'));
        if (cancelled) return;
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setTreks(docs);
          setSource('firestore');
        }
      } catch {
        // keep samples
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { treks, loading, source };
}
