import React from "react";
import { FileText, Download, Eye, Calendar, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RecordsTile = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const recentRecords = [
    {
      id: 1,
      type: "Blood Test Results",
      date: "2024-01-15",
      status: "available",
      size: "2.3 MB",
    },
    {
      id: 2,
      type: "X-Ray Report",
      date: "2024-01-10",
      status: "available",
      size: "8.7 MB",
    },
    {
      id: 3,
      type: "Prescription",
      date: "2024-01-08",
      status: "available",
      size: "156 KB",
    },
  ];

  return (
    <Card className="h-full bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm hover:border-[#388E3C]/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#388E3C]/20">
              <FileText className="h-5 w-5 text-[#388E3C]" />
            </div>
            <CardTitle className="text-[#FAFAFA] font-sf-pro-bold">
              Medical Records
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("records")}
            className="border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 font-sf-pro-medium"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#FAFAFA]/70 font-sf-pro-regular text-sm">
          Access your secure medical documents and reports
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20">
            <div className="text-lg font-sf-pro-bold text-[#388E3C]">12</div>
            <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
              Total Records
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20">
            <div className="text-lg font-sf-pro-bold text-[#388E3C]">3</div>
            <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
              This Month
            </div>
          </div>
        </div>

        {/* Recent Records */}
        <div className="space-y-2">
          {recentRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-[#388E3C]" />
                <div>
                  <div className="text-sm font-sf-pro-medium text-[#FAFAFA]">
                    {record.type}
                  </div>
                  <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
                    {record.date} • {record.size}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-[#388E3C] hover:bg-[#388E3C]/20"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-[#388E3C] hover:bg-[#388E3C]/20"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
          <Shield className="h-3 w-3 text-[#388E3C]" />
          <span>All records are encrypted and HIPAA compliant</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordsTile;
