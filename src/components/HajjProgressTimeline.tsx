import { useLanguage } from "@/contexts/LanguageContext";
import { HAJJ_STAGES, STAGE_LABELS, PROGRESS_LABELS } from "@/data/hajjStagesContent";
import { Check, Circle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface HajjProgressTimelineProps {
  currentStage: string | null;
  pilgrimName?: string;
}

/**
 * Hajj Progress Timeline - Visual journey tracker for families
 * 
 * Design Philosophy:
 * - Calm, reassuring aesthetic (no anxiety-inducing elements)
 * - Clear visual hierarchy showing completed vs upcoming stages
 * - No timestamps (per silence protocol)
 * - Static presentation - updates appear naturally
 */
export const HajjProgressTimeline = ({ 
  currentStage, 
  pilgrimName 
}: HajjProgressTimelineProps) => {
  const { language, isRTL } = useLanguage();
  
  const labels = PROGRESS_LABELS[language] || PROGRESS_LABELS.en;
  const stageLabels = STAGE_LABELS[language] || STAGE_LABELS.en;
  
  // Find current stage index
  const currentStageIndex = HAJJ_STAGES.findIndex(s => s.id === currentStage);
  const hasStarted = currentStageIndex >= 0;

  return (
    <div className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      {pilgrimName && (
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 text-center">
          {pilgrimName}{labels.pilgrimJourney}
        </h2>
      )}

      {/* Timeline */}
      <div className="relative">
        {HAJJ_STAGES.map((stage, index) => {
          const isCompleted = hasStarted && index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isUpcoming = !hasStarted || index > currentStageIndex;
          
          return (
            <div 
              key={stage.id}
              className={cn(
                "relative flex items-start gap-3 sm:gap-4 pb-6 sm:pb-8 last:pb-0",
                isRTL && "flex-row-reverse"
              )}
            >
              {/* Connecting Line */}
              {index < HAJJ_STAGES.length - 1 && (
                <div 
                  className={cn(
                    "absolute w-0.5 top-10 sm:top-12 bottom-0",
                    isRTL ? "right-5 sm:right-6" : "left-5 sm:left-6",
                    isCompleted ? "bg-status-safe" : "bg-muted"
                  )}
                />
              )}

              {/* Stage Icon */}
              <div 
                className={cn(
                  "relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all duration-300",
                  isCompleted && "bg-status-safe-bg border-2 border-status-safe",
                  isCurrent && "bg-primary/10 border-2 border-primary ring-4 ring-primary/20 scale-110",
                  isUpcoming && "bg-muted border-2 border-muted-foreground/20"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-status-safe" />
                ) : isCurrent ? (
                  <span className="relative">
                    {stage.icon}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </span>
                ) : (
                  <span className="opacity-40">{stage.icon}</span>
                )}
              </div>

              {/* Stage Details */}
              <div className="flex-1 pt-1 sm:pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 
                    className={cn(
                      "font-medium text-sm sm:text-base",
                      isCompleted && "text-status-safe",
                      isCurrent && "text-primary font-semibold",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {stageLabels[stage.labelKey] || stage.labelKey}
                  </h3>
                  
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      <MapPin className="w-3 h-3" />
                      {labels.stageCurrent}
                    </span>
                  )}
                </div>

                {/* Status text */}
                <p 
                  className={cn(
                    "text-xs sm:text-sm mt-0.5",
                    isCompleted && "text-status-safe/70",
                    isCurrent && "text-primary/70",
                    isUpcoming && "text-muted-foreground/50"
                  )}
                >
                  {isCompleted && labels.stageCompleted}
                  {isUpcoming && labels.stageNotStarted}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* No stage yet message */}
      {!hasStarted && (
        <div className="mt-4 sm:mt-6 p-4 bg-muted/50 rounded-xl text-center">
          <Circle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{labels.noUpdates}</p>
        </div>
      )}
    </div>
  );
};
