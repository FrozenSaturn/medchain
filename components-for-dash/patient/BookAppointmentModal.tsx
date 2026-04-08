"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Loader2, X } from "lucide-react";

interface DoctorForBooking {
  id: string;
  name: string;
  specialty: string;
  location?: string;
  dbId?: string;
  consultationFee?: number;
  full_name?: string;
  specialization?: string;
  consultation_fee?: number;
}

const BookAppointmentModal = ({
  doctor,
  isOpen,
  onClose,
  userId,
}: {
  doctor: DoctorForBooking | null;
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  const doctorName = doctor?.name || doctor?.full_name || "Doctor";
  const doctorSpecialty = doctor?.specialty || doctor?.specialization || "General";
  const doctorLocation = doctor?.location || "MedConnect Healthcare";
  const doctorDbId = doctor?.dbId || (doctor as any)?.id;
  const consultationFee = doctor?.consultationFee ?? doctor?.consultation_fee ?? 0;

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const patientId = userId;

      if (patientId && doctorDbId && typeof doctorDbId === "string" && doctorDbId.length > 10) {
        const appointmentDate = selectedDate.toISOString().split("T")[0];

        const { error } = await supabase.from("appointments").insert({
          patient_id: patientId,
          doctor_id: doctorDbId,
          appointment_date: appointmentDate,
          time: selectedTime,
          reason: reason,
          symptoms: symptoms || null,
          status: "booked",
          consultation_fee: consultationFee,
          payment_status: "not_requested",
          payment_amount: 0,
        });

        if (error) {
          console.error("Booking error:", error);
          toast({
            title: "Booking Failed",
            description: "Could not save appointment. Please try again.",
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }

        toast({
          title: "Appointment Booked!",
          description: `Your appointment with ${doctorName} on ${appointmentDate} at ${selectedTime} has been saved.`,
        });
      } else {
        toast({
          title: "Appointment Booked (Demo)",
          description: `Your appointment with ${doctorName} has been scheduled. Sign in to persist bookings.`,
        });
      }

      onClose();
      resetForm();
    } catch (err) {
      console.error("Booking error:", err);
      toast({
        title: "Booking Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setReason("");
    setSymptoms("");
  };

  if (!mounted || !doctor || !isOpen) return null;

  return createPortal(
    // Backdrop — fills viewport, centers card
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal card */}
      <div
        className="relative flex flex-col w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header (fixed) ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold">
            Book Appointment with {doctorName}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ minHeight: 0 }}>

          {/* Date + Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Calendar */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Select Date</Label>
              <div className="border border-border rounded-xl overflow-hidden">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => setSelectedDate(date || null)}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="w-full"
                />
              </div>
            </div>

            {/* Times + Reason */}
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Available Times</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                        selectedTime === time
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="reason" className="text-sm font-semibold mb-1 block">
                  Reason for Visit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Regular checkup, chest pain..."
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <Label htmlFor="symptoms" className="text-sm font-semibold mb-1 block">
              Symptoms{" "}
              <span className="font-normal text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm space-y-1.5">
            <p className="font-semibold text-base mb-2">Appointment Summary</p>
            <p><span className="text-muted-foreground">Doctor:</span> {doctorName}</p>
            <p><span className="text-muted-foreground">Specialty:</span> {doctorSpecialty}</p>
            <p><span className="text-muted-foreground">Location:</span> {doctorLocation}</p>
            {consultationFee > 0 && (
              <p><span className="text-muted-foreground">Consultation Fee:</span> ${consultationFee}</p>
            )}
            {selectedDate && (
              <p><span className="text-muted-foreground">Date:</span> {selectedDate.toDateString()}</p>
            )}
            {selectedTime && (
              <p><span className="text-muted-foreground">Time:</span> {selectedTime}</p>
            )}
          </div>
        </div>

        {/* ── Footer (fixed) ── */}
        <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleBooking} className="flex-1" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookAppointmentModal;
