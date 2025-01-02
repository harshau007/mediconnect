import VerifyPhone from "@/components/VerifyPhone";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-phone")({
  component: VerifyPhone,
});
