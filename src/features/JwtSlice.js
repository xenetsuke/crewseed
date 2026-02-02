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
    /* =========================
       SET JWT
       - stores BOTH raw + token
    ========================= */
    setJwt: (state, action) => {
      const raw = action.payload;
      const token = normalizeToken(raw);

      state.raw = raw;
      state.token = token;

      if (import.meta.env.DEV) {
        console.log("🔐 [JWT SET]");
        console.log("   raw   →", raw);
        console.log("   token →", token);
      }
    },

    /* =========================
       REMOVE JWT
    ========================= */
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
//