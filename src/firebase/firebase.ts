import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx4JmGkfBjwHL20D9d9I3yUUAbmB4RKp0",
  authDomain: "proyecto3g7.firebaseapp.com",
  databaseURL: "https://proyecto3g7-default-rtdb.firebaseio.com",
  projectId: "proyecto3g7",
  storageBucket: "proyecto3g7.firebasestorage.app",
  messagingSenderId: "58886895768",
  appId: "1:58886895768:web:dfa1be7effafa6285bf8ed",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Instancia de Realtime Database asociada a la aplicación
export const database = getDatabase(app);
