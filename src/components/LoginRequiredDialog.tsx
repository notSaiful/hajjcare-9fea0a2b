import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginRequiredDialog({ open, onOpenChange }: LoginRequiredDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" />
            Login Required
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Login required to continue. Please sign in to access this feature.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/auth")}
            className="w-full sm:w-auto"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In / Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
