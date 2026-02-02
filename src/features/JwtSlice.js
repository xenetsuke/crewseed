import { createSlice } from "@reduxjs/toolkit";

const normalizeToken = (token) => {
  if (!token) return null;

  // 🔥 Handle stringified JWT from redux-persist
  if (typeof token === "string" && token.startsWith('"')) {
    try {
      return JSON.parse(token);
    } catch {
      return null;
    }
  }

  return token;
};

const JwtSlice = createSlice({
  name: "jwt",
  initialState: null,
  reducers: {
    setJwt: (state, action) => {
      return normalizeToken(action.payload);
    },
    removeJwt: () => null,
  },
});

export const { setJwt, removeJwt } = JwtSlice.actions;
export default JwtSlice.reducer;
