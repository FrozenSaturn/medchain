import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatResponse {
  content: string;
  timestamp: string;
  contextUsed?: string;
  error?: boolean;
}

export const useRAGChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextInfo, setContextInfo] = useState<string>("");

  const sendMessage = async (message: string, userId?: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let resolvedUserId = userId;
      if (resolvedUserId === undefined) {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        resolvedUserId = session?.user?.id;
      }

      const response = await fetch("/api/rag-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages,
          userId: resolvedUserId,
        }),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok || data.error) {
        const errorMessage: Message = {
          role: "assistant",
          content:
            data.content?.trim() ||
            "Sorry, I encountered an error. Please try again.",
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return data;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setContextInfo(data.contextUsed || "");

      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setContextInfo("");
  };

  return {
    messages,
    isLoading,
    contextInfo,
    sendMessage,
    clearChat,
  };
};
