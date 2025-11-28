import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { companyApi as api } from "@/utils/company/api";

// Async thunk for fetching dashboard analytics
export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<any>(
        "/api/company/analytics/dashboard",
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch analytics data",
      );
    }
  },
);

interface AnalyticsState {
  dashboard: any | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: AnalyticsState = {
  dashboard: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAnalytics: (state) => {
      state.dashboard = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardAnalytics.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.dashboard = action.payload;
          state.lastFetched = Date.now();
          state.error = null;
        },
      )
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
