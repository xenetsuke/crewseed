import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, GoogleAuthProvider } from "firebase/auth";

/* =========================
   Firebase Config
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyA_sT-jC0AhccVIiZulLssuIhkqy-Nu_Tw",
  authDomain: "crewseed-35e2d.firebaseapp.com",
  projectId: "crewseed-35e2d",
  storageBucket: "crewseed-35e2d.firebasestorage.app",
  messagingSenderId: "811334350006",
  appId: "1:811334350006:web:e97f9692370814ebea2217",
  measurementId: "G-EL6JSK163Y",
};

/* =========================
   Initialize Firebase
========================= */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* 🔥 REQUIRED FOR AXIOS FIREBASE RE-EXCHANGE */
window.firebaseAuth = auth;

/* =========================
   Google Auth
========================= */
export const googleProvider = new GoogleAuthProvider();

/* =========================
   🔥 SINGLETON reCAPTCHA
========================= */
let recaptchaVerifier = null;

export const getRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
  }
  return recaptchaVerifier;
};
