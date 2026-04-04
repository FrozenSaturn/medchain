import React from "react";
import FindDoctorsTile from "../patient/tiles/FindDoctorsTile";
import AppointmentsTile from "../patient/tiles/AppointmentsTile";
import RecordsTile from "../patient/tiles/RecordsTile";
import PaymentsTile from "../patient/tiles/PaymentsTile";
import MedicalNFTsTile from "../patient/tiles/MedicalNFTsTile";
import { Card, CardContent } from "@/components/ui/card";

interface PatientProfileProps {
  setActiveTab: (tab: string) => void;
  patientName?: string;
  appointmentCount?: number;
  recordCount?: number;
  pendingPayments?: number;
}

const PatientProfile = ({
  setActiveTab,
  patientName = "Patient",
  appointmentCount = 0,
  recordCount = 0,
  pendingPayments = 0,
}: PatientProfileProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-sf-pro-bold text-[#FAFAFA] mb-2">
                Welcome back, {patientName}!
              </h2>
              <p className="text-[#FAFAFA]/70 font-sf-pro-regular">
                Here&apos;s your healthcare overview for today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-sf-pro-bold text-[#388E3C]">
                  {appointmentCount}
                </div>
                <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
                  Appointments
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-sf-pro-bold text-[#388E3C]">
                  {recordCount}
                </div>
                <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
                  Records
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-sf-pro-bold text-[#388E3C]">
                  {pendingPayments}
                </div>
                <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[1fr]">
        <div className="lg:col-span-2 h-full">
          <FindDoctorsTile setActiveTab={setActiveTab} />
        </div>
        <div className="h-full">
          <AppointmentsTile setActiveTab={setActiveTab} />
        </div>
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
