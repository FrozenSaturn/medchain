import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// Initialize the Gemini AI client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Function to fetch relevant medical data from Supabase
async function fetchMedicalData(userId?: string) {
  const supabase = createClient();
  let contextData = "";

  try {
    // Fetch appointments with patient and doctor information
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select(
        `
        id,
        appointment_date,
        consultation_fee,
        patient_id,
        doctor_id,
        profiles!appointments_patient_id_fkey(full_name),
        profiles!appointments_doctor_id_fkey(full_name)
      `
      )
      .limit(10);

    if (!appointmentsError && appointments) {
      contextData += "Recent Appointments:\n";
      appointments.forEach((apt: any) => {
        contextData += `- Appointment ID: ${apt.id}, Date: ${
          apt.appointment_date
        }, Patient: ${apt.profiles?.full_name || "Unknown"}, Doctor: ${
          apt.profiles?.full_name || "Unknown"
        }\n`;
      });
    }

    // Fetch medical records NFTs (diagnosis and treatment data)
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

    if (!medicalRecordsError && medicalRecords) {
      contextData += "\nMedical Records (Diagnosis & Treatment):\n";
      medicalRecords.forEach((record: any) => {
        if (record.diagnosis) {
          contextData += `- Diagnosis: ${record.diagnosis}\n`;
        }
        if (record.treatment) {
          contextData += `- Treatment: ${record.treatment}\n`;
        }
        contextData += `- Appointment ID: ${record.appointment_id}\n\n`;
      });
    }

    // Fetch user profiles for additional context
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .limit(20);

    if (!profilesError && profiles) {
      contextData += "\nUser Profiles:\n";
      profiles.forEach((profile: any) => {
        contextData += `- Name: ${profile.full_name}, Email: ${profile.email}\n`;
      });
    }
  } catch (error) {
    console.error("Error fetching medical data:", error);
  }

  return contextData;
}

export async function POST(req: Request) {
  try {
    const { message, history, userId } = await req.json();

    // Fetch relevant medical data from Supabase
    const medicalContext = await fetchMedicalData(userId);

    // Create the context-aware prompt
    const systemPrompt = `You are Dr. AI, a specialized medical assistant with access to patient data from our healthcare system. 

Available Medical Data:
${medicalContext}

Your role is to:
1. Answer questions about patient appointments, diagnoses, and treatments
2. Provide insights based on the available medical data
3. Help users understand their medical records
4. Offer general health advice while reminding users to consult healthcare professionals for serious concerns

Important Guidelines:
- Only provide information based on the available data
- If asked about specific patients, only share information if it's in the provided data
- Always maintain patient confidentiality
- For medical advice, recommend consulting healthcare professionals
- Be empathetic and supportive in your responses

Current conversation context: ${
      history
        ? history.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")
        : "No previous context"
    }

User question: ${message}

Please provide a helpful response based on the available medical data.`;

    // Create a chat session with Gemini
    const chat = genAI.chats.create({
      model: "gemini-2.0-flash",
      history:
        history?.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })) || [],
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Send the message with context to Gemini
    const response = await chat.sendMessage({ message: systemPrompt });
    const text = response.text;

    // Return the AI response
    return NextResponse.json({
      content: text,
      timestamp: new Date().toISOString(),
      contextUsed: medicalContext
        ? "Medical data from database"
        : "No medical data available",
    });
  } catch (error) {
    console.error("Error in RAG chat:", error);
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
