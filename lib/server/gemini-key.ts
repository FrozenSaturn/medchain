import "server-only";
import fs from "fs";
import path from "path";

let cachedDotEnvKey: string | null | undefined;

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readGeminiKeyFromDotEnv(): string | null {
  if (cachedDotEnvKey !== undefined) return cachedDotEnvKey;

  try {
    const envPath = path.join(process.cwd(), ".env");
    const file = fs.readFileSync(envPath, "utf8");
    const line = file
      .split(/\r?\n/)
      .find((raw) => /^\s*GEMINI_API_KEY\s*=/.test(raw) && !/^\s*#/.test(raw));

    if (!line) {
      cachedDotEnvKey = null;
      return cachedDotEnvKey;
    }

    const value = line.replace(/^\s*GEMINI_API_KEY\s*=\s*/, "");
    cachedDotEnvKey = stripQuotes(value) || null;
    return cachedDotEnvKey;
  } catch {
    cachedDotEnvKey = null;
    return cachedDotEnvKey;
  }
}

/**
 * AI/chat routes should prefer `.env` for GEMINI_API_KEY.
 * Fallback to process.env supports environments where `.env` file is absent.
 */
export function getGeminiApiKeyOrNull(): string | null {
  const key = readGeminiKeyFromDotEnv() ?? process.env.GEMINI_API_KEY ?? null;
  const trimmed = key?.trim();
  return trimmed ? trimmed : null;
}

export function getGeminiApiKeyOrThrow(): string {
  const key = getGeminiApiKeyOrNull();
  if (!key) {
    throw new Error("MISSING_GEMINI_API_KEY");
  }
  return key;
}
