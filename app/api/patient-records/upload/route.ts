import { NextResponse } from "next/server";
import { extractText } from "unpdf";
import { createClient } from "@/lib/supabase/server";
import { summarizeMedicalPdfText } from "@/lib/patient-records/summarize-pdf-text";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_STORED_TEXT = 200_000;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const titleRaw = formData.get("title");
    const descriptionRaw = formData.get("description");

    const title =
      typeof titleRaw === "string" && titleRaw.trim()
        ? titleRaw.trim()
        : "Untitled document";
    const description =
      typeof descriptionRaw === "string" && descriptionRaw.trim()
        ? descriptionRaw.trim()
        : null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 15 MB)" },
        { status: 400 }
      );
    }

    const mime = file.type || "application/octet-stream";
    if (mime !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF uploads are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uint8 = new Uint8Array(buffer);

    let extracted = "";
    try {
      const { text, totalPages } = await extractText(uint8, { mergePages: true });
      extracted = typeof text === "string" ? text : "";
      if (!extracted.trim() && totalPages > 0) {
        extracted = "";
      }
    } catch (e) {
      console.error("PDF extract error:", e);
      const { error: insertErr } = await supabase
        .from("patient_uploaded_records")
        .insert({
          patient_id: user.id,
          title,
          description,
          file_name: file.name,
          file_size_bytes: file.size,
          mime_type: "application/pdf",
          processing_status: "error",
          error_message: "Could not parse this PDF (corrupt or unsupported).",
        });

      if (insertErr) {
        console.error("Insert error row failed:", insertErr);
      }
      return NextResponse.json(
        { error: "Failed to extract text from PDF" },
        { status: 422 }
      );
    }

    const normalized = extracted.replace(/\s+/g, " ").trim();
    const storedText =
      normalized.length > MAX_STORED_TEXT
        ? `${normalized.slice(0, MAX_STORED_TEXT)}\n\n[truncated]`
        : normalized;

    if (!normalized) {
      const { error: insertErr } = await supabase
        .from("patient_uploaded_records")
        .insert({
          patient_id: user.id,
          title,
          description,
          file_name: file.name,
          file_size_bytes: file.size,
          mime_type: "application/pdf",
          extracted_text: null,
          processing_status: "error",
          error_message:
            "No extractable text found (scanned PDF without text layer?).",
        });
      if (insertErr) console.error(insertErr);
      return NextResponse.json(
        { error: "No text could be extracted from this PDF" },
        { status: 422 }
      );
    }

    let aiSummary: string;
    try {
      aiSummary = await summarizeMedicalPdfText(normalized);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Summary generation failed";
      console.error("Summarization error:", e);
      const { data: row, error: insertErr } = await supabase
        .from("patient_uploaded_records")
        .insert({
          patient_id: user.id,
          title,
          description,
          file_name: file.name,
          file_size_bytes: file.size,
          mime_type: "application/pdf",
          extracted_text: storedText,
          processing_status: "error",
          error_message: message,
        })
        .select("id")
        .single();

      if (insertErr) {
        console.error(insertErr);
        return NextResponse.json(
          { error: "Could not save record" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          id: row?.id,
          processing_status: "error",
          error_message: message,
        },
        { status: 502 }
      );
    }

    const { data: row, error: insertErr } = await supabase
      .from("patient_uploaded_records")
      .insert({
        patient_id: user.id,
        title,
        description,
        file_name: file.name,
        file_size_bytes: file.size,
        mime_type: "application/pdf",
        extracted_text: storedText,
        ai_summary: aiSummary,
        processing_status: "ready",
        error_message: null,
      })
      .select("id, created_at, processing_status")
      .single();

    if (insertErr) {
      console.error(insertErr);
      return NextResponse.json(
        { error: "Could not save record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: row?.id,
      created_at: row?.created_at,
      processing_status: row?.processing_status ?? "ready",
    });
  } catch (e) {
    console.error("patient-records/upload:", e);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
