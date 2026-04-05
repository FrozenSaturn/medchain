/**
 * Hosted Gemma on the Gemini API (Google AI Studio). See:
 * https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api
 *
 * Typical ids (varies by account; use models.list to confirm):
 * gemma-3-1b-it, gemma-3-4b-it, gemma-3-12b-it, gemma-3-27b-it,
 * gemma-3n-e2b-it, gemma-3n-e4b-it, gemma-4-26b-a4b-it, gemma-4-31b-it
 *
 * Gemma 3 / Gemma 3n do **not** support `systemInstruction` (developer
 * instruction) on the Chat API — requests return HTTP 400. Gemma 4 does.
 * Use {@link modelSupportsDeveloperInstruction} and the fallbacks in routes.
 */
export const DEFAULT_GEMINI_TEXT_MODEL = "gemma-4-31b-it";

/** Smaller hosted Gemma; fine for `generateContent` (no chat systemInstruction). */
export const DEFAULT_GEMMA_SUMMARY_MODEL = "gemma-3-1b-it";

export function resolveGeminiTextModel(): string {
  return (
    process.env.GEMINI_CHAT_MODEL?.trim() ||
    process.env.GEMINI_MODEL?.trim() ||
    process.env.GEMMA_CHAT_MODEL?.trim() ||
    DEFAULT_GEMINI_TEXT_MODEL
  );
}

export function resolveGeminiRecordSummaryModel(): string {
  return (
    process.env.GEMINI_RECORD_SUMMARY_MODEL?.trim() ||
    DEFAULT_GEMMA_SUMMARY_MODEL
  );
}

/** Gemma 3 and Gemma 3n reject system/developer instructions on the Chat API. */
export function modelSupportsDeveloperInstruction(modelId: string): boolean {
  const m = modelId.toLowerCase();
  if (m.startsWith("gemma-3n") || m.startsWith("gemma-3-")) {
    return false;
  }
  return true;
}
