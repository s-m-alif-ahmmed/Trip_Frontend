import Container from "../shared/Container";
import {
  CalenderIcon,
  LocationIcon1,
  LocationIcon2,
  SwitchIcon,
} from "@/assets/icons/icon";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { useStateContext } from "@/hooks/useStateContext";
import TripDetails from "./TripDetails";
import WarningSection from "./WarningSection";
import AvailableTripsSection from "./AvailableTripsSection";
import Pagination from "../shared/Pagination";
import TripCityInput, { type SelectedLocation } from "../shared/TripCityInput";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguageContext } from "@/hooks/useLanguageContext";

interface TripCity {
  city: string;
  country: string;
  countryCode: string;
}

interface Trip {
  id: number;
  departureCity: TripCity;
  arrivalCity: TripCity;
  weight: string;
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

const TripBookingSection = () => {
  const { t } = useLanguageContext();
  const [date, setDate] = useState<Date>();
  const [fromCity, setFromCity] = useState<SelectedLocation | null>(null);
  const [toCity, setToCity] = useState<SelectedLocation | null>(null);
  const [calenderPopOverOpen, setCalenderPopOverOpen] = useState(false);
  const [calenderSmallPopOverOpen, setCalenderSmallPopOverOpen] =
    useState(false);
  const { selectedTrip, setSelectedTrip } = useStateContext();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setCalenderPopOverOpen(false);
      setCalenderSmallPopOverOpen(false);
    }
  };

  const handleBackToSearch = () => {
    setSelectedTrip(null);
  };

  const handleSwitch = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isAvailableTripsPending, setIsAvailableTripsPending] = useState(true);
  const [isAvailableTripsError, setIsAvailableTripsError] = useState(false);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [activeQueryString, setActiveQueryString] = useState("");

  const fetchTrips = useCallback(async (page: number, queryString: string) => {
    const separator = queryString ? "&" : "";
    const url = `${import.meta.env.VITE_BASE_URL}/search/trip?page=${page}${separator}${queryString}`;
    setIsAvailableTripsPending(true);
    setIsAvailableTripsError(false);
    try {
      const response = await axios.get(url);
      setAvailableTrips(response.data?.data || []);
      setPagination(response.data?.pagination ?? null);
    } catch {
      setIsAvailableTripsError(true);
    } finally {
      setIsAvailableTripsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips(1, "");
  }, [fetchTrips]);

  const handleSearch = useCallback(async () => {
    const params = new URLSearchParams();

    if (fromCity) {
      params.set("departure_country", fromCity.country);
      params.set("departure_country_code", fromCity.countryCode);
      params.set("departure_city", fromCity.city);
    }

    if (toCity) {
      params.set("arrival_country", toCity.country);
      params.set("arrival_country_code", toCity.countryCode);
      params.set("arrival_city", toCity.city);
    }

    if (date) {
      params.set("date", format(date, "yyyy-MM-dd"));
    }

    const query = params.toString();
    setActiveQueryString(query);
    setIsPending(true);
    try {
      await fetchTrips(1, query);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while searching for trips. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }, [fromCity, toCity, date, fetchTrips]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchTrips(page, activeQueryString);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchTrips, activeQueryString],
  );

  return (
    <Container className="-mt-8 sm:-mt-10 lg:-mt-15.5">
      {selectedTrip ? (
        <div className="mb-10 sm:mb-14 lg:mb-20 relative z-20">
          <TripDetails
            selectedTrip={selectedTrip}
            onBack={handleBackToSearch}
          />
        </div>
      ) : (
        <>
          <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl shadow-sm relative z-20">
            {/* Mobile: Stacked layout */}
            <div className="flex flex-col lg:hidden gap-3">
              <div className="bg-[#F4F6F8] rounded-xl">
                <div className="px-4 sm:px-6 py-3 relative">
                  <TripCityInput
                    placeholder={t("booking.whereFrom")}
                    className="h-full"
                    icon={<LocationIcon1 className="w-5 h-5" />}
                    onSelect={setFromCity}
                    onClear={() => setFromCity(null)}
                    value={fromCity}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  className="p-1 bg-white rounded-full shadow-md cursor-pointer"
                  onClick={handleSwitch}
                >
                  <span className="p-2 bg-primary rounded-full block">
                    <SwitchIcon />
                  </span>
                </button>
              </div>

              <div className="bg-[#F4F6F8] rounded-xl">
                <div className="px-4 sm:px-6 py-3 relative">
                  <TripCityInput
                    placeholder={t("booking.whereTo")}
                    icon={<LocationIcon2 className="w-5 h-5" />}
                    onSelect={setToCity}
                    onClear={() => setToCity(null)}
                    value={toCity}
                  />
                </div>
              </div>

              <Popover
                open={calenderSmallPopOverOpen}
                onOpenChange={setCalenderSmallPopOverOpen}
              >
                <PopoverTrigger asChild>
                  <div className="bg-[#F4F6F8] rounded-xl px-4 sm:px-6 py-3 relative cursor-pointer flex items-center h-12 lg:h-auto">
                    <span
                      className={`flex-1 text-xs sm:text-sm ${
                        date
                          ? "text-[#212B36] font-semibold"
                          : "text-[#919EAB] font-normal"
                      }`}
                    >
                      {date ? format(date, "PPP") : t("booking.departureDate")}
                    </span>
                    <CalenderIcon className="absolute top-1/2 right-4 sm:right-6 -translate-y-1/2 pointer-events-none w-5 h-5 text-[#122464]" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button
                className="h-12 sm:h-13 lg:h-14 rounded-xl w-full"
                onClick={handleSearch}
                disabled={isPending}
              >
                {isPending
                  ? t("booking.searching") || "Searching..."
                  : t("booking.search")}
              </Button>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden lg:flex bg-[#F4F6F8] h-15 rounded-xl">
              <div className="relative flex-1 min-w-0">
                <TripCityInput
                  placeholder={t("booking.whereFrom")}
                  icon={<LocationIcon1 />}
                  onSelect={setFromCity}
                  onClear={() => setFromCity(null)}
                  value={fromCity}
                />
              </div>

              <div className="divider bg-[#DFE3E8] w-px shrink-0 relative">
                <button
                  className="p-1 bg-white rounded-full absolute z-30 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
                  onClick={handleSwitch}
                >
                  <span className="p-2 bg-primary rounded-full block">
                    <SwitchIcon className="size-4.5 xl:size-5" />
                  </span>
                </button>
              </div>

              <div className="relative flex-1 min-w-0">
                <TripCityInput
                  placeholder={t("booking.whereTo")}
                  icon={<LocationIcon2 />}
                  onSelect={setToCity}
                  onClear={() => setToCity(null)}
                  value={toCity}
                />
              </div>

              <div className="divider bg-[#DFE3E8] w-px shrink-0"></div>

              <Popover
                open={calenderPopOverOpen}
                onOpenChange={setCalenderPopOverOpen}
              >
                <PopoverTrigger asChild>
                  <div className="relative flex-1 min-w-0 cursor-pointer flex items-center">
                    <span
                      className={`px-5 xl:px-6 w-full text-xs lg:text-sm truncate ${
                        date
                          ? "text-[#212B36] font-semibold"
                          : "text-[#919EAB] font-normal"
                      }`}
                    >
                      {date ? format(date, "PPP") : t("booking.departureDate")}
                    </span>
                    <CalenderIcon className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none text-[#122464]" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>

              <Button
                className="min-w-40 xl:min-w-45 rounded-2xl rounded-l-none min-h-full"
                onClick={handleSearch}
                disabled={isPending}
              >
                {isPending
                  ? t("booking.searching") || "Searching..."
                  : t("booking.search")}
              </Button>
            </div>
          </div>
          <WarningSection />
          <AvailableTripsSection
            availableTrips={availableTrips}
            isAvailableTripsPending={isAvailableTripsPending}
            isAvailableTripsError={isAvailableTripsError}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};

export default TripBookingSection;
