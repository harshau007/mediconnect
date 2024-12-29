import Appointments from "@/components/Appointments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/appointments/")({
  component: Appointments,
});
