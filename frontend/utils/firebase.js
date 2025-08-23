// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fooddeliveryauth-7734b.firebaseapp.com",
  projectId: "fooddeliveryauth-7734b",
  storageBucket: "fooddeliveryauth-7734b.firebasestorage.app",
  messagingSenderId: "32570922634",
  appId: "1:32570922634:web:68a6334b0925ff3965ff73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {provider,auth}