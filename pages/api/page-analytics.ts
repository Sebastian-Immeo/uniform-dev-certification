import { NextApiRequest, NextApiResponse } from "next";
import { getPageAnalytics, getPageCustomEvents } from "../../lib/ga4-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pagePath = (req.query.pagePath as string) || "/";
  
  try {
    // Fetch all analytics data in parallel
    const [pageAnalytics, customEvents] = await Promise.all([
      getPageAnalytics(pagePath),
      getPageCustomEvents(pagePath)
    ]);

    res.json({
      success: true,
      pagePath,
      data: {
        pageViews: pageAnalytics.pageViews,
        avgTimeMinutes: pageAnalytics.avgTimeMinutes,
        formSubmissions: customEvents.formSubmissions,
        shares: customEvents.shares,
        campaignClicks: customEvents.campaignClicks,
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Page Analytics API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      pagePath
    });
  }
}
