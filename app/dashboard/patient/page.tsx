"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  User,
  Search,
  CreditCard,
  Award,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientProfile from "../../../components-for-dash/patient/PatientProfile";
import DoctorSearch from "../../../components-for-dash/patient/DoctorSearch";
import AppointmentStatus from "../../../components-for-dash/patient/AppointmentStatus";
import TreatmentPayment from "../../../components-for-dash/patient/TreatmentPayment";
import NFTViewer from "../../../components-for-dash/patient/NFTViewer";
import { usePathname } from "next/navigation";
import MedicalRecordUpload from "@/components-for-dash/patient/MedicalRecordUpload";
import { createClient } from "@/lib/supabase/client";

const PatientDashboard = () => {
  const pathname = usePathname();
  const supabase = createClient();

  const getInitialTab = () => {
    if (pathname.endsWith("/appointment")) return "appointments";
    if (pathname.endsWith("/records")) return "records";
    if (pathname.endsWith("/payments")) return "payments";
    if (pathname.endsWith("/nfts")) return "nfts";
    return "profile";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [userId, setUserId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("Patient");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCounts = async (uid: string, wallet: string | null) => {
    const { count: aptCount } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("patient_id", uid);
    setAppointmentCount(aptCount || 0);

    if (wallet) {
      const { count: recCount } = await supabase
        .from("medical_records_nfts")
        .select("*", { count: "exact", head: true })
        .eq("patient_wallet_address", wallet);
      setRecordCount(recCount || 0);
    }

    try {
      const { count: payCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("patient_id", uid)
        .eq("payment_status", "pending");
      setPendingPayments(payCount || 0);
    } catch {
      setPendingPayments(0);
    }
  };

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, walletAddress")
          .eq("id", user.id)
          .single();

        const name = profile?.full_name || "Patient";
        const wallet = profile?.walletAddress || null;
        setPatientName(name);
        setWalletAddress(wallet);

        await refreshCounts(user.id, wallet);
      } catch (err) {
        console.error("Error loading patient data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#388E3C]" />
          <p className="text-[#FAFAFA]/70 font-sf-pro-regular">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sf-pro-bold text-[#FAFAFA] mb-2">
            Patient Dashboard
          </h1>
          <p className="text-[#FAFAFA]/70 font-sf-pro-regular">
            Welcome back,{" "}
            <span className="text-[#388E3C] font-sf-pro-semibold">
              {patientName}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#388E3C]" />
                <span className="text-sm font-sf-pro-medium text-[#FAFAFA]">
                  {appointmentCount} Appointments
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6 bg-black/50 border border-[#388E3C]/20 backdrop-blur-sm">
          <TabsTrigger
            value="profile"
            className="flex items-center space-x-2 data-[state=active]:bg-[#388E3C]/20 data-[state=active]:text-[#388E3C] data-[state=active]:border-[#388E3C]/30 text-[#FAFAFA]/70 hover:text-[#FAFAFA] font-sf-pro-regular"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="flex items-center space-x-2 data-[state=active]:bg-[#388E3C]/20 data-[state=active]:text-[#388E3C] data-[state=active]:border-[#388E3C]/30 text-[#FAFAFA]/70 hover:text-[#FAFAFA] font-sf-pro-regular"
          >
            <Search className="h-4 w-4" />
            <span>Find Doctors</span>
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="flex items-center space-x-2 data-[state=active]:bg-[#388E3C]/20 data-[state=active]:text-[#388E3C] data-[state=active]:border-[#388E3C]/30 text-[#FAFAFA]/70 hover:text-[#FAFAFA] font-sf-pro-regular"
          >
            <Calendar className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger
            value="records"
            className="flex items-center space-x-2 data-[state=active]:bg-[#388E3C]/20 data-[state=active]:text-[#388E3C] data-[state=active]:border-[#388E3C]/30 text-[#FAFAFA]/70 hover:text-[#FAFAFA] font-sf-pro-regular"
          >
            <FileText className="h-4 w-4" />
            <span>Records</span>
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="flex items-center space-x-2 data-[state=active]:bg-[#388E3C]/20 data-[state=active]:text-[#388E3C] data-[state=active]:border-[#388E3C]/30 text-[#FAFAFA]/70 hover:text-[#FAFAFA] font-sf-pro-regular"
          >
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger
            value="nfts"
            className="flex items-center space-x-2 data-[state=active]:bg-[#388E3C]/20 data-[state=active]:text-[#388E3C] data-[state=active]:border-[#388E3C]/30 text-[#FAFAFA]/70 hover:text-[#FAFAFA] font-sf-pro-regular"
          >
            <Award className="h-4 w-4" />
            <span>Medical NFTs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <PatientProfile
            setActiveTab={setActiveTab}
            patientName={patientName}
            appointmentCount={appointmentCount}
            recordCount={recordCount}
            pendingPayments={pendingPayments}
          />
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <DoctorSearch userId={userId} />
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <AppointmentStatus userId={userId} />
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <MedicalRecordUpload userId={userId} walletAddress={walletAddress} />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <TreatmentPayment userId={userId} />
        </TabsContent>

        <TabsContent value="nfts" className="mt-6">
          <NFTViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;
