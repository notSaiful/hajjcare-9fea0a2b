import { useCallback, useEffect, useRef, useState } from "react";
import { getZoyaLanguage } from "@/lib/zoyaLanguages";
import { requestMicrophonePermission } from "@/lib/nativeMicrophonePermission";

interface BrowserRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionConstructor = new () => BrowserRecognition;

const getRecognitionConstructor = (): RecognitionConstructor | undefined =>
  (window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }).SpeechRecognition
  ?? (window as Window & { webkitSpeechRecognition?: RecognitionConstructor }).webkitSpeechRecognition;

export function useSpeechRecognition(languageCode: string, onTranscript: (text: string) => void) {
  const recognitionRef = useRef<BrowserRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSupported = typeof window !== "undefined" && Boolean(getRecognitionConstructor());

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    const Recognition = getRecognitionConstructor();
    if (!Recognition) {
      setError("Voice typing is unavailable in this browser. Use the Voice tab for supported voice calls.");
      return;
    }
    try {
      await requestMicrophonePermission();
      const recognition = new Recognition();
      recognition.lang = getZoyaLanguage(languageCode).locale;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim();
        if (transcript) onTranscript(transcript);
      };
      recognition.onerror = (event) => {
        if (event.error !== "aborted") setError(`Voice typing failed: ${event.error}.`);
      };
      recognition.onend = () => { recognitionRef.current = null; setIsListening(false); };
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      console.info("[zoya-voice]", { event: "stt_started", language: languageCode, sttLanguage: recognition.lang });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Microphone permission is required for voice typing.");
    }
  }, [languageCode, onTranscript]);

  useEffect(() => stop, [stop]);
  return { start, stop, isListening, isSupported, error };
}
