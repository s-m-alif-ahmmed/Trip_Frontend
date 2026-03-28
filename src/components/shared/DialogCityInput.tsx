"use client";

import React, { useState, useCallback, useRef } from "react";
import { MapPin, Loader2, AlertCircle, SearchX } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
    state?: string;
  };
  name: string;
}

export interface SelectedLocation {
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  displayName: string;
}

interface DialogCityInputProps {
  onSelect?: (location: SelectedLocation) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  value?: SelectedLocation | null;
  disabled?: boolean;
}

export default function DialogCityInput({
  onSelect,
  placeholder = "Search for a city...",
  className,
  hasError = false,
  value = null,
  disabled = false,
}: DialogCityInputProps) {
  const [query, setQuery] = useState(() =>
    value?.city ? `${value.city}, ${value.country}` : "",
  );
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const prevValueRef = useRef(value);

  // Sync query when value prop changes externally (e.g. pre-filled from previous leg)
  React.useEffect(() => {
    if (value?.city && value !== prevValueRef.current) {
      setQuery(`${value.city}, ${value.country}`);
    } else if (!value?.city && prevValueRef.current?.city) {
      setQuery("");
    }
    prevValueRef.current = value;
  }, [value]);

  const shouldShowPopover = isOpen && query.length >= 2;

  // Debounced search
  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setError(null);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsOpen(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `format=json&q=${encodeURIComponent(searchQuery)}` +
          `&addressdetails=1&limit=6&featuretype=city`,
        { headers: { "Accept-Language": "en-US,en;q=0.9" } },
      );

      if (!response.ok) throw new Error("Failed to fetch cities");

      const data: NominatimResult[] = await response.json();
      setResults(data);
      setSelectedIndex(-1);
    } catch (err) {
      console.error(err);
      setError("Failed to search cities. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCities(value), 300);
  };

  const handleSelect = (result: NominatimResult, index: number) => {
    const address = result.address || {};
    const city = address.city || address.town || address.village || result.name;
    const country = address.country || "Unknown";
    const countryCode = address.country_code?.toUpperCase() || "";

    const location: SelectedLocation = {
      city,
      country,
      countryCode,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name,
    };

    setQuery(`${city}, ${country}`);
    setIsOpen(false);
    setSelectedIndex(index);
    onSelect?.(location);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!shouldShowPopover) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex], selectedIndex);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <Popover open={!disabled && shouldShowPopover} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              !disabled &&
              query.length >= 2 &&
              (results.length > 0 || !!error) &&
              setIsOpen(true)
            }
            placeholder={placeholder}
            autoComplete="off"
            disabled={disabled}
            className={cn(
              "w-full border rounded-xl px-5 py-4 text-sm sm:text-base",
              "placeholder:text-[#919EAB] text-[#212B36] h-14 outline-none",
              "transition-colors pr-12",
              disabled && "bg-[#F4F6F8] text-[#637381] cursor-not-allowed",
              hasError
                ? "border-red-400 focus:border-red-500"
                : "border-[#DFE3E8] focus:border-[#122464]",
              className,
            )}
          />

          {/* Trailing icon */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
            {loading ? (
              <Loader2 className="w-5 h-5 text-[#122464] animate-spin" />
            ) : (
              <MapPin className="w-5 h-5 text-[#919EAB]" />
            )}
          </div>
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="p-0 overflow-hidden rounded-xl border border-[#DFE3E8] shadow-lg"
        align="start"
        sideOffset={6}
        style={{ width: "var(--radix-popover-trigger-width)" }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center gap-2 px-4 py-5 text-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-xs text-[#919EAB]">
              Try searching with more specific details
            </p>
          </div>
        )}

        {/* No results state */}
        {!error && !loading && results.length === 0 && query.length >= 2 && (
          <div className="flex flex-col items-center gap-2 px-4 py-5 text-center">
            <SearchX className="w-5 h-5 text-[#919EAB]" />
            <p className="text-sm text-[#919EAB]">
              No cities found for &quot;{query}&quot;
            </p>
          </div>
        )}

        {/* Results list */}
        {!error && results.length > 0 && (
          <div className="max-h-64 overflow-auto">
            {results.map((result, index) => {
              const address = result.address || {};
              const city =
                address.city || address.town || address.village || result.name;
              const country = address.country || "Unknown";
              const countryCode = address.country_code?.toUpperCase() || "";
              const state = address.state || "";
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={result.place_id}
                  onClick={() => handleSelect(result, index)}
                  className={cn(
                    "cursor-pointer select-none py-2.5 px-4 transition-colors duration-150",
                    isSelected
                      ? "bg-[#122464]/5 text-[#122464]"
                      : "text-[#212B36] hover:bg-[#F4F6F8]",
                    index !== results.length - 1 && "border-b border-[#F4F6F8]",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isSelected ? "text-[#122464]" : "text-[#919EAB]",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{city}</p>
                      <p className="text-xs text-[#919EAB] truncate">
                        {countryCode && (
                          <span className="inline-flex items-center mr-1.5 px-1 py-0.5 rounded text-[10px] font-medium bg-[#F4F6F8] text-[#637381]">
                            {countryCode}
                          </span>
                        )}
                        {country}
                        {state ? `, ${state}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
