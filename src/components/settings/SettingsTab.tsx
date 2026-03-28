"use client";

import { cn } from "@/lib/utils";

export interface SettingsTabItem {
  label: string;
  value: string;
  variant?: "default" | "danger";
}

interface SettingsTabProps {
  tabs: SettingsTabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

const SettingsTab = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}: SettingsTabProps) => {
  return (
    <div className={cn("flex flex-row lg:flex-col flex-wrap gap-2 overflow-x-auto pb-1 lg:pb-0", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const isDanger = tab.variant === "danger";

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 rounded-sm text-sm sm:text-base lg:text-xl font-medium font-ibm-plex-sans leading-tight lg:leading-7.5 transition-colors cursor-pointer whitespace-nowrap shrink-0",
              isActive
                ? "bg-primary text-white"
                : "border border-[#DFE3E8] bg-transparent",
              !isActive && isDanger && "text-[#FF4842]",
              !isActive && !isDanger && "text-[#101010]"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SettingsTab;
