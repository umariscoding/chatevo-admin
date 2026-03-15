import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { Company } from "@/types/auth";
import { companyApi as api } from "@/utils/company/api";

interface BatchUpdateSettingsRequest {
  slug?: string;
  chatbot_title?: string;
  chatbot_description?: string;
  is_published?: boolean;
  default_model?: string;
  system_prompt?: string;
  tone?: string;
}

interface BatchUpdateSettingsResponse {
  message: string;
  company: Company;
}

interface CompanyState {
  publicUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  publicUrl: null,
  loading: false,
  error: null,
};

// Batch Update Settings
export const batchUpdateSettings = createAsyncThunk(
  "company/batchUpdateSettings",
  async (data: BatchUpdateSettingsRequest, { rejectWithValue }) => {
    try {
      const response = await api.put<BatchUpdateSettingsResponse>(
        "/auth/company/settings",
        data,
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : error.message || "Failed to update settings";
      return rejectWithValue(errorMessage);
    }
  },
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPublicUrl: (state, action: PayloadAction<string>) => {
      state.publicUrl = action.payload;
    },
    resetCompany: (state) => {
      state.publicUrl = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(batchUpdateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchUpdateSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.company.slug) {
          state.publicUrl = `/${action.payload.company.slug}`;
        }
      })
      .addCase(batchUpdateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetCompany } = companySlice.actions;

export default companySlice.reducer;
