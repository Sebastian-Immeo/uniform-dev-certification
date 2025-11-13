// pages/api/test-ga4.ts (or app/api/test-ga4/route.ts)
import { NextApiRequest, NextApiResponse } from "next";
import {
  getActiveUsersLast30m,
  getCustomEventCount,
} from "../../lib/ga4-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const views = await getCustomEventCount("articlePageView");
    const views = await getActiveUsersLast30m();
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
