import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useUserStore } from "@/store/useUserStore";
import { Appointment } from "@/types/appointment";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface ApiResponse {
  data: Appointment[];
  status: string;
}

export default function Appointments() {
  const navigate = useNavigate();
  const { getUser } = useUserStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const user = getUser();

  const handleBookAppointment = () => {
    navigate({ to: "/appointments/book" });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const authToken = isAuthenticated();
        const response = await api.get(
          `/appointment?type=user&id=${user?.id.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response);
        if (!response.data) {
          throw new Error("Failed to fetch appointment");
        }
        const data: ApiResponse = await response.data;
        console.log(data);
        setAppointments(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, []);

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
              <CardTitle>{appointment.doctorName || "---"}</CardTitle>
              <CardDescription>{appointment.hospitalName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Date:{" "}
                {new Date(appointment.appointmentDate).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "2-digit", year: "numeric" }
                )}
              </p>
              <p>
                Time:{" "}
                {new Date(appointment.appointmentTime).toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                    hour12: false,
                  }
                )}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/appointments/book",
                    search: {
                      date: new Date(appointment.appointmentDate)
                        .toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .toString(),
                      time: new Date(appointment.appointmentTime)
                        .toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Kolkata",
                        })
                        .toString(),
                      doctor: appointment.doctorName,
                      hospital: appointment.hospitalName,
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
