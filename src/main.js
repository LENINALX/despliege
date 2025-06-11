import { createApp } from 'vue'
import App from './App.vue'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfTvDifkA7vnCbafQ7UfIvypDPGqoW-mM",
  authDomain: "aeropuerto-d5f66.firebaseapp.com",
  projectId: "aeropuerto-d5f66",
  storageBucket: "aeropuerto-d5f66.firebasestorage.app",
  messagingSenderId: "282700820312",
  appId: "1:282700820312:web:e3722903f0cd92b9c2bf2d",
  measurementId: "G-66FTP6N0D0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
export default app;
createApp(App).mount('#app')