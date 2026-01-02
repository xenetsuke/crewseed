import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmployerDashboard,
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  getRequirementDetails,
  searchWorkers,
  getWorkerProfile,
  getApplications,
  updateApplicationStatus,
  scheduleInterview,
  inviteWorker,
  getEmployerProfile,
  updateEmployerProfile,
} from "../../Services/employerApi";

// Initial state
const initialState = {
  dashboard: null,
  profile: null,
  requirements: [],
  currentRequirement: null,
  workers: [],
  currentWorker: null,
  applications: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchEmployerDashboard = createAsyncThunk(
  "employer/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEmployerDashboard();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch dashboard"
      );
    }
  }
);

export const fetchRequirements = createAsyncThunk(
  "employer/fetchRequirements",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getRequirements(filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch requirements"
      );
    }
  }
);

export const addRequirement = createAsyncThunk(
  "employer/addRequirement",
  async (requirementData, { rejectWithValue }) => {
    try {
      const response = await createRequirement(requirementData);
      return response?.requirement;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to create requirement"
      );
    }
  }
);

export const editRequirement = createAsyncThunk(
  "employer/editRequirement",
  async ({ requirementId, updateData }, { rejectWithValue }) => {
    try {
      const response = await updateRequirement(requirementId, updateData);
      return response?.requirement;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update requirement"
      );
    }
  }
);

export const removeRequirement = createAsyncThunk(
  "employer/removeRequirement",
  async (requirementId, { rejectWithValue }) => {
    try {
      const response = await deleteRequirement(requirementId);
      return response?.requirementId;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to delete requirement"
      );
    }
  }
);

export const fetchRequirementDetails = createAsyncThunk(
  "employer/fetchRequirementDetails",
  async (requirementId, { rejectWithValue }) => {
    try {
      const response = await getRequirementDetails(requirementId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch requirement details"
      );
    }
  }
);

export const findWorkers = createAsyncThunk(
  "employer/findWorkers",
  async (searchFilters = {}, { rejectWithValue }) => {
    try {
      const response = await searchWorkers(searchFilters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to search workers"
      );
    }
  }
);

export const fetchWorkerProfile = createAsyncThunk(
  "employer/fetchWorkerProfile",
  async (workerId, { rejectWithValue }) => {
    try {
      const response = await getWorkerProfile(workerId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch worker profile"
      );
    }
  }
);

export const fetchApplications = createAsyncThunk(
  "employer/fetchApplications",
  async ({ requirementId, status = "ALL" }, { rejectWithValue }) => {
    try {
      const response = await getApplications(requirementId, status);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch applications"
      );
    }
  }
);

export const changeApplicationStatus = createAsyncThunk(
  "employer/changeApplicationStatus",
  async ({ applicationId, status, additionalData }, { rejectWithValue }) => {
    try {
      const response = await updateApplicationStatus(
        applicationId,
        status,
        additionalData
      );
      return response?.application;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update application status"
      );
    }
  }
);

export const createInterview = createAsyncThunk(
  "employer/createInterview",
  async ({ applicationId, interviewData }, { rejectWithValue }) => {
    try {
      const response = await scheduleInterview(applicationId, interviewData);
      return response?.interview;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to schedule interview"
      );
    }
  }
);

export const sendWorkerInvitation = createAsyncThunk(
  "employer/sendWorkerInvitation",
  async ({ workerId, requirementId, message }, { rejectWithValue }) => {
    try {
      const response = await inviteWorker(workerId, requirementId, message);
      return response?.invitation;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to send invitation"
      );
    }
  }
);

export const fetchEmployerProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEmployerProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "employer/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateEmployerProfile(profileData);
      return response?.profile;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update profile"
      );
    }
  }
);

// Slice
const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRequirement: (state) => {
      state.currentRequirement = null;
    },
    clearCurrentWorker: (state) => {
      state.currentWorker = null;
    },
  },
  extraReducers: (builder) => {
    // Update Profile
    // Fetch Employer Profile
    // Send Worker Invitation
    // Create Interview
    // Change Application Status
    // Fetch Applications
    // Fetch Worker Profile
    // Find Workers
    // Fetch Requirement Details
    // Remove Requirement
    // Edit Requirement
    // Add Requirement
    // Fetch Requirements
    // Fetch Dashboard
    builder
      ?.addCase(fetchEmployerDashboard?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchEmployerDashboard?.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action?.payload;
      })
      ?.addCase(fetchEmployerDashboard?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchRequirements?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchRequirements?.fulfilled, (state, action) => {
        state.loading = false;
        state.requirements = action?.payload;
      })
      ?.addCase(fetchRequirements?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(addRequirement?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(addRequirement?.fulfilled, (state, action) => {
        state.loading = false;
        state?.requirements?.unshift(action?.payload);
      })
      ?.addCase(addRequirement?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(editRequirement?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(editRequirement?.fulfilled, (state, action) => {
        state.loading = false;
        const index = state?.requirements?.findIndex(
          (req) => req?.id === action?.payload?.id
        );
        if (index !== -1) {
          state.requirements[index] = action?.payload;
        }
      })
      ?.addCase(editRequirement?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(removeRequirement?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(removeRequirement?.fulfilled, (state, action) => {
        state.loading = false;
        state.requirements = state?.requirements?.filter(
          (req) => req?.id !== action?.payload
        );
      })
      ?.addCase(removeRequirement?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchRequirementDetails?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchRequirementDetails?.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequirement = action?.payload;
      })
      ?.addCase(fetchRequirementDetails?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(findWorkers?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(findWorkers?.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action?.payload;
      })
      ?.addCase(findWorkers?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchWorkerProfile?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchWorkerProfile?.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorker = action?.payload;
      })
      ?.addCase(fetchWorkerProfile?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchApplications?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchApplications?.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action?.payload;
      })
      ?.addCase(fetchApplications?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(changeApplicationStatus?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(changeApplicationStatus?.fulfilled, (state, action) => {
        state.loading = false;
        const index = state?.applications?.findIndex(
          (app) => app?.id === action?.payload?.id
        );
        if (index !== -1) {
          state.applications[index] = {
            ...state?.applications?.[index],
            ...action?.payload,
          };
        }
      })
      ?.addCase(changeApplicationStatus?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(createInterview?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(createInterview?.fulfilled, (state, action) => {
        state.loading = false;
      })
      ?.addCase(createInterview?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(sendWorkerInvitation?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(sendWorkerInvitation?.fulfilled, (state, action) => {
        state.loading = false;
      })
      ?.addCase(sendWorkerInvitation?.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })
      ?.addCase(fetchEmployerProfile?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      ?.addCase(fetchEmployerProfile?.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action?.payload;
      })
      ?.addCase(fetchEmployerProfile?.rejected, (state, action) => {
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
      });
  },
});

export const { clearError, clearCurrentRequirement, clearCurrentWorker } =
  employerSlice?.actions;
export default employerSlice?.reducer;
