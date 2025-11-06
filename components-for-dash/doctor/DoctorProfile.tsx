import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DoctorAppointmentsTile from "../doctor/tiles/DoctorAppointmentsTile";
import DiagnosisSubmissionTile from "../doctor/tiles/DiagnosisSubmissionTile";
import MedicalRecordAccessTile from "../doctor/tiles/MedicalRecordAccessTile";

const DoctorProfile = () => {
  // TODO: Fetch doctor data from Supabase
  const doctorData = {
    name: "Dr. Sarah Johnson",
    pendingAppointments: 8,
    completedToday: 5,
    awaitingDiagnosis: 3,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {doctorData.name}!
              </h2>
              <p className="text-muted-foreground">
                Here's your overview for today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {doctorData.pendingAppointments}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {doctorData.completedToday}
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {doctorData.awaitingDiagnosis}
                </div>
                <div className="text-sm text-muted-foreground">
                  Awaiting Diagnosis
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[1fr]">
        <div className="lg:col-span-2 h-full">
          <DoctorAppointmentsTile />
        </div>
        <div className="h-full">
          <DiagnosisSubmissionTile />
        </div>
        <div className="md:col-span-2 lg:col-span-3 h-full">
          <MedicalRecordAccessTile />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
