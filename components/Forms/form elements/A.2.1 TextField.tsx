"use client";
import React from "react";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

interface TextFieldProps {
  label: string;
  isDarkMode: boolean;
  placeholder?: string;
  value?: string;
  staticValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  valid?: boolean;
  id: string;
  type?: string;
  name?: string;
  required?: boolean;
  minLength?: number;
  pattern?: string;
  className?: string;
  defaultValue?: string;
  width?: "full" | "half";
  hidden?: boolean;
}

const TextField = ({
  label,
  placeholder,
  value,
  staticValue,
  onChange,
  error,
  valid,
  isDarkMode,
  id,
  type = "text",
  name,
  required,
  minLength,
  pattern,
  defaultValue,
  className,
  width = "full",
  hidden = false,
  component,
}: ComponentProps<TextFieldProps>) => {
  if (hidden) {
    return <input type="hidden" name={name} value={staticValue || ""} />;
  }

  const isDark = component?.variant === "dark" || isDarkMode;
  const showError = !!error && !valid;

  const styles = getStyles(isDark, showError);
  const focusOutline = isDark
    ? "focus-outline-white-input"
    : "focus-outline-blue-input";

  const errorId = `${id}-error`;

  const renderLabel = () => (
    <label htmlFor={id} className={`${styles.textColor} text-label`}>
      {label}
    </label>
  );

  const renderIcon = () =>
    (valid || showError) && (
      <span
        className="flex justify-center items-center w-ft-6 h-ft-6"
        style={{
          borderRadius: "var(--space-6)",
          background: styles.iconBg,
        }}
      ></span>
    );

  const renderInput = () => (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      minLength={minLength}
      pattern={pattern}
      aria-invalid={showError}
      aria-describedby={showError ? errorId : undefined}
      className={`
        w-full px-ft-6 py-ft-5 font-medium rounded-[3px] 
        transition-all backdrop-blur-[20px] text-label
        outline-none focus:outline-none
        ${styles.textColor} ${styles.placeholder}
        ${styles.baseBg} ${styles.hoverBg}
        ${styles.hoverBorder} ${styles.hoverPlaceholder}
        ${focusOutline}
        border ${styles.borderColor}
      `}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
    />
  );

  const renderError = () =>
    showError && (
      <p
        id={errorId}
        className={`text-tag ${isDark ? "text-platinum" : "text-carbon"}`}
        style={{ opacity: 0.7 }}
      >
        {error}
      </p>
    );

  return (
    <div
      className={`w-full flex flex-col items-start gap-ft-3 ${width} ${className}`}
    >
      <div className="flex items-center gap-ft-3 h-[18px]">
        {renderLabel()}
        {renderIcon()}
      </div>
      {renderInput()}
      {renderError()}
    </div>
  );
};

const getStyles = (isDark: boolean, showError: boolean) => ({
  textColor: isDark ? "text-platinum" : "text-carbon",
  placeholder: isDark
    ? "placeholder-overlay-platinum-70"
    : "placeholder-titanium",
  baseBg: isDark ? "bg-overlay-platinum-25" : "bg-rhodium",
  hoverBg: isDark ? "hover:bg-overlay-platinum-25" : "hover:bg-rhodium",
  hoverBorder: isDark ? "hover:border-titanium" : "hover:border-magnesium",
  hoverPlaceholder: isDark
    ? "hover:placeholder-(--overlay-platinum)"
    : "hover:placeholder-(--overlay-carbon)",
  borderColor: showError
    ? isDark
      ? "border-titanium"
      : "border-magnesium"
    : "border-transparent",
  iconFill: isDark ? "fill-carbon" : "fill-platinum",
  iconBg: isDark ? "var(--icon-bg-rhodium)" : "var(--icon-bg-carbon)",
});

registerUniformComponent({
  type: "textField",
  component: TextField,
});

export default TextField;
