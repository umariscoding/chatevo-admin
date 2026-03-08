import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Company, Tokens } from "@/types/auth";
import { companyApi as api } from "@/utils/company/api";
import { API_CONFIG } from "@/constants/api";
import { resetCompany } from "./companySlice";
import { resetAnalytics } from "./analyticsSlice";
import { resetKnowledgeBase } from "./knowledgeBaseSlice";
import { resetUI } from "./uiSlice";

interface CompanyAuthState {
  company: Company | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyAuthState = {
  company: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Company Registration
export const registerCompany = createAsyncThunk(
  "companyAuth/register",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/company/register", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || "Registration failed",
      );
    }
  },
);

// Company Login
export const loginCompany = createAsyncThunk(
  "companyAuth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/company/login", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || error.message || "Login failed",
      );
    }
  },
);

// Verify Company Token and fetch fresh company data
export const verifyCompanyToken = createAsyncThunk(
  "companyAuth/verify",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { companyAuth: CompanyAuthState };
      const token =
        state.companyAuth.tokens?.access_token ||
        localStorage.getItem("company_access_token");

      if (!token) {
        throw new Error("No company token found");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Verify token
      const verifyRes = await axios.get(`${API_CONFIG.BASE_URL}/auth/verify`, {
        headers,
      });

      if (!verifyRes.data.valid) {
        return verifyRes.data;
      }

      // Fetch fresh company data
      const profileRes = await axios.get(
        `${API_CONFIG.BASE_URL}/auth/company/profile`,
        { headers },
      );

      return {
        ...verifyRes.data,
        company: profileRes.data.company,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Token verification failed",
      );
    }
  },
);

// Company Logout - Clears all company-related data
export const logoutCompanyComprehensive = createAsyncThunk(
  "companyAuth/logoutComprehensive",
  async (_, { dispatch }) => {
    // Clear company-related localStorage data
    if (typeof window !== "undefined") {
      localStorage.removeItem("company_access_token");
      localStorage.removeItem("company_refresh_token");
      localStorage.removeItem("company_data");
    }

    // Reset company-specific Redux states
    dispatch(resetCompany());
    dispatch(resetKnowledgeBase()); // Company owns knowledge base
    dispatch(resetAnalytics()); // Company analytics
    dispatch(resetUI()); // Clean UI state

    return true;
  },
);

const companyAuthSlice = createSlice({
  name: "companyAuth",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.company = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear tokens and company data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("company_access_token");
        localStorage.removeItem("company_refresh_token");
        localStorage.removeItem("company_data");
      }
    },
    updateCompanyInfo: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("company_data", JSON.stringify(action.payload));
      }
    },
    // Load tokens and company data from storage
    loadFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("company_access_token");
        const refreshToken = localStorage.getItem("company_refresh_token");
        const companyData = localStorage.getItem("company_data");

        if (accessToken && refreshToken) {
          state.tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: "bearer",
          };
          state.isAuthenticated = true;

          // Load complete company data if available
          if (companyData) {
            try {
              state.company = JSON.parse(companyData);
            } catch (error) {
              console.warn("Failed to parse stored company data:", error);
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Company Registration
    builder
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;

        // Store tokens and complete company data in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "company_access_token",
            action.payload.tokens.access_token,
          );
          localStorage.setItem(
            "company_refresh_token",
            action.payload.tokens.refresh_token,
          );
          localStorage.setItem(
            "company_data",
            JSON.stringify(action.payload.company),
          );
        }
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Company Login
    builder
      .addCase(loginCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;

        // Store tokens and complete company data in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "company_access_token",
            action.payload.tokens.access_token,
          );
          localStorage.setItem(
            "company_refresh_token",
            action.payload.tokens.refresh_token,
          );
          localStorage.setItem(
            "company_data",
            JSON.stringify(action.payload.company),
          );
        }
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Token Verification
    builder
      .addCase(verifyCompanyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyCompanyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.valid;
        if (!action.payload.valid) {
          state.company = null;
          state.tokens = null;
          state.isAuthenticated = false;
          if (typeof window !== "undefined") {
            localStorage.removeItem("company_access_token");
            localStorage.removeItem("company_refresh_token");
            localStorage.removeItem("company_data");
          }
        } else if (action.payload.company) {
          // Update with fresh company data from server
          state.company = action.payload.company;
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "company_data",
              JSON.stringify(action.payload.company),
            );
          }
        }
      })
      .addCase(verifyCompanyToken.rejected, (state) => {
        state.loading = false;
        state.company = null;
        state.tokens = null;
        state.isAuthenticated = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("company_access_token");
          localStorage.removeItem("company_refresh_token");
          localStorage.removeItem("company_data");
        }
      });

    // Comprehensive Logout
    builder.addCase(logoutCompanyComprehensive.fulfilled, (state) => {
      state.company = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { clearError, updateCompanyInfo, loadFromStorage } =
  companyAuthSlice.actions;

// Note: logoutCompanyComprehensive is exported above as a createAsyncThunk

export default companyAuthSlice.reducer;
