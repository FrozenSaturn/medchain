"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TreatmentPayment = () => {
  // TODO: Fetch payment requests from Supabase
  const paymentRequests = [
    {
      id: "PAY001",
      bookingId: "BK-2024-003",
      doctor: "Dr. Emily Rodriguez",
      treatment: "Dermatology Consultation",
      amount: 150,
      requestDate: "2024-01-16",
      status: "pending",
      description: "Comprehensive skin examination and treatment plan",
    },
    {
      id: "PAY002",
      bookingId: "BK-2024-002",
      doctor: "Dr. Michael Chen",
      treatment: "Neurology Consultation + MRI",
      amount: 450,
      requestDate: "2024-01-14",
      status: "pending",
      description: "Neurological examination with brain MRI scan",
    },
    {
      id: "PAY003",
      bookingId: "BK-2024-001",
      doctor: "Dr. Sarah Johnson",
      treatment: "Cardiology Follow-up",
      amount: 200,
      requestDate: "2024-01-12",
      status: "paid",
      description: "Follow-up consultation and ECG test",
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j...",
    },
  ];

  const handlePayment = async (paymentRequest: any) => {
    // TODO: Integrate with smart contract for payment
    // 1. Connect to Web3 wallet
    // 2. Call smart contract payment function
    // 3. Update payment status in Supabase after blockchain confirmation

    toast({
      title: "Payment Processing",
      description: "Connecting to blockchain for payment processing...",
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Payment of $${paymentRequest.amount} has been processed on the blockchain.`,
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>Payment Required</span>
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="flex items-center space-x-1 bg-green-600/10 text-green-500 border-green-500/20"
      >
        <CheckCircle className="h-3 w-3" />
        <span>Paid</span>
      </Badge>
    );
  };

  const viewTransaction = (hash: string) => {
    // TODO: Open blockchain explorer
    toast({
      title: "Transaction Details",
      description: "Opening blockchain explorer in new tab...",
    });
  };

  const pendingPayments = paymentRequests.filter((p) => p.status === "pending");
  const paidPayments = paymentRequests.filter((p) => p.status === "paid");

  return (
    <div className="space-y-6">
      {pendingPayments.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Pending Payments ({pendingPayments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="bg-card rounded-lg p-4 border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {payment.treatment}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p>
                          <strong>Doctor:</strong> {payment.doctor}
                        </p>
                        <p>
                          <strong>Booking ID:</strong> {payment.bookingId}
                        </p>
                        <p>
                          <strong>Request Date:</strong> {payment.requestDate}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p>
                          <strong>Amount:</strong>{" "}
                          <span className="text-xl font-bold text-green-500">
                            ${payment.amount}
                          </span>
                        </p>
                        <p>
                          <strong>Description:</strong> {payment.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button
                      onClick={() => handlePayment(payment)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay ${payment.amount}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Payment History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paidPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment history yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paidPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{payment.treatment}</h3>
                        {getStatusBadge(payment.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="space-y-1">
                          <p>
                            <strong>Doctor:</strong> {payment.doctor}
                          </p>
                          <p>
                            <strong>Booking ID:</strong> {payment.bookingId}
                          </p>
                          <p>
                            <strong>Amount:</strong> ${payment.amount}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p>
                            <strong>Description:</strong> {payment.description}
                          </p>
                          {payment.transactionHash && (
                            <p>
                              <strong>Transaction:</strong>{" "}
                              {payment.transactionHash.substring(0, 20)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {payment.transactionHash && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewTransaction(payment.transactionHash)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Tx
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentPayment;
