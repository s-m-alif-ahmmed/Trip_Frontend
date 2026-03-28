

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useStateContext } from "@/hooks/useStateContext";
import { useNavigate } from "react-router";
import { useLanguageContext } from "@/hooks/useLanguageContext";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
  const [isPending, setIsPending] = useState(false);
  const { setIsLoggedIn } = useStateContext();
  const navigate = useNavigate();
  const { t } = useLanguageContext();

  const handleConfirm = async () => {
    try {
      setIsPending(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      localStorage.removeItem("token");
      onOpenChange(false);
      setIsLoggedIn(false);
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Logout failed. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm gap-0 rounded-lg border-none p-8 shadow-lg"
      >
        {/* Text block */}
        <div className="flex flex-col items-center gap-2 text-center">
          <DialogTitle className="font-poppins text-2xl font-semibold leading-9 text-[#212B36]">
            {t("logout.title")}
          </DialogTitle>
          <DialogDescription className="font-poppins text-base leading-6 text-[#212B36]">
            {t("logout.description")}
          </DialogDescription>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2 w-full">
          <Button
            variant="noStyle"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="flex-1 rounded px-8 py-4 h-auto border-[1.5px] border-[#5C638B] font-poppins text-[15px] font-bold leading-6.5 text-[#5C638B] hover:bg-[#5C638B]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("logout.back")}
          </Button>
          <Button
            variant="noStyle"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 rounded px-8 py-4 h-auto bg-[#FF4842] font-poppins text-[15px] font-bold leading-6.5 text-white hover:bg-[#FF4842]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t("logout.submitting") : t("logout.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
