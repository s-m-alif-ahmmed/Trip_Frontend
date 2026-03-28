"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Loader2, AlertCircle, SearchX, X } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

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

interface TripCityInputProps {
  onSelect?: (location: SelectedLocation) => void;
  onClear?: () => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  value?: SelectedLocation | null;
}

export default function TripCityInput({
  onSelect,
  onClear,
  placeholder = "Search for a city...",
  icon,
  className = "",
  value,
}: TripCityInputProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (value) {
      setQuery(`${value.city}, ${value.country}`);
    } else {
      setQuery("");
    }
  }, [value]);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  // Determines whether the popover should show
  const shouldShowPopover = isOpen && query.length >= 2;

  // Debounced search function
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
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
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

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchCities(value);
    }, 300);
  };

  // Select a city from dropdown
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

  // Keyboard navigation
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
    <Popover open={shouldShowPopover} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div className={`relative flex-1 min-w-0 h-full ${className}`}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              query.length >= 2 &&
              (results.length > 0 || error) &&
              setIsOpen(true)
            }
            placeholder={placeholder}
            readOnly={!!value}
            className={`lg:px-5 xl:px-6 bg-transparent outline-none font-semibold placeholder:text-[#919EAB] placeholder:font-normal w-full text-xs lg:text-sm h-full pr-10 ${value ? "text-[#212B36] cursor-default" : "text-[#212B36]"}`}
            autoComplete="off"
          />

          {/* Icon / Clear area */}
          <div className="absolute top-1/2 right-0 lg:right-6 -translate-y-1/2">
            {loading ? (
              <Loader2 className="w-5 h-5 text-[#122464] animate-spin pointer-events-none" />
            ) : value ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setIsOpen(false);
                  onClear?.();
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full bg-[#919EAB]/20 hover:bg-[#919EAB]/40 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 text-[#637381]" />
              </button>
            ) : (
              <span className="pointer-events-none">{icon}</span>
            )}
          </div>
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="p-0 overflow-hidden rounded-xl border border-[#DFE3E8] shadow-lg"
        align="start"
        sideOffset={8}
        style={{ width: "var(--radix-popover-trigger-width)" }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center gap-2 px-4 py-5 text-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-sm text-[#919EAB]">
              Search with more specific details
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
                  className={`cursor-pointer select-none py-2.5 px-4
                             transition-colors duration-150 ease-in-out
                             ${
                               isSelected
                                 ? "bg-[#122464]/5 text-[#122464]"
                                 : "text-[#212B36] hover:bg-[#F4F6F8]"
                             }
                             ${index !== results.length - 1 ? "border-b border-[#F4F6F8]" : ""}
                            `}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? "text-[#122464]" : "text-[#919EAB]"
                      }`}
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
