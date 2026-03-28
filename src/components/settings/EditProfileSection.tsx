import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CameraIcon } from "@/assets/icons/icon";
import { useStateContext } from "@/hooks/useStateContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguageContext } from "@/hooks/useLanguageContext";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
}

interface EditProfileSectionProps {
  onCancel: () => void;
}

type EditProfileFormValues = Omit<ProfileData, "avatarUrl">;

const sampleUser = {
  name: "User's Name",
  email: "demo@mail.com",
  avatar: "https://i.ibb.co.com/XkYLH2xR/avatar.png",
  number: "+0 (000) 000-0000",
  address: "address...",
} as const;

const EditProfileSection = ({ onCancel }: EditProfileSectionProps) => {
  const { userData, setUserData } = useStateContext();
  const [isPending, setIsPending] = useState(false);
  const { t } = useLanguageContext();

  const [avatarPreview, setAvatarPreview] = useState<string>(
    userData?.avatar ?? sampleUser.avatar,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const { register, handleSubmit } = useForm<EditProfileFormValues>({
    defaultValues: {
      name: userData?.name ?? sampleUser.name,
      email: userData?.email ?? sampleUser.email,
      phone: userData?.number ?? sampleUser.number,
      address: userData?.address ?? sampleUser.address,
    },
  });

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      setIsPending(true);
      const storedToken = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("number", values.phone);
      formData.append("address", values.address);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );
      if (response?.data?.data) {
        setUserData(response.data.data);
      }
      toast.success(response?.data?.message ?? "Profile updated successfully!");
      onCancel();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to update profile.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-4 sm:gap-5 min-w-0"
    >
      <div
        className="w-24 sm:w-28 lg:w-33.75 aspect-square rounded-lg overflow-hidden border border-dashed relative shrink-0 cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
        title="Click to change photo"
      >
        <img
          src={avatarPreview}
          alt={userData?.name ?? sampleUser.name}
          className="object-contain w-full h-full"
        />
        {/* hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <CameraIcon className="size-7 text-white" />
          <span className="font-poppins text-xs text-white">{t("editProfile.changePhoto")}</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        <label className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
          {t("editProfile.fullName")}
        </label>
        <Input
          {...register("name")}
          className="h-11 sm:h-12 rounded-lg border-[#DFE3E8] px-4 sm:px-5 py-2.5 sm:py-3 font-poppins text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
        <div className="flex flex-1 min-w-0 flex-col gap-2 sm:gap-3">
          <label className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
            {t("editProfile.email")}
          </label>
          <Input
            {...register("email")}
            className="h-11 sm:h-12 rounded-lg border-[#DFE3E8] px-4 sm:px-5 py-2.5 sm:py-3 font-poppins text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-1 min-w-0 flex-col gap-2 sm:gap-3">
          <label className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
            {t("editProfile.phone")}
          </label>
          <Input
            {...register("phone")}
            className="h-11 sm:h-12 rounded-lg border-[#DFE3E8] px-4 sm:px-5 py-2.5 sm:py-3 font-poppins text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        <label className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
          {t("editProfile.address")}
        </label>
        <Input
          {...register("address")}
          className="h-11 sm:h-12 rounded-lg border-[#DFE3E8] px-4 sm:px-5 py-2.5 sm:py-3 font-poppins text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        <Button
          type="button"
          variant="noStyle"
          onClick={onCancel}
          disabled={isPending}
          className="h-12 sm:h-14 flex-1 rounded-xl bg-[#DFE3E8] px-4 sm:px-5.5 py-3 sm:py-4 font-poppins text-sm sm:text-base font-semibold text-[#212B36] disabled:opacity-60"
        >
          {t("editProfile.cancel")}
        </Button>
        <Button
          type="submit"
          variant="noStyle"
          disabled={isPending}
          className="h-12 sm:h-14 flex-1 rounded-xl border border-[#122464] bg-[#122464] px-4 sm:px-5.5 py-3 sm:py-4 font-poppins text-sm sm:text-base font-semibold text-[#EBF0FF] disabled:opacity-60"
        >
          {isPending ? t("editProfile.submitting") : t("editProfile.submit")}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileSection;
