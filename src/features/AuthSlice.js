import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ready: false, // 🔑 gates API calls
  },
  reducers: {
    setAuthReady: (state) => {
      state.ready = true;
    },
    resetAuth: (state) => {
      state.ready = false;
    },
  },
});

export const { setAuthReady, resetAuth } = authSlice.actions;
export default authSlice.reducer;
