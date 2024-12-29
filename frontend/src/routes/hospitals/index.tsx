import Projects from "@/components/Hospitals";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hospitals/")({
  component: Projects,
});
