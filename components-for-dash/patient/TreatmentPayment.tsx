"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Clock,
  CheckCircle,
  ExternalLink,
  Loader2,
  DollarSign,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { doctorSpecialtyFromProfile } from "@/lib/doctor-profile";

interface PaymentAppointment {
  id: string;
  appointment_date: string;
  reason: string;
  consultation_fee: number;
  payment_status: string | null;
  payment_amount: number | null;
  payment_tx_hash: string | null;
  created_at: string;
  doctor: {
    id: string;
    full_name: string;
    bio: string | null;
  } | null;
}

const TreatmentPayment = ({ userId }: { userId: string | null }) => {
  const [appointments, setAppointments] = useState<PaymentAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [confirmPayment, setConfirmPayment] = useState<PaymentAppointment | null>(null);

  const supabase = createClient();

  const fetchPayments = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `id, appointment_date, reason, consultation_fee,
           payment_status, payment_amount, payment_tx_hash, created_at,
           doctor:doctor_id(id, full_name, bio)`
        )
        .eq("patient_id", userId)
        .in("payment_status", ["pending", "paid"])
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payments:", error);
        return;
      }

      setAppointments((data as unknown as PaymentAppointment[]) || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [userId]);

  const handlePayment = async (apt: PaymentAppointment) => {
    setPayingId(apt.id);

    toast({
      title: "Processing Payment",
      description: "Connecting to blockchain wallet...",
    });

    setTimeout(async () => {
      const txHash = `0xdemo${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

      const { error } = await supabase
        .from("appointments")
        .update({
          payment_status: "paid",
          payment_tx_hash: txHash,
        })
        .eq("id", apt.id);

      setPayingId(null);
      setConfirmPayment(null);

      if (error) {
        toast({
          title: "Payment Failed",
          description: "Could not process payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Payment Successful!",
        description: `$${apt.payment_amount || apt.consultation_fee} has been processed. Transaction recorded on blockchain.`,
      });

      fetchPayments();
    }, 2500);
  };

  const viewTransaction = (hash: string) => {
    toast({
      title: "Transaction Details",
      description: `Transaction: ${hash.substring(0, 30)}...`,
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const pendingPayments = appointments.filter(
    (a) => a.payment_status === "pending"
  );
  const paidPayments = appointments.filter((a) => a.payment_status === "paid");

  const totalPaid = paidPayments.reduce(
    (sum, a) => sum + (a.payment_amount || a.consultation_fee || 0),
    0
  );
  const totalPending = pendingPayments.reduce(
    (sum, a) => sum + (a.payment_amount || a.consultation_fee || 0),
    0
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#388E3C] mr-3" />
            <p className="text-[#FAFAFA]/70">Loading payment data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#388E3C]/10 border-[#388E3C]/20">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-[#388E3C] mx-auto mb-2" />
            <div className="text-2xl font-sf-pro-bold text-[#388E3C]">
              ${totalPaid.toFixed(2)}
            </div>
            <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
              Total Paid
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-sf-pro-bold text-destructive">
              ${totalPending.toFixed(2)}
            </div>
            <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
              Pending
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#388E3C]/10 border-[#388E3C]/20">
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 text-[#388E3C] mx-auto mb-2" />
            <div className="text-2xl font-sf-pro-bold text-[#FAFAFA]">
              {appointments.length}
            </div>
            <div className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
              Total Transactions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
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
              <div
                key={payment.id}
                className="bg-card rounded-lg p-4 border border-[#388E3C]/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg text-[#FAFAFA]">
                        {payment.reason}
                      </h3>
                      <Badge
                        variant="destructive"
                        className="flex items-center space-x-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>Payment Required</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#FAFAFA]/70">
                      <div className="space-y-1">
                        <p>
                          <strong className="text-[#FAFAFA]/90">Doctor:</strong>{" "}
                          {payment.doctor?.full_name || "Doctor"}
                        </p>
                        <p>
                          <strong className="text-[#FAFAFA]/90">
                            Specialty:
                          </strong>{" "}
                          {doctorSpecialtyFromProfile({
                            bio: payment.doctor?.bio,
                          })}
                        </p>
                        <p>
                          <strong className="text-[#FAFAFA]/90">Date:</strong>{" "}
                          {formatDate(payment.appointment_date)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p>
                          <strong className="text-[#FAFAFA]/90">Amount:</strong>{" "}
                          <span className="text-xl font-bold text-[#388E3C]">
                            $
                            {payment.payment_amount || payment.consultation_fee}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button
                      onClick={() => setConfirmPayment(payment)}
                      className="bg-[#388E3C] hover:bg-[#388E3C]/80"
                      disabled={payingId === payment.id}
                    >
                      {payingId === payment.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay $
                          {payment.payment_amount || payment.consultation_fee}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#FAFAFA]">
            <CheckCircle className="h-5 w-5 text-[#388E3C]" />
            <span>Payment History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paidPayments.length === 0 ? (
            <div className="text-center py-8 text-[#FAFAFA]/50">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment history yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paidPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border border-[#388E3C]/20 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-[#FAFAFA]">
                          {payment.reason}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="flex items-center space-x-1 bg-[#388E3C]/10 text-[#388E3C] border-[#388E3C]/20"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Paid</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#FAFAFA]/60">
                        <div className="space-y-1">
                          <p>
                            <strong className="text-[#FAFAFA]/80">
                              Doctor:
                            </strong>{" "}
                            {payment.doctor?.full_name || "Doctor"}
                          </p>
                          <p>
                            <strong className="text-[#FAFAFA]/80">
                              Date:
                            </strong>{" "}
                            {formatDate(payment.appointment_date)}
                          </p>
                          <p>
                            <strong className="text-[#FAFAFA]/80">
                              Amount:
                            </strong>{" "}
                            $
                            {payment.payment_amount || payment.consultation_fee}
                          </p>
                        </div>
                        <div className="space-y-1">
                          {payment.payment_tx_hash && (
                            <p className="text-xs">
                              <strong className="text-[#FAFAFA]/80">
                                Transaction:
                              </strong>{" "}
                              {payment.payment_tx_hash.substring(0, 24)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {payment.payment_tx_hash && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          viewTransaction(payment.payment_tx_hash!)
                        }
                        className="border-[#388E3C]/30 text-[#FAFAFA]"
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

      {/* No payments at all */}
      {appointments.length === 0 && (
        <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
          <CardContent className="text-center py-12">
            <CreditCard className="h-16 w-16 mx-auto text-[#388E3C]/40 mb-4" />
            <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">
              No Payment Activity
            </h3>
            <p className="text-[#FAFAFA]/60">
              Payment requests will appear here after your appointments.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={!!confirmPayment}
        onOpenChange={() => setConfirmPayment(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>
          {confirmPayment && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2 text-sm">
                <p>
                  <strong>Treatment:</strong> {confirmPayment.reason}
                </p>
                <p>
                  <strong>Doctor:</strong>{" "}
                  {confirmPayment.doctor?.full_name || "Doctor"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDate(confirmPayment.appointment_date)}
                </p>
                <p className="text-lg font-bold text-[#388E3C]">
                  Amount: $
                  {confirmPayment.payment_amount ||
                    confirmPayment.consultation_fee}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                This is a demo payment. No real funds will be transferred.
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmPayment(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handlePayment(confirmPayment)}
                  className="flex-1 bg-[#388E3C] hover:bg-[#388E3C]/80"
                  disabled={payingId === confirmPayment.id}
                >
                  {payingId === confirmPayment.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Confirm Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreatmentPayment;
