import React, { useState } from "react";
import { Shield, Users, Calendar, CreditCard, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleVerification from "../admin/RoleVerification";
import AppointmentManagement from "../admin/AppointmentManagement";
import PaymentTracking from "../admin/PaymentTracking";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("roles");

  // TODO: Fetch admin statistics from Supabase
  const adminStats = {
    pendingVerifications: 12,
    totalDoctors: 145,
    totalHospitals: 23,
    pendingPayments: 8,
    totalTransactions: 1247,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System management and oversight
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium">
                  {adminStats.pendingVerifications} Pending
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">
                  {adminStats.totalDoctors} Doctors
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
        <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Role Verification</span>
          </TabsTrigger>
          <TabsTrigger
            value="hospitals"
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Hospital Management</span>
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RoleVerification />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
