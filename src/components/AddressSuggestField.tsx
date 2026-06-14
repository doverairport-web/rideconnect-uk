"use client";

import { useEffect, useId, useRef, useState } from "react";

type AddressSuggestFieldProps = {
  name: string;
  value: string;
  onChange: (value: string, coords?: { lat: number; lng: number } | null) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

type Suggestion = {
  label: string;
  value: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

export function AddressSuggestField({
  name,
  value,
  onChange,
  placeholder,
  required,
  className,
}: AddressSuggestFieldProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  async function fetchSuggestions(query: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/address-suggest?q=${encodeURIComponent(query)}`,
      );
      const result = await response.json();
      if (response.ok && result.ok) {
        setSuggestions(result.suggestions ?? []);
        setOpen((result.suggestions ?? []).length > 0);
        setActiveIndex(-1);
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    } catch {
      setSuggestions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function resolvePlaceId(placeId: string): Promise<Suggestion | null> {
    try {
      const response = await fetch(
        `/api/address-suggest?place_id=${encodeURIComponent(placeId)}`,
      );
      const result = await response.json();
      if (response.ok && result.ok && result.suggestion) {
        return result.suggestion as Suggestion;
      }
    } catch {
      return null;
    }
    return null;
  }

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      void fetchSuggestions(query);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function chooseSuggestion(suggestion: Suggestion) {
    void (async () => {
      let resolved = suggestion;
      if (
        (resolved.lat == null || resolved.lng == null) &&
        resolved.placeId
      ) {
        const lookedUp = await resolvePlaceId(resolved.placeId);
        if (lookedUp) resolved = lookedUp;
      }

      const coords =
        resolved.lat != null && resolved.lng != null
          ? { lat: resolved.lat, lng: resolved.lng }
          : null;
      onChange(resolved.value, coords);
      setOpen(false);
      setSuggestions([]);
    })();
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value, null)}
        onFocus={() => {
          if (value.trim().length >= 2) {
            void fetchSuggestions(value.trim());
          } else if (suggestions.length > 0) {
            setOpen(true);
          }
        }}
        onBlur={() => {
          window.setTimeout(() => {
            if (suggestions.length === 1 && value.trim().length >= 2) {
              chooseSuggestion(suggestions[0]);
            }
          }, 150);
        }}
        onKeyDown={(event) => {
          if (!open || suggestions.length === 0) return;

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
          } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            chooseSuggestion(suggestions[activeIndex]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        required={required}
        placeholder={placeholder}
        className={className}
        autoComplete="street-address"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
      />

      {loading ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          …
        </span>
      ) : null}

      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.value}-${index}`} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`block w-full px-3 py-2 text-left text-sm text-navy hover:bg-slate-50 ${
                  index === activeIndex ? "bg-slate-50" : ""
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseSuggestion(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
