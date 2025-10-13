// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQr81W1pZn2phYVMnhkyN4CijpI20GUxA",
  authDomain: "kirneshflix-20fbf.firebaseapp.com",
  projectId: "kirneshflix-20fbf",
  storageBucket: "kirneshflix-20fbf.firebasestorage.app",
  messagingSenderId: "301848868981",
  appId: "1:301848868981:web:5dc9a50e58fb58de11a03c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
