"use client";

import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Clock,
  Info,
  RefreshCcw,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useHospitalStore } from "../store/useHospitalStore";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const now = new Date();
const formattedDate = now.toISOString().split("T")[0];
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
const formattedTime = oneHourLater.toTimeString().slice(0, 5);

interface HospitalDetailsProps {
  hospitalId: string;
}

export default function HospitalDetails({ hospitalId }: HospitalDetailsProps) {
  const {
    selectedHospital,
    setSelectedHospital,
    isLoading,
    refreshHospital,
    getHospital,
  } = useHospitalStore();

  useEffect(() => {
    const fetchHospital = async () => {
      if (hospitalId) {
        const id = parseInt(hospitalId, 10);
        if (!isNaN(id)) {
          const hospital = getHospital(id);
          setSelectedHospital(hospital);
        }
      }
    };
    fetchHospital();
  }, [hospitalId, refreshHospital]);

  const handleRefresh = () => {
    if (hospitalId) {
      const id = parseInt(hospitalId, 10);
      if (!isNaN(id)) {
        refreshHospital(id);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!selectedHospital) {
    return <div>Hospital not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/hospitals"
          className="text-primary hover:underline inline-flex items-center"
        >
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{selectedHospital.name}</h1>
        <Button onClick={handleRefresh} className="flex items-center">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">
            <Info className="mr-2 h-4 w-4" />
            Information
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Activity className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="facilities">
            <Users className="mr-2 h-4 w-4" />
            Facilities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Overview of the hospital</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold">Address</dt>
                  <dd className="text-sm">{selectedHospital.address}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Phone</dt>
                  <dd className="text-sm">{selectedHospital.phone}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd className="text-sm">{selectedHospital.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Website</dt>
                  <dd className="text-sm">
                    <a
                      href={selectedHospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {selectedHospital.website}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Visiting Hours</dt>
                  <dd className="text-sm">
                    {selectedHospital.visitingHours || "Not specified"}
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 inline" />
                Last inspected:{" "}
                {new Date(
                  selectedHospital.lastInspected.Time
                ).toLocaleDateString()}
              </div>
              <Link
                to="/appointments/book"
                search={{
                  hospital: selectedHospital.name,
                  date: formattedDate,
                  time: formattedTime,
                  doctor: "",
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Real-time data about the hospital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold">Queue Length</dt>
                  <dd className="text-sm">
                    {selectedHospital.queueLength} patients
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Average Wait Time</dt>
                  <dd className="text-sm">
                    {selectedHospital.averageWaitingTime} minutes
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Current Wait Time</dt>
                  <dd className="text-sm">
                    {selectedHospital.currentWaitingTime} minutes
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Crowded</dt>
                  <dd className="text-sm">
                    {selectedHospital.isCrowded.Bool ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
              <CardDescription>
                Available services and amenities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4">
                {selectedHospital.facilities
                  .split(",")
                  .map((facility, index) => (
                    <li key={index} className="text-sm">
                      {facility.trim()}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
