import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAuth, RecaptchaVerifier,GoogleAuthProvider } from "firebase/auth";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_sT-jC0AhccVIiZulLssuIhkqy-Nu_Tw",
  authDomain: "crewseed-35e2d.firebaseapp.com",
  projectId: "crewseed-35e2d",
  storageBucket: "crewseed-35e2d.firebasestorage.app",
  messagingSenderId: "811334350006",
  appId: "1:811334350006:web:e97f9692370814ebea2217",
  measurementId: "G-EL6JSK163Y"
};

const app = initializeApp(firebaseConfig);

export const setupRecaptcha = () =>
  new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
