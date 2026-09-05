"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  options: SearchableSelectOption[];
  placeholder: string;
  searchPlaceholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  value,
  options,
  placeholder,
  searchPlaceholder = "Ketik untuk mencari...",
  onChange,
  disabled = false,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const openSelect = () => {
    if (disabled) return;
    setIsOpen(true);
    setQuery("");
  };

  const selectOption = (option: SearchableSelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex w-full items-center rounded-xl border-2 bg-white transition-all duration-200 dark:bg-slate-800 ${
          disabled
            ? "cursor-not-allowed border-slate-200 opacity-60 dark:border-slate-700"
            :
          isOpen
            ? "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400 dark:bg-slate-800 dark:ring-emerald-400/20"
            : selectedOption
              ? "border-emerald-400 dark:border-emerald-500/60"
              : "border-slate-300 dark:border-slate-600"
        }`}
      >
        <Search className="ml-3 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 sm:ml-4 sm:h-5 sm:w-5" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : selectedOption?.label || ""}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={openSelect}
          onClick={openSelect}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
              setQuery("");
              inputRef.current?.blur();
            }
            if (event.key === "Enter" && filteredOptions[0]) {
              event.preventDefault();
              selectOption(filteredOptions[0]);
            }
          }}
          placeholder={isOpen ? searchPlaceholder : placeholder}
          aria-label={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          disabled={disabled}
          className={`min-w-0 flex-1 bg-transparent px-2.5 py-2.5 text-xs font-bold outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 sm:px-3 sm:py-3.5 sm:text-sm ${
            selectedOption ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
          }`}
        />
        <ChevronDown
          className={`mr-3 h-4 w-4 shrink-0 text-slate-400 transition-transform dark:text-slate-500 sm:mr-4 sm:h-5 sm:w-5 ${
            isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-[#0a0f1d]">
          <div className="border-b border-slate-200 px-3 py-2.5 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-300">
            {placeholder}
          </div>
          <div id={listboxId} role="listbox" className="max-h-60 overflow-y-auto pt-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${
                      isSelected
                        ? "bg-[#00df82] text-slate-950"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                Tidak ada pilihan yang cocok.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}