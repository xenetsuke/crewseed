import { createSlice } from "@reduxjs/toolkit";

const employerDashboardSlice = createSlice({
  name: "employerDashboard",
  initialState: {
    stats: {},
  },
  reducers: {
    setDashboardStats: (state, action) => {
      state.stats = action.payload;
    },
    clearDashboardStats: (state) => {
      state.stats = {};
    },
  },
});

export const {
  setDashboardStats,
  clearDashboardStats,
} = employerDashboardSlice.actions;

export default employerDashboardSlice.reducer;
