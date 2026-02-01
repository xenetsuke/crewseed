import axios from "../Interceptor/AxiosInterceptor";
import { setJwt } from "../features/JwtSlice";
import { setUser } from "../features/UserSlice";
import { setAuthReady } from "../features/AuthSlice";

export const bootstrapAuth = async (dispatch) => {
  try {
    // 🚫 STOP if user explicitly logged out
    if (sessionStorage.getItem("crewseed_logged_out") === "true") {
      dispatch(setAuthReady());
      return;
    }
  if (provider === "FIREBASE") {
    dispatch(setAuthReady());
    return;
  }
    // 🔄 attempt refresh
    const res = await axios.post("/auth/refresh", {}, { withCredentials: true });

    const token = res.data.accessToken;
    if (!token) throw new Error("NO_TOKEN");

    dispatch(setJwt(token));

    const decoded = JSON.parse(atob(token.split(".")[1]));
    dispatch(setUser(decoded));
  } catch (e) {
    // silent fail
  } finally {
    dispatch(setAuthReady());
  }
};
