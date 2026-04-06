"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Loader2,
  RefreshCw,
  Send,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import { doctorAppointmentDoctorIdScope } from "@/lib/doctor-appointment-scope";

type PaymentStatus = "not_requested" | "pending" | "paid" | string;

interface Row {
  id: string;
  appointment_date: string | null;
  reason: string | null;
  consultation_fee: number | null;
  payment_status: PaymentStatus | null;
  payment_amount: number | null;
  payment_tx_hash: string | null;
  patient: { full_name: string | null }[] | { full_name: string | null } | null;
}

function patientName(p: Row["patient"]): string {
  if (!p) return "Patient";
  const row = Array.isArray(p) ? p[0] : p;
  return row?.full_name?.trim() || "Patient";
}

function statusBadge(status: PaymentStatus | null) {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-600">Paid</Badge>;
    case "pending":
      return (
        <Badge variant="secondary" className="bg-amber-500/20 text-amber-900 dark:text-amber-100">
          Awaiting patient
        </Badge>
      );
    default:
      return <Badge variant="outline">Not requested</Badge>;
  }
}

export function DoctorPaymentTab() {
  const supabase = createClient();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [amountDrafts, setAmountDrafts] = useState<Record<string, string>>({});
  const [accountIssue, setAccountIssue] = useState<
    null | "not_doctor" | "scope_error"
  >(null);

  const loadSession = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setDoctorId(user?.id ?? null);
    return user?.id ?? null;
  }, [supabase]);

  const fetchRows = useCallback(
    async (uid: string) => {
      setLoading(true);
      setAccountIssue(null);

      const scope = await doctorAppointmentDoctorIdScope(supabase, uid);
      if (scope.notDoctor) {
        setAccountIssue("not_doctor");
        setRows([]);
        setLoading(false);
        return;
      }
      if (scope.ids.length === 0) {
        setAccountIssue("scope_error");
        toast({
          title: "Could not resolve doctor scope",
          description: scope.error ?? "Unknown error",
          variant: "destructive",
        });
        setRows([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `id, appointment_date, reason, consultation_fee,
           payment_status, payment_amount, payment_tx_hash,
           patient:patient_id(full_name)`
        )
        .in("doctor_id", scope.ids)
        .order("appointment_date", { ascending: false });

      if (error) {
        console.error("DoctorPaymentTab fetch", error);
        toast({
          title: "Could not load appointments",
          description: error.message,
          variant: "destructive",
        });
        setRows([]);
      } else {
        setRows((data as Row[]) || []);
      }
      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    (async () => {
      const uid = await loadSession();
      if (uid) await fetchRows(uid);
      else setLoading(false);
    })();
  }, [loadSession, fetchRows]);

  const callAction = async (
    appointmentId: string,
    action: "request_payment" | "record_demo_paid" | "clear_payment_request",
    paymentAmount?: number
  ) => {
    setActingId(appointmentId);
    try {
      const res = await fetch("/api/doctor/appointment-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, action, paymentAmount }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: "Action failed",
          description: json.error || res.statusText,
          variant: "destructive",
        });
        return;
      }
      const label =
        action === "request_payment"
          ? "Payment request sent — patient will see it on their Payments tab."
          : action === "record_demo_paid"
            ? "Recorded as paid (demo). Patient profile updated."
            : "Payment request cleared.";
      toast({ title: "Saved", description: label });
      if (doctorId) await fetchRows(doctorId);
    } finally {
      setActingId(null);
    }
  };

  const refresh = async () => {
    const uid = await loadSession();
    if (uid) await fetchRows(uid);
    else toast({ title: "Sign in required", variant: "destructive" });
  };

  if (!doctorId && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payments (demo)
          </CardTitle>
          <CardDescription>
            Sign in with your Supabase account that matches your doctor profile
            id so payment updates are saved to the same rows patients see.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (accountIssue === "not_doctor" && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payments (demo)</CardTitle>
          <CardDescription>
            Your Supabase profile role is not &quot;doctor&quot;, so this queue
            is hidden. If you use the doctor dashboard via wallet, also set{" "}
            <code className="text-xs">role = doctor</code> on your{" "}
            <code className="text-xs">profiles</code> row for this account.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-primary/40 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Demo payment workflow</CardTitle>
          <CardDescription>
            No real charges or card processing. Actions only update{" "}
            <code className="text-xs">appointments</code> in Supabase (
            <code className="text-xs">payment_status</code>,{" "}
            <code className="text-xs">payment_amount</code>,{" "}
            <code className="text-xs">payment_tx_hash</code>) so the patient
            dashboard reflects the same state.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No appointments in scope</CardTitle>
            <CardDescription className="space-y-2 text-left">
              <p>
                We load rows where <code className="text-xs">doctor_id</code> is
                your profile id <strong>or</strong> any doctor profile with the
                same <code className="text-xs">walletAddress</code> (so seed UIDs
                still match after you connect the same wallet).
              </p>
              <p>
                If you still see nothing: run{" "}
                <code className="text-xs">supabase_link_auth_appointments.sql</code>{" "}
                so <code className="text-xs">appointments.doctor_id</code> points
                at your Auth user id, or set your doctor profile&apos;s wallet to
                match the row that owns the appointment.
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rows.map((apt) => {
            const fee = Number(apt.consultation_fee) || 0;
            const draft =
              amountDrafts[apt.id] ??
              String(
                apt.payment_amount != null && apt.payment_amount > 0
                  ? apt.payment_amount
                  : fee
              );
            const busy = actingId === apt.id;

            return (
              <Card key={apt.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">
                      {patientName(apt.patient)}
                    </CardTitle>
                    <CardDescription>
                      {apt.appointment_date ?? "—"}
                      {apt.reason ? ` · ${apt.reason}` : ""}
                    </CardDescription>
                  </div>
                  {statusBadge(apt.payment_status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>
                      Consultation fee:{" "}
                      <strong className="text-foreground">${fee}</strong>
                    </span>
                    <span>
                      Amount due / recorded:{" "}
                      <strong className="text-foreground">
                        $
                        {apt.payment_amount != null && apt.payment_amount > 0
                          ? apt.payment_amount
                          : fee}
                      </strong>
                    </span>
                    {apt.payment_tx_hash ? (
                      <span className="font-mono text-xs truncate max-w-[220px]">
                        Tx: {apt.payment_tx_hash.slice(0, 18)}…
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-3 flex-wrap">
                    {(apt.payment_status === "not_requested" ||
                      apt.payment_status == null) && (
                      <>
                        <div className="space-y-1 max-w-[140px]">
                          <Label htmlFor={`amt-${apt.id}`} className="text-xs">
                            Bill amount (USD)
                          </Label>
                          <Input
                            id={`amt-${apt.id}`}
                            type="number"
                            min={0}
                            step={1}
                            value={draft}
                            onChange={(e) =>
                              setAmountDrafts((d) => ({
                                ...d,
                                [apt.id]: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            const n = parseFloat(draft);
                            callAction(
                              apt.id,
                              "request_payment",
                              Number.isFinite(n) && n >= 0 ? n : fee
                            );
                          }}
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Request payment from patient
                        </Button>
                      </>
                    )}

                    {apt.payment_status === "pending" && (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={busy}
                          onClick={() =>
                            callAction(apt.id, "record_demo_paid")
                          }
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                          )}
                          Mark paid (demo)
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={busy}
                          onClick={() =>
                            callAction(apt.id, "clear_payment_request")
                          }
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Cancel request
                        </Button>
                      </>
                    )}

                    {apt.payment_status === "paid" && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          Patient sees this as paid on their Payments tab.
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground shrink-0"
                          disabled={busy}
                          onClick={() =>
                            callAction(apt.id, "clear_payment_request")
                          }
                        >
                          Reset demo
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
