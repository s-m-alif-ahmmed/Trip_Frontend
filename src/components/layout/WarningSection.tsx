"use client";

import { LocationIcon3 } from "@/assets/icons/icon";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const WarningSection = () => {
  const { t } = useLanguageContext();

  return (
    <div className="bg-[#E7E9F0] rounded-xl sm:rounded-2xl my-4 sm:my-5 lg:my-6 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div className="shrink-0">
        <LocationIcon3 />
      </div>
      <div className="text-primary">
        <h4 className="font-semibold mb-1 text-sm sm:text-base">
          {t("warning.title")}
        </h4>
        <p className="text-xs sm:text-sm">
          {t("warning.description")}
        </p>
      </div>
    </div>
  );
};

export default WarningSection;
