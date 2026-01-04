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
          w-full h-12 sm:h-14 rounded-xl
          border-2 border-destructive/30
          text-destructive hover:bg-destructive/5
          font-semibold text-sm sm:text-base
          flex items-center justify-center gap-2.5 sm:gap-3
        "
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{t("emergency")}</span>
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-sm mx-auto" dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl text-center">
              {t("emergencyConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm sm:text-base">
              {t("emergencyConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleConfirm}
              className="w-full h-12 sm:h-14 bg-destructive hover:bg-destructive/90 text-base sm:text-lg font-semibold"
            >
              {t("emergencyConfirm")}
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-10 sm:h-12 text-sm sm:text-base">
              {t("cancel")}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
