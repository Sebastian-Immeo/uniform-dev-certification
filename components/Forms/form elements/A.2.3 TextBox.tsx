"use client";
import { ComponentProps } from "@uniformdev/canvas-react";
import React from "react";

interface TextBoxProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  isDarkMode: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  resizeAble?: boolean;
  name: string;
  required?: boolean;
  defaultValue?: string;
  width?: "full" | "half";
}

export const TextBox = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  isDarkMode,
  name,
  required = false,
  resizeAble = false,
  defaultValue,
  width = "full",
  component,
}: ComponentProps<TextBoxProps>) => {
  const isDark = component?.variant === "dark" || isDarkMode;
  const labelColor = isDark ? "text-platinum" : "text-carbon";

  const baseBg = isDark ? "bg-overlay-platinum-25" : "bg-rhodium";

  const hoverBorder = isDark
    ? "hover:border-rhodium"
    : "hover:border-magnesium";

  const textColor = isDark ? "text-platinum" : "text-carbon";

  const placeholderColor = isDark
    ? "placeholder-overlay-platinum-70 hover:placeholder-platinum"
    : "placeholder-color-titanium hover:placeholder-carbon";

  const focusOutline = isDark ? "focus-outline-white" : "focus-outline-blue";

  return (
    <div className={`w-full flex flex-col items-start gap-ft-3 ${width}`}>
      <label htmlFor={id} className={`${labelColor} text-label`}>
        {label}
      </label>
      <textarea
        name={name}
        required={required}
        id={id}
        value={value}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`w-full h-[130px] px-ft-6 py-ft-5 gap-ft-4
          ${baseBg} ${hoverBorder}
          ${textColor} ${placeholderColor}
          rounded-[3px] backdrop-blur-[20px]
          transition-all border border-transparent
          ${focusOutline}
          ${resizeAble ? "resize" : "resize-none"}
        `}
      />
    </div>
  );
};
