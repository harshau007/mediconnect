import MedicalHistory from "@/components/MedicalHistory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/medical-history/")({
  component: MedicalHistory,
});
