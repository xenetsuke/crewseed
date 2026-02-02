import { createSlice } from "@reduxjs/toolkit";

/* =====================================================
   JWT SLICE
   - raw   : exactly what backend sends (may be quoted)
   - token : normalized JWT (NO quotes) → used everywhere
===================================================== */

const initialState = {
  raw: null,    // persisted
  token: null,  // normalized, safe
};

const normalizeToken = (value) => {
  if (!value) return null;

  // If token is stringified like: "\"eyJhbGciOi...\""
  if (typeof value === "string" && value.startsWith('"')) {
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
      // 🛑 SAFETY: handle old persisted string
      if (typeof state === "string") {
        state = initialState;
      }

      const raw = action.payload;
      let token = raw;

      if (typeof raw === "string" && raw.startsWith('"')) {
        try {
          token = JSON.parse(raw);
        } catch {
          token = null;
        }
      }

      state.raw = raw;
      state.token = token;

      console.log("🔐 [JWT SET]", { raw, token });
    },

    removeJwt: () => initialState,
  },
});
export const { setJwt, removeJwt } = jwtSlice.actions;
export default jwtSlice.reducer;
