import { createSlice } from "@reduxjs/toolkit";
import { getItem, removeItem, setItem } from "../Services/LocalStorageService";

const initialState = getItem("user");

const userSlice = createSlice({
  name: "user",
  initialState: initialState || null,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;

      // Save in localStorage
      setItem("user", userData);
      localStorage.setItem("accountType", userData.accountType);
      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }

      // Update Redux state correctly
      return userData;
    },

    removeUser: () => {
      removeItem("user");
      removeItem("token");
      localStorage.removeItem("accountType");

      return null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
