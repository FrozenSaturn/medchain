import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { appointmentAssignedToDoctorScope } from "@/lib/doctor-appointment-scope";

type Action = "request_payment" | "record_demo_paid" | "clear_payment_request";

function demoTxHash(): string {
  return `0xdemo${Date.now().toString(16)}${Math.random().toString(16).slice(2, 14)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const appointmentId = body.appointmentId as string | undefined;
    const action = body.action as Action | undefined;
    const paymentAmount = body.paymentAmount as number | undefined;

    if (!appointmentId || typeof appointmentId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid appointmentId" },
        { status: 400 }
      );
    }

    if (
      action !== "request_payment" &&
      action !== "record_demo_paid" &&
      action !== "clear_payment_request"
    ) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Sign in with your Supabase doctor account (same user id as profiles / appointments.doctor_id).",
        },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "doctor") {
      return NextResponse.json({ error: "Doctor profile required" }, { status: 403 });
    }

    const { data: appt, error: apptError } = await supabase
      .from("appointments")
      .select(
        "id, doctor_id, patient_id, consultation_fee, payment_status, payment_amount"
      )
      .eq("id", appointmentId)
      .maybeSingle();

    if (apptError || !appt) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const allowed = await appointmentAssignedToDoctorScope(
      supabase,
      user.id,
      appt.doctor_id
    );
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "This appointment is not assigned to you (check profiles.id vs appointments.doctor_id, or matching doctor walletAddress).",
        },
        { status: 403 }
      );
    }

    let update: Record<string, string | number | null> = {};

    switch (action) {
      case "request_payment": {
        const fee = Number(appt.consultation_fee) || 0;
        const amount =
          typeof paymentAmount === "number" &&
          !Number.isNaN(paymentAmount) &&
          paymentAmount >= 0
            ? paymentAmount
            : fee;
        update = {
          payment_status: "pending",
          payment_amount: amount,
          payment_tx_hash: null,
        };
        break;
      }
      case "record_demo_paid": {
        const amount =
          appt.payment_amount != null && Number(appt.payment_amount) > 0
            ? Number(appt.payment_amount)
            : Number(appt.consultation_fee) || 0;
        update = {
          payment_status: "paid",
          payment_amount: amount,
          payment_tx_hash: demoTxHash(),
        };
        break;
      }
      case "clear_payment_request": {
        update = {
          payment_status: "not_requested",
          payment_amount: 0,
          payment_tx_hash: null,
        };
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { data: updated, error: upError } = await supabase
      .from("appointments")
      .update(update)
      .eq("id", appointmentId)
      .select()
      .single();

    if (upError) {
      console.error("appointment-payment update", upError);
      return NextResponse.json(
        { error: upError.message || "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ appointment: updated });
  } catch (e) {
    console.error("appointment-payment", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
