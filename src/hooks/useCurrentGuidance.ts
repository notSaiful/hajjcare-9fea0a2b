import { useState, useEffect, useCallback } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useHajjLocation } from "@/hooks/useHajjLocation";
import {
  GuidanceMessage,
  GuidanceContext,
  HajjPhase,
  LocationZone,
  getGuidance,
  getElderlyModification,
  STATUS_LABELS,
  FAILSAFE_GUIDANCE,
} from "@/data/guidanceContent";

interface CurrentGuidance {
  status: string;
  statusLabel: string;
  instruction: string;
  safety?: string;
  isFailsafe: boolean;
  lastUpdated: Date;
}

// Map stage from useHajjLocation to our zone
const mapStageToZone = (stage: string | null): LocationZone => {
  if (!stage) return "unknown";
  
  const stageMap: Record<string, LocationZone> = {
    makkah: "haram",
    mina: "mina",
    arafat: "arafat",
    muzdalifah: "muzdalifah",
  };
  
  return stageMap[stage.toLowerCase()] || "unknown";
};

// Determine current phase based on date and time
// For Hajj 2026, dates would be configured from official calendar
const determinePhase = (): HajjPhase => {
  const now = new Date();
  const hours = now.getHours();
  
  // In production, this would use actual Hajj calendar dates
  // For now, we'll simulate based on stored preference or default
  const savedPhase = localStorage.getItem("hajj-current-phase");
  if (savedPhase && isValidPhase(savedPhase)) {
    return savedPhase as HajjPhase;
  }
  
  // Default to pre_hajj phase
  return "pre_hajj";
};

const isValidPhase = (phase: string): phase is HajjPhase => {
  const validPhases: HajjPhase[] = [
    "pre_hajj",
    "day_8_mina",
    "day_9_arafat_morning",
    "day_9_arafat_standing",
    "day_9_arafat_sunset",
    "night_muzdalifah",
    "day_10_rami",
    "day_10_tawaf",
    "days_11_12_mina",
    "day_13_farewell",
    "post_hajj",
  ];
  return validPhases.includes(phase as HajjPhase);
};

export const useCurrentGuidance = () => {
  const { language } = useLanguage();
  const { stage } = useHajjLocation();
  
  const [guidance, setGuidance] = useState<CurrentGuidance>(() => ({
    status: "WAIT",
    statusLabel: STATUS_LABELS.WAIT[language],
    instruction: FAILSAFE_GUIDANCE.instruction[language] || FAILSAFE_GUIDANCE.instruction.en,
    safety: FAILSAFE_GUIDANCE.safety?.[language] || FAILSAFE_GUIDANCE.safety?.en,
    isFailsafe: true,
    lastUpdated: new Date(),
  }));

  const [isElderly, setIsElderly] = useState<boolean>(() => {
    return localStorage.getItem("hajj-pilgrim-elderly") === "true";
  });

  const updateGuidance = useCallback(() => {
    try {
      const phase = determinePhase();
      const zone = mapStageToZone(stage);
      
      const context: GuidanceContext = {
        phase,
        zone,
        isElderly,
      };

      const guidanceMessage = getGuidance(context);
      const isFailsafe = guidanceMessage === FAILSAFE_GUIDANCE;

      let instruction = guidanceMessage.instruction[language] || guidanceMessage.instruction.en;
      let safety = guidanceMessage.safety?.[language] || guidanceMessage.safety?.en;

      // Add elderly modification if applicable
      if (isElderly && !isFailsafe) {
        safety = safety 
          ? `${safety} ${getElderlyModification(language)}`
          : getElderlyModification(language);
      }

      setGuidance({
        status: guidanceMessage.status,
        statusLabel: STATUS_LABELS[guidanceMessage.status][language] || STATUS_LABELS[guidanceMessage.status].en,
        instruction,
        safety,
        isFailsafe,
        lastUpdated: new Date(),
      });
    } catch {
      // On any error, show failsafe
      setGuidance({
        status: "WAIT",
        statusLabel: STATUS_LABELS.WAIT[language],
        instruction: FAILSAFE_GUIDANCE.instruction[language] || FAILSAFE_GUIDANCE.instruction.en,
        safety: FAILSAFE_GUIDANCE.safety?.[language] || FAILSAFE_GUIDANCE.safety?.en,
        isFailsafe: true,
        lastUpdated: new Date(),
      });
    }
  }, [stage, language, isElderly]);

  // Update guidance when context changes
  useEffect(() => {
    updateGuidance();
  }, [updateGuidance]);

  // Set phase manually (for demo/testing or official updates)
  const setPhase = useCallback((phase: HajjPhase) => {
    localStorage.setItem("hajj-current-phase", phase);
    // Force update by calling updateGuidance
    setTimeout(() => updateGuidance(), 0);
  }, [updateGuidance]);

  // Toggle elderly status
  const toggleElderly = useCallback((value: boolean) => {
    setIsElderly(value);
    localStorage.setItem("hajj-pilgrim-elderly", value.toString());
  }, []);

  // Get last known instruction for offline mode
  const getOfflineInstruction = useCallback((): CurrentGuidance => {
    const saved = localStorage.getItem("hajj-last-guidance");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return guidance;
      }
    }
    return guidance;
  }, [guidance]);

  // Save guidance for offline access
  useEffect(() => {
    localStorage.setItem("hajj-last-guidance", JSON.stringify(guidance));
  }, [guidance]);

  return {
    guidance,
    isElderly,
    setPhase,
    toggleElderly,
    refreshGuidance: updateGuidance,
    getOfflineInstruction,
  };
};
