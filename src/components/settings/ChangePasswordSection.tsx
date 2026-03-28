"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import toast from "react-hot-toast";
import axios from "axios";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordSection = () => {
  const [isPending, setIsPending] = useState(false);
  const { t } = useLanguageContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      setIsPending(true);
      const storedToken = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/change-password`,
        {
          old_password: data.currentPassword,
          password: data.newPassword,
          password_confirmation: data.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );
      toast.success(response?.data?.message ?? "Password changed successfully!");
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to change password.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-5 min-w-0">
      <h3 className="font-poppins text-lg sm:text-xl font-semibold text-[#212B36]">
        {t("changePassword.title")}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-2 sm:gap-3">
          <label className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
            {t("changePassword.currentLabel")}
          </label>
          <PasswordField
            placeholder={t("changePassword.currentPlaceholder")}
            {...register("currentPassword")}
            className="h-11 sm:h-12 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border-[#DFE3E8] text-sm sm:text-base"
          />
          {errors.currentPassword && (
            <p className="text-xs sm:text-sm text-[#FF4842]">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <label className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
            {t("changePassword.newLabel")}
          </label>
          <PasswordField
            placeholder={t("changePassword.newPlaceholder")}
            {...register("newPassword")}
            className="h-11 sm:h-12 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border-[#DFE3E8] text-sm sm:text-base"
          />
          {errors.newPassword && (
            <p className="text-xs sm:text-sm text-[#FF4842]">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <label className="font-poppins text-sm sm:text-base leading-6 text-[#637381]">
            {t("changePassword.confirmLabel")}
          </label>
          <PasswordField
            placeholder={t("changePassword.confirmPlaceholder")}
            {...register("confirmPassword")}
            className="h-11 sm:h-12 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border-[#DFE3E8] text-sm sm:text-base"
          />
          {errors.confirmPassword && (
            <p className="text-xs sm:text-sm text-[#FF4842]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-fit mt-1 sm:mt-2 disabled:opacity-60"
        >
          {isPending ? t("changePassword.submitting") : t("changePassword.submit")}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordSection;
