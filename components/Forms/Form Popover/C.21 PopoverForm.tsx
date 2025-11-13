"use client";

import { useEffect, useRef, useState } from "react";
import DynamicForm, {
  DynamicFormProps,
  DynamicFormSlots,
} from "../DynamicForm";
import { Overlay } from "../Overlay";
import { trackEvent } from "@/lib/GTM";
import { ComponentProps } from "@uniformdev/canvas-react";

export interface PopoverFormProps extends DynamicFormProps {
  buttonText: string;
  closeAriaLabel?: string;
  formExtraText?: {
    type: string;
    value: Record<string, string>;
  };
  formSuccesMessage: string;
  formErrorTitle: string;
  formErrorMessage: string;
  defaultFormHandle?: string;
}

export type PopoverFormSlots = DynamicFormSlots;

export function PopoverForm({
  id,
  component,
  buttonText,
  closeAriaLabel,
  formExtraText,
  formSuccesMessage,
  formErrorTitle,
  formErrorMessage,
  formHandle,
  ...dynamicFormProps
}: ComponentProps<PopoverFormProps>) {
  const isFirstRender = useRef(true);
  const [isOpen, setIsOpen] = useState(false);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  const handleFormStateChange = (isSubmitted: boolean, hasError: boolean) => {
    setIsFormSubmitted(isSubmitted);
    setDisplayError(hasError);
    if (isSubmitted || hasError) {
      setIsOpen(false);
    }
  };

  const handleOpenForm = () => {
    setIsOpen(true);
    setIsFormSubmitted(false);
    setDisplayError(false);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    trackEvent("LightBoxOpen", { state: isOpen ? "open" : "close" });
  }, [isOpen]);

  return (
    <>
      {isFormSubmitted && (
        <div className="py-ft-9 px-ft-7 !max-w-[588px]">
          <div className="flex flex-col gap-ft-7">
            <div className="rounded-full border-[1px] border-aluminum text-aluminium w-[54px] h-[54px] flex items-center justify-center"></div>
            <p className="text-heading-3">{formSuccesMessage}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleOpenForm}
        className="max-w-none md:max-w-[50%] bg-carbon text-white py-ft-3 px-ft-6 rounded-medium hover:bg-magnesium transition-all duration-200 flex items-center gap-ft-2"
      >
        Contact us
      </button>

      <Overlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeAriaLabel={closeAriaLabel || "Close contact form"}
      >
        <DynamicForm
          {...dynamicFormProps}
          id={id}
          formHandle={formHandle}
          isDarkMode={true}
          onFormStateChange={handleFormStateChange}
          component={component}
        />
      </Overlay>
    </>
  );
}
