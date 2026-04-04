import { ApiError, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL_ID = "gemini-2.0-flash";

const STATIC_SYSTEM_INSTRUCTION = `You are Dr. AI, a specialized medical assistant with access to patient data from our healthcare system.

Your role is to:
1. Answer questions about patient appointments, diagnoses, and treatments
2. Provide insights based on the available medical data
3. Help users understand their medical records
4. Offer general health advice while reminding users to consult healthcare professionals for serious concerns

Important Guidelines:
- Only provide information based on the available data in the medical context below
- If asked about specific patients, only share information if it's in the provided data
- Always maintain patient confidentiality
- For medical advice, recommend consulting healthcare professionals
- Be empathetic and supportive in your responses`;

type AppointmentRow = {
  id: string;
  appointment_date: string | null;
  consultation_fee: number | null;
  patient_id: string | null;
  doctor_id: string | null;
  patient: { full_name: string | null } | null;
  doctor: { full_name: string | null } | null;
};

async function fetchMedicalData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  scopedPatientId: string | null
) {
  let contextData = "";

  try {
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select(
        `
        id,
        appointment_date,
        consultation_fee,
        patient_id,
        doctor_id,
        patient:profiles!appointments_patient_id_fkey(full_name),
        doctor:profiles!appointments_doctor_id_fkey(full_name)
      `
      )
      .limit(10);

    if (!appointmentsError && appointments?.length) {
      contextData += "Recent Appointments:\n";
      appointments.forEach((apt: AppointmentRow) => {
        contextData += `- Appointment ID: ${apt.id}, Date: ${
          apt.appointment_date
        }, Patient: ${apt.patient?.full_name ?? "Unknown"}, Doctor: ${
          apt.doctor?.full_name ?? "Unknown"
        }\n`;
      });
    }

    const { data: medicalRecords, error: medicalRecordsError } = await supabase
      .from("medical_records_nfts")
      .select(
        `
        id,
        appointment_id,
        diagnosis,
        treatment,
        patient_wallet_address,
        doctor_wallet_address,
        token_uri
      `
      )
      .limit(10);

    if (!medicalRecordsError && medicalRecords?.length) {
      contextData += "\nMedical Records (Diagnosis & Treatment):\n";
      medicalRecords.forEach((record: Record<string, unknown>) => {
        if (record.diagnosis) {
          contextData += `- Diagnosis: ${record.diagnosis}\n`;
        }
        if (record.treatment) {
          contextData += `- Treatment: ${record.treatment}\n`;
        }
        contextData += `- Appointment ID: ${record.appointment_id}\n\n`;
      });
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .limit(20);

    if (!profilesError && profiles?.length) {
      contextData += "\nUser Profiles:\n";
      profiles.forEach((profile: { full_name: string | null; id: string }) => {
        contextData += `- Name: ${profile.full_name ?? "Unknown"}, ID: ${profile.id}\n`;
      });
    }

    if (scopedPatientId) {
      const { data: uploads, error: uploadsError } = await supabase
        .from("patient_uploaded_records")
        .select("title, description, ai_summary, file_name, created_at")
        .eq("patient_id", scopedPatientId)
        .eq("processing_status", "ready")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!uploadsError && uploads?.length) {
        contextData += "\nPatient-uploaded documents (AI summaries from PDFs):\n";
        uploads.forEach(
          (u: {
            title: string;
            description: string | null;
            ai_summary: string | null;
            file_name: string;
            created_at: string;
          }) => {
            contextData += `- Title: ${u.title} (${u.file_name})\n`;
            if (u.description) contextData += `  Note: ${u.description}\n`;
            if (u.ai_summary) {
              contextData += `  Summary:\n${u.ai_summary}\n\n`;
            }
          }
        );
      }
    }
  } catch (error) {
    console.error("Error fetching medical data:", error);
  }

  return contextData;
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        {
          content: "Please send a non-empty message.",
          timestamp: new Date().toISOString(),
          error: true,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const medicalContext = await fetchMedicalData(supabase, user?.id ?? null);

    const systemInstruction = `${STATIC_SYSTEM_INSTRUCTION}

Available Medical Data:
${medicalContext || "(No rows returned for this session — answer only from general guidance.)"}`;

    const priorHistory =
      Array.isArray(history) && history.length > 0
        ? history.map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? ("user" as const) : ("model" as const),
            parts: [{ text: msg.content }],
          }))
        : [];

    const chat = genAI.chats.create({
      model: MODEL_ID,
      history: priorHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = await chat.sendMessage({ message: message.trim() });
    const text = response.text;

    if (text === undefined || text === "") {
      console.error("RAG chat empty response", {
        promptFeedback: response.promptFeedback,
        candidates: response.candidates,
      });
      return NextResponse.json(
        {
          content:
            "I could not generate a reply (response was empty or blocked). Please try rephrasing your question.",
          timestamp: new Date().toISOString(),
          error: true,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      content: text,
      timestamp: new Date().toISOString(),
      contextUsed: medicalContext
        ? "Medical data from database"
        : "No medical data available",
    });
  } catch (error) {
    console.error("Error in RAG chat:", error);

    const quotaOrRateLimit =
      error instanceof ApiError && error.status === 429
        ? true
        : typeof error === "object" &&
            error !== null &&
            "status" in error &&
            (error as { status: number }).status === 429;

    if (quotaOrRateLimit) {
      return NextResponse.json(
        {
          content:
            "Gemini API rate limit or quota exceeded (HTTP 429). Your Google AI project has hit free-tier or per-minute limits for this model. Check usage and billing in Google AI Studio, review https://ai.google.dev/gemini-api/docs/rate-limits , wait for the reset window, or enable paid billing if needed.",
          timestamp: new Date().toISOString(),
          error: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        content:
          "I'm sorry, I'm having trouble accessing the medical database right now. Please try again later.",
        timestamp: new Date().toISOString(),
        error: true,
      },
      { status: 500 }
    );
  }
}
