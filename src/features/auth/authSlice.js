import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginWithEmail,
  signupWorker,
  signupEmployer,
  logout as logoutApi,
} from "../../Services/authApi";
import {
  setToken,
  setUserData,
  clearAuthData,
  getToken,
  getUserData,
} from "../../utils/token";

// Initial state
const initialState = {
  user: getUserData(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginWithEmail(email, password);
      setToken(response?.accessToken);
      setUserData(response?.user);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Login failed");
    }
  }
);

export const registerWorker = createAsyncThunk(
  "auth/registerWorker",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signupWorker(userData);
      setToken(response?.accessToken);
      setUserData(response?.user);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Signup failed");
    }
  }
);

export const registerEmployer = createAsyncThunk(
  "auth/registerEmployer",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await signupEmployer(companyData);
      setToken(response?.accessToken);
      setUserData(response?.user);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Signup failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearAuthData();
      return null;
    } catch (error) {
      // Even if API fails, clear local auth data
      clearAuthData();
      return rejectWithValue(error?.response?.data || "Logout failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state?.user, ...action?.payload };
      setUserData(state?.user);
    },
  },
  extraReducers: (builder) => {
    // Logout
    // Register Employer
    // Register Worker
    // Login
    builder
      ?.addCase(login?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(login?.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action?.payload?.user;
        state.token = action?.payload?.accessToken;
      })
      ?.addCase(login?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(registerWorker?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(registerWorker?.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action?.payload?.user;
        state.token = action?.payload?.accessToken;
      })
      ?.addCase(registerWorker?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(registerEmployer?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(registerEmployer?.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action?.payload?.user;
        state.token = action?.payload?.accessToken;
      })
      ?.addCase(registerEmployer?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(logout?.pending, (state) => {
        state.loading = true;
      })
      ?.addCase(logout?.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      ?.addCase(logout?.rejected, (state) => {
        // Even on error, clear auth state
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, updateUser } = authSlice?.actions;
export default authSlice?.reducer;
