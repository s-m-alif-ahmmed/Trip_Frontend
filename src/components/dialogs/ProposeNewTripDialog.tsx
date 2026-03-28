"use client";

import React, { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CalendarIcon, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CloseIcon } from "@/assets/icons/icon";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import DialogCityInput, {
  type SelectedLocation,
} from "@/components/shared/DialogCityInput";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguageContext } from "@/hooks/useLanguageContext";
import { useQueryClient } from "@tanstack/react-query";

// --- Schema ----------------------------------------------------------------
const locationSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  countryCode: z.string(),
  lat: z.number(),
  lon: z.number(),
  displayName: z.string(),
});

const formSchema = z.object({
  slots: z
    .array(
      z.object({
        departureCity: locationSchema,
        weight: z.string().min(1, "Weight is required"),
        date: z.string().min(1, "Date is required"),
        time: z.string().min(1, "Time is required"),
        arrivalCity: locationSchema,
      }),
    )
    .min(1),
});

type FormValues = z.infer<typeof formSchema>;

// --- Helpers ---------------------------------------------------------------
const emptyLocation: SelectedLocation = {
  city: "",
  country: "",
  countryCode: "",
  lat: 0,
  lon: 0,
  displayName: "",
};

const emptySlot = {
  departureCity: emptyLocation,
  weight: "",
  date: "",
  time: "",
  arrivalCity: emptyLocation,
};

interface ProposeNewTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputCls =
  "w-full border border-[#DFE3E8] rounded-xl px-5 py-4 text-sm sm:text-base placeholder:text-[#919EAB] text-[#212B36] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#122464] h-14";

// --- Content ---------------------------------------------------------------
const ProposeNewTripDialogContent: React.FC<
  Pick<ProposeNewTripDialogProps, "onOpenChange">
> = ({ onOpenChange }) => {
  const { t } = useLanguageContext();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slots: [{ ...emptySlot }],
    },
  });

  const queryClient = useQueryClient();

  const {
    fields: slotFields,
    append: appendSlot,
    remove: removeSlot,
  } = useFieldArray({ control: form.control, name: "slots" });

  // One controlled calendar-open state per slot
  const [openCalendars, setOpenCalendars] = useState<boolean[]>([false]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [openMultiDateCalendar, setOpenMultiDateCalendar] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const timeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Tracks whether each slot's native time picker is open (ref avoids stale closure)
  const timeOpenRef = useRef<boolean[]>([false]);

  function handleOpenPicker(index: number) {
    const input = timeInputRefs.current[index];
    if (!input) return;
    if (timeOpenRef.current[index]) {
      // Already open � close it
      timeOpenRef.current[index] = false;
      input.blur();
    } else {
      // Closed � open it
      timeOpenRef.current[index] = true;
      input.focus();
      if (input.showPicker) {
        input.showPicker();
      } else {
        input.click();
      }
    }
  }

  const watchedSlots = useWatch({ control: form.control, name: "slots" });

  function toggleCalendar(index: number, open: boolean) {
    setOpenCalendars((prev) => {
      const next = [...prev];
      next[index] = open;
      return next;
    });
  }

  function handleAddSlot() {
    const lastSlot = watchedSlots[watchedSlots.length - 1];
    const prefillDeparture = lastSlot?.arrivalCity?.city
      ? lastSlot.arrivalCity
      : emptyLocation;

    appendSlot({ ...emptySlot, departureCity: prefillDeparture });
    setOpenCalendars((prev) => [...prev, false]);
    timeOpenRef.current = [...timeOpenRef.current, false];
  }

  function handleRemoveSlot(index: number) {
    removeSlot(index);
    setOpenCalendars((prev) => prev.filter((_, i) => i !== index));
    timeOpenRef.current = timeOpenRef.current.filter((_, i) => i !== index);
  }

  async function onSubmit(data: FormValues) {
    // Build base batch (original slots as-is)
    const batches: { slots: typeof data.slots }[] = [{ slots: data.slots }];

    // For each availableDate, replicate slots with dates offset from the base date
    if (availableDates.length > 0) {
      const baseDate = data.slots[0]?.date
        ? new Date(data.slots[0].date)
        : new Date();

      availableDates.forEach((availDate) => {
        const newBase = new Date(availDate);
        const replicatedSlots = data.slots.map((slot) => {
          const slotDate = slot.date ? new Date(slot.date) : baseDate;
          const offset = differenceInDays(slotDate, baseDate);
          return {
            ...slot,
            date: format(addDays(newBase, offset), "yyyy-MM-dd"),
          };
        });
        batches.push({ slots: replicatedSlots });
      });
    }

    // Flatten all batches into a single array in the required format
    const payload = batches.flatMap(({ slots }) =>
      slots.map((slot) => ({
        departureCity: {
          city: slot.departureCity.city,
          country: slot.departureCity.country,
          countryCode: slot.departureCity.countryCode,
        },
        weight: slot.weight,
        date: slot.date,
        time: slot.time,
        arrivalCity: {
          city: slot.arrivalCity.city,
          country: slot.arrivalCity.country,
          countryCode: slot.arrivalCity.countryCode,
        },
      })),
    );

    console.log("Payload to POST:", payload);

    try {
      setIsPending(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/trips`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(response?.data?.message ?? "Trip proposed successfully!");
      queryClient.invalidateQueries({ queryKey: ["/trips?page=1"] });
      form.reset();
      setAvailableDates([]);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to propose trip. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="border border-[rgba(92,133,255,0.5)] rounded-2xl sm:rounded-3xl lg:rounded-4xl px-5 sm:px-10 lg:px-20 py-8 sm:py-12 lg:py-16 w-full max-w-[calc(100%-2rem)] sm:max-w-140 lg:max-w-200 bg-white shadow-xl max-h-[90vh] overflow-y-auto"
    >
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-3 sm:right-4 top-3 sm:top-4 size-8 sm:size-10 rounded-full bg-[#212B36] hover:bg-[#212B36]/90 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Close dialog"
      >
        <CloseIcon />
      </button>

      <div className="flex flex-col gap-6 sm:gap-8 font-poppins">
        {/* Heading */}
        <div>
          <h3 className="text-[#212B36] text-2xl sm:text-3xl lg:text-[32px] font-bold lg:leading-12">
            {t("propose.title")}
          </h3>
          <p className="text-[#637381] text-sm sm:text-base leading-6 mt-1">
            {t("propose.subtitle")}
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 sm:gap-8"
        >
          <div className="flex flex-col">
            {slotFields.map((slotField, index) => (
              <div key={slotField.id}>
                <div className="flex flex-col gap-4">
                  {/* Slot header */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-[#212B36] text-base sm:text-lg font-semibold">
                      {t("propose.trip")} {index + 1}
                    </h4>
                    {index > 0 && (
                      <div className="">
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(index)}
                          className="size-full flex items-center justify-center bg-[#fb2c36]/5 hover:bg-[#fb2c36]/10 rounded-sm p-2 transition-colors cursor-pointer"
                        >
                          <Trash className="size-5 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Departure City */}
                  <Controller
                    name={`slots.${index}.departureCity`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <DialogCityInput
                        placeholder={t("propose.departurePlaceholder")}
                        onSelect={(loc) => field.onChange(loc)}
                        hasError={!!fieldState.error}
                        value={
                          index > 0
                            ? watchedSlots[index - 1]?.arrivalCity
                            : undefined
                        }
                        disabled={index > 0}
                      />
                    )}
                  />

                  {/* Available Weight */}
                  <div className="flex gap-3 sm:gap-4">
                    <Controller
                      name={`slots.${index}.weight`}
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t("propose.weightPlaceholder")}
                          className={`${inputCls} flex-1`}
                        />
                      )}
                    />
                  </div>

                  {/* Date + Time */}
                  <div className="flex gap-3 sm:gap-4">
                    <Controller
                      name={`slots.${index}.date`}
                      control={form.control}
                      render={({ field }) => (
                        <Popover
                          open={openCalendars[index] ?? false}
                          onOpenChange={(open) => toggleCalendar(index, open)}
                        >
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                inputCls,
                                "flex items-center justify-between flex-1 text-left",
                                !field.value && "text-[#919EAB]",
                              )}
                            >
                              {field.value
                                ? format(new Date(field.value), "PPP")
                                : t("propose.datePlaceholder")}
                              <CalendarIcon className="w-5 h-5 text-[#919EAB]" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              disabled={{ before: new Date() }}
                              onSelect={(date) => {
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd") : "",
                                );
                                toggleCalendar(index, false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    <Controller
                      name={`slots.${index}.time`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="relative flex-1">
                          <Input
                            {...field}
                            ref={(el) => {
                              timeInputRefs.current[index] = el;
                            }}
                            type="time"
                            placeholder="Time"
                            className={cn(inputCls, "pr-14")}
                            onBlur={() => {
                              timeOpenRef.current[index] = false;
                            }}
                          />
                          <Clock
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#919EAB] cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleOpenPicker(index)}
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* Arrival City */}
                  <Controller
                    name={`slots.${index}.arrivalCity`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <DialogCityInput
                        placeholder={t("propose.arrivalPlaceholder")}
                        onSelect={(loc) => field.onChange(loc)}
                        hasError={!!fieldState.error}
                      />
                    )}
                  />
                </div>

                {/* Divider between slots */}
                {index < slotFields.length - 1 && (
                  <div className="h-px bg-[#DFE3E8] mt-8 mb-4" />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSlot}
              className="w-full h-14 mt-5 bg-[#122464] hover:bg-[#122464]/90 rounded-xl flex items-center justify-center gap-2 text-white font-semibold text-base transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              {t("propose.add")}
            </button>
          </div>

          {/* Available Multiple dates */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[#212B36] text-base sm:text-lg font-semibold">
                {t("propose.availableDates")}
              </h4>
              <Popover
                open={openMultiDateCalendar}
                onOpenChange={setOpenMultiDateCalendar}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 h-10 px-4 bg-[#122464] hover:bg-[#122464]/90 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {t("propose.addDate")}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    disabled={{ before: new Date() }}
                    onSelect={(date) => {
                      if (!date) return;
                      const formatted = format(date, "yyyy-MM-dd");
                      setAvailableDates((prev) =>
                        prev.includes(formatted) ? prev : [...prev, formatted],
                      );
                      setOpenMultiDateCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {availableDates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableDates.map((d) => (
                  <div
                    key={d}
                    className="flex items-center gap-2 px-3 py-2 bg-[#F4F6F8] border border-[#DFE3E8] rounded-lg text-sm text-[#212B36]"
                  >
                    <CalendarIcon className="w-4 h-4 text-[#637381]" />
                    {format(new Date(d), "MMM d, yyyy")}
                    <button
                      type="button"
                      onClick={() =>
                        setAvailableDates((prev) => prev.filter((x) => x !== d))
                      }
                      className="text-[#637381] hover:text-red-500 transition-colors cursor-pointer ml-1"
                      aria-label={`Remove ${d}`}
                    >
                      �
                    </button>
                  </div>
                ))}
              </div>
            )}

            {availableDates.length === 0 && (
              <p className="text-sm text-[#919EAB]">{t("propose.noDates")}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-14 bg-[#F4F6F8] text-[#212B36] rounded-xl font-semibold text-base hover:bg-[#DFE3E8]"
              variant="noStyle"
            >
              {t("propose.back")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-14 bg-[#122464] text-white rounded-xl font-semibold text-base hover:bg-[#122464]/90 disabled:opacity-70 disabled:cursor-not-allowed"
              variant="noStyle"
            >
              {isPending ? t("propose.submitting") : t("propose.submit")}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

const ProposeNewTripDialog: React.FC<ProposeNewTripDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ProposeNewTripDialogContent onOpenChange={onOpenChange} />
    </Dialog>
  );
};

export default ProposeNewTripDialog;
