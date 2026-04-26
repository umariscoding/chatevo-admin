"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { companyApi } from "@/utils/company/api";

export interface Appointment {
  appointment_id: string;
  caller_name: string | null;
  caller_phone: string | null;
  caller_email: string | null;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  service_type: string | null;
  notes: string | null;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  source: "voice_agent" | "manual" | "web";
  created_at: string;
}

export type StatusFilter = "all" | "confirmed" | "completed" | "cancelled" | "no_show";

interface CreatePayload {
  scheduled_date: string;
  start_time: string;
  duration_min: number;
  caller_name: string;
  caller_phone?: string | null;
  caller_email?: string | null;
  service_type?: string | null;
  notes?: string | null;
  source?: "manual" | "voice_agent" | "web";
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const res = await companyApi.get("/appointments");
      setAppointments(res.data.appointments || []);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateStatus = useCallback(async (id: string, status: Appointment["status"]) => {
    await companyApi.put(`/appointments/${id}`, { status });
    setAppointments((prev) =>
      prev.map((a) => (a.appointment_id === id ? { ...a, status } : a))
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    await companyApi.delete(`/appointments/${id}`);
    setAppointments((prev) => prev.filter((a) => a.appointment_id !== id));
  }, []);

  const create = useCallback(async (payload: CreatePayload) => {
    const res = await companyApi.post("/appointments", {
      ...payload,
      source: payload.source ?? "manual",
    });
    setAppointments((prev) => [...prev, res.data]);
    return res.data as Appointment;
  }, []);

  const counts = useMemo(
    () => ({
      all: appointments.length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      no_show: appointments.filter((a) => a.status === "no_show").length,
    }),
    [appointments]
  );

  return { appointments, loading, error, counts, refetch: fetchAll, updateStatus, remove, create };
}
