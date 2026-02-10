import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AIModule = "ilm" | "fraud" | "tracking" | "emotional" | "general";

type OrchestratorMeta = {
  module: AIModule;
  intent: string;
  confidence: number;
  sessionId?: string;
};

const ORCHESTRATOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-orchestrator`;

export const useAIOrchestrator = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModule, setCurrentModule] = useState<AIModule>("general");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const { toast } = useToast();
  const { language } = useLanguage();

  const sendMessage = useCallback(async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      // Get auth session
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          messages,
          language,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({ title: "Rate Limit", description: "Please wait before sending another message.", variant: "destructive" });
          throw new Error("Rate limited");
        }
        if (response.status === 402) {
          toast({ title: "Service Unavailable", description: "Please try again later.", variant: "destructive" });
          throw new Error("Payment required");
        }
        throw new Error("Failed to get response");
      }

      // Read metadata from headers
      const module = (response.headers.get("X-AI-Module") || "general") as AIModule;
      const newSessionId = response.headers.get("X-AI-Session-Id");
      setCurrentModule(module);
      if (newSessionId) setSessionId(newSessionId);

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error("AI Orchestrator error:", error);
      if (!assistantContent) {
        toast({ title: "Error", description: "Failed to get a response. Please try again.", variant: "destructive" });
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast, language, sessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(undefined);
    setCurrentModule("general");
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    currentModule,
    sessionId,
  };
};
