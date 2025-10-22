// pages/api/test-ga4.ts (or app/api/test-ga4/route.ts)
import { NextApiRequest, NextApiResponse } from "next";
import { getPageViews } from "../../lib/ga4-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test with your homepage
    const views = await getPageViews("/");
    res.json({
      success: true,
      pageViews: views,
      message: "GA4 connection working!",
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
}
