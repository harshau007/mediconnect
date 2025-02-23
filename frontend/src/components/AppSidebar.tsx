import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  History,
  Home,
  Hospital,
  LucideIcon,
  Rocket,
  User,
} from "lucide-react";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

type Role = "hospital" | "user";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  roles: Role[];
}

const navItems: readonly NavItem[] = [
  {
    to: "/dashboard",
    icon: Home,
    label: "Dashboard",
    roles: ["hospital", "user"],
  },
  {
    to: "/hospitals",
    icon: Hospital,
    label: "Hospitals",
    roles: ["user"],
  },
  {
    to: "/appointments",
    icon: Rocket,
    label: "Appointments",
    roles: ["user"],
  },
  {
    to: "/medical-history",
    icon: History,
    label: "Medical History",
    roles: ["user"],
  },
  {
    to: "/users/",
    icon: User,
    label: "Users",
    roles: ["hospital"],
  },
] as const;

export default function AppSidebar() {
  const matchRoute = useMatchRoute();
  const { getUser } = useUserStore();
  const userRole = (getUser()?.role as Role) || "";
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <Sidebar>
      <SidebarHeader className="flex p-3 justify-center items-center">
        <h2 className="text-2xl font-semibold">MediConnect</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {filteredNavItems.map(({ to, icon: Icon, label }) => {
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
      <SidebarFooter className="flex flex-col items-center gap-4 p-3">
        <NavUser
          user={{
            avatar: "https://i.pravatar.cc/150?img=" + getUser()?.id,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
