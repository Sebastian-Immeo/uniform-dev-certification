import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { GoogleAuth } from "google-auth-library";

// Create credentials object from environment variables
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY
    : undefined,
};

// Validate that we have the required credentials
if (!credentials.client_email || !credentials.private_key) {
  throw new Error(
    "Missing required Google service account credentials. Please check GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables."
  );
}

const analyticsDataClient = new BetaAnalyticsDataClient({
  auth: new GoogleAuth({
    projectId: process.env.GOOGLE_PROJECT_ID,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    credentials: credentials,
  }),
});

export async function getPageViews(pagePath: string) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      // Use GA4's minimum allowed start date for "lifetime" data
      dateRanges: [{ startDate: "2015-08-14", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }], // or { name: "views" } if you prefer
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: pagePath },
        },
      },
    });

    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0", 10);
  } catch (error) {
    console.error("GA4 Error:", error);
    return 0;
  }
}

export async function getCustomEventCount(eventName: string) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: eventName },
        },
      },
    });

    console.log("GA4 Response:", response);

    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0");
  } catch (error) {
    console.error("GA4 Error:", error);
    return 0;
  }
}

export async function getActiveUsersLast30m() {
  const [response] = await analyticsDataClient.runRealtimeReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    metrics: [{ name: "activeUsers" }],
  });

  console.log("GA4 Realtime Response:", response);
  return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0", 10);
}

export async function getPageAnalytics(pagePath: string) {
  try {
    // Get lifetime + 7d page views combined
    const [lifetimeResponse] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "2015-08-14", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: pagePath },
        },
      },
    });

    // Get 7d page views for recent activity
    const [recentResponse] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: pagePath },
        },
      },
    });

    // Get average engagement duration for the page
    const [engagementResponse] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "userEngagementDuration" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: pagePath },
        },
      },
    });

    const lifetimeViews = parseInt(lifetimeResponse.rows?.[0]?.metricValues?.[0]?.value || "0", 10);
    const recentViews = parseInt(recentResponse.rows?.[0]?.metricValues?.[0]?.value || "0", 10);
    const engagementDuration = parseFloat(engagementResponse.rows?.[0]?.metricValues?.[0]?.value || "0");

    return {
      pageViews: {
        lifetime: lifetimeViews,
        recent: recentViews,
        combined: lifetimeViews, // We'll add real-time increments on the client
      },
      avgTimeMinutes: Math.round(engagementDuration / 60) || 0,
    };
  } catch (error) {
    console.error("GA4 Page Analytics Error:", error);
    return {
      pageViews: { lifetime: 0, recent: 0, combined: 0 },
      avgTimeMinutes: 0,
    };
  }
}

export async function getPageCustomEvents(pagePath: string) {
  try {
    const eventPromises = [
      // Form submissions
      analyticsDataClient.runReport({
        property: `properties/${process.env.GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }, { name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: { matchType: "EXACT", value: pagePath },
                },
              },
              {
                filter: {
                  fieldName: "eventName",
                  stringFilter: { matchType: "EXACT", value: "formSubmit" },
                },
              },
            ],
          },
        },
      }),
      // Shared events
      analyticsDataClient.runReport({
        property: `properties/${process.env.GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }, { name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: { matchType: "EXACT", value: pagePath },
                },
              },
              {
                filter: {
                  fieldName: "eventName",
                  stringFilter: { matchType: "EXACT", value: "shared" },
                },
              },
            ],
          },
        },
      }),
      // Campaign clicks
      analyticsDataClient.runReport({
        property: `properties/${process.env.GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }, { name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: { matchType: "EXACT", value: pagePath },
                },
              },
              {
                filter: {
                  fieldName: "eventName",
                  stringFilter: { matchType: "EXACT", value: "specialOfferClicked" },
                },
              },
            ],
          },
        },
      }),
    ];

    const [formResponse, sharedResponse, campaignResponse] = await Promise.all(eventPromises.map((p) => p[0]));

    return {
      formSubmissions: parseInt(formResponse.rows?.[0]?.metricValues?.[0]?.value || "0", 10),
      shares: parseInt(sharedResponse.rows?.[0]?.metricValues?.[0]?.value || "0", 10),
      campaignClicks: parseInt(campaignResponse.rows?.[0]?.metricValues?.[0]?.value || "0", 10),
    };
  } catch (error) {
    console.error("GA4 Custom Events Error:", error);
    return {
      formSubmissions: 0,
      shares: 0,
      campaignClicks: 0,
    };
  }
}
