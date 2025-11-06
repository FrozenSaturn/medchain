import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  User,
  Search,
  CreditCard,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientProfile from "../patient/PatientProfile";
import DoctorSearch from "../patient/DoctorSearch";
import AppointmentStatus from "../patient/AppointmentStatus";
import MedicalRecordUpload from "../patient/MedicalRecordUpload";
import TreatmentPayment from "../patient/TreatmentPayment";
import NFTViewer from "../patient/NFTViewer";
import { useRouter, useSearchParams } from "next/navigation";

const PatientDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    // Only run on client
    const urlTab = searchParams.get("tab");
    setTab(urlTab || "profile");
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setTab(value);
    router.push(`?tab=${value}`);
  };

  // TODO: Fetch patient data from Supabase
  const patientData = {
    name: "John Doe",
    email: "john.doe@email.com",
    appointments: 3,
    records: 5,
    pendingPayments: 2,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Patient Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {patientData.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">
                  {patientData.appointments} Appointments
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-secondary/50">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Find Doctors</span>
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Records</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="nfts" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Medical NFTs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <PatientProfile setActiveTab={handleTabChange} />
        </TabsContent>

        <TabsContent value="search">
          <DoctorSearch />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentStatus />
        </TabsContent>

        <TabsContent value="records">
          <MedicalRecordUpload />
        </TabsContent>

        <TabsContent value="payments">
          <TreatmentPayment />
        </TabsContent>

        <TabsContent value="nfts">
          <NFTViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;
