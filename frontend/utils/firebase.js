// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
 authDomain: "zingo-46c00.firebaseapp.com",
  projectId: "zingo-46c00",
  storageBucket: "zingo-46c00.firebasestorage.app",
  messagingSenderId: "489358730089",
  appId: "1:489358730089:web:cfcf43e08ab2aeaf6913f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {provider,auth}