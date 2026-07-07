// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // 1. ADD THIS IMPORT
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTNQirwfXhsSH6kaDilMQ4BTqSqkYFfjw",
  authDomain: "toolify-3d.firebaseapp.com",
  projectId: "toolify-3d",
  storageBucket: "toolify-3d.firebasestorage.app",
  messagingSenderId: "836399572845",
  appId: "1:836399572845:web:deabb6d757cae10e1d1c64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. INITIALIZE AND EXPORT STORAGE
export const storage = getStorage(app);