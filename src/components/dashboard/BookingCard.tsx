import React from "react";
import { ArrowIcon, CalenderIcon, WatchIcon } from "@/assets/icons/icon";

interface BookingCardProps {
  departureCity: string;
  departureCountry: string;
  arrivalCity: string;
  arrivalCountry: string;
  status: string;
  date: string;
  time: string;
  weight: number;
  totalPaid: number;
  pickupStatus: boolean;
  isPaid: boolean;
  bookerName?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  departureCity,
  departureCountry,
  arrivalCity,
  arrivalCountry,
  status,
  date,
  time,
  weight,
  totalPaid,
  pickupStatus,
  isPaid,
  // bookerName,
}) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "confirm":
      case "approved":
        return "bg-[#E9FCD4] text-[#229A16]";
      case "pending":
        return "bg-[#FFF8E1] text-[#B78103]";
      case "cancelled":
      case "rejected":
        return "bg-[#FFEBEE] text-[#B72136]";
      default:
        return "bg-[#F4F6F8] text-[#637381]";
    }
  };

  return (
    <div className="bg-[#F9FAFB] border border-[#DFE3E8] flex flex-col gap-4 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-[0px_4px_8px_0px_rgba(191,191,191,0.08)]">
      {/* Route + Status */}
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
          <div className="flex flex-col min-w-0">
            <p className="font-poppins text-xs sm:text-sm text-[#637381] leading-5 truncate">
              {departureCountry}
            </p>
            <p className="font-poppins font-semibold text-[#212B36] text-base sm:text-lg lg:text-xl leading-tight truncate">
              {departureCity}
            </p>
          </div>
          <ArrowIcon className="size-5 sm:size-6 lg:size-7 text-[#637381] shrink-0" />
          <div className="flex flex-col min-w-0">
            <p className="font-poppins text-xs sm:text-sm text-[#637381] leading-5 truncate">
              {arrivalCountry}
            </p>
            <p className="font-poppins font-semibold text-[#212B36] text-base sm:text-lg lg:text-xl leading-tight truncate">
              {arrivalCity}
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full font-poppins font-semibold text-xs sm:text-sm leading-5 shrink-0 ${getStatusStyles()}`}
        >
          {status}
        </span>
      </div>

      <div className="h-px bg-[#DFE3E8] w-full" />

      {/* Booker name */}
      {/* <p className="font-poppins text-xs sm:text-sm text-[#637381] leading-5">
        <span className="font-semibold text-[#212B36]">{bookerName}</span>
      </p> */}

      {/* Date & Time */}
      <div className="flex flex-wrap gap-3 sm:gap-5 items-center">
        <div className="flex gap-2 items-center">
          <CalenderIcon className="size-4 sm:size-5 text-[#122464]" />
          <p className="font-poppins font-medium text-[#122464] text-sm sm:text-base leading-6">
            {date}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <WatchIcon className="size-4 sm:size-5 text-[#637381]" />
          <p className="font-poppins text-[#637381] text-sm sm:text-base leading-6">
            {time}
          </p>
        </div>
      </div>

      {/* Weight + Badges + Total */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="bg-[#F4F6F8] border border-[#DFE3E8] rounded-full px-2.5 py-1 font-poppins text-xs sm:text-sm text-[#637381] font-medium">
            {weight} kg
          </span>
          {pickupStatus && (
            <span className="bg-[#E7E9F0] border border-[#122464]/20 rounded-full px-2.5 py-1 font-poppins text-xs sm:text-sm text-[#122464] font-medium">
              Pickup
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-1 font-poppins text-xs sm:text-sm font-medium ${
              isPaid
                ? "bg-[#E9FCD4] text-[#229A16]"
                : "bg-[#FFEBEE] text-[#B72136]"
            }`}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>
        <p className="font-poppins font-semibold text-[#122464] text-xl sm:text-2xl leading-9">
          {totalPaid.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
