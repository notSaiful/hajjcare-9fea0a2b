import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Phone } from "lucide-react";

interface EmergencyButtonProps {
  onConfirm: () => void;
}

export const EmergencyButton = ({ onConfirm }: EmergencyButtonProps) => {
  const { t, isRTL } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    setShowConfirm(false);
    onConfirm();
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setShowConfirm(true)}
        className="
          w-full h-14 sm:h-16 rounded-2xl
          border border-destructive/20
          bg-[hsl(var(--status-emergency-bg))]
          text-destructive
          hover:bg-destructive/10 hover:border-destructive/30
          font-semibold text-sm sm:text-base
          flex items-center justify-center gap-3
          transition-all duration-300 ease-out
        "
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span>{t("emergency")}</span>
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent 
          className="max-w-[90vw] sm:max-w-md mx-auto rounded-2xl border border-border bg-card animate-scale-in" 
          dir={isRTL ? "rtl" : "ltr"}
        >
          <AlertDialogHeader className="space-y-3">
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl sm:text-2xl text-center font-semibold">
              {t("emergencyConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("emergencyConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 sm:flex-col pt-4">
            <AlertDialogAction
              onClick={handleConfirm}
              className="w-full h-14 sm:h-16 rounded-xl bg-destructive hover:bg-destructive/90 text-base sm:text-lg font-semibold transition-all duration-300"
            >
              {t("emergencyConfirm")}
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-medium border-border">
              {t("cancel")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
