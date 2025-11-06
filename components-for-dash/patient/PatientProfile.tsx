import React from "react";
import { Calendar, FileText, CreditCard, Award, Search } from "lucide-react";
import FindDoctorsTile from "../patient/tiles/FindDoctorsTile";
import AppointmentsTile from "../patient/tiles/AppointmentsTile";
import RecordsTile from "../patient/tiles/RecordsTile";
import PaymentsTile from "../patient/tiles/PaymentsTile";
import MedicalNFTsTile from "../patient/tiles/MedicalNFTsTile";
import { Card, CardContent } from "@/components/ui/card";

const PatientProfile = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  // TODO: Fetch patient data from Supabase
  const patientData = {
    name: "John Doe",
    email: "john.doe@email.com",
    appointments: 3,
    records: 5,
    pendingPayments: 2,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-sf-pro-bold text-[#FAFAFA] mb-2">
                Welcome back, {patientData.name}!
              </h2>
              <p className="text-[#FAFAFA]/70 font-sf-pro-regular">
                Here's your healthcare overview for today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-sf-pro-bold text-[#388E3C]">
                  {patientData.appointments}
                </div>
                <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
                  Appointments
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-sf-pro-bold text-[#388E3C]">
                  {patientData.records}
                </div>
                <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
                  Records
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-sf-pro-bold text-[#388E3C]">
                  {patientData.pendingPayments}
                </div>
                <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[1fr]">
        {/* Row 1 */}
        <div className="lg:col-span-2 h-full">
          <FindDoctorsTile setActiveTab={setActiveTab} />
        </div>
        <div className="h-full">
          <AppointmentsTile setActiveTab={setActiveTab} />
        </div>
        {/* Row 2 */}
        <div className="h-full">
          <RecordsTile setActiveTab={setActiveTab} />
        </div>
        <div className="h-full">
          <PaymentsTile setActiveTab={setActiveTab} />
        </div>
        <div className="h-full">
          <MedicalNFTsTile setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
