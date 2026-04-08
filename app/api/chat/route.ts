import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamText, tool } from "ai"
import { z } from "zod"
import {
  modelSupportsDeveloperInstruction,
  resolveGeminiTextModel,
} from "@/lib/gemini-default-model"
import { getGeminiApiKeyOrThrow } from "@/lib/server/gemini-key"

export const maxDuration = 30

const DR_AI_SYSTEM = `You are Dr. AI, a specialized health analytics assistant. You help users understand their symptoms and health metrics with empathy and expertise.

Key capabilities:
- Analyze symptoms and provide insights
- Explain health metrics in simple terms
- Suggest lifestyle improvements
- Provide health recommendations
- Update health analytics based on user input

Always be supportive, accurate, and remind users to consult healthcare professionals for serious concerns.`

function injectSystemIntoFirstUserMessage(
  messages: unknown[],
  systemText: string
): unknown[] {
  if (!Array.isArray(messages)) return messages
  const copy = messages.map((m) =>
    m !== null && typeof m === "object" ? { ...(m as object) } : m
  ) as Record<string, unknown>[]
  const idx = copy.findIndex((m) => m?.role === "user")
  if (idx === -1) {
    return [{ role: "user", content: systemText }, ...copy]
  }
  const first = copy[idx]
  const content = first.content
  if (typeof content === "string") {
    first.content = `${systemText}\n\n---\n\n${content}`
  }
  return copy
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const apiKey = getGeminiApiKeyOrThrow()
  const google = createGoogleGenerativeAI({ apiKey })

  const modelId = resolveGeminiTextModel()
  const useSystemInstruction = modelSupportsDeveloperInstruction(modelId)
  const streamMessages = useSystemInstruction
    ? messages
    : injectSystemIntoFirstUserMessage(messages, DR_AI_SYSTEM)

  const result = streamText({
    model: google(modelId),
    messages: streamMessages,
    system: useSystemInstruction ? DR_AI_SYSTEM : undefined,
    tools: {
      analyzeSymptoms: tool({
        description: "Analyze user symptoms and provide health insights",
        parameters: z.object({
          symptoms: z.array(z.string()).describe("List of symptoms reported by user"),
          severity: z.enum(["mild", "moderate", "severe"]).describe("Overall severity assessment"),
          recommendations: z.array(z.string()).describe("Health recommendations based on symptoms"),
        }),
        execute: async ({ symptoms, severity, recommendations }) => {
          return {
            type: "symptom_analysis",
            symptoms,
            severity,
            recommendations,
            timestamp: new Date().toISOString(),
          }
        },
      }),
      updateHealthMetrics: tool({
        description: "Update health metrics based on symptom analysis or user input",
        parameters: z.object({
          metricType: z
            .enum(["neurodegenerative", "chronic_disease", "overall_score"])
            .describe("Type of metric to update"),
          value: z.number().describe("New metric value"),
          reason: z.string().describe("Reason for the update"),
        }),
        execute: async ({ metricType, value, reason }) => {
          return {
            type: "metric_update",
            metricType,
            value,
            reason,
            timestamp: new Date().toISOString(),
          }
        },
      }),
      generateHealthInsight: tool({
        description: "Generate personalized health insights based on current data",
        parameters: z.object({
          focus: z.string().describe("Area of focus for the insight"),
          dataPoints: z.array(z.string()).describe("Relevant data points to consider"),
        }),
        execute: async ({ focus, dataPoints }) => {
          return {
            type: "health_insight",
            focus,
            dataPoints,
            insight: `Based on your ${focus} data, here are key insights to help improve your health.`,
            timestamp: new Date().toISOString(),
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
