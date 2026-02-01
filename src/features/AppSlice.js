import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    authReady: false, // 🔑 critical
  },
  reducers: {
    setAuthReady: (state, action) => {
      state.authReady = action.payload;
    },
  },
});

export const { setAuthReady } = appSlice.actions;
export default appSlice.reducer;
