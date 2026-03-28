"use client";

import { DialogContent } from "@/components/ui/dialog";
import axios from "axios";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { PasswordField } from "../ui/password-field";
import { Field, FieldError, FieldGroup } from "../ui/field";
import toast from "react-hot-toast";
import { useStateContext } from "@/hooks/useStateContext";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordDialogContent = ({
  setState,
}: {
  setState: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isPending, setIsPending] = useState(false);
  const { token } = useStateContext();
  const { t } = useLanguageContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/reset-password`,
        {
          password: data.password,
          password_confirmation: data.confirmPassword,
          token: token,
        },
      );
      console.log(response.data);
      // toast.success("Password reset successfully!");
      setState(8);
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="border border-[rgba(92,133,255,0.5)] rounded-2xl sm:rounded-3xl lg:rounded-4xl px-5 sm:px-10 lg:px-20 py-8 sm:py-16 lg:py-25 w-full max-w-[calc(100%-2rem)] sm:max-w-115 lg:max-w-180 backdrop-blur-2xl bg-white shadow-xl border-none max-h-[90vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 items-center font-poppins">
        {/* Heading */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 items-start w-full">
          <h3 className="text-[#212B36] text-xl sm:text-2xl lg:text-[32px] font-semibold lg:leading-12">
            {t("resetPassword.title")}
          </h3>
          <p className="text-[#637381] text-sm sm:text-base leading-6">
            {t("resetPassword.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6 sm:gap-8 lg:gap-10"
        >
          <FieldGroup>
            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <PasswordField
                    {...field}
                    placeholder={t("resetPassword.passwordPlaceholder")}
                    className="w-full border border-[#919EAB] rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-[#919EAB]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <PasswordField
                    {...field}
                    placeholder={t("resetPassword.confirmPlaceholder")}
                    className="w-full border border-[#919EAB] rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-[#919EAB]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
            <Button
              type="button"
              onClick={() => setState((prev) => prev - 1)}
              variant="secondary"
              className="flex-1 bg-[#DFE3E8] text-[#212B36] hover:bg-[#DFE3E8]/90 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 h-12 sm:h-14 lg:h-14.5 text-sm sm:text-base font-semibold"
            >
              {t("resetPassword.back")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#122464] text-white hover:bg-[#122464]/90 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold h-12 sm:h-14 lg:h-14.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? t("resetPassword.submitting") : t("resetPassword.submit")}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

export default ResetPasswordDialogContent;
