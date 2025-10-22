import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? undefined // Will use file path
    : JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"), // Or JSON object
});

export async function getPageViews(pagePath: string) {
  try {
    const [response] = await analyticsDataClient.runReport({
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

    console.log("GA4 Response:", response);

    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0");
  } catch (error) {
    console.error("GA4 Error:", error);
    return 0;
  }
}
