import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUniformContext } from "@uniformdev/context-react";

interface AnalyticsData {
  pageViews: number;
  personalizations: number;
  campaignsClicked: number;
  formsSend: number;
}

const Analytics = () => {
  const router = useRouter();
  const { context } = useUniformContext();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 0,
    personalizations: 0,
    campaignsClicked: 0,
    formsSend: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const path = router.asPath.split("?")[0];

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Fetch page views from GA4 API
        const pageViewsResponse = await fetch(`/api/test-ga4?pagePath=${path}`);
        const pageViewsData = await pageViewsResponse.json();

        // Get personalization count from Uniform context
        const personalizations = Object.keys(context.quirks || {}).length;

        // Get campaigns clicked from localStorage or dataLayer
        const campaignsClicked = getCampaignsClicked();

        setAnalytics({
          pageViews: pageViewsData.pageViews || 0,
          personalizations,
          campaignsClicked,
          formsSend: pageViewsData.formsSend || 0,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (path) {
      fetchAnalytics();
    }
  }, [path, context.quirks]);

  const getCampaignsClicked = (): number => {
    try {
      // Check dataLayer for campaign clicks
      const dataLayer = (window as any).dataLayer || [];
      const campaignEvents = dataLayer.filter(
        (event: any) =>
          event.event === "specialOfferClicked" ||
          event.event === "campaignClick"
      );
      return campaignEvents.length;
    } catch (error) {
      console.warn("Could not access campaign data:", error);
      return 0;
    }
  };

  return (
    <div className="bg-carbon rounded-b-xl px-8 py-6 border-t-1 border-rhodium">
      <h3 className="text-sm font-semibold text-rhodium mb-3 tracking-wide">
        Engagement Metrics
      </h3>

      <div className="w-full flex justify-between my-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {isLoading ? "..." : analytics.pageViews.toLocaleString()}
          </div>
          <div className="text-xs text-rhodium uppercase tracking-wide">
            Page Views
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">
            {isLoading ? "..." : analytics?.formsSend ?? 0}
          </div>
          <div className="text-xs text-rhodium uppercase tracking-wide">
            Forms Send
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {isLoading ? "..." : analytics.personalizations}
          </div>
          <div className="text-xs text-rhodium uppercase tracking-wide">
            Personalization Actions
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-violet-400">
            {isLoading ? "..." : analytics.campaignsClicked}
          </div>
          <div className="text-xs text-rhodium uppercase tracking-wide">
            Campaigns Clicked
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
