"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleVerification from "../components-for-dash/admin/RoleVerification";

const AdminPage = () => {
  const pathname = usePathname();
  const getInitialTab = () => {
    if (pathname.endsWith("/roles")) return "profile";
    if (pathname.endsWith("/appointments")) return "profile";
    if (pathname.endsWith("/payments")) return "profile";
    return "profile";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // TODO: Fetch admin statistics from Supabase
  const adminStats = {
    pendingVerifications: 12,
    totalDoctors: 145,
    totalHospitals: 23,
    pendingPayments: 8,
    totalTransactions: 1247,
  };

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-screen">
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
        onValueChange={handleTabChange}
        className="space-y-6 flex-1"
      >
        {/* Horizontal Tabs List */}
        <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-secondary/50 p-1 text-muted-foreground w-auto">
          <TabsTrigger
            value="profile"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm mr-1"
          >
            <Users className="h-4 w-4 mr-2" />
            <span>Profile</span>
          </TabsTrigger>
        </TabsList>

        {/* Equal spacing between tab content areas */}
        <div className="space-y-6">
          <TabsContent value="profile" className="mt-6">
            <RoleVerification />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminPage;
