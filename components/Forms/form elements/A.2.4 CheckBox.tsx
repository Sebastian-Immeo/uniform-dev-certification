"use client";
import { useState, useEffect, useRef } from "react";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

interface CheckboxProps {
  id?: string;
  label: string;
  isDarkMode: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  error?: string;
  defaultChecked?: boolean;
  required?: boolean;
  hidden?: boolean;
  value?: string;
  staticValue?: boolean;
  width?: "full" | "half";
  locale?: "en" | "dk";
}

const Checkbox = ({
  id,
  label,
  isDarkMode,
  checked = false,
  onChange,
  name,
  error,
  defaultChecked = false,
  required = false,
  hidden = false,
  staticValue,
  width = "full",
  component,
}: ComponentProps<CheckboxProps>) => {
  if (hidden) {
    return (
      <input type="hidden" name={name} value={staticValue ? "true" : "false"} />
    );
  }

  const [isChecked, setChecked] = useState(defaultChecked || checked);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setChecked(defaultChecked || checked);
  }, [defaultChecked, checked]);

  const toggle = () => {
    const newChecked = !isChecked;
    setChecked(newChecked);
    if (inputRef.current) inputRef.current.checked = newChecked;
    onChange?.(newChecked);
  };

  const isDark = component?.variant === "dark" || isDarkMode;

  const displayError = error || (required && !isChecked);
  const showError = !!displayError;
  const styles = getStyles(isDark, showError);
  const focusOutline = isDark ? "focus-outline-white" : "focus-outline-blue";

  const renderCheckmark = () =>
    isChecked && (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-[var(--space-5)] h-[var(--space-5)] translate-y-[0.5px] -translate-x-[0.5px] ${styles.checkmarkColor}`}
      >
        <path
          d="M13.5 4L6 11.5L2.5 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  const renderBox = () => (
    <div
      className={`
        ${styles.boxBase}
        ${styles.fillBase}
        ${styles.hoverBorder}
        ${isChecked ? styles.checked : `border ${styles.borderColor}`}
      `}
    >
      {renderCheckmark()}
    </div>
  );

  const renderLabel = () => (
    <span
      id={id}
      className={`
        ${styles.textColor} group-hover:underline
        text-body-1
         mb-0 mt-auto
      `}
    >
      {label}
    </span>
  );

  return (
    <div className={`w-full flex flex-col items-start mb-ft-6 ${width}`}>
      {/* Hidden input for form submission - remove required to prevent focus issues */}
      {name && (
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          required={required}
          defaultChecked={isChecked}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: 22,
            height: 22,
            margin: "auto",
          }}
          tabIndex={-1}
        />
      )}

      <button
        type="button"
        role="checkbox"
        onClick={toggle}
        className={`flex items-center text-start gap-3 cursor-pointer group ${focusOutline}`}
        aria-labelledby={id}
        aria-required={required}
        aria-invalid={showError}
        aria-checked={isChecked}
      >
        {renderBox()}
        {renderLabel()}
      </button>
    </div>
  );
};

const getStyles = (isDark: boolean, showError: boolean) => ({
  textColor: isDark ? "text-(--color-platinum)" : "text-(--color-carbon)",
  boxBase:
    "flex justify-center items-center self-start w-[22px] h-[22px] shrink-0 backdrop-blur-[20px] transition-all rounded-[3px]",
  fillBase: isDark ? "bg-overlay-platinum-25" : "bg-rhodium",
  hoverBorder: isDark
    ? "group-hover:border-palladium"
    : "group-hover:border-magnesium",
  checked: isDark
    ? "border border-blue bg-platinum"
    : "border border-carbon bg-rhodium",
  borderColor: showError
    ? isDark
      ? "border-titanium"
      : "border-magnesium"
    : "border-transparent",
  checkmarkColor: isDark ? "text-carbon" : "text-carbon",
});

registerUniformComponent({
  type: "checkbox",
  component: Checkbox,
});

export default Checkbox;
