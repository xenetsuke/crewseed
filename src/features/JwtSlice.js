import { createSlice } from "@reduxjs/toolkit";

/* =====================================================
   JWT SLICE
   - raw   : exactly what backend sends
   - token : normalized JWT (string only)
===================================================== */

const initialState = {
  raw: null,
  token: null,
};

const normalizeToken = (value) => {
  if (!value || typeof value !== "string") return null;

  // handle "\"eyJhbGci...\"" edge case
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
};

const jwtSlice = createSlice({
  name: "jwt",
  initialState,
  reducers: {
    setJwt: (state, action) => {
      const raw = action.payload;
      const token = normalizeToken(raw);

      state.raw = raw;
      state.token = token;

      if (import.meta.env.DEV) {
        console.log("🔐 [JWT SET]", { token });
      }
    },

    removeJwt: (state) => {
      state.raw = null;
      state.token = null;

      if (import.meta.env.DEV) {
        console.log("🧹 [JWT CLEARED]");
      }
    },
  },
});

export const { setJwt, removeJwt } = jwtSlice.actions;
export default jwtSlice.reducer;
