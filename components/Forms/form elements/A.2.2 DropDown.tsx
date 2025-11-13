"use client";
import React, { useState, useEffect, useRef } from "react";
import type { OptionField } from "./A.2.5 RadioButtonGroup";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

interface DropdownProps {
  id: string;
  label: string;
  placeholder: string;
  options: OptionField[];
  selected?: string;
  isDarkMode: boolean;
  onSelect?: (value: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
}

const Dropdown = ({
  id,
  label,
  placeholder,
  options,
  selected,
  isDarkMode,
  onSelect,
  name,
  required,
  className,
  component,
}: ComponentProps<DropdownProps>) => {
  if (!options || !Array.isArray(options)) {
    console.error("Options is invalid:", options);
    return <div>Loading dropdown options...</div>;
  }
  // Find the default value from options or use first option
  const defaultValue =
    options.find((option) => option.fields?.default?.value)?.fields.value
      .value ||
    (required ? options[0]?.fields?.value?.value : "") ||
    "";

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(
    selected ||
      defaultValue ||
      (required ? options[0]?.fields?.value?.value || "" : "")
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the label for the current selected value
  const getCurrentLabel = () => {
    const selectedOption = options.find(
      (option) => option.fields.value.value === current
    );
    return selectedOption?.fields.label.value || "";
  };

  // Sync with defaultValue when it changes (from server data)
  useEffect(() => {
    const newValue =
      selected ||
      defaultValue ||
      (required ? options[0]?.fields?.value?.value || "" : "");
    setCurrent(newValue);
  }, [defaultValue, selected, required, options]);

  const toggle = () => setOpen((p) => !p);
  const choose = (optValue: string) => {
    setCurrent(optValue);
    onSelect?.(optValue);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const isDark = component?.variant === "dark" || isDarkMode;
  const labelColor = isDark ? "text-platinum" : "text-carbon";
  const triggerBg = isDark ? "bg-overlay-platinum-25" : "bg-rhodium";
  const triggerText = isDark ? "text-platinum" : "text-carbon";
  const arrowFill = isDark ? "fill-platinum" : "fill-carbon";
  const hoverBorder = isDark
    ? "hover:border-(--color-palladium)"
    : "hover:border-(--color-magnesium)";
  const openBorder = isDark
    ? "border-(--color-palladium)"
    : "border-(--color-magnesium)";
  const focusOutline = isDark ? "focus-outline-white" : "focus-outline-blue";
  const isPlaceholderShown = !current;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <label id={id} className={`${labelColor} block text-label mb-ft-3`}>
        {label}
      </label>

      {/* Native select for form submission */}
      <select
        name={name}
        value={current}
        onChange={(e) => {
          setCurrent(e.target.value);
          onSelect?.(e.target.value);
        }}
        required={required}
        style={{ display: "none" }}
        tabIndex={-1}
      >
        {!required && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.fields.value.value} value={opt.fields.value.value}>
            {opt.fields.label.value}
          </option>
        ))}
      </select>

      <button
        role="combobox"
        aria-labelledby={id}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`
          w-full rounded-[3px] flex items-center justify-between
          font-medium cursor-pointer transition-colors
          border ${open ? openBorder : "border-transparent"}
          ${hoverBorder} ${triggerBg} ${triggerText}
          px-ft-6 py-ft-5 gap-ft-4
          ${focusOutline}
        `}
      >
        <span className={isPlaceholderShown ? "text-label" : ""}>
          {getCurrentLabel() || placeholder}
        </span>

        {open ? (
          <svg
            className={`w-4 h-4 transition-transform ${arrowFill}`}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M4.427 9.573l3.396-3.396a.25.25 0 01.354 0l3.396 3.396a.25.25 0 01-.177.427H4.604a.25.25 0 01-.177-.427z" />
          </svg>
        ) : (
          <svg
            className={`w-4 h-4 transition-transform ${arrowFill}`}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          aria-labelledby={id}
          aria-hidden={!open}
          className={`
            absolute z-10 mt-ft-2 w-full flex flex-col
            rounded-[3px] border border-rhodium
           bg-platinum text-label
            shadow-carbon max-h-[250px] overflow-y-auto
            p-ft-3 text-carbon
          `}
        >
          {options.map((opt) => (
            <button
              key={opt?.fields?.value?.value}
              onClick={() => choose(opt?.fields?.value?.value)}
              className={`
                text-left
                flex items-center 
                px-ft-5 py-ft-5
                rounded-[3px]
                hover:underline hover:bg-rhodium
                cursor-pointer
                text-label
              `}
            >
              {opt?.fields?.label?.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

registerUniformComponent({
  type: "dropdown",
  component: Dropdown,
});

export default Dropdown;
