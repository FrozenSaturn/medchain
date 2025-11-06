import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  Calendar,
  Stethoscope,
  Phone,
  Mail,
} from "lucide-react";
import BookAppointmentModal from "./BookAppointmentModal";

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Oncology",
  ];

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Miami, FL",
    "Chicago, IL",
    "Houston, TX",
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      rating: 4.9,
      reviews: 127,
      location: "Downtown Medical Center",
      availability: "Mon-Fri, 9AM-5PM",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@healthcare.com",
      image: "/placeholder-user.jpg",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      rating: 4.8,
      reviews: 89,
      location: "Westside Clinic",
      availability: "Tue-Sat, 10AM-6PM",
      phone: "+1 (555) 234-5678",
      email: "michael.chen@healthcare.com",
      image: "/placeholder-user.jpg",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      rating: 4.7,
      reviews: 156,
      location: "Children's Hospital",
      availability: "Mon-Thu, 8AM-4PM",
      phone: "+1 (555) 345-6789",
      email: "emily.rodriguez@healthcare.com",
      image: "/placeholder-user.jpg",
    },
  ];

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    const matchesLocation =
      !selectedLocation || doctor.location === selectedLocation;

    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#FAFAFA] font-sf-pro-bold flex items-center space-x-2">
            <Search className="h-5 w-5 text-[#388E3C]" />
            <span>Find Healthcare Professionals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/50 border-[#388E3C]/30 text-[#FAFAFA] placeholder:text-[#FAFAFA]/50 focus:border-[#388E3C] font-sf-pro-regular"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-2 bg-black/50 border border-[#388E3C]/30 text-[#FAFAFA] rounded-md focus:border-[#388E3C] font-sf-pro-regular"
            >
              {specialties.map((specialty) => (
                <option
                  key={specialty}
                  value={specialty === "All Specialties" ? "all" : specialty}
                >
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm hover:border-[#388E3C]/40 transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-[#388E3C]/20 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-[#388E3C]" />
                </div>
                <div>
                  <CardTitle className="text-[#FAFAFA] font-sf-pro-bold text-lg">
                    {doctor.name}
                  </CardTitle>
                  <p className="text-[#388E3C] font-sf-pro-medium">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-[#388E3C] fill-current" />
                  <span className="text-[#FAFAFA] font-sf-pro-semibold">
                    {doctor.rating}
                  </span>
                </div>
                <span className="text-[#FAFAFA]/60 font-sf-pro-regular">
                  ({doctor.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-2 text-[#FAFAFA]/80 font-sf-pro-regular">
                <MapPin className="h-4 w-4 text-[#388E3C]" />
                <span>{doctor.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-[#FAFAFA]/80 font-sf-pro-regular">
                <Calendar className="h-4 w-4 text-[#388E3C]" />
                <span>{doctor.availability}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#FAFAFA]/80 font-sf-pro-regular">
                  <Phone className="h-4 w-4 text-[#388E3C]" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#FAFAFA]/80 font-sf-pro-regular">
                  <Mail className="h-4 w-4 text-[#388E3C]" />
                  <span>{doctor.email}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  className="flex-1 bg-[#388E3C] hover:bg-[#388E3C]/80 text-[#FAFAFA] font-sf-pro-medium"
                  onClick={() => handleBookAppointment(doctor)}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 font-sf-pro-medium"
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-[#388E3C] mx-auto mb-4" />
            <h3 className="text-[#FAFAFA] font-sf-pro-bold text-lg mb-2">
              No doctors found
            </h3>
            <p className="text-[#FAFAFA]/70 font-sf-pro-regular">
              Try adjusting your search criteria or browse all specialties
            </p>
          </CardContent>
        </Card>
      )}

      <BookAppointmentModal
        doctor={selectedDoctor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default DoctorSearch;
