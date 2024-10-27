import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCBQir89yQmEUxpymreUnFAVo9NWz28f9U",
  authDomain: "church-app-a9ecc.firebaseapp.com",
  projectId: "church-app-a9ecc",
  storageBucket: "church-app-a9ecc.appspot.com",
  messagingSenderId: "673739783284",
  appId: "1:673739783284:web:a834efec33c634fc506521",
  measurementId: "G-2C2NL47KTK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';

try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Persistence not supported by browser');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}

// Error handling for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in');
  } else {
    console.log('User is signed out');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});