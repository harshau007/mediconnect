import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col">
        <Toaster richColors />
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
