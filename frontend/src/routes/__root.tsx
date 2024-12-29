import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

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

  component: () => (
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
  ),
});
