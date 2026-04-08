import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { resolveGeminiTextModel } from "@/lib/gemini-default-model";
import { getGeminiApiKeyOrThrow } from "@/lib/server/gemini-key";

function getGenAI(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: getGeminiApiKeyOrThrow() });
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const genAI = getGenAI();

    // Create a chat session with Gemini
    const chat = genAI.chats.create({
      model: resolveGeminiTextModel(),
      history: history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Send the message to Gemini
    const response = await chat.sendMessage({ message });
    const text = response.text;

    // Return the AI response
    return NextResponse.json({
      content: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      {
        content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        timestamp: new Date().toISOString(),
        error: true,
      },
      { status: 500 },
    );
  }
}
