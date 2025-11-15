import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Location {
  state: string;
  district: string;
  city: string;
  area: string;
}

interface LocationAutocompleteProps {
  onLocationSelect: (location: Location) => void;
  value?: Location | null;
}

const LocationAutocomplete = ({ onLocationSelect, value }: LocationAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load locations data
  useEffect(() => {
    fetch("/data/locations.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      setDisplayValue(`${value.city}, ${value.district}, ${value.state}`);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // Filter locations based on search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations([]);
      setIsOpen(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = locations.filter((loc) => {
      return (
        loc.state.toLowerCase().includes(term) ||
        loc.district.toLowerCase().includes(term) ||
        loc.city.toLowerCase().includes(term)
      );
    });

    setFilteredLocations(filtered.slice(0, 50)); // Limit to 50 results for performance
    setIsOpen(filtered.length > 0);
  }, [searchTerm, locations]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setDisplayValue(value);
  };

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location);
    setDisplayValue(`${location.city}, ${location.district}, ${location.state}`);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setDisplayValue("");
    setFilteredLocations([]);
    setIsOpen(false);
    onLocationSelect({ state: "", district: "", city: "" });
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? 
            <span key={i} className="font-semibold text-primary">{part}</span> : 
            part
        )}
      </span>
    );
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="location-search">Location *</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          id="location-search"
          type="text"
          placeholder="Search location (State / District / City / Area)"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (displayValue && !searchTerm) {
              setSearchTerm(displayValue);
            }
          }}
          className="pl-10 pr-10"
          autoComplete="off"
        />
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && filteredLocations.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg"
        >
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {filteredLocations.map((location, index) => (
                <button
                  key={`${location.state}-${location.district}-${location.city}-${index}`}
                  type="button"
                  onClick={() => handleLocationClick(location)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="font-medium">
                    {highlightMatch(location.city, searchTerm.toLowerCase())}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {highlightMatch(location.district, searchTerm.toLowerCase())}, {highlightMatch(location.state, searchTerm.toLowerCase())}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
