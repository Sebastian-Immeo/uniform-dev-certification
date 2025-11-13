import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { useUniformContext } from "@uniformdev/context-react";

interface AnalyticsData {
  pageViews: {
    lifetime: number;
    recent: number;
    combined: number;
  };
  avgTimeMinutes: number;
  formSubmissions: number;
  shares: number;
  campaignClicks: number;
  personalizations: number;
}

const Analytics = () => {
  const router = useRouter();
  const { context } = useUniformContext();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: { lifetime: 0, recent: 0, combined: 0 },
    avgTimeMinutes: 0,
    formSubmissions: 0,
    shares: 0,
    campaignClicks: 0,
    personalizations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const path = router.asPath.split("?")[0];

  const fetchAnalytics = useCallback(
    async (incrementPageView = false) => {
      if (!path) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/page-analytics?pagePath=${path}`);
        const result = await response.json();

        if (result.success) {
          setAnalytics((prev) => ({
            pageViews: {
              ...result.data.pageViews,
              combined: incrementPageView
                ? result.data.pageViews.lifetime + 1
                : result.data.pageViews.lifetime,
            },
            avgTimeMinutes: result.data.avgTimeMinutes || 0,
            formSubmissions: result.data.formSubmissions || 0,
            shares: result.data.shares || 0,
            campaignClicks: result.data.campaignClicks || 0,
            personalizations: result.data.personalizations || 0,
          }));
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [path, context.quirks]
  );

  useEffect(() => {
    const handlePageView = () => {
      fetchAnalytics(true);
    };

    const handleCustomEvent = (event: CustomEvent) => {
      setTimeout(() => fetchAnalytics(), 1000);
    };

    // Listen for router events
    router.events.on("routeChangeComplete", handlePageView);

    // Listen for custom tracking events
    window.addEventListener("gtm:pageView", handlePageView);
    window.addEventListener("gtm:formSubmit", handleCustomEvent);
    window.addEventListener("gtm:shared", handleCustomEvent); // Already listening for shares
    window.addEventListener("gtm:specialOfferClicked", handleCustomEvent);

    return () => {
      router.events.off("routeChangeComplete", handlePageView);
      window.removeEventListener("gtm:pageView", handlePageView);
      window.removeEventListener("gtm:formSubmit", handleCustomEvent);
      window.removeEventListener("gtm:shared", handleCustomEvent); // Already cleaning up
      window.removeEventListener("gtm:specialOfferClicked", handleCustomEvent);
    };
  }, [router.events, fetchAnalytics]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatNumber = (num: number) => {
    if (num === 0 && isLoading) return "...";
    if (num === 0) return 0;
    return num.toLocaleString();
  };

  const formatTime = (minutes: number) => {
    if (minutes === 0 && isLoading) return "...";
    if (minutes === 0) return 0;
    return `${minutes}m`;
  };

  return (
    <div className="bg-carbon rounded-b-xl px-8 py-6 border-t-1 border-rhodium">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-rhodium tracking-wide">
            Page Analytics
          </h3>
        </div>

        <div className="grid grid-cols-6 gap-6 py-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {formatNumber(analytics.pageViews.combined)}
            </div>
            <div className="text-xs text-rhodium uppercase tracking-wide">
              Page Views
            </div>
            <div className="text-xs text-rhodium/60 mt-1">
              {analytics.pageViews.recent > 0 &&
                `${analytics.pageViews.recent} (recent 7d)`}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {formatTime(analytics.avgTimeMinutes)}
            </div>
            <div className="text-xs text-rhodium uppercase tracking-wide">
              Avg. Time
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400">
              {formatNumber(analytics.shares)}
            </div>
            <div className="text-xs text-rhodium uppercase tracking-wide">
              Times Shared
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">
              {formatNumber(analytics.formSubmissions)}
            </div>
            <div className="text-xs text-rhodium uppercase tracking-wide">
              Forms Sent
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {formatNumber(analytics.personalizations)}
            </div>
            <div className="text-xs text-rhodium uppercase tracking-wide">
              Personalization Events
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-violet-400">
              {formatNumber(analytics.campaignClicks)}
            </div>
            <div className="text-xs text-rhodium uppercase tracking-wide">
              Campaigns Clicked
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-rhodium/20">
          <div className="text-xs text-rhodium/60 flex justify-between">
            <span> PATH: {path}</span>
            {lastUpdate && (
              <span className="text-xs text-rhodium/60">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
