import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AppointmentConfirmation from "./AppointmentConfirmation";

interface AppointmentBookingProps {
  prefillData?: {
    date?: string;
    time?: string;
    doctor?: string;
    hospital?: string;
  };
}

interface Search {
  date?: string;
  time?: string;
  doctor?: string;
  hospital?: string;
}

const hospitals = [
  "General Hospital",
  "City Medical Center",
  "Community Health Clinic",
];

export default function AppointmentBooking({
  prefillData,
}: AppointmentBookingProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Search;
  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
    doctor: "",
    hospital: "",
  });
  const [value, setValue] = useState("General Hospital");
  const [isBooked, setIsBooked] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (prefillData) {
      setAppointment((prev) => ({ ...prev, ...prefillData }));
    } else if (search.date || search.time || search.doctor || search.hospital) {
      console.log(search);
      setValue((search.hospital as string) || "General Hospital");
      setAppointment({
        date: (search.date as string) || "",
        time: (search.time as string) || "",
        doctor: (search.doctor as string) || "",
        hospital: (search.hospital as string) || "",
      });
    }
  }, [prefillData, search]);

  useEffect(() => {
    if (isBooked) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const redirect = setTimeout(() => {
        navigate({ to: "/appointments" });
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirect);
      };
    }
  }, [isBooked, navigate]);

  const handleBookAppointment = () => {
    // Here you would typically send this data to your backend
    console.log("Booking appointment:", appointment);

    setIsBooked(true);
  };

  if (isBooked) {
    return <AppointmentConfirmation countdown={countdown} />;
  }

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Book Appointment</CardTitle>
        <CardDescription>
          Schedule your next medical appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={appointment.date}
              onChange={(e) =>
                setAppointment({ ...appointment, date: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={appointment.time}
              onChange={(e) =>
                setAppointment({ ...appointment, time: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="doctor">Doctor</Label>
            <Input
              id="doctor"
              value={appointment.doctor}
              onChange={(e) =>
                setAppointment({ ...appointment, doctor: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="hospital">Hospital</Label>
            <Select
              value={value}
              onValueChange={(value) =>
                setAppointment({ ...appointment, hospital: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hospital" />
              </SelectTrigger>
              <SelectContent>
                {hospitals.map((hospital) => (
                  <SelectItem key={hospital} value={hospital}>
                    {hospital}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/appointments" })}
        >
          Cancel
        </Button>
        <Button onClick={handleBookAppointment}>Book Appointment</Button>
      </CardFooter>
    </Card>
  );
}
