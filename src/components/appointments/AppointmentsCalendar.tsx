"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/calendar.css";
import "./schedule-x-overrides.css";

import type { Appointment } from "@/hooks/useAppointments";

const STATUS_CALENDAR_ID: Record<Appointment["status"], string> = {
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
  no_show: "no_show",
};

interface Props {
  appointments: Appointment[];
  onSelect: (a: Appointment) => void;
  onSlotClick?: (date: string, time: string) => void;
}

function toEvent(a: Appointment) {
  const date = a.scheduled_date;
  const start = `${date} ${a.start_time.slice(0, 5)}`;
  const end = `${date} ${a.end_time.slice(0, 5)}`;
  const name = a.caller_name || "Unknown";
  const service = a.service_type ? ` · ${a.service_type}` : "";
  return {
    id: a.appointment_id,
    title: `${name}${service}`,
    start,
    end,
    calendarId: STATUS_CALENDAR_ID[a.status],
    description: a.notes || "",
    people: a.caller_phone ? [a.caller_phone] : [],
  };
}

export default function AppointmentsCalendar({ appointments, onSelect, onSlotClick }: Props) {
  const eventsService = useRef(createEventsServicePlugin());
  const onSelectRef = useRef(onSelect);
  const onSlotClickRef = useRef(onSlotClick);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onSlotClickRef.current = onSlotClick;
  }, [onSelect, onSlotClick]);

  const initialEvents = useMemo(() => appointments.map(toEvent), []); // eslint-disable-line react-hooks/exhaustive-deps

  const calendar = useNextCalendarApp(
    {
      views: [createViewWeek(), createViewMonthGrid(), createViewDay(), createViewMonthAgenda()],
      defaultView: createViewWeek().name,
      events: initialEvents,
      calendars: {
        confirmed: {
          colorName: "confirmed",
          lightColors: { main: "#0d9488", container: "#ccfbf1", onContainer: "#0f766e" },
        },
        completed: {
          colorName: "completed",
          lightColors: { main: "#10b981", container: "#d1fae5", onContainer: "#047857" },
        },
        cancelled: {
          colorName: "cancelled",
          lightColors: { main: "#94a3b8", container: "#f1f5f9", onContainer: "#475569" },
        },
        no_show: {
          colorName: "no_show",
          lightColors: { main: "#ef4444", container: "#fee2e2", onContainer: "#b91c1c" },
        },
      },
      callbacks: {
        onEventClick: (event) => {
          const appt = appointmentsRef.current.find((a) => a.appointment_id === event.id);
          if (appt) onSelectRef.current(appt);
        },
        onClickDateTime: (dateTimeStr: string) => {
          const [date, time] = dateTimeStr.split(" ");
          onSlotClickRef.current?.(date, time?.slice(0, 5) || "09:00");
        },
        onClickDate: (dateStr: string) => {
          onSlotClickRef.current?.(dateStr, "09:00");
        },
      },
      dayBoundaries: { start: "07:00", end: "21:00" },
      weekOptions: { gridHeight: 600 },
    },
    [eventsService.current]
  );

  const appointmentsRef = useRef(appointments);
  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  useEffect(() => {
    if (!calendar) return;
    eventsService.current.set(appointments.map(toEvent));
  }, [appointments, calendar]);

  return (
    <div className="sx-react-calendar-wrapper">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}
