import HospitalDetails from "@/components/HospitalDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hospitals/$hospitalId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      hospitalId: params.hospitalId,
    };
  },
});

function RouteComponent() {
  const { hospitalId } = Route.useLoaderData();
  return <HospitalDetails hospitalId={hospitalId} />;
}
