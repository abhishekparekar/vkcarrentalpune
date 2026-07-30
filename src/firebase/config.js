// Firebase Configuration — NextRent Car Rental
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBX19VWQ81SAB5Hy_gkMyV6Dwx9SZgy6iI",
  authDomain: "job-portal-85414.firebaseapp.com",
  databaseURL: "https://job-portal-85414-default-rtdb.firebaseio.com",
  projectId: "job-portal-85414",
  storageBucket: "job-portal-85414.firebasestorage.app",
  messagingSenderId: "699831995778",
  appId: "1:699831995778:web:7108a85ca5f61b9ed4d39b",
  measurementId: "G-P77QFV6VHB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics (browser only)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
