import { useState } from "react";
import { useNavigate } from "react-router";
import Container from "@/components/shared/Container";
import SettingsTab, {
  type SettingsTabItem,
} from "@/components/settings/SettingsTab";
import ProfileSection from "@/components/settings/ProfileSection";
import EditProfileSection from "@/components/settings/EditProfileSection";
import ChangePasswordSection from "@/components/settings/ChangePasswordSection";
import LogoutDialog from "@/components/dialogs/LogoutDialog";
import { ArrowLeftIcon } from "@/assets/icons/icon";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguageContext();

  const SETTINGS_TABS: SettingsTabItem[] = [
    { label: t("settings.profile"), value: "profile" },
    { label: t("settings.changePassword"), value: "change-password" },
    { label: t("settings.logout"), value: "logout", variant: "danger" },
  ];

  const handleTabChange = (value: string) => {
    if (value === "logout") {
      setIsLogoutDialogOpen(true);
      return;
    }
    setIsEditingProfile(false);
    setActiveTab(value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container className="py-6 sm:py-10">
      <div className="bg-white border-2 border-[#DFE3E8] border-dashed rounded-xl sm:rounded-2xl lg:rounded-[20px] p-4 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5 lg:gap-6">
        {/* Header */}
        <div className="flex gap-3 sm:gap-4 items-center">
          <button
            onClick={handleBack}
            className="shrink-0 size-5 sm:size-6 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-5 sm:size-6 text-[#212B36]" />
          </button>
          <h1 className="font-poppins font-semibold text-xl sm:text-2xl lg:text-[28px] leading-tight lg:leading-9 text-[#212B36]">
            {t("settings.title")}
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 lg:items-start">
          {/* Sidebar Tabs */}
          <SettingsTab
            tabs={SETTINGS_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="w-full lg:w-auto lg:shrink-0"
          />

          {/* Tab Content */}
          {activeTab === "profile" && !isEditingProfile && (
            <ProfileSection onEdit={() => setIsEditingProfile(true)} />
          )}
          {activeTab === "profile" && isEditingProfile && (
            <EditProfileSection onCancel={() => setIsEditingProfile(false)} />
          )}
          {activeTab === "change-password" && <ChangePasswordSection />}
        </div>
      </div>

      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      />
    </Container>
  );
};

export default SettingsPage;
