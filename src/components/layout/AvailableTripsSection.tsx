"use client";

import { ArrowIcon, CalenderIcon, WatchIcon } from "@/assets/icons/icon";
import { useStateContext } from "@/hooks/useStateContext";
import { useLanguageContext } from "@/hooks/useLanguageContext";
import Pagination from "@/components/shared/Pagination";

interface TripCity {
  city: string;
  country: string;
  countryCode: string;
}

interface Trip {
  id: number;
  departureCity: TripCity;
  arrivalCity: TripCity;
  available_weight: string;
  date: string;
  time: string;
  price_per_kg: number | null;
  status: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
}

const AvailableTripsSection = ({
  availableTrips,
  isAvailableTripsPending,
  isAvailableTripsError,
  pagination,
  onPageChange,
}: {
  availableTrips: Trip[];
  isAvailableTripsPending: boolean;
  isAvailableTripsError: boolean;
  pagination?: PaginationData | null;
  onPageChange?: (page: number) => void;
}) => {
  const { setSelectedTrip } = useStateContext();
  const { t } = useLanguageContext();

  if (isAvailableTripsPending) {
    return (
      <div className="bg-white border border-dashed p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl min-h-40 sm:min-h-62.5 flex flex-col justify-center items-center mb-10 sm:mb-14 lg:mb-20">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-[#122464] border-t-transparent animate-spin" />
          <p className="text-[#637381] text-sm sm:text-base font-medium">
            {t("trips.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isAvailableTripsError) {
    return (
      <div className="bg-white border border-dashed p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl min-h-40 sm:min-h-62.5 flex flex-col justify-center items-center mb-10 sm:mb-14 lg:mb-20">
        <p className="text-center text-red-400 text-base sm:text-lg font-medium">
          {t("trips.error")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-dashed p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl min-h-40 sm:min-h-62.5 flex flex-col justify-center items-center mb-10 sm:mb-14 lg:mb-20">
      {availableTrips.length > 0 ? (
        <section className="w-full space-y-6">
          <p className="text-[#212B36] text-xl font-medium">
            {t("trips.available")}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 w-full">
            {availableTrips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTrip(trip.id)}
                className="bg-[#F9FAFB] border border-[#DFE3E8] flex flex-col gap-4 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-[0px_4px_8px_0px_rgba(191,191,191,0.08)] text-[#212B36] cursor-pointer hover:scale-102 transition-all duration-500 text-left"
              >
                {/* Route */}
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <p className="font-poppins text-xs sm:text-sm text-[#637381] leading-5 truncate">
                        {trip.departureCity.country}
                      </p>
                      <p className="font-poppins font-semibold text-[#212B36] text-base sm:text-lg lg:text-xl leading-tight truncate">
                        {trip.departureCity.city}
                      </p>
                    </div>
                    <ArrowIcon className="size-5 sm:size-6 lg:size-7 text-[#637381] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <p className="font-poppins text-xs sm:text-sm text-[#637381] leading-5 truncate">
                        {trip.arrivalCity.country}
                      </p>
                      <p className="font-poppins font-semibold text-[#212B36] text-base sm:text-lg lg:text-xl leading-tight truncate">
                        {trip.arrivalCity.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#DFE3E8] w-full" />

                {/* Date & Time */}
                <div className="flex flex-wrap gap-3 sm:gap-5 items-center justify-between">
                  <div className="flex flex-wrap gap-3 sm:gap-5 items-center">
                    <div className="flex gap-2 items-center">
                      <CalenderIcon className="size-4 sm:size-5 text-[#122464]" />
                      <p className="font-poppins font-medium text-[#122464] text-sm sm:text-base leading-6">
                        {trip.date}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <WatchIcon className="size-4 sm:size-5 text-[#637381]" />
                      <p className="font-poppins text-[#637381] text-sm sm:text-base leading-6">
                        {trip.time}
                      </p>
                    </div>
                  </div>

                  {/* Weight + Price */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-[#F4F6F8] border border-[#DFE3E8] rounded-full px-2.5 py-1 font-poppins text-xs sm:text-sm text-[#637381] font-medium">
                      {t("trips.available.kg")} {trip.available_weight} kg
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center text-[#C4CDD5] text-base sm:text-lg lg:text-xl font-medium">
          {t("trips.noResults")}
        </p>
      )}
      {pagination && onPageChange && (
        <div
          className={`w-full transition-opacity duration-200 ${
            isAvailableTripsPending ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AvailableTripsSection;
