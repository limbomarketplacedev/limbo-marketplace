// config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAWDuZrty90pvqChu-_9jXOcBEJxBCax5w",
  authDomain: "limbo-marketplace-19a44.firebaseapp.com",
  projectId: "limbo-marketplace-19a44",
  storageBucket: "limbo-marketplace-19a44.firebasestorage.app",
  messagingSenderId: "794436733780",
  appId: "1:794436733780:web:138a71f1f66ee78cefd6c1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

