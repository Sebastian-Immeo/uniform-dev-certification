declare global {
  interface Window {
    dataLayer?: any[];
  }
}

type uniformGTMEvent = {
  event: string;
  eventModel: {
    event_category: string;
    event_label: string;
    is_control_group: number;
  };
};

/**
 * Push a custom event to the dataLayer.
 * @param eventName - The value for the `event` key (e.g. "specialOfferClicked")
 */
export function trackUniformEvent({ event, eventModel }: uniformGTMEvent) {
  if (typeof window === "undefined") {
    // Serverside tracking?
    return;
  }

  if (!window.dataLayer) {
    console.warn(
      "GTM dataLayer not available. Ensure GTM is properly loaded before calling trackEvent."
    );
    return;
  }

  const payload = {
    event,
    eventModel,
    send_to: process.env.NEXT_PUBLIC_GTM_ID || "GTM-P3JF95MV",
  };

  window.dataLayer.push(payload);
}

export function trackEvent(eventName: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") {
    // Todo: Implement server-side tracking
    return;
  }

  if (!window.dataLayer) {
    console.warn(
      "GTM dataLayer not available. Ensure GTM is properly loaded before calling trackEvent."
    );
    return;
  }

  const payload: Record<string, unknown> = {
    event: eventName,
    ...data,
  };

  window.dataLayer.push(payload);
}
