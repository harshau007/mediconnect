import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useUserStore } from "@/store/useUserStore";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ApiResponse {
  data: User;
  status: string;
  message: string;
}

export default function Settings() {
  const [isSaveChangesOpen, setIsSaveChangesOpen] = useState(false);
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});
  const { getUser, updateUser } = useUserStore();
  const [localUser, setLocalUser] = useState<Partial<User>>({});
  const [password, setPassword] = useState<
    Partial<{
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  >({});

  useEffect(() => {
    setLocalUser(getUser() as User);
  }, []);

  const handleInputChange = (field: keyof User, value: string) => {
    setLocalUser((prev) => ({
      ...prev,
      [field]: value,
    }));
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPassword((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    setIsSaveChangesOpen(true);
  };

  const confirmSaveChanges = async () => {
    const authToken = isAuthenticated();
    const response = await api.patch(
      "/user/update",
      {
        firstName: localUser?.firstName,
        lastName: localUser?.lastName,
        email: localUser?.email,
        phone: localUser?.phone,
        aadharNumber: localUser?.aadharNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (!response.data) {
      throw new Error("Failed to fetch hospitals");
    }
    const data: ApiResponse = await response.data;
    updateUser(data.data);
    setIsSaveChangesOpen(false);
  };

  const handleUpdatePassword = async () => {
    const authToken = isAuthenticated();
    const response = await api.patch(
      "/user/update/password",
      {
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
        confirmPassword: password.confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (!response.data) {
      throw new Error("Failed to fetch hospitals");
    }
    const data: ApiResponse = await response.data;
    console.log(data);
    setIsUpdatePasswordOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage your account settings and set email preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-lg">
                <AvatarImage
                  src={"https://i.pravatar.cc/150?img=" + getUser()?.id}
                  alt={getUser()?.firstName! + " " + getUser()?.lastName!}
                />
                <AvatarFallback className="rounded-lg">
                  {getUser()?.firstName[0]! + getUser()?.lastName[0]!}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar">Change Profile Picture</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  // onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="Enter your first name"
                  value={localUser?.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Enter your last name"
                  value={localUser?.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  value={localUser?.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                readOnly
                value={localUser?.phone}
                className="bg-gray-100/10 cursor-not-allowed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input
                id="aadhar"
                placeholder="Enter your Aadhar number"
                readOnly
                value={localUser?.aadharNumber}
                className="bg-gray-100/10 cursor-not-allowed"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => setIsUpdatePasswordOpen(true)}
            >
              Update Password
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog
        open={isUpdatePasswordOpen}
        onOpenChange={setIsUpdatePasswordOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                onChange={(e) =>
                  handlePasswordChange("oldPassword", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm new password"
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSaveChangesOpen} onOpenChange={setIsSaveChangesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <p>Are you sure you want to save the following changes?</p>
            <ul className="list-disc pl-5">
              {Object.entries(updatedFields).map(([field, value]) => (
                <li key={field}>
                  <strong>{field}:</strong> <span>{value as string}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsSaveChangesOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmSaveChanges}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
