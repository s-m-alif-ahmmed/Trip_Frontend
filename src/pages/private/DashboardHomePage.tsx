import React, { useState } from "react";
import BookingCard from "@/components/dashboard/BookingCard";
import TripOfferCard from "@/components/dashboard/TripOfferCard";
import ProposeNewTripDialog from "@/components/dialogs/ProposeNewTripDialog";
import Pagination from "@/components/shared/Pagination";
import { Plus } from "lucide-react";
import Container from "@/components/shared/Container";
import { useLanguageContext } from "@/hooks/useLanguageContext";
import useFetchData from "@/hooks/useFetchData";
import DashboardOverviewSection from "@/components/dashboard/DashboardOverviewSection";

type TripStatus = "Approved" | "Pending" | "Rejected";

interface CityInfo {
  city: string;
  country: string;
  countryCode: string;
}

interface ApiTrip {
  id: number;
  departureCity: CityInfo;
  arrivalCity: CityInfo;
  total_weight: number;
  available_weight: number;
  date: string;
  time: string;
  status: string;
}

interface ApiBookingTrip {
  id: number;
  departureCity: CityInfo;
  arrivalCity: CityInfo;
  date: string;
  time: string;
  status: string;
}

interface ApiBooking {
  id: number;
  booking_name: string;
  email: string;
  phone: string;
  address: string;
  pickup_address: string;
  weight: number;
  weight_price: number;
  service_fee: number;
  pickup_fee: number;
  total_paid: number;
  pickup_status: boolean;
  status: string;
  is_paid: boolean;
  created_at: string;
  trip: ApiBookingTrip;
}

interface TripOffer {
  id: number;
  departureCity: string;
  departureCountry: string;
  arrivalCity: string;
  arrivalCountry: string;
  status: TripStatus;
  date: string;
  weight: string;
  time: string;
}

const DashboardHomePage = () => {
  const [activeTab, setActiveTab] = useState<"bookings" | "offers">("bookings");
  const [isProposeDialogOpen, setIsProposeDialogOpen] = useState(false);
  const [tripsPage, setTripsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const { t } = useLanguageContext();
  const {
    data: tripsData,
    isPending: isTripsDataPending,
    isError: isTripsDataError,
  } = useFetchData(`/trips?page=${tripsPage}`, true);
  const {
    data: bookingData,
    isPending: isBookingDataPending,
    isError: isBookingDataError,
  } = useFetchData(`/user-bookings?page=${bookingsPage}`, true);

  const apiBookings: ApiBooking[] = bookingData?.data ?? [];
  const bookingsPagination = bookingData?.pagination;

  const mapStatus = (apiStatus: string): TripStatus => {
    switch (apiStatus?.toLowerCase()) {
      case "active":
      case "approved":
        return "Approved";
      case "rejected":
      case "inactive":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const apiTrips: ApiTrip[] = tripsData?.data ?? [];
  const tripsPagination = tripsData?.pagination;

  const [tripOfferOverrides, setTripOfferOverrides] = useState<
    Record<number, TripStatus>
  >({});

  const tripOffers: TripOffer[] = apiTrips.map((trip) => ({
    id: trip.id,
    departureCity: trip.departureCity.city,
    departureCountry: trip.departureCity.country,
    arrivalCity: trip.arrivalCity.city,
    arrivalCountry: trip.arrivalCity.country,
    status: tripOfferOverrides[trip.id] ?? mapStatus(trip.status),
    date: trip.date,
    weight: `${trip.available_weight} kg`,
    time: trip.time,
  }));

  const updateOfferStatus = (id: number, status: TripStatus) => {
    setTripOfferOverrides((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="">
      <Container className="">
        <div className="h-px bg-[#DFE3E8]" />

        <div className="pt-6 sm:pt-8 lg:pt-12 pb-10 sm:pb-14 lg:pb-20">
          <div className="mb-6 sm:mb-8 lg:mb-13">
            <h1 className="font-poppins font-semibold text-[#212B36] text-2xl sm:text-[28px] lg:text-[32px] leading-tight lg:leading-12 mb-2 sm:mb-3">
              {t("dashboard.title")}
            </h1>
            <p className="font-poppins font-normal text-[#637381] text-sm sm:text-base leading-6">
              {t("dashboard.subtitle")}
            </p>
          </div>

          <DashboardOverviewSection />

          <div className="bg-white border-2 border-[#DFE3E8] border-dashed rounded-xl sm:rounded-2xl lg:rounded-[20px] p-3 sm:p-4 lg:p-5">
            <div className="bg-[#F9FAFB] flex flex-col sm:flex-row items-stretch justify-between p-1 rounded-lg sm:rounded-xl mb-4 sm:mb-5 lg:mb-6 gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <button
                  className={`${
                    activeTab === "bookings"
                      ? "bg-[#122464] text-[#E7E9F0]"
                      : "bg-[#DFE3E8] text-[#122464]"
                  } font-poppins font-medium text-base sm:text-[17px] lg:text-lg px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors cursor-pointer text-center`}
                  onClick={() => setActiveTab("bookings")}
                >
                  {t("dashboard.myBookings")}
                </button>

                <button
                  className={`${
                    activeTab === "offers"
                      ? "bg-[#122464] text-[#E7E9F0]"
                      : "bg-[#DFE3E8] text-[#122464]"
                  } font-poppins font-medium text-base sm:text-[17px] lg:text-lg px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors cursor-pointer`}
                  onClick={() => setActiveTab("offers")}
                >
                  {t("dashboard.myTripOffers")}
                </button>
              </div>

              <button
                className="bg-[#122464] flex gap-2.5 items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg cursor-pointer"
                onClick={() => setIsProposeDialogOpen(true)}
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#E7E9F0]" />
                <span className="font-poppins font-semibold text-[#E7E9F0] text-base sm:text-[17px] lg:text-lg">
                  {t("dashboard.proposeNewTrip")}
                </span>
              </button>
            </div>

            {activeTab === "bookings" ? (
              isBookingDataError ? (
                <div className="flex justify-center items-center min-h-40 sm:min-h-52">
                  <p className="text-center text-red-400 text-sm sm:text-base font-medium">
                    {t("dashboard.bookings.error")}
                  </p>
                </div>
              ) : isBookingDataPending ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#F9FAFB] border border-[#DFE3E8] flex flex-col gap-4 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl animate-pulse"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="space-y-1.5">
                            <div className="h-3 w-16 bg-[#DFE3E8] rounded" />
                            <div className="h-5 w-24 bg-[#DFE3E8] rounded" />
                          </div>
                          <div className="h-4 w-4 bg-[#DFE3E8] rounded-full" />
                          <div className="space-y-1.5">
                            <div className="h-3 w-16 bg-[#DFE3E8] rounded" />
                            <div className="h-5 w-24 bg-[#DFE3E8] rounded" />
                          </div>
                        </div>
                        <div className="h-6 w-16 bg-[#DFE3E8] rounded-full" />
                      </div>
                      <div className="h-px bg-[#DFE3E8]" />
                      <div className="flex gap-5 items-center">
                        <div className="h-4 w-24 bg-[#DFE3E8] rounded" />
                        <div className="h-4 w-16 bg-[#DFE3E8] rounded" />
                      </div>
                      <div className="h-px bg-[#DFE3E8]" />
                      <div className="flex justify-between">
                        <div className="h-4 w-20 bg-[#DFE3E8] rounded" />
                        <div className="h-6 w-24 bg-[#DFE3E8] rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`transition-opacity duration-200 ${
                    isBookingDataPending ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                    {apiBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        departureCity={booking.trip.departureCity.city}
                        departureCountry={booking.trip.departureCity.country}
                        arrivalCity={booking.trip.arrivalCity.city}
                        arrivalCountry={booking.trip.arrivalCity.country}
                        status={booking.status}
                        date={booking.trip.date}
                        time={booking.trip.time}
                        weight={booking.weight}
                        totalPaid={booking.total_paid}
                        pickupStatus={booking.pickup_status}
                        isPaid={booking.is_paid}
                        bookerName={booking.booking_name}
                      />
                    ))}
                  </div>
                  {bookingsPagination && (
                    <Pagination
                      currentPage={bookingsPagination.current_page}
                      lastPage={bookingsPagination.last_page}
                      onPageChange={(page) => setBookingsPage(page)}
                    />
                  )}
                </div>
              )
            ) : isTripsDataError ? (
              <div className="flex justify-center items-center min-h-40 sm:min-h-52">
                <p className="text-center text-red-400 text-sm sm:text-base font-medium">
                  {t("dashboard.trips.error")}
                </p>
              </div>
            ) : isTripsDataPending ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#DFE3E8] p-4 sm:p-5 space-y-3 animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1.5">
                        <div className="h-3 w-16 bg-[#F4F6F8] rounded" />
                        <div className="h-5 w-24 bg-[#DFE3E8] rounded" />
                      </div>
                      <div className="h-4 w-4 bg-[#DFE3E8] rounded-full" />
                      <div className="space-y-1.5 text-right">
                        <div className="h-3 w-16 bg-[#F4F6F8] rounded ml-auto" />
                        <div className="h-5 w-24 bg-[#DFE3E8] rounded" />
                      </div>
                    </div>
                    <div className="h-px bg-[#DFE3E8]" />
                    <div className="flex items-center gap-3">
                      <div className="h-3.5 w-24 bg-[#F4F6F8] rounded" />
                      <div className="h-3.5 w-16 bg-[#F4F6F8] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`transition-opacity duration-200 ${
                  isTripsDataPending ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  {tripOffers.map((offer) => (
                    <TripOfferCard
                      key={offer.id}
                      {...offer}
                      onStatusChange={(status) =>
                        updateOfferStatus(offer.id, status)
                      }
                    />
                  ))}
                </div>

                {tripsPagination && (
                  <Pagination
                    currentPage={tripsPagination.current_page}
                    lastPage={tripsPagination.last_page}
                    onPageChange={(page) => setTripsPage(page)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
      <ProposeNewTripDialog
        open={isProposeDialogOpen}
        onOpenChange={setIsProposeDialogOpen}
      />
    </div>
  );
};

export default DashboardHomePage;
