"use client";

import { ArrowIcon, CalenderIcon, WatchIcon } from "@/assets/icons/icon";

type TripStatus = "Approved" | "Pending" | "Rejected";

interface TripOfferCardProps {
  departureCity: string;
  departureCountry: string;
  arrivalCity: string;
  arrivalCountry: string;
  status: TripStatus;
  onStatusChange?: (status: TripStatus) => void;
  date: string;
  weight: string;
  time: string;
}

const TripOfferCard: React.FC<TripOfferCardProps> = ({
  departureCity,
  departureCountry,
  arrivalCity,
  arrivalCountry,
  status,
  date,
  weight,
  time,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Approved":
        return "text-[#229A16] bg-[#E9FCD4]";
      case "Pending":
        return "text-[#B78103] bg-[#FFF8E1]";
      case "Rejected":
        return "text-[#B72136] bg-[#FFEBEE]";
      default:
        return "text-[#229A16] bg-[#E9FCD4]";
    }
  };

  return (
    <div className="bg-[#F9FAFB] border border-[#DFE3E8] flex flex-col gap-4 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-[0px_4px_8px_0px_rgba(191,191,191,0.08)]">
      {/* Route Row */}
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
          {/* Departure */}
          <div className="flex flex-col min-w-0">
            <p className="font-poppins text-xs sm:text-sm text-[#637381] leading-5 truncate">
              {departureCountry}
            </p>
            <p className="font-poppins font-semibold text-[#212B36] text-base sm:text-lg lg:text-xl leading-tight truncate">
              {departureCity}
            </p>
          </div>

          <ArrowIcon className="size-5 sm:size-6 lg:size-7 text-[#637381] shrink-0" />

          {/* Arrival */}
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

      {/* Divider */}
      <div className="h-px bg-[#DFE3E8] w-full" />

      {/* Date, Time, Weight Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <p className="font-poppins font-semibold text-[#212B36] text-sm sm:text-base leading-6">
          {weight}
        </p>
      </div>
    </div>
  );
};

export default TripOfferCard;
