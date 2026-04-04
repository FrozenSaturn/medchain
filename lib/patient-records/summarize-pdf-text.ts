import { GoogleGenAI } from "@google/genai";

const MAX_INPUT_CHARS = 48_000;

/** Gemma on Gemini API; override with GEMINI_RECORD_SUMMARY_MODEL (e.g. gemma-3-1b-it). */
const DEFAULT_SUMMARY_MODEL = "gemma-3-1b-it";

export async function summarizeMedicalPdfText(extractedText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const trimmed = extractedText.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    throw new Error("No text could be extracted from the PDF");
  }

  const body =
    trimmed.length > MAX_INPUT_CHARS
      ? `${trimmed.slice(0, MAX_INPUT_CHARS)}\n\n[…truncated for model context]`
      : trimmed;

  const model =
    process.env.GEMINI_RECORD_SUMMARY_MODEL?.trim() || DEFAULT_SUMMARY_MODEL;

  const genAI = new GoogleGenAI({ apiKey });

  const prompt = `You are helping organize a patient's personal health documents. The following text was extracted from a PDF using an automated parser (may contain OCR or layout noise).

Produce a concise summary for the patient's record and for a clinician-facing assistant:
1) **Overview** — 2–4 sentences in plain language.
2) **Key points** — bullet list (max 8 bullets) of facts explicitly stated in the text (dates, labs, medications, diagnoses as written, providers). Do not infer or diagnose.
3) If the text is too sparse or unreadable, say so briefly.

Rules: Only use information present in the excerpt. Do not give treatment advice.

--- BEGIN EXTRACTED TEXT ---
${body}
--- END EXTRACTED TEXT ---`;

  const run = async (modelId: string) => {
    const response = await genAI.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.25,
        maxOutputTokens: 2048,
      },
    });
    const text = response.text?.trim();
    if (!text) {
      throw new Error("Summary model returned an empty response");
    }
    return text;
  };

  try {
    return await run(model);
  } catch (first) {
    const fallback = "gemini-2.0-flash";
    if (model === fallback) throw first;
    console.warn(
      `Gemma summary model "${model}" failed, retrying with ${fallback}:`,
      first
    );
    return await run(fallback);
  }
}
