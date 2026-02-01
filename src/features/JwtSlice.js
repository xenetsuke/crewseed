import { createSlice } from "@reduxjs/toolkit";

const jwtSlice = createSlice({
  name: "jwt",

  // ✅ START EMPTY (in-memory only)
  initialState: "",

  reducers: {
    setJwt: (state, action) => {
      return action.payload; // 🔥 DO NOT TOUCH localStorage
    },

    removeJwt: () => {
      return "";
    },
  },
});

export const { setJwt, removeJwt } = jwtSlice.actions;
export default jwtSlice.reducer;
