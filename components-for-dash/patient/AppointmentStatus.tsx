"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, FileText, CreditCard } from "lucide-react";

const AppointmentStatus = () => {
  // TODO: Fetch appointments from Supabase
  const appointments = [
    {
      id: "APT001",
      bookingId: "BK-2024-001",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      hospital: "City General Hospital",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "booked",
      reason: "Regular checkup",
    },
    {
      id: "APT002",
      bookingId: "BK-2024-002",
      doctor: "Dr. Michael Chen",
      specialty: "Neurology",
      hospital: "Metro Medical Center",
      date: "2024-01-18",
      time: "2:00 PM",
      status: "awaiting_diagnosis",
      reason: "Headache consultation",
    },
    {
      id: "APT003",
      bookingId: "BK-2024-003",
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatology",
      hospital: "Sunshine Clinic",
      date: "2024-01-15",
      time: "11:30 AM",
      status: "payment_requested",
      reason: "Skin examination",
      paymentAmount: 150,
    },
    {
      id: "APT004",
      bookingId: "BK-2024-004",
      doctor: "Dr. James Wilson",
      specialty: "Orthopedics",
      hospital: "Sports Medicine Center",
      date: "2024-01-10",
      time: "9:00 AM",
      status: "completed",
      reason: "Knee injury follow-up",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      booked: { label: "Booked", variant: "secondary" },
      awaiting_diagnosis: { label: "Awaiting Diagnosis", variant: "default" },
      payment_requested: { label: "Payment Required", variant: "destructive" },
      completed: { label: "Completed", variant: "outline" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary",
    };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const filterAppointments = (status: string) => {
    if (status === "all") return appointments;
    return appointments.filter((apt) => apt.status === status);
  };

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
              {getStatusBadge(appointment.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{appointment.specialty}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Hospital:</strong> {appointment.hospital}
                </p>
                <p>
                  <strong>Booking ID:</strong> {appointment.bookingId}
                </p>
                <p>
                  <strong>Reason:</strong> {appointment.reason}
                </p>
                {appointment.paymentAmount && (
                  <p>
                    <strong>Amount:</strong> ${appointment.paymentAmount}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="ml-4 space-y-2">
            {appointment.status === "payment_requested" && (
              <Button size="sm" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
            {appointment.status === "completed" && (
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
            )}
            {appointment.status === "booked" && (
              <Button variant="outline" size="sm" className="w-full">
                Reschedule
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="flex w-full overflow-x-auto">
              <TabsTrigger value="all" className="flex-shrink-0">
                All ({appointments.length})
              </TabsTrigger>
              <TabsTrigger value="booked" className="flex-shrink-0">
                Booked ({filterAppointments("booked").length})
              </TabsTrigger>
              <TabsTrigger value="awaiting_diagnosis" className="flex-shrink-0">
                Diagnosis ({filterAppointments("awaiting_diagnosis").length})
              </TabsTrigger>
              <TabsTrigger value="payment_requested" className="flex-shrink-0">
                Payment ({filterAppointments("payment_requested").length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-shrink-0">
                Completed ({filterAppointments("completed").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </TabsContent>

            <TabsContent value="booked">
              {filterAppointments("booked").map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </TabsContent>

            <TabsContent value="awaiting_diagnosis">
              {filterAppointments("awaiting_diagnosis").map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </TabsContent>

            <TabsContent value="payment_requested">
              {filterAppointments("payment_requested").map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </TabsContent>

            <TabsContent value="completed">
              {filterAppointments("completed").map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentStatus;
