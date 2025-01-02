import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

const formSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, {
    message: "OTP must be 6 digits.",
  }),
});

export default function VerifyPhone() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { phone, clearAuth } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const sendOtp = async () => {
    if (!phone) {
      console.error("Phone number not found");
      navigate({ to: "/signup" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/user/verify", { phone });
      setOtpSent(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit() {
    if (!phone) {
      console.error("Phone number not found");
      navigate({ to: "/signup" });
      return;
    }

    setIsLoading(true);
    try {
      await api.patch("/user/verify", { phone, otp: otp });
      clearAuth();
      setIsVerified(true);
      setTimeout(() => navigate({ to: "/login" }), 2000);
    } catch (error) {
      console.error("Phone verification failed:", error);
    } finally {
      setIsLoading(false);
      setOtp("");
    }
  }

  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[350px] mx-auto">
          <CardHeader>
            <div className="mx-auto my-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckIcon className="w-8 h-8 text-green-600 animate-check" />
            </div>
            <CardTitle>Number Verified</CardTitle>
            <CardDescription>
              Your phone number has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <img src="/success.svg" alt="Success" className="w-20 h-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-[350px] mx-auto border shadow-md">
      <CardHeader className="text-center">
        <CardTitle>Verify Phone Number</CardTitle>
        <CardDescription>Enter the OTP sent to your phone</CardDescription>
      </CardHeader>
      <CardContent>
        {!otpSent ? (
          <div className="flex flex-col items-center space-y-4">
            <img src="/otp.svg" alt="Send OTP" className="w-24 h-24" />
            <Button
              onClick={sendOtp}
              disabled={isLoading}
              className="w-full border-muted-foreground"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-6">
              <div className="flex justify-center space-x-2">
                <InputOTP
                  maxLength={6}
                  minLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  onClick={onSubmit}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" onClick={() => navigate({ to: "/signup" })}>
          Back to Signup
        </Button>
      </CardFooter>
    </Card>
  );
}
