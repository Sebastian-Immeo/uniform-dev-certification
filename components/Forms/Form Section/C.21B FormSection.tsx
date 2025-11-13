"use client";

import {
  ComponentProps,
  registerUniformComponent,
  UniformText,
} from "@uniformdev/canvas-react";
import { useState } from "react";
import DynamicForm, {
  DynamicFormProps,
  DynamicFormSlots,
} from "../DynamicForm";

export interface InlineFormSectionProps extends DynamicFormProps {
  id: string;
  preheader?: string;
  description?: string;
  formErrorTitle: string;
  formErrorMessage: string;
  formSuccesMessage: string;
  navigationName: string;
}

export type InlineFormSectionSlots = DynamicFormSlots;

export default function InlineFormSection({
  id,
  component,

  formErrorTitle,
  formErrorMessage,
  formSuccesMessage,
  navigationName,
  ...formProps
}: ComponentProps<InlineFormSectionProps>) {
  const locale = "en";
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const handleFormStateChange = (isSubmitted: boolean, hasError: boolean) => {
    setIsFormSubmitted(isSubmitted);
    setDisplayError(hasError);

    // Reset error message timer by changing key when new error occurs
    if (hasError && !isSubmitted) {
      setErrorKey((prev) => prev + 1);
    }
  };

  return (
    <section
      id={`C.21B-${id}`}
      aria-describedby={`C.21B-title-${id}`}
      data-navigation-name={navigationName}
    >
      <div className="flex flex-col md:flex-row py-ft-7 md:pt-ft-12 md:pb-ft-11 gap-x-ft-11 relative text-carbon">
        <div className="bg-rhodium w-full h-full absolute overflow-container-width -z-10 top-0"></div>

        <div className="w-full mb-ft-6">
          <p className="text-heading-5 mb-ft-7">
            <UniformText parameterId="preheader" />
          </p>
          <h2 id={`C.21B-title-${id}`} className="text-heading-2 mb-ft-7">
            <UniformText parameterId="formTitle" />
          </h2>
          <p className="text-body-1">
            <UniformText parameterId="description" />
          </p>
        </div>

        <div className="w-full max-w-none md:max-w-[634px]">
          {!isFormSubmitted && (
            <div className="w-full bg-platinum rounded-corners p-ft-6 pt-ft-8 md:px-ft-9 md:py-ft-11">
              <DynamicForm
                {...formProps}
                locale={locale}
                onFormStateChange={handleFormStateChange}
                component={component}
                // slots={slots}
              />
            </div>
          )}

          {isFormSubmitted && !displayError && (
            <div className="w-full flex items-center rounded-corners shadow-lg p-ft-6 md:p-ft-9 bg-platinum text-carbon">
              <div className="flex flex-col">
                <div className="rounded-full border-[1px] border-aluminum text-aluminium w-[54px] h-[54px] flex items-center justify-center mb-ft-8 md:mb-ft-9">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-heading-3 whitespace-pre-line">
                  {formSuccesMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

registerUniformComponent({
  type: "dynamicForm",
  component: InlineFormSection,
});
