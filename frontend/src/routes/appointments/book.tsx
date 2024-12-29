import AppointmentBooking from "@/components/AppointmentBooking";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/appointments/book")({
  component: AppointmentBooking,
});
