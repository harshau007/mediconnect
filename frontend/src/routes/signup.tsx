import Signup from "@/components/Signup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: Signup,
});
