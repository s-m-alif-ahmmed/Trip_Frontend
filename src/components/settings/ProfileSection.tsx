import ProfileField from "@/components/settings/ProfileField";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/assets/icons/icon";
import { useStateContext } from "@/hooks/useStateContext";
import { useLanguageContext } from "@/hooks/useLanguageContext";

interface ProfileSectionProps {
  onEdit?: () => void;
}

const ProfileSection = ({ onEdit }: ProfileSectionProps) => {
  const { userData } = useStateContext();
  const { t } = useLanguageContext();

  const sampleUser = {
    id: 0,
    name: "User's Name",
    email: "demo@mail.com",
    avatar: "https://i.ibb.co.com/XkYLH2xR/avatar.png",
    number: "+0 (000) 000-0000",
    address: "address...",
    role: "User",
  } as const;

  const fullName = userData?.name ?? sampleUser.name;
  const email = userData?.email ?? sampleUser.email;
  const phone = userData?.number ?? sampleUser.number;
  const address = userData?.address ?? sampleUser.address;
  const avatarUrl = userData?.avatar ?? sampleUser.avatar;

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-5 relative min-w-0">
      {/* Avatar */}
      <div className="w-24 sm:w-28 lg:w-33.75 aspect-square rounded-lg overflow-hidden relative shrink-0 border border-dashed">
        <img src={avatarUrl} alt={fullName} className="object-contain w-full h-full" />
      </div>

      {/* Edit Button - positioned top right */}
      <Button
        variant="default"
        onClick={onEdit}
        className="absolute right-0 top-0 gap-1.5 sm:gap-2 px-2 py-1 rounded-sm h-auto text-sm sm:text-base font-poppins font-normal"
      >
        <EditIcon className="size-4 sm:size-5 lg:size-6 text-white" />
        {t("profile.edit")}
      </Button>

      {/* Full Name */}
      <ProfileField label={t("profile.fullName")} value={fullName} />

      {/* Email & Phone Row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
        <ProfileField label={t("profile.email")} value={email} className="flex-1 min-w-0" />
        <ProfileField label={t("profile.phone")} value={phone} className="flex-1 min-w-0" />
      </div>

      {/* Address */}
      <ProfileField label={t("profile.address")} value={address} />
    </div>
  );
};

export default ProfileSection;
