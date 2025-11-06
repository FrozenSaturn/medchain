"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  payment_status: boolean;
  date: string;
  status: string;
}

const DoctorAppointmentsTile = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Simple fetch appointments and patient data
  const fetchAppointments = async () => {
    try {
      // First, get appointments
      const { data: appointmentsData, error: appointmentsError } =
        await supabase
          .from("appointments")
          .select("id, patient_id, payment_status")
          .limit(5);

      if (appointmentsError) {
        throw new Error("Failed to fetch appointments");
      }

      if (!appointmentsData || appointmentsData.length === 0) {
        setAppointments([]);
        return;
      }

      // Get patient IDs
      const patientIds = appointmentsData.map((apt) => apt.patient_id);

      // Then, get patient names from profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", patientIds);

      if (profilesError) {
        throw new Error("Failed to fetch patient profiles");
      }

      // Create a map of patient ID to name
      const patientNameMap = new Map();
      if (profilesData) {
        profilesData.forEach((profile) => {
          patientNameMap.set(profile.id, profile.full_name);
        });
      }

      // Hardcoded dates
      const hardcodedDates = [
        "2024-01-20",
        "2024-01-20",
        "2024-01-21",
        "2024-01-22",
        "2024-01-23",
      ];

      // Combine the data
      const transformedAppointments: Appointment[] = appointmentsData.map(
        (apt, index) => ({
          id: apt.id,
          patient_id: apt.patient_id,
          patient_name: patientNameMap.get(apt.patient_id) || "Unknown Patient",
          payment_status: apt.payment_status,
          date: hardcodedDates[index] || "2024-01-20",
          status: apt.payment_status ? "confirmed" : "pending",
        })
      );

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", variant: "default" as const },
      pending: { label: "Pending", variant: "secondary" as const },
      completed: { label: "Completed", variant: "outline" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: boolean) => {
    return paymentStatus ? (
      <Badge variant="default" className="text-xs bg-green-600">
        Paid
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        Unpaid
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-gray-600 text-sm">Loading appointments...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>Appointments</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No appointments found</p>
            </div>
          ) : (
            appointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">
                    {appointment.patient_name}
                  </h4>
                  <div className="flex space-x-2">
                    {getStatusBadge(appointment.status)}
                    {getPaymentStatusBadge(appointment.payment_status)}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>Patient ID: {appointment.patient_id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>{appointment.date}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {appointments.length > 3 && (
            <div className="text-center text-xs text-gray-500">
              +{appointments.length - 3} more appointments
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Appointments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointmentsTile;
