"use client";

import { DialogContent } from "@/components/ui/dialog";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Field, FieldError } from "../ui/field";
import toast from "react-hot-toast";
import axios from "axios";
import { useStateContext } from "@/hooks/useStateContext";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const formSchema = z.object({
  otp: z.string().min(4, "Please enter the 4-digit code."),
});

const VerifyRegistrationDialogContent = ({
  setState,
}: {
  onBack?: () => void;
  setState: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { email } = useStateContext();
  const { t } = useLanguageContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    try {
      setIsResending(true);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/resend_otp`, {
        email: email,
      });
      toast.success("A new code has been sent to your email.");
      setCountdown(60);
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to resend code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);
      console.log(data);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/verify_otp`,
        {
          email: email,
          otp: data.otp,
        },
      );
      console.log(response.data);
      toast.success("Email verified successfully!");
      setState(3);
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Verification failed. Please try again.",
      );
      return;
    } finally {
      setIsPending(false);
    }
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="border border-[rgba(92,133,255,0.5)] rounded-2xl sm:rounded-3xl lg:rounded-4xl px-5 sm:px-12 lg:px-24 py-10 sm:py-20 lg:py-30 w-full max-w-[calc(100%-2rem)] sm:max-w-115 lg:max-w-180 backdrop-blur-2xl bg-white shadow-xl border-none"
    >
      <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 items-center font-poppins">
        {/* Heading */}
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 items-start w-full">
          <h3 className="text-[#212B36] text-xl sm:text-2xl lg:text-[32px] font-semibold lg:leading-12 w-full">
            {t("verify.title")}
          </h3>
          <p className="text-[#637381] text-sm sm:text-base leading-6">
            {t("verify.subtitle.before")}{" "}
            <span className="text-[#212B36] font-medium">{email}</span>
            {t("verify.subtitle.after")}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5 sm:gap-6 lg:gap-8"
        >
          {/* OTP Input */}
          <Controller
            name="otp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputOTP
                  maxLength={4}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                >
                  <InputOTPGroup className="w-full gap-3 sm:gap-4 lg:gap-5 justify-between">
                    <InputOTPSlot
                      index={0}
                      className="flex-1 h-12 sm:h-14 lg:h-16 rounded-full border border-[#637381] text-[#212B36] text-sm sm:text-base font-semibold"
                    />
                    <InputOTPSlot
                      index={1}
                      className="flex-1 h-12 sm:h-14 lg:h-16 rounded-full border border-[#637381] text-[#212B36] text-sm sm:text-base font-semibold"
                    />
                    <InputOTPSlot
                      index={2}
                      className="flex-1 h-12 sm:h-14 lg:h-16 rounded-full border border-[#637381] text-[#212B36] text-sm sm:text-base font-semibold"
                    />
                    <InputOTPSlot
                      index={3}
                      className="flex-1 h-12 sm:h-14 lg:h-16 rounded-full border border-[#637381] text-[#212B36] text-sm sm:text-base font-semibold"
                    />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Resend OTP */}
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
            {countdown > 0 ? (
              <>
                <span className="text-[#637381]">{t("verify.resendIn")}</span>
                <span className="text-[#122464] font-semibold tabular-nums min-w-[2.5ch]">
                  {String(countdown).padStart(2, "0")}s
                </span>
              </>
            ) : (
              <>
                <span className="text-[#637381]">
                  {t("verify.didntReceive")}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#122464] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {isResending ? t("verify.resending") : t("verify.resend")}
                </button>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
            <Button
              type="button"
              onClick={() => setState(1)}
              variant="secondary"
              className="flex-1 bg-[#DFE3E8] text-[#212B36] hover:bg-[#DFE3E8]/90 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 h-12 sm:h-14 lg:h-14.5 text-sm sm:text-base font-semibold"
            >
              {t("verify.back")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#122464] text-white hover:bg-[#122464]/90 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold h-12 sm:h-14 lg:h-14.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? t("verify.submitting") : t("verify.submit")}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

export default VerifyRegistrationDialogContent;
