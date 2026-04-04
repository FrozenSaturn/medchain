"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import { doctorSpecialtyFromProfile } from "@/lib/doctor-profile";

interface AppointmentRow {
  id: string;
  appointment_date: string;
  time: string;
  reason: string;
  symptoms: string | null;
  status: string;
  consultation_fee: number;
  payment_status: string | null;
  payment_amount: number | null;
  payment_tx_hash: string | null;
  created_at: string;
  doctor: {
    id: string;
    full_name: string;
    bio: string | null;
  } | null;
}

const AppointmentStatus = ({ userId }: { userId: string | null }) => {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchAppointments = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `id, appointment_date, time, reason, symptoms, status, consultation_fee,
           payment_status, payment_amount, payment_tx_hash, created_at,
           doctor:doctor_id(id, full_name, bio)`
        )
        .eq("patient_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }

      setAppointments((data as unknown as AppointmentRow[]) || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const getStatusBadge = (status: string, paymentStatus: string | null) => {
    if (paymentStatus === "pending") {
      return (
        <Badge variant="destructive" className="flex items-center space-x-1 w-fit">
          <CreditCard className="h-3 w-3" />
          <span>Payment Required</span>
        </Badge>
      );
    }

    const statusConfig: Record<string, { label: string; variant: string }> = {
      booked: { label: "Booked", variant: "secondary" },
      awaiting_diagnosis: { label: "Awaiting Diagnosis", variant: "default" },
      completed: { label: "Completed", variant: "outline" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const handlePayment = async (apt: AppointmentRow) => {
    toast({
      title: "Processing Payment",
      description: "Connecting to blockchain for payment processing...",
    });

    setTimeout(async () => {
      const txHash = `0xdemo${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

      const { error } = await supabase
        .from("appointments")
        .update({
          payment_status: "paid",
          payment_tx_hash: txHash,
        })
        .eq("id", apt.id);

      if (error) {
        toast({
          title: "Payment Failed",
          description: "Could not process payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Payment Successful!",
        description: `Payment of $${apt.payment_amount || apt.consultation_fee} processed on blockchain.`,
      });

      fetchAppointments();
    }, 2000);
  };

  const filterAppointments = (filter: string) => {
    if (filter === "all") return appointments;
    if (filter === "payment_required")
      return appointments.filter((a) => a.payment_status === "pending");
    return appointments.filter((a) => a.status === filter);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: AppointmentRow }) => (
    <Card className="mb-4 bg-[#388E3C]/5 border-[#388E3C]/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg text-[#FAFAFA]">
                {appointment.doctor?.full_name || "Doctor"}
              </h3>
              {getStatusBadge(appointment.status, appointment.payment_status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#FAFAFA]/70">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-[#388E3C]" />
                  <span>
                    {doctorSpecialtyFromProfile({
                      bio: appointment.doctor?.bio,
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-[#388E3C]" />
                  <span>{formatDate(appointment.appointment_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-[#388E3C]" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong className="text-[#FAFAFA]/90">Reason:</strong>{" "}
                  {appointment.reason}
                </p>
                {appointment.symptoms && (
                  <p>
                    <strong className="text-[#FAFAFA]/90">Symptoms:</strong>{" "}
                    {appointment.symptoms}
                  </p>
                )}
                {appointment.consultation_fee > 0 && (
                  <p>
                    <strong className="text-[#FAFAFA]/90">Fee:</strong> $
                    {appointment.consultation_fee}
                  </p>
                )}
                {appointment.payment_tx_hash && (
                  <p className="text-xs">
                    <strong className="text-[#FAFAFA]/90">Tx:</strong>{" "}
                    {appointment.payment_tx_hash.substring(0, 20)}...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="ml-4 space-y-2">
            {appointment.payment_status === "pending" && (
              <Button
                size="sm"
                className="w-full bg-[#388E3C] hover:bg-[#388E3C]/80"
                onClick={() => handlePayment(appointment)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ${appointment.payment_amount || appointment.consultation_fee}
              </Button>
            )}
            {appointment.status === "completed" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#388E3C]/30 text-[#FAFAFA]"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#388E3C] mr-3" />
            <p className="text-[#FAFAFA]/70">Loading appointments...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
        <CardHeader>
          <CardTitle className="text-[#FAFAFA] font-sf-pro-bold flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-[#388E3C]" />
            <span>Appointment Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-[#388E3C]/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#FAFAFA]">
                No Appointments Yet
              </h3>
              <p className="text-[#FAFAFA]/60">
                Book your first appointment from the Find Doctors tab.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="flex w-full overflow-x-auto bg-black/30">
                <TabsTrigger value="all" className="flex-shrink-0">
                  All ({appointments.length})
                </TabsTrigger>
                <TabsTrigger value="booked" className="flex-shrink-0">
                  Booked ({filterAppointments("booked").length})
                </TabsTrigger>
                <TabsTrigger
                  value="awaiting_diagnosis"
                  className="flex-shrink-0"
                >
                  Diagnosis (
                  {filterAppointments("awaiting_diagnosis").length})
                </TabsTrigger>
                <TabsTrigger value="payment_required" className="flex-shrink-0">
                  Payment ({filterAppointments("payment_required").length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-shrink-0">
                  Completed ({filterAppointments("completed").length})
                </TabsTrigger>
              </TabsList>

              {["all", "booked", "awaiting_diagnosis", "payment_required", "completed"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab}>
                    {filterAppointments(tab).length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-8 w-8 mx-auto text-[#FAFAFA]/30 mb-2" />
                        <p className="text-[#FAFAFA]/50">
                          No appointments in this category
                        </p>
                      </div>
                    ) : (
                      filterAppointments(tab).map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))
                    )}
                  </TabsContent>
                )
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentStatus;
