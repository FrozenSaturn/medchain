import { useState } from "react";

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
      const response = await fetch("/api/rag-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages,
          userId,
        }),
      });

      const data: ChatResponse = await response.json();

      if (data.error) {
        throw new Error(data.content);
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
