import { createSlice } from "@reduxjs/toolkit";
import {
  getItem,
  setItem,
  removeItem,
} from "../Services/LocalStorageService";

// import { createSlice } from "@reduxjs/toolkit";

const jwtSlice = createSlice({
  name: "jwt",

  // ✅ Load token as plain string
  initialState: localStorage.getItem("token") || "",

  reducers: {
    // ✅ Save token correctly
    setJwt: (state, action) => {
      const token =
        typeof action.payload === "string"
          ? action.payload.replace(/^"+|"+$/g, "")
          : action.payload;

      localStorage.setItem("token", token);
      return token;
    },

    // ❌ Remove token
    removeJwt: () => {
      localStorage.removeItem("token");
      return "";
    },
  },
});

export const { setJwt, removeJwt } = jwtSlice.actions;
export default jwtSlice.reducer;
