"use client";

import { DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { CongratulationIcon } from "@/assets/icons/icon";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const RegistrationCompleteDialogContent = ({
  setState,
}: {
  onBackToLogin?: () => void;
  setState: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleBackToLogin = () => {
    setState(4);
  };
  const { t } = useLanguageContext();

  return (
    <DialogContent
      showCloseButton={false}
      className="border border-[rgba(92,133,255,0.5)] rounded-2xl sm:rounded-3xl lg:rounded-4xl px-5 sm:px-12 lg:px-24 py-10 sm:py-20 lg:py-30 w-full max-w-[calc(100%-2rem)] sm:max-w-115 lg:max-w-180 backdrop-blur-2xl bg-white shadow-xl border-none"
    >
      <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 items-center font-poppins">
        {/* Success Icon */}
        <CongratulationIcon />

        {/* Heading */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 items-center text-center w-full">
          <h3 className="text-[#212B36] text-xl sm:text-2xl lg:text-[32px] font-semibold lg:leading-12">
            {t("regComplete.title")}
          </h3>
          <p className="text-[#637381] text-sm sm:text-base leading-6">
            {t("regComplete.subtitle")}
          </p>
        </div>

        {/* Back to Login Button */}
        <Button
          onClick={handleBackToLogin}
          className="w-full bg-[#122464] text-white hover:bg-[#122464]/90 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 h-12 sm:h-14 lg:h-14.5 text-sm sm:text-base font-semibold"
        >
          {t("regComplete.backToLogin")}
        </Button>
      </div>
    </DialogContent>
  );
};

export default RegistrationCompleteDialogContent;
