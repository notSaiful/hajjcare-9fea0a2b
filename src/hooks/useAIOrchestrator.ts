import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getZoyaLanguage } from "@/lib/zoyaLanguages";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AIModule = "official" | "ilm" | "fraud" | "tracking" | "emotional" | "general";

type OrchestratorMeta = {
  module: AIModule;
  intent: string;
  confidence: number;
  sessionId?: string;
};

const ORCHESTRATOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-orchestrator`;

export const useAIOrchestrator = (selectedLanguageCode?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModule, setCurrentModule] = useState<AIModule>("general");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const { toast } = useToast();
  const { language } = useLanguage();
  const responseLanguage = getZoyaLanguage(selectedLanguageCode || language);

  const sendMessage = useCallback(async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30_000);

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
      console.info("[zoya-chat]", { event: "request_started", at: new Date().toISOString() });
      // Get auth session
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          messages,
          language: responseLanguage.code,
          language_locale: responseLanguage.locale,
          response_language_name: responseLanguage.name,
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
      console.info("[zoya-chat]", { event: "stream_connected" });

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
      console.info("[zoya-chat]", { event: "response_completed", receivedContent: Boolean(assistantContent) });
    } catch (error) {
      const message = error instanceof DOMException && error.name === "AbortError"
        ? "Zoya did not respond within 30 seconds. Please check your connection and try again."
        : error instanceof Error ? error.message : "Failed to get a response.";
      console.error("[zoya-chat] request_failed", error);
      if (!assistantContent) {
        toast({ title: "Zoya is unavailable", description: message, variant: "destructive" });
        setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      }
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  }, [messages, toast, responseLanguage.code, responseLanguage.locale, responseLanguage.name, sessionId]);

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
