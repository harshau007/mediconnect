import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { isAuthenticated } from "@/lib/auth";
import {
  createRootRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  notFoundComponent: () => {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 text-lg font-medium rounded-md shadow-md hover:bg-primary-dark transition"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  },

  beforeLoad: async ({ location }) => {
    const isAuthRoute = ["/login", "/signup", "/verify-phone"].includes(
      location.pathname
    );
    if (isAuthRoute) {
      if (isAuthenticated()) {
        throw redirect({ to: "/dashboard" });
      }
    } else {
      if (!isAuthenticated()) {
        throw redirect({ to: "/login" });
      }

      return null;
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

  const authPaths = ["/login", "/signup", "/verify-phone"];
  const isAuthRoute = authPaths.includes(currentPath);

  if (isAuthRoute) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center bg-background text-foreground">
        <div className="w-full p-4">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <SidebarInset className="flex w-full lg:w-[90rem]">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <SidebarTrigger className="mb-4 lg:hidden" />
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </div>
  );
}
