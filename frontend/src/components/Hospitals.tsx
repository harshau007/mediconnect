"use client";

import { useHospitalStore } from "@/store/useHospitalStore";
import { Hospital } from "@/types/hospital";
import { Link } from "@tanstack/react-router";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ApiResponse {
  data: Hospital[];
  status: string;
}

const now = new Date();

// Format the date as YYYY-MM-DD
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
const day = String(now.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;

// Add one hour to the current time
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
const hours = String(oneHourLater.getHours()).padStart(2, "0");
const minutes = String(oneHourLater.getMinutes()).padStart(2, "0");
const formattedTime = `${hours}:${minutes}`;

export default function Hospitals() {
  const [hospitalsPage, setHospitalsPage] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setHospitals } = useHospitalStore();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/hospitals/");
        if (!response.ok) {
          throw new Error("Failed to fetch hospitals");
        }
        const data: ApiResponse = await response.json();
        setHospitals(data.data);
        setHospitalsPage(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Hospitals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitalsPage.map((hospital) => (
            <Link
              key={hospital.id}
              to="/hospitals/$hospitalId"
              params={{
                hospitalId: hospital.id.toString(),
              }}
            >
              <Card className="h-full transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg border-2 hover:border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center justify-between">
                    <span>{hospital.name}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-muted-foreground">
                          {hospital.address}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Location</TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    <Badge
                      variant={hospital.isOpen.Bool ? "default" : "destructive"}
                      className="mt-2"
                    >
                      {hospital.isOpen.Bool ? (
                        <CheckCircle className="h-3 w-3 mr-1 inline" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1 inline" />
                      )}
                      {hospital.isOpen.Bool ? "Open" : "Closed"}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground truncate">
                    Located in: {hospital.address}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 inline" />
                    Last inspected:{" "}
                    {new Date(hospital.lastInspected.Time).toLocaleDateString()}
                  </div>
                  <Link
                    to="/appointments/book"
                    search={{
                      hospital: hospital.name,
                      date: formattedDate,
                      time: formattedTime,
                      doctor: "",
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Appointment
                  </Link>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
