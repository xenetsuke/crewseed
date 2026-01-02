import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "../Services/ProfileService"; // backend API call



const profileSlice = createSlice({
  name: "profile",
  initialState: {},
  reducers: {
    // ✅ Sets the profile (used on login/fetch)
    setProfile: (state, action) => {
      return { ...action.payload };
    },

    // ✅ Updates the profile and syncs with backend
    changeProfile: (state, action) => {
      // Call backend API to persist changes
      updateProfile(action.payload).catch((err) => {
        console.error("Failed to update profile on backend:", err);
      });

      // Update Redux state immediately
      return { ...action.payload };
    },

    // Optional: just updates Redux state without calling backend
    updateProfileState: (state, action) => {
      return { ...action.payload };
    },

    // Optional: clear profile
    // clearProfile: () => {
    //   return {};
    // },
  },
});

export const { setProfile, changeProfile, updateProfileState } = profileSlice.actions;
export default profileSlice.reducer;
