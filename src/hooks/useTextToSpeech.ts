import { useState, useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Map app language codes to speech synthesis language codes
const LANG_MAP: Record<string, string[]> = {
  en: ["en-US", "en-GB", "en"],
  ar: ["ar-SA", "ar-EG", "ar"],
  ur: ["ur-PK", "ur-IN", "ur"],
  hi: ["hi-IN", "hi"],
  tr: ["tr-TR", "tr"],
  ru: ["ru-RU", "ru"],
};

// Find the best matching voice for a language
const findVoiceForLanguage = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const langCodes = LANG_MAP[langCode] || [langCode];
  
  for (const code of langCodes) {
    // Try exact match first
    const exactMatch = voices.find(v => v.lang === code);
    if (exactMatch) return exactMatch;
    
    // Try prefix match (e.g., "ar" matches "ar-SA")
    const prefixMatch = voices.find(v => v.lang.startsWith(code.split('-')[0]));
    if (prefixMatch) return prefixMatch;
  }
  
  return null;
};

export const useTextToSpeech = () => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }
    
    setIsSupported(true);
    
    // Load voices (they may load async)
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the best voice for the current language
    const voice = findVoiceForLanguage(language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Fallback to language code
      utterance.lang = LANG_MAP[language]?.[0] || "en-US";
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [language, isSpeaking]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stop, isSpeaking, isSupported, currentLanguage: language };
};
