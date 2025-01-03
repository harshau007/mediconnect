import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useState } from "react";

interface ResponseUser {
  id: number;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface ApiResponse {
  data: ResponseUser;
  status: string;
}

export default function HospitalUserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ResponseUser>();

  const handleSearch = async () => {
    const authToken = isAuthenticated();
    const response = await api.get(`/user?aadharNumber=${searchQuery.trim()}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.data) {
      throw new Error("Failed to fetch hospitals");
    }
    const results: ApiResponse = await response.data;

    setSearchResults(results.data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Search</h1>
      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Enter Aadhar Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults && (
          <UserCard key={searchResults?.id} user={searchResults!} />
        )}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: ResponseUser }) {
  return (
    <Card className="h-full transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg border-2 hover:border-primary/30">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={user?.avatar}
            alt={`${user?.firstName} ${user?.lastName}`}
          />
          <AvatarFallback>
            {user?.firstName[0]}
            {user?.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="select-none">
          <CardTitle>
            {user?.firstName} {user?.lastName}
          </CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </DialogTrigger>
        </Dialog> */}
      </CardFooter>
    </Card>
  );
}
