import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

interface AppointmentConfirmationProps {
  countdown: number;
}

export default function AppointmentConfirmation({
  countdown,
}: AppointmentConfirmationProps) {
  return (
    <Card className="w-[350px] mx-auto text-center">
      <CardHeader>
        <div className="mx-auto my-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckIcon className="w-8 h-8 text-green-600 animate-check" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-600">
          Booking Successful!
        </CardTitle>
        <CardDescription>Your appointment has been confirmed.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mt-2">
          Please arrive 10 minutes early for your appointment.
        </p>
        <p className="text-sm font-medium mt-4">
          Redirecting to appointments in {countdown} seconds...
        </p>
      </CardContent>
    </Card>
  );
}
