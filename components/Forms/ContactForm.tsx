import TextField from "./form elements/A.2.1 TextField";
import Dropdown from "./form elements/A.2.2 DropDown";

import { TextBox } from "./form elements/A.2.3 TextBox";
import Checkbox from "./form elements/A.2.4 CheckBox";

import { trackEvent } from "@/lib/GTM";
import { ComponentProps, UniformRichText } from "@uniformdev//canvas-react";
import { useRouter } from "next/router";
import { OptionField } from "./form elements/A.2.5 RadioButtonGroup";

export interface ContactFormProps {
  id?: string;
  formTitle: string;
  formHandle?: string;
  showRequestTopic?: boolean;
  abbreviation: string;
  contactEmail: string;
  topicLabel: string;
  topicPlaceholder: string;
  areaOfInterestOptions: OptionField[];
  messageLabel: string;
  messagePlaceholder: string;
  titleLabel: string;
  titlePlaceholder: string;
  firstNameLabel: string;
  firstNamePlaceholder: string;
  lastNameLabel: string;
  lastNamePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  countryLabel: string;
  countryPlaceholder: string;
  countryOptions: OptionField[];
  locale: "en" | "dk";
  submitButtonText: string;
  acceptTermsLabel: string;
  department?: string;
  handleFormSubmitState: (success: boolean) => void;
}

export default function ContactForm({
  showRequestTopic = true,
  topicLabel,
  topicPlaceholder,
  areaOfInterestOptions,
  messageLabel,
  messagePlaceholder,
  titleLabel,
  titlePlaceholder,
  firstNameLabel,
  firstNamePlaceholder,
  lastNameLabel,
  lastNamePlaceholder,
  companyLabel,
  companyPlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  submitButtonText,
  acceptTermsLabel,
  component,
  handleFormSubmitState,
}: ComponentProps<ContactFormProps>) {
  const path = useRouter().asPath;
  const handleFormSubmit = () => {
    trackEvent("formSubmit", {
      articlePath: path,
    });
    handleFormSubmitState(true);
  };

  return (
    <form className="space-y-6 mx-auto" onSubmit={handleFormSubmit}>
      <TextBox
        id="message"
        name="message"
        label="Message"
        placeholder="Enter your message here"
        isDarkMode={true}
        component={component}
      />

      <div className="flex flex-row gap-4 mb-7">
        <TextField
          id="first_name"
          name="first_name"
          label={firstNameLabel}
          placeholder={firstNamePlaceholder}
          isDarkMode={true}
          minLength={2}
          component={component}
        />

        <TextField
          id="last_name"
          name="last_name"
          label={lastNameLabel}
          placeholder={lastNamePlaceholder}
          isDarkMode={true}
          minLength={2}
          component={component}
        />
      </div>

      <div className="flex flex-row gap-4 mb-7">
        <TextField
          id="email"
          name="email"
          label={emailLabel}
          placeholder={emailPlaceholder}
          isDarkMode={true}
          type="email"
          component={component}
          pattern="^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$"
        />

        <TextField
          id="user_inserted_phone_number"
          name="user_inserted_phone_number"
          label="Phone"
          placeholder="Enter your phone number"
          isDarkMode={true}
          type="tel"
          pattern="[\+]?[1-9][\d]{0,15}"
          component={component}
        />
      </div>

      <Dropdown
        id="country"
        name="country"
        label="Country"
        placeholder="Select your country"
        options={[
          {
            fields: {
              value: { type: "string", value: "US" },
              label: { type: "string", value: "United States" },
            },
          },
          {
            fields: {
              value: { type: "string", value: "CA" },
              label: { type: "string", value: "Canada" },
            },
          },
          {
            fields: {
              value: { type: "string", value: "UK" },
              label: { type: "string", value: "United Kingdom" },
            },
          },
          {
            fields: {
              value: { type: "string", value: "DE" },
              label: { type: "string", value: "Germany" },
            },
          },
          {
            fields: {
              value: { type: "string", value: "FR" },
              label: { type: "string", value: "France" },
            },
          },
          {
            fields: {
              value: { type: "string", value: "DK" },
              label: { type: "string", value: "Denmark" },
            },
          },
        ]}
        isDarkMode={true}
        className="mb-7"
        required={true}
        component={component}
      />

      <Checkbox
        id="permission_store_and_process"
        label={acceptTermsLabel}
        isDarkMode={true}
        name="permission_store_and_process"
        required={true}
        component={component}
      />

      <button
        type="submit"
        className="mt-6 px-4 py-2 bg-platinum text-carbon rounded-lg cursor-pointer"
      >
        {submitButtonText}
      </button>
    </form>
  );
}
