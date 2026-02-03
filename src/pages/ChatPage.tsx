import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Phone, RotateCcw, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHajjChat } from "@/hooks/useHajjChat";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import WelcomeScreen from "@/components/WelcomeScreen";
import { BottomNavigation } from "@/components/BottomNavigation";

const CHAT_LABELS = {
  en: {
    title: "AI Assistant",
    subtitle: "Chat or Call",
    chat: "Chat",
    voice: "Voice",
    newChat: "New Chat",
    weakConnection: "Weak connection detected",
    strongConnection: "Good connection",
    voiceOptimized: "Voice calls work even with slow internet",
    chatNote: "Chat requires stable internet for streaming responses",
    back: "Back",
  },
  ar: {
    title: "المساعد الذكي",
    subtitle: "محادثة أو مكالمة",
    chat: "محادثة",
    voice: "صوتي",
    newChat: "محادثة جديدة",
    weakConnection: "اتصال ضعيف",
    strongConnection: "اتصال جيد",
    voiceOptimized: "المكالمات الصوتية تعمل حتى مع الإنترنت البطيء",
    chatNote: "المحادثة تحتاج إنترنت مستقر",
    back: "رجوع",
  },
  ur: {
    title: "AI اسسٹنٹ",
    subtitle: "چیٹ یا کال",
    chat: "چیٹ",
    voice: "آواز",
    newChat: "نئی چیٹ",
    weakConnection: "کمزور کنکشن",
    strongConnection: "اچھا کنکشن",
    voiceOptimized: "وائس کالز سست انٹرنیٹ پر بھی کام کرتی ہیں",
    chatNote: "چیٹ کے لیے مستحکم انٹرنیٹ درکار ہے",
    back: "واپس",
  },
  hi: {
    title: "AI सहायक",
    subtitle: "चैट या कॉल",
    chat: "चैट",
    voice: "वॉइस",
    newChat: "नई चैट",
    weakConnection: "कमज़ोर कनेक्शन",
    strongConnection: "अच्छा कनेक्शन",
    voiceOptimized: "वॉइस कॉल धीमे इंटरनेट पर भी काम करती है",
    chatNote: "चैट के लिए स्थिर इंटरनेट चाहिए",
    back: "वापस",
  },
  ta: {
    title: "AI உதவியாளர்",
    subtitle: "அரட்டை அல்லது அழைப்பு",
    chat: "அரட்டை",
    voice: "குரல்",
    newChat: "புதிய அரட்டை",
    weakConnection: "பலவீனமான இணைப்பு",
    strongConnection: "நல்ல இணைப்பு",
    voiceOptimized: "குரல் அழைப்புகள் மெதுவான இணையத்திலும் செயல்படும்",
    chatNote: "அரட்டைக்கு நிலையான இணையம் தேவை",
    back: "பின்",
  },
  te: {
    title: "AI సహాయకుడు",
    subtitle: "చాట్ లేదా కాల్",
    chat: "చాట్",
    voice: "వాయిస్",
    newChat: "కొత్త చాట్",
    weakConnection: "బలహీన కనెక్షన్",
    strongConnection: "మంచి కనెక్షన్",
    voiceOptimized: "వాయిస్ కాల్స్ నెమ్మది ఇంటర్నెట్‌లో కూడా పని చేస్తాయి",
    chatNote: "చాట్‌కు స్థిర ఇంటర్నెట్ అవసరం",
    back: "వెనుకకు",
  },
  mr: {
    title: "AI सहाय्यक",
    subtitle: "चॅट किंवा कॉल",
    chat: "चॅट",
    voice: "आवाज",
    newChat: "नवीन चॅट",
    weakConnection: "कमकुवत कनेक्शन",
    strongConnection: "चांगले कनेक्शन",
    voiceOptimized: "व्हॉइस कॉल्स हळू इंटरनेटवरही काम करतात",
    chatNote: "चॅटसाठी स्थिर इंटरनेट आवश्यक",
    back: "मागे",
  },
  bn: {
    title: "AI সহায়ক",
    subtitle: "চ্যাট বা কল",
    chat: "চ্যাট",
    voice: "ভয়েস",
    newChat: "নতুন চ্যাট",
    weakConnection: "দুর্বল সংযোগ",
    strongConnection: "ভালো সংযোগ",
    voiceOptimized: "ভয়েস কল ধীর ইন্টারনেটেও কাজ করে",
    chatNote: "চ্যাটের জন্য স্থির ইন্টারনেট প্রয়োজন",
    back: "ফিরে",
  },
  or: {
    title: "AI ସହାୟକ",
    subtitle: "ଚ୍ୟାଟ୍ କିମ୍ବା କଲ୍",
    chat: "ଚ୍ୟାଟ୍",
    voice: "ଭଏସ୍",
    newChat: "ନୂଆ ଚ୍ୟାଟ୍",
    weakConnection: "ଦୁର୍ବଳ ସଂଯୋଗ",
    strongConnection: "ଭଲ ସଂଯୋଗ",
    voiceOptimized: "ଭଏସ୍ କଲ୍ ଧୀର ଇଣ୍ଟରନେଟରେ ମଧ୍ୟ କାମ କରେ",
    chatNote: "ଚ୍ୟାଟ୍ ପାଇଁ ସ୍ଥିର ଇଣ୍ଟରନେଟ ଆବଶ୍ୟକ",
    back: "ପଛକୁ",
  },
  ml: {
    title: "AI സഹായി",
    subtitle: "ചാറ്റ് അല്ലെങ്കിൽ കോൾ",
    chat: "ചാറ്റ്",
    voice: "വോയ്സ്",
    newChat: "പുതിയ ചാറ്റ്",
    weakConnection: "ദുർബല കണക്ഷൻ",
    strongConnection: "നല്ല കണക്ഷൻ",
    voiceOptimized: "വോയ്സ് കോൾ മന്ദഗതിയിലുള്ള ഇന്റർനെറ്റിലും പ്രവർത്തിക്കും",
    chatNote: "ചാറ്റിന് സ്ഥിരമായ ഇന്റർനെറ്റ് ആവശ്യമാണ്",
    back: "മടങ്ങുക",
  },
  pa: {
    title: "AI ਸਹਾਇਕ",
    subtitle: "ਚੈਟ ਜਾਂ ਕਾਲ",
    chat: "ਚੈਟ",
    voice: "ਆਵਾਜ਼",
    newChat: "ਨਵੀਂ ਚੈਟ",
    weakConnection: "ਕਮਜ਼ੋਰ ਕੁਨੈਕਸ਼ਨ",
    strongConnection: "ਚੰਗਾ ਕੁਨੈਕਸ਼ਨ",
    voiceOptimized: "ਵਾਇਸ ਕਾਲਾਂ ਹੌਲੀ ਇੰਟਰਨੈੱਟ ਤੇ ਵੀ ਕੰਮ ਕਰਦੀਆਂ ਹਨ",
    chatNote: "ਚੈਟ ਲਈ ਸਥਿਰ ਇੰਟਰਨੈੱਟ ਚਾਹੀਦਾ ਹੈ",
    back: "ਵਾਪਸ",
  },
  tr: {
    title: "AI Asistanı",
    subtitle: "Sohbet veya Arama",
    chat: "Sohbet",
    voice: "Sesli",
    newChat: "Yeni Sohbet",
    weakConnection: "Zayıf bağlantı",
    strongConnection: "İyi bağlantı",
    voiceOptimized: "Sesli aramalar yavaş internette de çalışır",
    chatNote: "Sohbet için kararlı internet gerekli",
    back: "Geri",
  },
  ru: {
    title: "AI Ассистент",
    subtitle: "Чат или Звонок",
    chat: "Чат",
    voice: "Голос",
    newChat: "Новый чат",
    weakConnection: "Слабое соединение",
    strongConnection: "Хорошее соединение",
    voiceOptimized: "Голосовые звонки работают даже при медленном интернете",
    chatNote: "Для чата нужен стабильный интернет",
    back: "Назад",
  },
};

const ChatPage = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { messages, isLoading, sendMessage, clearChat } = useHajjChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "voice">("chat");
  const [connectionStrength, setConnectionStrength] = useState<"weak" | "strong">("strong");

  const labels = CHAT_LABELS[language] || CHAT_LABELS.en;

  // Check connection strength
  useEffect(() => {
    const checkConnection = () => {
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn) {
          const effectiveType = conn.effectiveType;
          // 2g or slow-2g is considered weak
          if (effectiveType === "slow-2g" || effectiveType === "2g") {
            setConnectionStrength("weak");
          } else {
            setConnectionStrength("strong");
          }
        }
      }
    };

    checkConnection();
    
    // Listen for connection changes
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn) {
        conn.addEventListener("change", checkConnection);
        return () => conn.removeEventListener("change", checkConnection);
      }
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-9 w-9"
              >
                <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{labels.title}</h1>
                <p className="text-xs text-muted-foreground">{labels.subtitle}</p>
              </div>
            </div>

            {/* Connection indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              {connectionStrength === "weak" ? (
                <>
                  <WifiOff className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 hidden sm:inline">{labels.weakConnection}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 hidden sm:inline">{labels.strongConnection}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-14 pb-4">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as "chat" | "voice")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {labels.chat}
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {labels.voice}
                {connectionStrength === "weak" && (
                  <span className="text-[10px] bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="mt-0">
              {connectionStrength === "weak" && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-400">
                  {labels.chatNote}
                </div>
              )}

              {hasMessages ? (
                <div className="space-y-4">
                  {/* Clear button */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      {labels.newChat}
                    </Button>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="h-[calc(100vh-320px)]" ref={scrollRef}>
                    <div className="space-y-4 pr-2">
                      {messages.map((message, index) => (
                        <ChatMessage
                          key={index}
                          role={message.role}
                          content={message.content}
                          isStreaming={
                            isLoading &&
                            index === messages.length - 1 &&
                            message.role === "assistant"
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </div>
              ) : (
                <div className="space-y-6">
                  <WelcomeScreen onQuickAction={sendMessage} />
                  <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </div>
              )}
            </TabsContent>

            {/* Voice Tab */}
            <TabsContent value="voice" className="mt-0">
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                {/* Voice optimized message */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm">
                    <Wifi className="w-4 h-4" />
                    {labels.voiceOptimized}
                  </div>
                </div>

                {/* Voice Assistant */}
                <VoiceAssistant />

                {/* Instructions */}
                <div className="text-center text-sm text-muted-foreground max-w-xs">
                  {isRTL 
                    ? "اضغط على الزر للتحدث مع المساعد. يمكنك طرح أي سؤال عن الحج أو العمرة."
                    : "Tap the button to talk with the assistant. You can ask any question about Hajj or Umrah."
                  }
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ChatPage;
