import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, RotateCcw, Bot, User, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FAQ_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hajj-faq-chat`;

const LABELS: Record<string, {
  title: string; placeholder: string; newChat: string; greeting: string;
  suggestions: string[];
}> = {
  en: {
    title: "Hajj FAQ Bot",
    placeholder: "Ask about Hajj rituals, travel, health...",
    newChat: "New Chat",
    greeting: "Assalamu Alaikum! 🕋 I'm your Hajj FAQ assistant. Ask me anything about Hajj 2026 — rituals, travel tips, health advice, or duas.",
    suggestions: [
      "What are the steps of Hajj?",
      "What to pack for Hajj?",
      "Duas during Tawaf?",
      "Health tips for Hajj",
      "Women's Hajj guidelines",
      "What documents do I need?",
    ],
  },
  ur: {
    title: "حج سوالات بوٹ",
    placeholder: "حج کے بارے میں پوچھیں...",
    newChat: "نئی چیٹ",
    greeting: "السلام علیکم! 🕋 میں آپ کا حج سوالات اسسٹنٹ ہوں۔ حج 2026 کے بارے میں کچھ بھی پوچھیں۔",
    suggestions: ["حج کے مراحل کیا ہیں؟", "حج کے لیے کیا لے جائیں؟", "طواف کی دعائیں؟", "صحت کے مشورے"],
  },
  hi: {
    title: "हज FAQ बॉट",
    placeholder: "हज के बारे में पूछें...",
    newChat: "नई चैट",
    greeting: "अस्सलामु अलैकुम! 🕋 मैं आपका हज FAQ सहायक हूं। हज 2026 के बारे में कुछ भी पूछें।",
    suggestions: ["हज के चरण क्या हैं?", "हज के लिए क्या ले जाएं?", "तवाफ़ की दुआएं?", "स्वास्थ्य सुझाव"],
  },
  ar: {
    title: "بوت أسئلة الحج",
    placeholder: "اسأل عن مناسك الحج...",
    newChat: "محادثة جديدة",
    greeting: "السلام عليكم! 🕋 أنا مساعدك للأسئلة الشائعة عن الحج. اسأل أي سؤال عن حج 2026.",
    suggestions: ["ما هي خطوات الحج؟", "ماذا أحمل للحج؟", "أدعية الطواف؟", "نصائح صحية"],
  },
  ta: {
    title: "ஹஜ் FAQ பாட்",
    placeholder: "ஹஜ் பற்றி கேளுங்கள்...",
    newChat: "புதிய அரட்டை",
    greeting: "அஸ்ஸலாமு அலைக்கும்! 🕋 நான் உங்கள் ஹஜ் FAQ உதவியாளர். ஹஜ் 2026 பற்றி எதையும் கேளுங்கள்.",
    suggestions: ["ஹஜ் நிலைகள் என்ன?", "ஹஜ்ஜுக்கு என்ன கொண்டு செல்வது?"],
  },
  te: {
    title: "హజ్ FAQ బాట్",
    placeholder: "హజ్ గురించి అడగండి...",
    newChat: "కొత్త చాట్",
    greeting: "అస్సలాము అలైకుమ్! 🕋 నేను మీ హజ్ FAQ సహాయకుడిని. హజ్ 2026 గురించి ఏమైనా అడగండి.",
    suggestions: ["హజ్ దశలు ఏమిటి?", "హజ్ కోసం ఏమి తీసుకెళ్ళాలి?"],
  },
  bn: {
    title: "হজ FAQ বট",
    placeholder: "হজ সম্পর্কে জিজ্ঞাসা করুন...",
    newChat: "নতুন চ্যাট",
    greeting: "আসসালামু আলাইকুম! 🕋 আমি আপনার হজ FAQ সহায়ক। হজ ২০২৬ সম্পর্কে যেকোনো প্রশ্ন করুন।",
    suggestions: ["হজের ধাপগুলো কী?", "হজে কী নিয়ে যাবেন?"],
  },
  mr: {
    title: "हज FAQ बॉट",
    placeholder: "हजबद्दल विचारा...",
    newChat: "नवीन चॅट",
    greeting: "अस्सलामू अलैकुम! 🕋 मी तुमचा हज FAQ सहाय्यक आहे. हज 2026 बद्दल काहीही विचारा.",
    suggestions: ["हजचे टप्पे कोणते?", "हजसाठी काय घ्यावे?"],
  },
  pa: {
    title: "ਹੱਜ FAQ ਬੋਟ",
    placeholder: "ਹੱਜ ਬਾਰੇ ਪੁੱਛੋ...",
    newChat: "ਨਵੀਂ ਚੈਟ",
    greeting: "ਅੱਸਲਾਮੁ ਅਲੈਕੁਮ! 🕋 ਮੈਂ ਤੁਹਾਡਾ ਹੱਜ FAQ ਸਹਾਇਕ ਹਾਂ। ਹੱਜ 2026 ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
    suggestions: ["ਹੱਜ ਦੇ ਕਦਮ ਕੀ ਹਨ?", "ਹੱਜ ਲਈ ਕੀ ਲੈ ਕੇ ਜਾਣਾ?"],
  },
};

export default function HajjFaqChatPage() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const labels = LABELS[language] || LABELS.en;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(FAQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: updatedMessages, language }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages([...updatedMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // partial JSON, wait for more data
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (const raw of buffer.split("\n")) {
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages([...updatedMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch { /* ignore */ }
        }
      }

      if (!assistantContent) {
        setMessages([...updatedMessages, { role: "assistant", content: "I'm sorry, I couldn't generate a response. Please try again." }]);
      }
    } catch (err: any) {
      console.error("FAQ chat error:", err);
      toast({ title: "Error", description: err.message || "Failed to get response", variant: "destructive" });
      setMessages([...updatedMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, language]);

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
              <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-lg font-semibold">{labels.title}</h1>
            </div>
          </div>
          {hasMessages && (
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-xs text-muted-foreground">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              {labels.newChat}
            </Button>
          )}
        </div>
      </header>

      {/* Chat body */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-130px)]" ref={scrollRef}>
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
            {/* Welcome / Greeting */}
            {!hasMessages && (
              <div className="space-y-6 pt-4">
                {/* Bot greeting */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed">{labels.greeting}</p>
                  </div>
                </div>

                {/* Quick suggestions */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium px-1">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {labels.suggestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="text-sm px-3 py-2 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                  {isLoading && i === messages.length - 1 && msg.role === "assistant" && (
                    <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-full" />
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={labels.placeholder}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 max-h-32 min-h-[44px]"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-xl flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
