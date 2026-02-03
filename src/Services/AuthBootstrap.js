import axios from "../Interceptor/AxiosInterceptor";
import { setJwt, removeJwt } from "../features/JwtSlice";
import { setUser } from "../features/UserSlice";
import { setAuthReady } from "../features/AuthSlice";

export const bootstrapAuth = async (dispatch) => {
  try {
    // 🚫 user explicitly logged out
    if (sessionStorage.getItem("crewseed_logged_out") === "true") {
      dispatch(setAuthReady());
      return;
    }

    const provider = sessionStorage.getItem("auth_provider"); // PASSWORD | FIREBASE

    // 🔥 Firebase users never refresh via backend
    if (provider === "FIREBASE") {
      dispatch(setAuthReady());
      return;
    }

    // 🔄 Silent refresh
    const res = await axios.post(
      "/auth/refresh",
      {},
      { withCredentials: true }
    );

    const token = res?.data?.accessToken;
    if (!token) throw new Error("NO_TOKEN");

    dispatch(setJwt(token));

    // decode safely
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      dispatch(setUser(decoded));
    } catch {
      console.warn("⚠️ JWT decode failed during bootstrap");
    }
  } catch (e) {
    // silent fail — user may be logged out
    dispatch(removeJwt());
  } finally {
    // 🔓 ALWAYS unlock app
    dispatch(setAuthReady());
  }
};
