import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { isAuthenticated, setAuthToken } from "@/lib/auth";
import { useUserStore } from "@/store/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine(
    async (data) => {
      try {
        const response = await api.post("/user/login", data);
        return !!response.data.token;
      } catch (error) {
        return false;
      }
    },
    {
      message: "Invalid username or password",
      path: ["password"], // This will show the error under the password field
    }
  );

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await api.post("/user/login", values);
      if (response.data && response.data.token) {
        setAuthToken(response.data.token);
        navigate({ to: "/dashboard" });

        const authToken = isAuthenticated();
        const profileResponse = await api.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(profileResponse.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // The error will be handled by Zod validation
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-16 p-4 bg-card shadow-md rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Login</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="border border-input focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Enter the email address associated with your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="border border-input focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Enter your account password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-muted-foreground pr-2">
          Don't have an account?
        </span>
        <Button variant="outline" onClick={() => navigate({ to: "/signup" })}>
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}
