import React, { useState } from "react";
import { User, Calendar, FileText, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorProfile from "../doctor/DoctorProfile";
import AppointmentQueue from "../doctor/AppointmentQueue";
import { DiagnosisSubmission } from "../doctor/DiagnosisSubmission";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // TODO: Fetch doctor data from Supabase
  const doctorData = {
    name: "Dr. Sarah Johnson",
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {doctorData.name}</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Appointment Queue</span>
          </TabsTrigger>
          <TabsTrigger
            value="diagnosis"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Submit Diagnosis</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Treatment History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <DoctorProfile />
        </TabsContent>

        <TabsContent value="queue">
          <AppointmentQueue />
        </TabsContent>

        <TabsContent value="diagnosis">
          <DiagnosisSubmission />
        </TabsContent>

        <TabsContent value="history">
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
