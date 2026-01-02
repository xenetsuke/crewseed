import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWorkerDashboard,
  getWorkerProfile,
  updateWorkerProfile,
  getWorkerAssignments,
  getAvailableJobs,
  applyForJob,
  getJobDetails,
  updateAvailability,
  uploadDocument,
  getWorkHistory,
} from "../../Services/workerApi";

// Initial state
const initialState = {
  dashboard: null,
  profile: null,
  assignments: [],
  availableJobs: [],
  currentJob: null,
  workHistory: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchWorkerDashboard = createAsyncThunk(
  "worker/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWorkerDashboard();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch dashboard"
      );
    }
  }
);

export const fetchWorkerProfile = createAsyncThunk(
  "worker/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWorkerProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "worker/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateWorkerProfile(profileData);
      return response?.profile;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update profile"
      );
    }
  }
);

export const fetchAssignments = createAsyncThunk(
  "worker/fetchAssignments",
  async (status = "ALL", { rejectWithValue }) => {
    try {
      const response = await getWorkerAssignments(status);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch assignments"
      );
    }
  }
);

export const fetchAvailableJobs = createAsyncThunk(
  "worker/fetchAvailableJobs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAvailableJobs(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch jobs");
    }
  }
);

export const applyToJob = createAsyncThunk(
  "worker/applyToJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await applyForJob(jobId);
      return { jobId, ...response };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to apply for job"
      );
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  "worker/fetchJobDetails",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getJobDetails(jobId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch job details"
      );
    }
  }
);

export const changeAvailability = createAsyncThunk(
  "worker/changeAvailability",
  async ({ status, availableFrom }, { rejectWithValue }) => {
    try {
      const response = await updateAvailability(status, availableFrom);
      return response?.availability;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update availability"
      );
    }
  }
);

export const uploadWorkerDocument = createAsyncThunk(
  "worker/uploadDocument",
  async (documentData, { rejectWithValue }) => {
    try {
      const response = await uploadDocument(documentData);
      return response?.document;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to upload document"
      );
    }
  }
);

export const fetchWorkHistory = createAsyncThunk(
  "worker/fetchWorkHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWorkHistory();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch work history"
      );
    }
  }
);

// Slice
const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Work History
    // Upload Document
    // Change Availability
    // Fetch Job Details
    // Apply to Job
    // Fetch Available Jobs
    // Fetch Assignments
    // Update Profile
    // Fetch Profile
    // Fetch Dashboard
    builder
      ?.addCase(fetchWorkerDashboard?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchWorkerDashboard?.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action?.payload;
      })
      ?.addCase(fetchWorkerDashboard?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchWorkerProfile?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchWorkerProfile?.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action?.payload;
      })
      ?.addCase(fetchWorkerProfile?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(updateProfile?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(updateProfile?.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action?.payload;
      })
      ?.addCase(updateProfile?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchAssignments?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchAssignments?.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action?.payload;
      })
      ?.addCase(fetchAssignments?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchAvailableJobs?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchAvailableJobs?.fulfilled, (state, action) => {
        state.loading = false;
        state.availableJobs = action?.payload;
      })
      ?.addCase(fetchAvailableJobs?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(applyToJob?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(applyToJob?.fulfilled, (state, action) => {
        state.loading = false;
        // Update job application status in available jobs
        const jobIndex = state?.availableJobs?.findIndex(
          (job) => job?.id === action?.payload?.jobId
        );
        if (jobIndex !== -1) {
          state.availableJobs[jobIndex].applicationStatus = "APPLIED";
        }
      })
      ?.addCase(applyToJob?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchJobDetails?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchJobDetails?.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action?.payload;
      })
      ?.addCase(fetchJobDetails?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(changeAvailability?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(changeAvailability?.fulfilled, (state, action) => {
        state.loading = false;
        if (state?.profile) {
          state.profile.availability = action?.payload?.status;
        }
      })
      ?.addCase(changeAvailability?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(uploadWorkerDocument?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(uploadWorkerDocument?.fulfilled, (state, action) => {
        state.loading = false;
        if (state?.profile?.documents) {
          state?.profile?.documents?.push(action?.payload);
        }
      })
      ?.addCase(uploadWorkerDocument?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchWorkHistory?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchWorkHistory?.fulfilled, (state, action) => {
        state.loading = false;
        state.workHistory = action?.payload;
      })
      ?.addCase(fetchWorkHistory?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      });
  },
});

export const { clearError, clearCurrentJob } = workerSlice?.actions;
export default workerSlice?.reducer;
