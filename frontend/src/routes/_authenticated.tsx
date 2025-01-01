import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    // if (!isAuthenticated()) {
    //   throw redirect({
    //     to: "/login",
    //     search: {
    //       // Use the current location to power a redirect after login
    //       // (Do not use `router.state.resolvedLocation` as it can
    //       // potentially lag behind the actual current location)
    //       redirect: location.href,
    //     },
    //   });
    // }
  },
});

function RouteComponent() {
  return <div>Hello "/_authenticated"!</div>;
}
