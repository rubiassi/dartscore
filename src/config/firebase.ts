import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Tjek om miljøvariablerne er tilgængelige
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error('Firebase API Key mangler i .env filen');
}

// Din Firebase konfiguration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Log konfigurationen (fjern i produktion)
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: 'HIDDEN' // Skjul API nøglen i loggen
});

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Hent Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app; 