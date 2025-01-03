import HospitalUserSearch from "@/components/HospitalUserSearch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/")({
  component: HospitalUserSearch,
});
