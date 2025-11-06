import React from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentsTile = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const paymentHistory = [
    {
      id: 1,
      service: "Cardiology Consultation",
      amount: 150.0,
      date: "2024-01-15",
      status: "paid",
    },
    {
      id: 2,
      service: "Blood Test",
      amount: 85.5,
      date: "2024-01-10",
      status: "pending",
    },
    {
      id: 3,
      service: "X-Ray Imaging",
      amount: 220.0,
      date: "2024-01-08",
      status: "paid",
    },
  ];

  const totalSpent = paymentHistory.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const pendingAmount = paymentHistory
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Card className="h-full bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm hover:border-[#388E3C]/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#388E3C]/20">
              <CreditCard className="h-5 w-5 text-[#388E3C]" />
            </div>
            <CardTitle className="text-[#FAFAFA] font-sf-pro-bold">
              Payments
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("payments")}
            className="border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 font-sf-pro-medium"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#FAFAFA]/70 font-sf-pro-regular text-sm">
          Manage your healthcare payments and billing
        </p>

        {/* Payment Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20">
            <div className="text-lg font-sf-pro-bold text-[#388E3C]">
              ${totalSpent.toFixed(2)}
            </div>
            <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
              Total Spent
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20">
            <div className="text-lg font-sf-pro-bold text-[#FAFAFA]">
              ${pendingAmount.toFixed(2)}
            </div>
            <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
              Pending
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="space-y-2">
          {paymentHistory.slice(0, 2).map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20"
            >
              <div className="flex items-center space-x-2">
                {payment.status === "paid" ? (
                  <CheckCircle className="h-4 w-4 text-[#388E3C]" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-[#FAFAFA]/60" />
                )}
                <div>
                  <div className="text-sm font-sf-pro-medium text-[#FAFAFA]">
                    {payment.service}
                  </div>
                  <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
                    {payment.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-sf-pro-semibold text-[#FAFAFA]">
                  ${payment.amount.toFixed(2)}
                </div>
                <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular capitalize">
                  {payment.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {pendingAmount > 0 && (
          <Button className="w-full bg-[#388E3C] hover:bg-[#388E3C]/80 text-[#FAFAFA] font-sf-pro-medium">
            Pay Pending Amount (${pendingAmount.toFixed(2)})
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentsTile;
