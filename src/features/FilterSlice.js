import { createSlice } from "@reduxjs/toolkit";

/**
 * Filter Slice
 * - Stores filter values for Find Workers / Talents pages
 * - State shape is dynamic based on filters applied
 */
const filterSlice = createSlice({
  name: "filter",

  // Initial state is an empty object
  initialState: {},

  reducers: {
    /**
     * Merge new filters with existing filters
     * Example payload:
     * {
     *   name: "john",
     *   Location: ["Delhi"],
     *   Skills: ["Electrician"]
     * }
     */
    updateFilter: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    /**
     * Reset all filters
     */
    resetFilter: () => {
      return {};
    },
  },
});

export const { updateFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
