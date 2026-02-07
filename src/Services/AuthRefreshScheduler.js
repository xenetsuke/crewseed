import { store } from "../Store";
import { refreshAccessToken } from "../Services/AuthService";
import { setJwt } from "../features/JwtSlice";

let refreshTimer = null;

export const startAutoRefresh = () => {
  if (refreshTimer) return;

  // 🔁 refresh every 10 minutes
  refreshTimer = setInterval(async () => {
    const provider = sessionStorage.getItem("auth_provider");
    const loggedOut = sessionStorage.getItem("crewseed_logged_out");

    if (provider === "FIREBASE" || loggedOut === "true") return;

    try {
      const newToken = await refreshAccessToken();
      store.dispatch(setJwt(newToken));
      console.log("🔄 Auto-refresh success");
    } catch (e) {
      console.warn("⚠️ Auto-refresh failed (silent)");
    }
  }, 10 * 60 * 1000); // 10 min
};

export const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};
