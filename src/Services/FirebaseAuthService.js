import axios from "axios";

export const exchangeFirebaseToken = (firebaseToken, role) => {
  return axios.post(
    "/api/auth/firebase-login",
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseToken}`, // ✅ ONLY Firebase token
        "X-USER-ROLE": role,
      },
    }
  );
};
