import { useCallback, useRef } from "react";
import { useCompanyAppDispatch, useCompanyAppSelector } from "./useCompanyAuth";
import {
  fetchDashboardAnalytics,
  clearError,
  resetAnalytics,
} from "@/store/company/slices/analyticsSlice";

export const useCompanyAnalytics = () => {
  const dispatch = useCompanyAppDispatch();
  const analytics = useCompanyAppSelector((state) => state.analytics);

  // Use a ref to avoid re-creating the callback when analytics changes
  const analyticsRef = useRef(analytics);
  analyticsRef.current = analytics;

  const loadDashboardAnalytics = useCallback(() => {
    const current = analyticsRef.current;
    const isDataFresh =
      current.lastFetched &&
      Date.now() - current.lastFetched < 5 * 60 * 1000;

    if (current.dashboard && isDataFresh && !current.error) {
      return;
    }

    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  const refreshAnalytics = useCallback(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  const clearAnalyticsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetAnalyticsData = useCallback(() => {
    dispatch(resetAnalytics());
  }, [dispatch]);

  return {
    dashboard: analytics.dashboard,
    loading: analytics.loading,
    error: analytics.error,
    lastFetched: analytics.lastFetched,
    loadDashboardAnalytics,
    refreshAnalytics,
    clearAnalyticsError,
    resetAnalyticsData,
    isDataFresh:
      analytics.lastFetched &&
      Date.now() - analytics.lastFetched < 5 * 60 * 1000,
    hasData: !!analytics.dashboard,
  };
};
