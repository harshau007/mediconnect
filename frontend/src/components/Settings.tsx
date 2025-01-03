import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
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

export default function Settings() {
  const [isSaveChangesOpen, setIsSaveChangesOpen] = useState(false);
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({});
  const { getUser } = useUserStore();

  // const [localUser, setLocalUser] = useState(getUser());

  const handleInputChange = (field: string, value: string) => {
    // setLocalUser((prev) => ({ ...prev, [field]: value }));
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setIsSaveChangesOpen(true);
  };

  const confirmSaveChanges = () => {
    // updateUser(localUser);
    setIsSaveChangesOpen(false);
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="Enter your first name"
                  value={getUser()?.firstName}
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
                  value={getUser()?.lastName}
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
                  value={getUser()?.email}
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
                value={getUser()?.phone}
                className="bg-gray-100/10 cursor-not-allowed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input
                id="aadhar"
                placeholder="Enter your Aadhar number"
                readOnly
                value={getUser()?.aadharNumber}
                className="bg-gray-100/10 cursor-not-allowed"
              />
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little bit about yourself"
                value={""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
            </div> */}
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsUpdatePasswordOpen(false)}>
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Changes Confirmation Dialog */}
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
                  <strong>{field}:</strong> {"value"}
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
