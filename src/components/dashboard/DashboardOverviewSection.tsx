"use client";

import useFetchData from "@/hooks/useFetchData";
import { useLanguageContext } from "@/hooks/useLanguageContext";
import { Package, PackageCheck, Plane, CircleDollarSign } from "lucide-react";

interface OverviewData {
  total_available_weight: number;
  total_weight: number;
  total_active_trips: number;
  total_revenue: number;
}

const DashboardOverviewSection = () => {
  const { data, isPending, isError } = useFetchData(
    `/dashboard/overview`,
    true,
  );
  const { t } = useLanguageContext();

  const overview: OverviewData | null = data?.data ?? null;

  const stats = overview
    ? [
        {
          label: t("dashboard.overview.totalWeight"),
          value: overview.total_weight.toLocaleString() + " kg",
          icon: Package,
          iconBg: "bg-[#E8F4FD]",
          iconColor: "text-[#1890FF]",
          accent: "border-l-[#1890FF]",
        },
        {
          label: t("dashboard.overview.availableWeight"),
          value: overview.total_available_weight.toLocaleString() + " kg",
          icon: PackageCheck,
          iconBg: "bg-[#E9FCD4]",
          iconColor: "text-[#229A16]",
          accent: "border-l-[#229A16]",
        },
        {
          label: t("dashboard.overview.activeTrips"),
          value: overview.total_active_trips.toLocaleString(),
          icon: Plane,
          iconBg: "bg-[#EEF2FF]",
          iconColor: "text-[#122464]",
          accent: "border-l-[#122464]",
        },
        {
          label: t("dashboard.overview.totalRevenue"),
          value: `€ ${overview.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: CircleDollarSign,
          iconBg: "bg-[#FFF8E1]",
          iconColor: "text-[#B78103]",
          accent: "border-l-[#B78103]",
        },
      ]
    : [];

  if (isError) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8 lg:mb-10">
      {isPending
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#DFE3E8] rounded-xl sm:rounded-2xl p-4 sm:p-5 border-l-4 border-l-[#DFE3E8] animate-pulse"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="h-4 w-28 bg-[#DFE3E8] rounded" />
                <div className="size-10 bg-[#F4F6F8] rounded-xl" />
              </div>
              <div className="h-7 w-20 bg-[#DFE3E8] rounded" />
            </div>
          ))
        : stats.map(
            ({ label, value, icon: Icon, iconBg, iconColor, accent }) => (
              <div
                key={label}
                className={`bg-white border border-[#DFE3E8] rounded-xl sm:rounded-2xl p-4 sm:p-5 border-l-4 ${accent} shadow-[0px_4px_8px_0px_rgba(191,191,191,0.08)] flex flex-col gap-3 sm:gap-4`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-poppins text-xs sm:text-sm text-[#637381] leading-5 font-medium">
                    {label}
                  </p>
                  <div
                    className={`${iconBg} ${iconColor} size-10 sm:size-11 rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <Icon className="size-5 sm:size-5.5" strokeWidth={1.75} />
                  </div>
                </div>
                <p className="font-poppins font-bold text-[#212B36] text-xl sm:text-2xl lg:text-[28px] leading-tight">
                  {value}
                </p>
              </div>
            ),
          )}
    </div>
  );
};

export default DashboardOverviewSection;
