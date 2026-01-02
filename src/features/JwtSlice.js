import { createSlice } from "@reduxjs/toolkit";
import {
  getItem,
  setItem,
  removeItem,
} from "../Services/LocalStorageService";

const jwtSlice = createSlice({
  name: "jwt",

  // 🔹 Initialize token from localStorage safely
  initialState: getItem("token") || "",

  reducers: {
    // ✅ Save token
    setJwt: (state, action) => {
      setItem("token", action.payload);
      return action.payload;
    },

    // ❌ Remove token
    removeJwt: () => {
      removeItem("token");
      return "";
    },
  },
});

export const { setJwt, removeJwt } = jwtSlice.actions;
export default jwtSlice.reducer;
