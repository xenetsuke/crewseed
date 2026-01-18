import { createSlice } from "@reduxjs/toolkit";

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    history: [],
    loading: false,
  },
  reducers: {
    setAttendanceHistory: (state, action) => {
      state.history = action.payload;
    },
    clearAttendance: (state) => {
      state.history = [];
    },
  },
});

export const {
  setAttendanceHistory,
  clearAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
