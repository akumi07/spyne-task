// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBbXZzg88EHdH8ViGSxbnuB7Uk2qMfo-Dw",
  authDomain: "car-management-system-f28a9.firebaseapp.com",
  projectId: "car-management-system-f28a9",
  storageBucket: "car-management-system-f28a9.firebasestorage.app",
  messagingSenderId: "253642447112",
  appId: "1:253642447112:web:3fb408d0c4828d8093b4bd",
  measurementId: "G-R2P59T9X12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export {app,auth,storage, db, addDoc, collection};



// const auth = getAuth(app);