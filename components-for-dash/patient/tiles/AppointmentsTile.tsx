"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
}

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
}

const AppointmentsTile = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch doctors from profiles table
  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, specialization")
        .eq("role", "doctor")
        .not("full_name", "is", null)
        .not("specialization", "is", null);

      if (error) {
        throw new Error("Failed to fetch doctors");
      }

      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Generate appointments using fetched doctors and hardcoded data
  const generateAppointments = (): Appointment[] => {
    if (doctors.length === 0) return [];

    const hardcodedData = [
      { date: "Today", time: "2:30 PM", status: "confirmed" },
      { date: "Tomorrow", time: "10:00 AM", status: "pending" },
      { date: "Dec 15", time: "3:45 PM", status: "confirmed" },
      { date: "Dec 18", time: "11:30 AM", status: "pending" },
      { date: "Dec 20", time: "9:15 AM", status: "confirmed" },
    ];

    return hardcodedData.map((data, index) => {
      const doctor = doctors[index % doctors.length]; // Cycle through available doctors
      return {
        id: index + 1,
        doctor: doctor.full_name,
        specialty: doctor.specialization,
        date: data.date,
        time: data.time,
        status: data.status,
      };
    });
  };

  const upcomingAppointments = generateAppointments();

  if (loading) {
    return (
      <Card className="h-full bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#388E3C]/20">
              <Calendar className="h-5 w-5 text-[#388E3C]" />
            </div>
            <CardTitle className="text-[#FAFAFA] font-sf-pro-bold">
              Appointments
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#388E3C]" />
            <p className="text-[#FAFAFA]/70 text-sm">Loading doctors...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#388E3C]/20">
              <Calendar className="h-5 w-5 text-[#388E3C]" />
            </div>
            <CardTitle className="text-[#FAFAFA] font-sf-pro-bold">
              Appointments
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm hover:border-[#388E3C]/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#388E3C]/20">
              <Calendar className="h-5 w-5 text-[#388E3C]" />
            </div>
            <CardTitle className="text-[#FAFAFA] font-sf-pro-bold">
              Appointments
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("appointments")}
            className="border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 font-sf-pro-medium"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#FAFAFA]/70 font-sf-pro-regular text-sm">
          Your upcoming healthcare appointments
        </p>

        <div className="space-y-3">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-[#FAFAFA]/60 text-sm">No doctors found</p>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-3 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-[#388E3C]" />
                    <span className="text-sm font-sf-pro-semibold text-[#FAFAFA]">
                      {appointment.doctor}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {appointment.status === "confirmed" ? (
                      <CheckCircle className="h-4 w-4 text-[#388E3C]" />
                    ) : (
                      <Clock className="h-4 w-4 text-[#FAFAFA]/60" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
                  {appointment.specialty} • {appointment.date} at{" "}
                  {appointment.time}
                </div>
              </div>
            ))
          )}
        </div>

        <Button
          variant="outline"
          className="w-full border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 font-sf-pro-medium"
        >
          Book New Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTile;
