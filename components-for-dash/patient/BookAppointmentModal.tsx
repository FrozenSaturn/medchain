
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';

const BookAppointmentModal = ({ doctor, isOpen, onClose }: { doctor: any, isOpen: boolean, onClose: () => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Save appointment to Supabase and generate booking ID
    // const bookingId = generateUniqueId();
    // const { error } = await supabase
    //   .from('appointments')
    //   .insert({
    //     booking_id: bookingId,
    //     patient_id: user.id,
    //     doctor_id: doctor.id,
    //     appointment_date: selectedDate,
    //     appointment_time: selectedTime,
    //     reason: reason,
    //     symptoms: symptoms,
    //     status: 'booked'
    //   });

    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${doctor?.name} has been scheduled.`,
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setReason('');
    setSymptoms('');
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
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
                <Label className="text-base font-semibold">Available Times</Label>
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Appointment Summary</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Doctor:</strong> {doctor.name}</p>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
              <p><strong>Hospital:</strong> {doctor.hospital}</p>
              {selectedDate && <p><strong>Date:</strong> {selectedDate.toDateString()}</p>}
              {selectedTime && <p><strong>Time:</strong> {selectedTime}</p>}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleBooking} className="flex-1">
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentModal;
