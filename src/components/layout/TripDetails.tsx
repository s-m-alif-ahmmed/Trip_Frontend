import {
  ArrowIcon,
  CalenderIcon,
  WatchIcon,
  LocationBigIcon,
} from "@/assets/icons/icon";
import { Button } from "../ui/button";
import { ChevronLeft, Plus, Minus, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useLanguageContext } from "@/hooks/useLanguageContext";
import useFetchData from "@/hooks/useFetchData";
import { useStateContext } from "@/hooks/useStateContext";
import axios from "axios";
import toast from "react-hot-toast";

const userInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  pickupAddress: z.string().optional(),
});

interface CityInfo {
  city: string;
  country: string;
  countryCode: string;
}

interface Trip {
  id: number;
  departureCity: CityInfo;
  arrivalCity: CityInfo;
  available_weight: string;
  date: string;
  time: string;
  status: string;
  price_per_kg?: number;
}

interface TripDetailsProps {
  selectedTrip: number;
  onBack?: () => void;
}

const TripDetails = ({ selectedTrip, onBack }: TripDetailsProps) => {
  const { t } = useLanguageContext();
  const { priceManageData } = useStateContext();
  const priceData = priceManageData?.data;
  const [weight, setWeight] = useState(0);
  const [extraBaggage, setExtraBaggage] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading } = useFetchData(`/search/trip/show/${selectedTrip}`);

  const trip: Trip | undefined = data?.data?.trip;
  const matchingTrips: Trip[] = data?.data?.matching_trips ?? [];

  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const watchedAddress = useWatch({ control: form.control, name: "address" });

  useEffect(() => {
    if (useSameAddress) {
      form.setValue("pickupAddress", watchedAddress, { shouldValidate: true });
    }
  }, [watchedAddress, useSameAddress, form]);

  const allDates = trip
    ? [trip, ...matchingTrips].map((t) => ({
        id: t.id,
        date: t.date,
        available: parseFloat(t.available_weight),
        time: t.time,
      }))
    : [];

  const pricePerKg = parseFloat(priceData?.weight_per_kg_price ?? "0");
  const basePrice = Math.max(pricePerKg * weight, 10);
  const serviceFee = parseFloat(priceData?.service_fee ?? "0");
  const totalServiceFee = serviceFee * weight;
  const pickupFee = parseFloat(priceData?.pickup_fee ?? "0");
  const extraBaggageFee = extraBaggage ? pickupFee : 0;
  const totalPrice = basePrice + totalServiceFee + extraBaggageFee;

  const handleIncrement = () => {
    const maxWeight = parseFloat(trip?.available_weight ?? "0");
    if (!maxWeight || weight < maxWeight) {
      setWeight(weight + 1);
    }
  };

  const handleDecrement = () => {
    if (weight > 0) {
      setWeight(weight - 1);
    }
  };

  const onSubmit = async (data: z.infer<typeof userInfoSchema>) => {
    if (extraBaggage && !data.pickupAddress?.trim()) {
      form.setError("pickupAddress", {
        type: "manual",
        message: "Pickup address is required when pickup service is selected",
      });
      return;
    }

    const selectedTripDate = allDates[selectedDate];

    const payload = {
      trip_id: selectedTripDate?.id,
      date: selectedTripDate?.date,
      time: selectedTripDate?.time,
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phone,
      address: data.address,
      pickup_address: data.pickupAddress ?? "",
      weight,
      pickup_service_status: extraBaggage ? 1 : 0,
    };

    const token = localStorage.getItem("token");

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/booking`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(
        response.data?.message ?? "Booking submitted successfully!",
      );
      console.log(response.data);
      if (response.data?.data?.payment_url) {
        window.location.assign(response.data.data.payment_url);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex items-center justify-center min-h-64">
        <span className="text-[#637381] text-base">
          Loading trip details...
        </span>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col gap-4 items-center justify-center min-h-64">
        <span className="text-[#637381] text-base">Trip not found.</span>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#637381] hover:text-[#212B36] transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-5" />
          <span className="font-medium text-base">
            {t("tripDetails.backToHome")}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5 lg:gap-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 sm:gap-3 text-[#637381] hover:text-[#212B36] transition-colors w-fit cursor-pointer"
      >
        <ChevronLeft className="size-6 sm:size-7 lg:size-8" />
        <span className="font-medium text-base sm:text-lg lg:text-[20px] leading-7">
          {t("tripDetails.backToHome")}
        </span>
      </button>

      <div className="bg-[#122464] border border-[#DFE3E8] rounded-xl sm:rounded-tl-2xl sm:rounded-tr-2xl sm:rounded-bl-sm sm:rounded-br-sm shadow-[0px_4px_8px_0px_rgba(191,191,191,0.08)] p-4 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
            <LocationBigIcon className="hidden sm:block" />
            <span className="font-semibold text-xl sm:text-2xl lg:text-[32px] lg:leading-12 text-white">
              {trip.departureCity.city}, {trip.departureCity.country}
            </span>
            <ArrowIcon className="size-5 sm:size-6 lg:size-8 text-[#B6BBCF]" />
            <span className="font-semibold text-xl sm:text-2xl lg:text-[32px] lg:leading-12 text-white">
              {trip.arrivalCity.city}, {trip.arrivalCity.country}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <CalenderIcon className="size-5 sm:size-6 text-white" />
            <span className="font-medium text-base sm:text-lg lg:text-xl lg:leading-7.5 text-white">
              {trip.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WatchIcon className="size-4 sm:size-5 text-[#B6BBCF]" />
            <span className="text-sm sm:text-base leading-6 text-[#B6BBCF]">
              {trip.time}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <h3 className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
          {t("tripDetails.date")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {allDates.map((dateItem, index) => {
            return (
              <button
                key={dateItem.id}
                onClick={() => setSelectedDate(index)}
                className={`border rounded-lg sm:rounded-xl px-4 sm:px-5 lg:px-6 py-3 sm:py-4 flex flex-col gap-2 sm:gap-3 text-left transition-colors cursor-pointer ${
                  selectedDate === index
                    ? "bg-[#E7E9F0] border-[#122464]"
                    : "bg-[#F4F6F8] border-[#DFE3E8]"
                }`}
              >
                <p
                  className={`font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 ${
                    selectedDate === index ? "text-[#080F2A]" : "text-[#212B36]"
                  }`}
                >
                  {dateItem.date}
                </p>
                <p className="text-sm sm:text-[16px] leading-6 text-[#637381]">
                  {`${dateItem.available < 10 ? "0" : ""}${dateItem.available}`}{" "}
                  {t("tripDetails.kgAvailable")}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row xl:flex-row lg:justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-4 sm:gap-5 lg:flex-1">
          <h3 className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
            {t("tripDetails.additionalOptions")}
          </h3>
          <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4">
            <div
              className="bg-[#F4F6F8] border border-[#DFE3E8] rounded-lg sm:rounded-xl px-4 sm:px-5 lg:px-6 py-3 sm:py-4 flex items-center gap-3 w-full sm:w-auto lg:w-full xl:w-90"
              onClick={() => {
                setExtraBaggage((prev) => {
                  if (prev) setUseSameAddress(false);
                  return !prev;
                });
              }}
            >
              <Checkbox
                checked={extraBaggage}
                className="border-2 border-[#637381] size-4 sm:size-5"
              />
              <span className="flex-1 font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
                {t("tripDetails.pickupService")}
              </span>
              <span className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
                +€{pickupFee}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 lg:flex-2">
          <h3 className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
            {t("tripDetails.enterWeight")}
          </h3>
          <div className="flex gap-3 sm:gap-4 grow lg:max-w-2/3">
            <button
              onClick={handleDecrement}
              disabled={weight < 1}
              className="bg-[#F4F6F8] border border-[#DFE3E8] rounded-lg p-2 sm:p-3 hover:bg-[#E7E9F0] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed aspect-square flex items-center justify-center"
            >
              <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-[#919EAB]" />
            </button>
            <Input
              type="number"
              step="any"
              min="1"
              value={weight}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setWeight(0);
                  return;
                }
                const value = parseFloat(raw);
                const maxWeight = parseFloat(trip?.available_weight ?? "0");
                if (
                  !isNaN(value) &&
                  value >= 1 &&
                  (!maxWeight || value <= maxWeight)
                ) {
                  setWeight(Number(value.toFixed(2)));
                }
              }}
              className="font-semibold text-xl md:text-2xl lg:text-xl 2xl:text-2xl lg:leading-9 text-[#080F2A] text-center bg-transparent p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-16 sm:min-w-20 border border-[#DFE3E8]"
            />
            <button
              onClick={handleIncrement}
              disabled={
                parseFloat(trip?.available_weight ?? "0")
                  ? weight >= parseFloat(trip?.available_weight ?? "0")
                  : false
              }
              className="bg-[#F4F6F8] border border-[#DFE3E8] rounded-lg p-2 sm:p-3 hover:bg-[#E7E9F0] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed aspect-square flex items-center justify-center"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#080F2A]" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#F4F6F8] rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col gap-5 sm:gap-6 lg:gap-8">
        <h3 className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
          {t("tripDetails.priceBreakdown")}
        </h3>
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-[16px] leading-6 text-[#637381]">
              {t("tripDetails.basePrice")}{" "}
            </span>
            <span className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
              €{basePrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-[16px] leading-6 text-[#637381]">
              {t("tripDetails.serviceFee")}{" "}
            </span>
            <span className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
              €{totalServiceFee.toFixed(2)}
            </span>
          </div>

          {extraBaggage && (
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-[16px] leading-6 text-[#637381]">
                {t("tripDetails.pickupService")}{" "}
              </span>
              <span className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
                €{pickupFee}
              </span>
            </div>
          )}

          <div className="h-px bg-[#DFE3E8]"></div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm sm:text-[16px] leading-6 text-[#212B36]">
              {t("tripDetails.total")}
            </span>
            <span className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
              €{totalPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#DFE3E8]"></div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-[#F9FAFB] border border-dashed border-[#DFE3E8] rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col gap-5 sm:gap-6 lg:gap-8">
          <h3 className="font-medium text-base sm:text-lg lg:text-[20px] lg:leading-7.5 text-[#212B36]">
            {t("tripDetails.yourInfo")}
          </h3>

          <FieldGroup className="flex flex-col gap-4 sm:gap-5">
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-sm sm:text-[16px] leading-6 text-[#637381]">
                    {t("tripDetails.fullName")}
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder={t("tripDetails.fullNamePlaceholder")}
                    className="border-[#DFE3E8] rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[16px] leading-6 placeholder:text-[#919EAB]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm sm:text-[16px] leading-6 text-[#637381]">
                      {t("tripDetails.email")}
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("tripDetails.emailPlaceholder")}
                      className="border-[#DFE3E8] rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[16px] leading-6 placeholder:text-[#919EAB]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm sm:text-[16px] leading-6 text-[#637381]">
                      {t("tripDetails.phone")}
                    </FieldLabel>
                    <Input
                      {...field}
                      type="tel"
                      placeholder={t("tripDetails.phonePlaceholder")}
                      className="border-[#DFE3E8] rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[16px] leading-6 placeholder:text-[#919EAB]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-sm sm:text-[16px] leading-6 text-[#637381]">
                    {t("tripDetails.address")}
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder={t("tripDetails.addressPlaceholder")}
                    className="border-[#DFE3E8] rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[16px] leading-6 placeholder:text-[#919EAB]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {extraBaggage && (
              <Controller
                name="pickupAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm sm:text-[16px] leading-6 text-[#637381]">
                      {t("tripDetails.pickupAddress")}
                    </FieldLabel>
                    <div className="flex items-center gap-2 mb-2 w-fit">
                      <Checkbox
                        checked={useSameAddress}
                        onCheckedChange={(checked) => {
                          const next = checked === true;
                          setUseSameAddress(next);
                          if (next) {
                            form.setValue(
                              "pickupAddress",
                              form.getValues("address"),
                              { shouldValidate: true },
                            );
                          }
                        }}
                        className="border-2 border-[#637381] size-3.5! sm:size-3.5! lg:size-3.5! cursor-pointer"
                      />
                      <span
                        className="text-xs font-medium text-[#637381] select-none cursor-pointer"
                        onClick={() => {
                          const next = !useSameAddress;
                          setUseSameAddress(next);
                          if (next) {
                            form.setValue(
                              "pickupAddress",
                              form.getValues("address"),
                              { shouldValidate: true },
                            );
                          }
                        }}
                      >
                        {t("tripDetails.useSameAddress")}
                      </span>
                    </div>
                    <Input
                      {...field}
                      disabled={useSameAddress}
                      placeholder={t("tripDetails.pickupAddressPlaceholder")}
                      className="border-[#DFE3E8] rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[16px] leading-6 placeholder:text-[#919EAB] disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#122464] hover:bg-[#122464]/90 text-white rounded-lg sm:rounded-xl h-12 sm:h-14 lg:h-14.5 px-4 sm:px-6 py-3 sm:py-4 w-full font-semibold text-sm sm:text-[16px] leading-6 mt-4 sm:mt-5 lg:mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader className="animate-spin size-4 mx-auto" />
          ) : (
            t("tripDetails.proceedToPayment")
          )}
        </Button>
      </form>
    </div>
  );
};

export default TripDetails;
