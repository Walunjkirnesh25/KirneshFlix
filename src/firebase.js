import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB2WDU3FmB2_3LAHcRxIKn7nH4NFlyfM6c",
  authDomain: "kirneshflix-20fbf-bdfc1.firebaseapp.com",
  projectId: "kirneshflix-20fbf-bdfc1",
  storageBucket: "kirneshflix-20fbf-bdfc1.firebasestorage.app",
  messagingSenderId: "943600726452",
  appId: "1:943600726452:web:0952e5403a371a509fc2e1",
  measurementId: "G-GBD5EXBBKH"
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// Analytics only runs in browser environments that support it
// (blocked in Safari private mode / some ad-blockers — guard with isSupported).
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
