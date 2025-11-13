"use client";

import TextField from "./form elements/A.2.1 TextField";
import Dropdown from "./form elements/A.2.2 DropDown";

import Checkbox from "./form elements/A.2.4 CheckBox";

import { trackEvent } from "@/lib/GTM";
import {
  ComponentProps,
  UniformSlot,
  registerUniformComponent,
} from "@uniformdev//canvas-react";
import { useRef } from "react";
import { OptionField } from "./form elements/A.2.5 RadioButtonGroup";

export interface DynamicFormProps {
  id?: string;
  formHandle?: string;
  formTitle: string;
  firstNameLabel: string;
  firstNamePlaceholder: string;
  lastNameLabel: string;
  lastNamePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  countryLabel: string;
  countryPlaceholder: string;
  countryOptions: OptionField[];
  submitButtonText: string;
  locale: "en" | "dk";
  acceptTermsLabel: string;
  acceptMarketingTermsLabel: string;
  termsToBeAccpted:
    | "both"
    | "permission_store_and_process"
    | "permission_type_marketing";
  isDarkMode?: boolean;
  onFormStateChange?: (isSubmitted: boolean, hasError: boolean) => void;
}

export type DynamicFormSlots = "prependedFields" | "appendedFields";

function DynamicForm({
  id,
  formTitle,
  termsToBeAccpted,
  acceptMarketingTermsLabel,
  formHandle,
  firstNameLabel,
  firstNamePlaceholder,
  lastNameLabel,
  lastNamePlaceholder,
  companyLabel,
  companyPlaceholder,
  emailLabel,
  emailPlaceholder,
  countryLabel,
  countryPlaceholder,
  countryOptions,
  submitButtonText,
  locale = "en",
  acceptTermsLabel,
  isDarkMode = false,
  onFormStateChange,
  component,
}: ComponentProps<DynamicFormProps>) {
  const hasAttemptedSubmission = useRef(false);
  const previousStateRef = useRef({});
  const shouldRenderMarketingCheckbox =
    termsToBeAccpted === "both" ||
    termsToBeAccpted === "permission_type_marketing";
  const shouldRenderStoreCheckbox =
    termsToBeAccpted === "both" ||
    termsToBeAccpted === "permission_store_and_process";

  const handleFieldError = (label: string, name: string) => {
    return "";
  };

  const handleFormSubmit = async () => {
    trackEvent("formSubmit", {
      email: "Tester@example.com",
      url: window ? window.location.href : "",
      formName: formTitle ?? "",
    });
    onFormStateChange?.(true, false);
    hasAttemptedSubmission.current = true;
  };

  return (
    <form
      className="space-y-6 mx-auto"
      onSubmit={() => {
        // ← move side-effect here
        handleFormSubmit();
      }}
      suppressHydrationWarning // ⚠️ Added intentionally:
      // Next.js (v15+) and React 19 sometimes produce a harmless hydration mismatch on <form> elements
      // that use Server Actions or useActionState. On the server, Next renders method="POST" (uppercase),
      // while the client applies method="post" (lowercase). Because React performs a strict string comparison
      // during hydration, it logs a mismatch even though both are equivalent HTML semantics.
      // This warning does NOT indicate a real rendering problem — the form submits normally.
      // We use suppressHydrationWarning here to silence that cosmetic case-difference warning while keeping
      // full SSR and Server Action behavior intact.
    >
      <div className="w-full flex flex-wrap gap-x-ft-5 [&>*]:mb-ft-7 [&>*.half]:w-[calc(50%-6px)]">
        <UniformSlot name="prependedFields" />
      </div>

      {/* Static Required Fields */}
      <div className="flex flex-row gap-ft-4 mb-ft-7">
        <TextField
          id="first_name"
          name="first_name"
          label={firstNameLabel}
          placeholder={firstNamePlaceholder}
          isDarkMode={isDarkMode}
          minLength={2}
          error={handleFieldError(firstNameLabel, "first_name")}
          defaultValue=""
          required={true}
          component={component}
        />

        <TextField
          id="last_name"
          name="last_name"
          label={lastNameLabel}
          placeholder={lastNamePlaceholder}
          isDarkMode={isDarkMode}
          minLength={2}
          error={handleFieldError(lastNameLabel, "last_name")}
          defaultValue=""
          required={true}
          component={component}
        />
      </div>

      <div className="flex flex-row gap-ft-4 mb-ft-7">
        <TextField
          id="company"
          name="company"
          label={companyLabel}
          placeholder={companyPlaceholder}
          isDarkMode={isDarkMode}
          defaultValue=""
          error={handleFieldError(companyLabel, "company")}
          required={true}
          component={component}
        />

        <TextField
          id="email"
          name="email"
          label={emailLabel}
          placeholder={emailPlaceholder}
          isDarkMode={isDarkMode}
          type="email"
          error={handleFieldError(emailLabel, "email")}
          defaultValue=""
          required={true}
          component={component}
          pattern="^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$"
        />
      </div>

      <Dropdown
        id="country"
        name="country"
        label={countryLabel}
        placeholder={countryPlaceholder}
        options={countryOptions}
        isDarkMode={isDarkMode}
        className="mb-ft-7"
        required={true}
        component={component}
      />

      <div className="w-full flex flex-wrap gap-x-ft-5 [&>*]:mb-ft-7 [&>*.half]:w-[calc(50%-6px)]">
        <UniformSlot name="appendedFields" />
      </div>

      {shouldRenderStoreCheckbox && (
        <Checkbox
          id="permission_store_and_process"
          label={acceptTermsLabel}
          isDarkMode={isDarkMode}
          name="permission_store_and_process"
          error={handleFieldError(
            acceptTermsLabel,
            "permission_store_and_process"
          )}
          required={true}
          component={component}
        />
      )}

      {shouldRenderMarketingCheckbox && (
        <Checkbox
          id="permission_type_marketing"
          label={acceptMarketingTermsLabel}
          isDarkMode={isDarkMode}
          name="permission_type_marketing"
          error={handleFieldError(
            acceptMarketingTermsLabel,
            "permission_type_marketing"
          )}
          required={true}
          component={component}
        />
      )}

      <button
        type="submit"
        className="mt-ft-6 bg-carbon text-white py-ft-3 px-ft-6 rounded-medium hover:bg-magnesium transition-all duration-200"
      >
        Submit
      </button>
    </form>
  );
}

registerUniformComponent({
  type: "dynamicForm",
  component: DynamicForm,
});

export default DynamicForm;
