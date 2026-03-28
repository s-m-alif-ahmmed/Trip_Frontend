// components/CitySearch.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, Globe } from "lucide-react";

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

interface SelectedLocation {
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  displayName: string;
}

interface CitySearchProps {
  onSelect?: (location: SelectedLocation) => void;
  placeholder?: string;
  className?: string;
}

export default function CitySearch({
  onSelect,
  placeholder = "Search for a city...",
  className = "",
}: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  // Debounced search function
  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `format=json&q=${encodeURIComponent(searchQuery)}` +
          `&addressdetails=1&limit=8&featuretype=city`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch cities");

      const data: NominatimResult[] = await response.json();
      setResults(data);
      setIsOpen(data.length > 0);
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
    setSelectedLocation(null);

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

    setSelectedLocation(location);
    setQuery(`${city}, ${country}`);
    setIsOpen(false);
    setSelectedIndex(index);

    onSelect?.(location);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[
        selectedIndex
      ] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query.length >= 2 && results.length > 0 && setIsOpen(true)
          }
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     leading-5 bg-white placeholder-gray-500 focus:outline-none 
                     focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 
                     focus:border-indigo-500 transition duration-150 ease-in-out
                     text-gray-900 text-base"
          autoComplete="off"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {loading ? (
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
          ) : (
            <Globe className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md 
                     max-h-80 overflow-auto ring-1 ring-black ring-opacity-5 
                     focus:outline-none animate-in fade-in slide-in-from-top-2 
                     duration-200"
        >
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
                className={`cursor-pointer select-none relative py-3 px-4 
                           transition-colors duration-150 ease-in-out
                           ${
                             isSelected
                               ? "bg-indigo-50 text-indigo-900"
                               : "text-gray-900 hover:bg-gray-50"
                           }
                           ${index !== results.length - 1 ? "border-b border-gray-100" : ""}
                           ${index === 0 ? "rounded-t-md" : ""}
                           ${index === results.length - 1 ? "rounded-b-md" : ""}
                          `}
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    className={`h-5 w-5 mt-0.5 shrink-0 
                                    ${isSelected ? "text-indigo-600" : "text-gray-400"}`}
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate
                                 ${isSelected ? "text-indigo-900" : "text-gray-900"}`}
                    >
                      {city}
                    </p>

                    <p
                      className={`text-xs mt-0.5 flex items-center gap-2
                                 ${isSelected ? "text-indigo-600" : "text-gray-500"}`}
                    >
                      {countryCode && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {countryCode}
                        </span>
                      )}
                      <span className="truncate">
                        {country}
                        {state ? `, ${state}` : ""}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {isOpen && !loading && results.length === 0 && query.length >= 2 && (
        <div
          className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md 
                        py-4 px-4 ring-1 ring-black ring-opacity-5"
        >
          <p className="text-sm text-gray-500 text-center">No cities found</p>
        </div>
      )}

      {/* Selected Location Card */}
      {selectedLocation && (
        <div
          className="mt-4 bg-linear-to-br from-indigo-500 to-purple-600 
                        rounded-lg shadow-lg p-5 text-white animate-in 
                        fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-indigo-200" />
            <h3 className="text-lg font-semibold">Selected Location</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-indigo-200 uppercase tracking-wider font-medium">
                City
              </p>
              <p className="text-2xl font-bold">{selectedLocation.city}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs text-indigo-200 uppercase tracking-wider font-medium">
                  Country
                </p>
                <p className="text-lg font-semibold mt-1">
                  {selectedLocation.country}
                </p>
                {selectedLocation.countryCode && (
                  <span
                    className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs 
                                   font-medium bg-white/20 text-white"
                  >
                    {selectedLocation.countryCode}
                  </span>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs text-indigo-200 uppercase tracking-wider font-medium">
                  Coordinates
                </p>
                <p className="text-sm font-mono mt-1 text-indigo-100">
                  {selectedLocation.lat.toFixed(4)},{" "}
                  {selectedLocation.lon.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
