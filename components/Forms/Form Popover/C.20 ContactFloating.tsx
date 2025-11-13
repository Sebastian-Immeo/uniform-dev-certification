"use client";

import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ContactForm, { ContactFormProps } from "../ContactForm";
import { Overlay } from "../Overlay";
import { trackEvent } from "@/lib/GTM";

export interface ContactOverlayProps extends ContactFormProps {
  email: string;
  headshot: any;
  name: string;
  phone: string;
  title: string;
  formTitle: string;
  closeAriaLabel?: string;
  formExtraText?: {
    type: string;
    value: Record<string, string>;
  };
  formErrorTitle: string;
  formSuccesMessage: string;
  formErrorMessage: string;
  defaultFormHandle?: string;
}

export function ContactOverlay({
  component,
  abbreviation,
  email,
  headshot,
  name,
  phone,
  title,
  formTitle,
  closeAriaLabel,
  formExtraText,
  formSuccesMessage,
  formErrorTitle,
  formErrorMessage,
  formHandle,
  defaultFormHandle,
  ...contactFormProps
}: ComponentProps<ContactOverlayProps>) {
  const isFirstRender = useRef(true);
  const [isOpen, setIsOpen] = useState(false);
  const image = headshot?.[0]?.fields?.url?.value;
  const [formRequestStatus, setFormRequestStatus] = useState<
    { send: boolean; success: boolean } | undefined
  >();

  const handleFormSubmitState = (success: boolean) => {
    setIsOpen(false);
    if (!formRequestStatus) {
      setFormRequestStatus({ send: true, success: success });
    }
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
      {formRequestStatus?.send && formRequestStatus?.success && (
        <span> SUCCESS</span>
      )}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => {
            setIsOpen(true);
            setFormRequestStatus(undefined);
          }}
          className="px-3 py-2 ml-auto flex items-center justify-center cursor-pointer bg-carbon hover:bg-magnesium rounded-full md:rounded-tl-medium md:rounded-tr-small md:rounded-b-small hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          aria-label="Open contact form"
        >
          <p
            aria-hidden="true"
            className="text-white text-heading-5 hidden md:block"
          >
            Write to author
          </p>
        </button>
      </div>

      <Overlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeAriaLabel={closeAriaLabel || "Close contact form"}
        header={<h2 className="text-heading-3">Write to author</h2>}
      >
        <ContactForm
          {...contactFormProps}
          component={component}
          handleFormSubmitState={handleFormSubmitState}
          abbreviation={abbreviation}
          showRequestTopic={!abbreviation}
          formTitle={formTitle}
        />
      </Overlay>
    </>
  );
}

registerUniformComponent({
  type: "c21SignUpFormulars",
  component: ContactOverlay,
});
