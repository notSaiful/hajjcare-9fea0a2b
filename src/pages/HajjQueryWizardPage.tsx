import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Send, RotateCcw, Bot, User, Sparkles,
  BookOpen, HeartPulse, Plane, HandHeart, Flower2, FileText, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FAQ_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hajj-faq-chat`;

interface Category {
  id: string;
  icon: typeof BookOpen;
  label: Record<string, string>;
  prompt: string;
  suggestions: Record<string, string[]>;
}

const CATEGORIES: Category[] = [
  {
    id: "rituals",
    icon: BookOpen,
    label: {
      en: "Hajj Rituals", ar: "مناسك الحج", ur: "حج کے مناسک", hi: "हज मनासिक",
      ta: "ஹஜ் சடங்குகள்", te: "హజ్ ఆచారాలు", mr: "हज विधी", bn: "হজ আচার",
      pa: "ਹੱਜ ਰਸਮਾਂ",
    },
    prompt: "I want to learn about Hajj rituals.",
    suggestions: {
      en: ["Steps of Hajj day by day?", "How to perform Tawaf?", "What happens at Arafat?", "Jamarat stoning rules?"],
      ur: ["حج کے مراحل بتائیں؟", "طواف کیسے کریں؟", "عرفات میں کیا ہوتا ہے؟"],
      hi: ["हज के चरण बताएं?", "तवाफ़ कैसे करें?", "अरफ़ात में क्या होता है?"],
      ar: ["خطوات الحج يوماً بيوم؟", "كيف أؤدي الطواف؟", "ماذا يحدث في عرفات؟"],
    },
  },
  {
    id: "health",
    icon: HeartPulse,
    label: {
      en: "Health & Safety", ar: "الصحة والسلامة", ur: "صحت اور حفاظت", hi: "स्वास्थ्य और सुरक्षा",
      ta: "ஆரோக்கியம் & பாதுகாப்பு", te: "ఆరోగ్యం & భద్రత", mr: "आरोग्य आणि सुरक्षा", bn: "স্বাস্থ্য ও নিরাপত্তা",
      pa: "ਸਿਹਤ ਅਤੇ ਸੁਰੱਖਿਆ",
    },
    prompt: "I need health and safety advice for Hajj.",
    suggestions: {
      en: ["How to avoid heat stroke?", "Medicines to carry?", "Vaccination requirements?", "Emergency numbers in Saudi?"],
      ur: ["ہیٹ اسٹروک سے کیسے بچیں؟", "کون سی دوائیں لے جائیں؟"],
      hi: ["हीट स्ट्रोक से कैसे बचें?", "कौन सी दवाइयां ले जाएं?"],
      ar: ["كيف أتجنب ضربة الشمس؟", "ما الأدوية التي يجب حملها؟"],
    },
  },
  {
    id: "travel",
    icon: Plane,
    label: {
      en: "Travel & Logistics", ar: "السفر واللوجستيات", ur: "سفر اور لاجسٹکس", hi: "यात्रा और लॉजिस्टिक्स",
      ta: "பயணம் & தளவாடம்", te: "ప్రయాణం & లాజిస్టిక్స్", mr: "प्रवास आणि लॉजिस्टिक्स", bn: "ভ্রমণ ও লজিস্টিক্স",
      pa: "ਯਾਤਰਾ ਅਤੇ ਲੌਜਿਸਟਿਕਸ",
    },
    prompt: "I need travel and logistics information for Hajj.",
    suggestions: {
      en: ["What to pack for Hajj?", "Saudi SIM card options?", "Currency exchange tips?", "Documents needed?"],
      ur: ["حج کے لیے کیا لے جائیں؟", "سعودی سم کارڈ؟"],
      hi: ["हज के लिए क्या पैक करें?", "सऊदी सिम कार्ड?"],
      ar: ["ماذا أحمل للحج؟", "خيارات شريحة الجوال؟"],
    },
  },
  {
    id: "duas",
    icon: HandHeart,
    label: {
      en: "Duas & Prayers", ar: "الأدعية والصلوات", ur: "دعائیں اور نمازیں", hi: "दुआएं और नमाज़",
      ta: "துஆக்கள் & தொழுகை", te: "దుఆలు & నమాజ్", mr: "दुआ आणि नमाज", bn: "দোয়া ও নামাজ",
      pa: "ਦੁਆਵਾਂ ਅਤੇ ਨਮਾਜ਼",
    },
    prompt: "I want to know about duas and prayers during Hajj.",
    suggestions: {
      en: ["Talbiyah text and meaning?", "Duas during Tawaf?", "Arafat supplications?", "Daily dhikr during Hajj?"],
      ur: ["تلبیہ کا متن اور معنی؟", "طواف کی دعائیں؟"],
      hi: ["तलबियह का पाठ और अर्थ?", "तवाफ़ की दुआएं?"],
      ar: ["نص التلبية ومعناها؟", "أدعية الطواف؟"],
    },
  },
  {
    id: "women",
    icon: Flower2,
    label: {
      en: "Women's Guide", ar: "دليل النساء", ur: "خواتین کی رہنمائی", hi: "महिला मार्गदर्शिका",
      ta: "பெண்கள் வழிகாட்டி", te: "మహిళల గైడ్", mr: "महिला मार्गदर्शक", bn: "মহিলা গাইড",
      pa: "ਔਰਤਾਂ ਦੀ ਗਾਈਡ",
    },
    prompt: "I need guidance specific to women performing Hajj.",
    suggestions: {
      en: ["Menstruation rules during Hajj?", "Mahram requirements?", "Women's Ihram clothing?", "Safety tips for women?"],
      ur: ["حج کے دوران حیض کے احکام؟", "محرم کی شرائط؟"],
      hi: ["हज के दौरान माहवारी के नियम?", "महरम की शर्तें?"],
      ar: ["أحكام الحيض أثناء الحج؟", "شروط المحرم؟"],
    },
  },
  {
    id: "documents",
    icon: FileText,
    label: {
      en: "Documents & Rules", ar: "الوثائق والقوانين", ur: "دستاویزات اور قوانین", hi: "दस्तावेज़ और नियम",
      ta: "ஆவணங்கள் & விதிகள்", te: "పత్రాలు & నియమాలు", mr: "कागदपत्रे आणि नियम", bn: "নথি ও নিয়ম",
      pa: "ਦਸਤਾਵੇਜ਼ ਅਤੇ ਨਿਯਮ",
    },
    prompt: "I need information about documents and rules for Hajj from India.",
    suggestions: {
      en: ["Haj Committee documents needed?", "Visa requirements?", "Embarkation point rules?", "Saudi regulations for pilgrims?"],
      ur: ["حج کمیٹی کی دستاویزات؟", "ویزا کی شرائط؟"],
      hi: ["हज कमेटी दस्तावेज़?", "वीज़ा शर्तें?"],
      ar: ["وثائق لجنة الحج؟", "متطلبات التأشيرة؟"],
    },
  },
];

const LABELS: Record<string, {
  title: string; subtitle: string; placeholder: string; newChat: string; back: string; selectCategory: string;
}> = {
  en: { title: "Hajj Query Wizard", subtitle: "Guided answers for your Hajj journey", placeholder: "Type your question...", newChat: "New Query", back: "Categories", selectCategory: "What do you need help with?" },
  ur: { title: "حج سوالات وزرڈ", subtitle: "حج کے سفر کے لیے رہنمائی", placeholder: "اپنا سوال لکھیں...", newChat: "نیا سوال", back: "زمرے", selectCategory: "آپ کو کس بارے میں مدد چاہیے؟" },
  hi: { title: "हज क्वेरी विज़ार्ड", subtitle: "हज यात्रा के लिए मार्गदर्शन", placeholder: "अपना सवाल लिखें...", newChat: "नया सवाल", back: "श्रेणियां", selectCategory: "आपको किस बारे में मदद चाहिए?" },
  ar: { title: "معالج أسئلة الحج", subtitle: "إجابات موجهة لرحلة حجك", placeholder: "اكتب سؤالك...", newChat: "سؤال جديد", back: "الأقسام", selectCategory: "بماذا تحتاج مساعدة؟" },
  ta: { title: "ஹஜ் வழிகாட்டி", subtitle: "ஹஜ் பயணத்திற்கான வழிகாட்டுதல்", placeholder: "உங்கள் கேள்வியை எழுதுங்கள்...", newChat: "புதிய கேள்வி", back: "வகைகள்", selectCategory: "உங்களுக்கு எதில் உதவி தேவை?" },
  te: { title: "హజ్ క్వెరీ విజార్డ్", subtitle: "హజ్ ప్రయాణానికి మార్గదర్శకత్వం", placeholder: "మీ ప్రశ్న రాయండి...", newChat: "కొత్త ప్రశ్న", back: "వర్గాలు", selectCategory: "మీకు దేనిలో సహాయం కావాలి?" },
  mr: { title: "हज क्वेरी विझार्ड", subtitle: "हज प्रवासासाठी मार्गदर्शन", placeholder: "तुमचा प्रश्न लिहा...", newChat: "नवा प्रश्न", back: "वर्ग", selectCategory: "तुम्हाला कशाबद्दल मदत हवी आहे?" },
  bn: { title: "হজ কোয়েরি উইজার্ড", subtitle: "হজ যাত্রার জন্য পথনির্দেশনা", placeholder: "আপনার প্রশ্ন লিখুন...", newChat: "নতুন প্রশ্ন", back: "বিভাগ", selectCategory: "আপনার কোন বিষয়ে সাহায্য দরকার?" },
  pa: { title: "ਹੱਜ ਕੁਐਰੀ ਵਿਜ਼ਾਰਡ", subtitle: "ਹੱਜ ਯਾਤਰਾ ਲਈ ਮਾਰਗਦਰਸ਼ਨ", placeholder: "ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ...", newChat: "ਨਵਾਂ ਸਵਾਲ", back: "ਸ਼੍ਰੇਣੀਆਂ", selectCategory: "ਤੁਹਾਨੂੰ ਕਿਸ ਬਾਰੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?" },
};

const ICON_COLORS = [
  "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40",
  "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/40",
  "text-sky-600 bg-sky-100 dark:text-sky-400 dark:bg-sky-900/40",
  "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40",
  "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/40",
  "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/40",
];

export default function HajjQueryWizardPage() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const labels = LABELS[language] || LABELS.en;
  const lang = language as string;

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
          } catch { /* partial JSON */ }
        }
      }

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
      console.error("Wizard chat error:", err);
      toast({ title: "Error", description: err.message || "Failed to get response", variant: "destructive" });
      setMessages([...updatedMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, language]);

  const selectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setMessages([]);
    setInput("");
  };

  const resetWizard = () => {
    setSelectedCategory(null);
    setMessages([]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const getSuggestions = (cat: Category): string[] => {
    return cat.suggestions[lang] || cat.suggestions.en || [];
  };

  // Category selection screen
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 flex items-center gap-3 h-14">
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
        </header>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Islamic decorative header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
              <span className="text-3xl">🕋</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{labels.selectCategory}</h2>
            <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
            {/* Decorative separator */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-primary text-xs">✦</span>
              <div className="h-px w-12 bg-primary/30" />
            </div>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat)}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 active:scale-[0.97]"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ICON_COLORS[i]} transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center leading-tight">
                    {cat.label[lang] || cat.label.en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom bismillah */}
          <p className="text-center text-xs text-muted-foreground/60 italic pt-4">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    );
  }

  // Chat screen for selected category
  const CatIcon = selectedCategory.icon;
  const catIdx = CATEGORIES.findIndex(c => c.id === selectedCategory.id);
  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={resetWizard} className="h-9 w-9">
              <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ICON_COLORS[catIdx]}`}>
                <CatIcon className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-tight">{selectedCategory.label[lang] || selectedCategory.label.en}</h1>
                <p className="text-[10px] text-muted-foreground">{labels.title}</p>
              </div>
            </div>
          </div>
          {hasMessages && (
            <Button variant="ghost" size="sm" onClick={() => { setMessages([]); setInput(""); }} className="text-xs text-muted-foreground">
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
            {/* Welcome state with suggestions */}
            {!hasMessages && (
              <div className="space-y-5 pt-2">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed">
                      Assalamu Alaikum! 🕋 Ask me anything about <strong>{selectedCategory.label.en}</strong>. I'm here to guide you through your Hajj journey.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium px-1">Suggested questions:</p>
                  <div className="flex flex-col gap-2">
                    {getSuggestions(selectedCategory).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="flex items-center justify-between text-sm px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-start"
                      >
                        <span>{q}</span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 ${isRTL ? "rotate-180" : ""}`} />
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
