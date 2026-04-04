"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

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

  const supabase = createClient();

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const doctorName = doctor?.name || doctor?.full_name || "Doctor";
  const doctorSpecialty = doctor?.specialty || doctor?.specialization || "General";
  const doctorLocation = doctor?.location || "MedChain Healthcare";
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

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctorName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-semibold">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => setSelectedDate(date || null)}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Available Times
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {availableTimes.map((time: string) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Regular checkup, chest pain..."
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="symptoms">Symptoms (Optional)</Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Appointment Summary</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Doctor:</strong> {doctorName}
              </p>
              <p>
                <strong>Specialty:</strong> {doctorSpecialty}
              </p>
              <p>
                <strong>Location:</strong> {doctorLocation}
              </p>
              {consultationFee > 0 && (
                <p>
                  <strong>Consultation Fee:</strong> ${consultationFee}
                </p>
              )}
              {selectedDate && (
                <p>
                  <strong>Date:</strong> {selectedDate.toDateString()}
                </p>
              )}
              {selectedTime && (
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              className="flex-1"
              disabled={submitting}
            >
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
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentModal;
