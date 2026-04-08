import { ApiError, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  modelSupportsDeveloperInstruction,
  resolveGeminiTextModel,
} from "@/lib/gemini-default-model";
import { getGeminiApiKeyOrThrow } from "@/lib/server/gemini-key";

const MODEL_ID = resolveGeminiTextModel();

function getGenAI(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: getGeminiApiKeyOrThrow() });
}

const STATIC_SYSTEM_INSTRUCTION = `You are the MedConnect clinical assistant embedded in the dashboard.

Primary purpose:
- Help users understand MedConnect data: appointments, diagnoses, treatments, uploaded PDF summaries, and profile-linked records.
- Provide concise, practical explanations grounded in the supplied context.
- Support operational tasks (what happened, what is pending, what to do next in the app).

Response style:
- Plain text only.
- No Markdown, no code blocks, no bullets with *, no # headings.
- Keep responses concise and structured with short paragraphs.
- When useful, use sections in plain text labels like: Summary:, Details:, Next steps:.

Grounding and truthfulness:
- Use only facts present in "Available Medical Data".
- Do not invent appointments, diagnoses, medications, lab values, IDs, providers, or dates.
- If data is missing or uncertain, say exactly what is missing and ask for the minimal clarification.
- Distinguish clearly between:
  1) Facts from MedConnect data
  2) General medical knowledge

Role-aware behavior:
- Patient user: discuss only that patient's own records from context.
- Doctor user: focus on doctor-linked appointments/patients shown in context.
- Admin user: may summarize platform-wide records present in context.
- If access appears unclear, answer conservatively and avoid exposing any details not explicitly present.

Medical safety:
- You are not a replacement for a licensed clinician.
- Do not provide diagnosis certainty, emergency triage decisions, or medication dosing changes as definitive instructions.
- For urgent or severe symptoms (e.g., chest pain, breathing difficulty, stroke signs, severe bleeding, suicidal ideation), clearly advise immediate emergency care.

MedConnect-specific guidance:
- If asked about payments/statuses/NFT or uploaded-record summaries, explain exactly what current records show and what in-app action is likely next.
- If a user asks "why" something is missing, suggest likely data reasons (not booked yet, not uploaded yet, processing pending) only when consistent with context.

Output contract:
- End with a short "Next step" sentence when actionable.
- If no actionable step exists, end with "Next step: No action needed right now."`;

/** Supabase nested selects are often typed as one-element arrays; runtime may be object or array. */
function profileFullName(
  rel:
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null
    | undefined
): string {
  if (rel == null) return "Unknown";
  const row = Array.isArray(rel) ? rel[0] : rel;
  return row?.full_name ?? "Unknown";
}

async function fetchMedicalData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string | null
) {
  let contextData = "";

  try {
    if (!userId) {
      return (
        "(You are not signed in. No personal appointments or records were loaded.)\n\n"
      );
    }

    const { data: myProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("RAG chat: profiles lookup error", profileError);
    }

    const role = myProfile?.role ?? null;
    if (myProfile) {
      contextData += `Signed-in user: ${myProfile.full_name ?? "Unknown"} (role: ${role ?? "unknown"})\n\n`;
    } else {
      contextData +=
        "Note: No profile row matches this account id; appointment links use profiles.id = auth user id.\n\n";
    }

    let appointmentsQuery = supabase.from("appointments").select(
      `
        id,
        appointment_date,
        consultation_fee,
        patient_id,
        doctor_id,
        patient:profiles!appointments_patient_id_fkey(full_name),
        doctor:profiles!appointments_doctor_id_fkey(full_name)
      `
    );

    if (role === "patient") {
      appointmentsQuery = appointmentsQuery.eq("patient_id", userId);
    } else if (role === "doctor") {
      appointmentsQuery = appointmentsQuery.eq("doctor_id", userId);
    } else if (role === "admin") {
      /* scoped to platform admin: all rows (still capped) */
    } else {
      appointmentsQuery = appointmentsQuery.or(
        `patient_id.eq.${userId},doctor_id.eq.${userId}`
      );
    }

    const { data: appointments, error: appointmentsError } =
      await appointmentsQuery
        .order("appointment_date", { ascending: false })
        .limit(25);

    if (appointmentsError) {
      console.error("RAG chat: appointments error", appointmentsError);
    } else if (appointments?.length) {
      contextData += "Appointments visible to this user:\n";
      appointments.forEach((apt) => {
        contextData += `- Appointment ID: ${apt.id}, Date: ${
          apt.appointment_date
        }, Patient: ${profileFullName(apt.patient)}, Doctor: ${profileFullName(
          apt.doctor
        )}\n`;
      });
    } else {
      contextData +=
        "No appointments returned for this user (check profile role and that patient_id/doctor_id match your auth user id).\n";
    }

    const appointmentIds = (appointments ?? []).map((a) => a.id).filter(Boolean);

    const medicalSelect = `
        id,
        appointment_id,
        diagnosis,
        treatment,
        patient_wallet_address,
        doctor_wallet_address,
        token_uri
      `;

    let medicalRecords: Record<string, unknown>[] | null = null;
    let medicalRecordsError: { message: string } | null = null;

    if (role === "admin") {
      const mr = await supabase
        .from("medical_records_nfts")
        .select(medicalSelect)
        .limit(25);
      medicalRecords = mr.data as Record<string, unknown>[] | null;
      medicalRecordsError = mr.error;
    } else if (appointmentIds.length > 0) {
      const mr = await supabase
        .from("medical_records_nfts")
        .select(medicalSelect)
        .in("appointment_id", appointmentIds);
      medicalRecords = mr.data as Record<string, unknown>[] | null;
      medicalRecordsError = mr.error;
    }

    if (medicalRecordsError) {
      console.error("RAG chat: medical_records_nfts error", medicalRecordsError);
    } else if (medicalRecords?.length) {
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

    if (role === "admin") {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .limit(50);

      if (profilesError) {
        console.error("RAG chat: admin profiles list error", profilesError);
      } else if (profiles?.length) {
        contextData += "\nProfiles (admin view):\n";
        profiles.forEach(
          (profile: { full_name: string | null; id: string; role: string | null }) => {
            contextData += `- Name: ${profile.full_name ?? "Unknown"}, ID: ${profile.id}, role: ${profile.role ?? "?"}\n`;
          }
        );
      }
    }

    const { data: uploads, error: uploadsError } = await supabase
      .from("patient_uploaded_records")
      .select("title, description, ai_summary, file_name, created_at")
      .eq("patient_id", userId)
      .eq("processing_status", "ready")
      .order("created_at", { ascending: false })
      .limit(20);

    if (uploadsError) {
      console.error("RAG chat: patient_uploaded_records error", uploadsError);
    } else if (uploads?.length) {
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
  } catch (error) {
    console.error("Error fetching medical data:", error);
  }

  return contextData;
}

function chatHistoryFromClient(history: unknown) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (msg): msg is { role: "user" | "assistant"; content: string } =>
        msg !== null &&
        typeof msg === "object" &&
        "role" in msg &&
        "content" in msg &&
        ((msg as { role: string }).role === "user" ||
          (msg as { role: string }).role === "assistant") &&
        typeof (msg as { content: unknown }).content === "string"
    )
    .map((msg) => ({
      role: msg.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: msg.content }],
    }));
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

    const priorHistory = chatHistoryFromClient(history);

    const genAI = getGenAI();
    const useDevInstruction = modelSupportsDeveloperInstruction(MODEL_ID);
    const config: Parameters<GoogleGenAI["chats"]["create"]>[0]["config"] = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };
    if (useDevInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const outboundMessage = useDevInstruction
      ? message.trim()
      : `${systemInstruction}\n\n---\n\nUser message:\n${message.trim()}`;

    const chat = genAI.chats.create({
      model: MODEL_ID,
      history: priorHistory,
      config,
    });

    const response = await chat.sendMessage({ message: outboundMessage });
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

    if (error instanceof Error && error.message === "MISSING_GEMINI_API_KEY") {
      return NextResponse.json(
        {
          content:
            "The AI assistant is not configured: add GEMINI_API_KEY to your server environment. The database can still be queried, but replies need the Google AI API.",
          timestamp: new Date().toISOString(),
          error: true,
        },
        { status: 503 }
      );
    }

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

    if (error instanceof ApiError) {
      const st = error.status;
      return NextResponse.json(
        {
          content: `The AI service returned an error${st != null ? ` (HTTP ${st})` : ""}. Confirm GEMINI_API_KEY, that model "${MODEL_ID}" is enabled for your project, and billing/quota in Google AI Studio. This is not a database failure — check server logs for details.`,
          timestamp: new Date().toISOString(),
          error: true,
        },
        { status: st === 400 || st === 401 || st === 403 || st === 404 ? st : 502 }
      );
    }

    return NextResponse.json(
      {
        content:
          "Something went wrong while generating a reply. Please try again. (Medical data is loaded separately; if this persists, the failure is likely the AI API or request format — see server logs.)",
        timestamp: new Date().toISOString(),
        error: true,
      },
      { status: 500 }
    );
  }
}
