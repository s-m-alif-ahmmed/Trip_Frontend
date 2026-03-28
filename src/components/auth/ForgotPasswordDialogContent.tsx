"use client";

import { DialogContent } from "@/components/ui/dialog";
import axios from "axios";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Field, FieldError } from "../ui/field";
import toast from "react-hot-toast";
import { useStateContext } from "@/hooks/useStateContext";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const ForgotPasswordDialogContent = ({
  setState,
}: {
  onBack?: () => void;
  setState: (state: number) => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const { setEmail } = useStateContext();
  const { t } = useLanguageContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/forgot-password`,
        {
          email: data.email,
        },
      );
      console.log(response.data);
      toast.success("OTP sent to your email!");
      setEmail(data.email);
      setState(6);
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
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
          <h3 className="text-[#212B36] text-xl sm:text-2xl lg:text-[32px] font-semibold lg:leading-12 text-center w-full">
            {t("forgot.title")}
          </h3>
          <p className="text-[#637381] text-sm sm:text-base leading-6 w-full">
            {t("forgot.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5 sm:gap-6 lg:gap-8"
        >
          {/* Email Input */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("forgot.emailPlaceholder")}
                  className="w-full border border-[#919EAB] rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-[#919EAB]"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
            <Button
              type="button"
              onClick={() => setState(4)}
              variant="secondary"
              className="flex-1 bg-[#DFE3E8] text-[#212B36] hover:bg-[#DFE3E8]/90 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 h-12 sm:h-14 text-sm sm:text-base font-semibold"
            >
              {t("forgot.back")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#122464] text-white hover:bg-[#122464]/90 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 h-12 sm:h-14 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? t("forgot.submitting") : t("forgot.submit")}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

export default ForgotPasswordDialogContent;
