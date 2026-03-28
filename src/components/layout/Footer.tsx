import { useStateContext } from "@/hooks/useStateContext";
import { useLanguageContext } from "@/hooks/useLanguageContext";
import { useEffect } from "react";

const Footer = () => {
  const { systemSettingsData, isSystemSettingsPending } = useStateContext();
  const { t } = useLanguageContext();

  useEffect(() => {
    console.log("System Settings:", systemSettingsData);
    console.log("System Settings Pending:", isSystemSettingsPending);
  }, [systemSettingsData, isSystemSettingsPending]);

  return (
    <footer className="bg-[#080F2A] text-[#919EAB] text-sm px-4 sm:px-6 lg:px-8">
      <p className="text-center py-6 border-t border-[#5F6368]">
        {systemSettingsData?.data?.copyright_text || t("footer.copyright")}
      </p>
    </footer>
  );
};

export default Footer;
