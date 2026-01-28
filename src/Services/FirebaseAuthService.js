import axios from "axios";

export const exchangeFirebaseToken = (firebaseToken, role) => {
  return axios.post(
    "https://bluc-ysbf.onrender.com/auth/firebase-login",
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseToken}`, // Firebase token ONLY
        "X-USER-ROLE": role,
      },
    }
  );
};
