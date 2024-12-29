import { Link } from "@tanstack/react-router";
import { Bell, Settings, User } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex w-full items-center justify-between px-4 py-4 bg-background border-b md:px-6">
      <div className="flex w-full items-center">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full md:w-64 mr-4"
        />
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu open={open}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to="/settings"
                className="flex"
                onClick={() => setOpen(false)}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}