import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  hospital: string;
}

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2023-06-15",
      time: "10:00",
      doctor: "Dr. Smith",
      hospital: "General Hospital",
    },
    {
      id: 2,
      date: "2023-07-01",
      time: "14:30",
      doctor: "Dr. Johnson",
      hospital: "City Medical Center",
    },
  ]);

  const handleBookAppointment = () => {
    navigate({ to: "/appointments/book" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Appointments</h1>
        <Button onClick={handleBookAppointment}>Book New Appointment</Button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <CardTitle>{appointment.doctor}</CardTitle>
              <CardDescription>{appointment.hospital}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/appointments/book",
                    search: {
                      date: appointment.date,
                      time: appointment.time,
                      doctor: appointment.doctor,
                      hospital: appointment.hospital,
                    },
                  })
                }
              >
                Reschedule
              </Button>
              <Button variant="destructive" className="ml-2">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
