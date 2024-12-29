import { cn } from "@/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { History, Home, Hospital, Rocket, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/hospitals", icon: Hospital, label: "Hospitals" },
  { to: "/appointments", icon: Rocket, label: "Appointments" },
  { to: "/medical-history", icon: History, label: "Medical History" },
  { to: "/settings", icon: Settings, label: "Settings" },
] as const;

export default function AppSidebar() {
  const matchRoute = useMatchRoute();

  return (
    <Sidebar>
      <SidebarHeader className="flex p-3 justify-center items-center">
        <h2 className="text-2xl font-semibold">MediConnect</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = matchRoute({ to });
            return (
              <SidebarMenuItem key={label} className="px-1.5 py-0.5">
                <SidebarMenuButton asChild className="w-full">
                  <Link
                    to={to}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <p className="text-xs text-muted-foreground">© 2024 MediConnect</p>
      </SidebarFooter>
    </Sidebar>
  );
}