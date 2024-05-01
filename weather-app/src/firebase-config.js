// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Import for Firebase Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyzmsaH8dCaenYHLFw0efFwdF0r6nvjT0",
  authDomain: "cs411-location-preferences.firebaseapp.com",
  databaseURL: "https://cs411-location-preferences-default-rtdb.firebaseio.com",
  projectId: "cs411-location-preferences",
  storageBucket: "cs411-location-preferences.appspot.com",
  messagingSenderId: "855704188395",
  appId: "1:855704188395:web:5d46ab0949c9e83dc1d5ae",
  measurementId: "G-JFVTZ5X404"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app); // This line initializes the Firebase Realtime Database

export { db }; // Ensure 'db' is exported