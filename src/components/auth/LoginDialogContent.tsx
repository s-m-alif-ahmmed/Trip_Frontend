"use client";

import { DialogContent } from "@/components/ui/dialog";
import axios from "axios";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { PasswordField } from "../ui/password-field";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import toast from "react-hot-toast";
import { CloseIcon } from "@/assets/icons/icon";
import { useStateContext } from "@/hooks/useStateContext";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
});

const LoginDialogContent = ({
  onOpenChange,
  setState,
}: {
  onOpenChange: (open: boolean) => void;
  setState: (state: number) => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const { setIsLoggedIn, handleLoginState } = useStateContext();
  const { t } = useLanguageContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/login`,
        {
          email: data.email,
          password: data.password,
        },
      );
      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);
      handleLoginState();

      toast.success("Logged in successfully!");
      setIsLoggedIn(true);
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials.",
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
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-3 sm:right-4 top-3 sm:top-4 size-8 sm:size-10 rounded-full bg-[#212B36] hover:bg-[#212B36]/90 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Close dialog"
      >
        <CloseIcon />
      </button>

      <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 items-center font-poppins">
        {/* Heading */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 items-start w-full">
          <h3 className="text-[#212B36] text-xl sm:text-2xl lg:text-[32px] font-semibold lg:leading-12">
            {t("login.title")}
          </h3>
          <p className="text-[#637381] text-sm sm:text-base leading-6">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6 sm:gap-8 lg:gap-10"
        >
          <FieldGroup>
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    className="w-full border border-[#919EAB] rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-[#919EAB]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <div className="">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <PasswordField
                      {...field}
                      placeholder={t("login.passwordPlaceholder")}
                      className="w-full border border-[#919EAB] rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-[#919EAB]"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Terms and Conditions Checkbox */}
              <div className="flex justify-between items-center mt-3 sm:mt-3.5 gap-2 sm:gap-0">
                <Controller
                  name="rememberMe"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className="flex-wrap"
                    >
                      <Checkbox
                        id="remember-me"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-2 border-[#122464] data-[state=checked]:bg-[#122464] cursor-pointer"
                      />
                      <FieldLabel
                        htmlFor="remember-me"
                        className="text-xs sm:text-sm text-[#919EAB] font-normal cursor-pointer"
                      >
                        {t("login.rememberMe")}
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <button
                  type="button"
                  onClick={() => setState(5)}
                  className="text-xs sm:text-sm text-[#122464] font-semibold hover:underline cursor-pointer sm:float-right text-nowrap w-fit"
                >
                  {t("login.forgotPassword")}
                </button>
              </div>
            </div>
          </FieldGroup>

          {/* Submit Button */}
          <div className="">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#122464] text-[#EBF0FF] rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 font-semibold hover:bg-[#122464]/90 transition-colors h-12 sm:h-14 lg:h-14.5 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? t("login.submitting") : t("login.submit")}
            </Button>

            {/* Sign in Link */}
            <div className="text-center mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm">
                <span className="text-[#919EAB]">{t("login.noAccount")} </span>
                <button
                  type="button"
                  onClick={() => {
                    setState(1);
                  }}
                  className="text-[#122464] font-semibold hover:underline cursor-pointer"
                >
                  {t("login.signUpLink")}
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

export default LoginDialogContent;
