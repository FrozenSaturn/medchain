import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Calendar, Stethoscope } from "lucide-react";
import BookAppointmentModal from "../BookAppointmentModal";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Doctor {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  specialization: string | null;
  consultation_fee: number | null;
}

const FindDoctorsTile = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const supabase = createClient();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, specialization, consultation_fee")
        .eq("role", "doctor")
        .limit(3);

      if (error) {
        console.error("Error fetching doctors:", error);
        return;
      }
      if (data) {
        setDoctors(data);
      }
    };
    fetchDoctors();
  }, [supabase]);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Card className="h-full bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm hover:border-[#388E3C]/40 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-[#388E3C]/20">
                <Search className="h-5 w-5 text-[#388E3C]" />
              </div>
              <CardTitle className="text-[#FAFAFA] font-sf-pro-bold">
                Find Doctors
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("search")}
              className="border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 font-sf-pro-medium"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#FAFAFA]/70 font-sf-pro-regular text-sm">
            Recommended healthcare professionals based on your needs
          </p>

          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center space-x-3 p-3 bg-[#388E3C]/10 border border-[#388E3C]/20 rounded-lg hover:border-[#388E3C]/40 transition-all duration-200"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={doctor.avatar_url ?? undefined}
                    alt={doctor.full_name ?? "Doctor"}
                  />
                  <AvatarFallback>
                    <Stethoscope className="h-6 w-6 text-[#388E3C]" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-sf-pro-semibold text-sm text-[#FAFAFA]">
                      {doctor.full_name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-[#388E3C]/20 text-[#388E3C] border-[#388E3C]/30 font-sf-pro-medium"
                    >
                      {doctor.specialization}
                    </Badge>
                  </div>

                  {doctor.consultation_fee && (
                    <div className="text-xs text-[#FAFAFA]/80 font-sf-pro-regular mb-1">
                      Fee: ${doctor.consultation_fee}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleBookAppointment(doctor)}
                  className="text-xs bg-[#388E3C] hover:bg-[#388E3C]/80 text-[#FAFAFA] font-sf-pro-medium"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Book
                </Button>
              </div>
            ))}
          </div>

          {/* Quick Search Categories */}
          <div className="space-y-2 pt-4 border-t border-[#388E3C]/20">
            <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-medium uppercase tracking-wide">
              Popular Specialties
            </div>
            <div className="flex flex-wrap gap-2">
              {["Cardiology", "Dermatology", "Neurology", "Pediatrics"].map(
                (specialty) => (
                  <Button
                    key={specialty}
                    variant="outline"
                    size="sm"
                    className="text-xs border-[#388E3C]/30 text-[#FAFAFA]/80 bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:text-[#FAFAFA] hover:border-[#388E3C]/50 font-sf-pro-regular"
                  >
                    {specialty}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <BookAppointmentModal
        doctor={selectedDoctor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default FindDoctorsTile;
