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
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      <div
        className={`fixed top-8 right-4 z-50 ${
          router.query.is_incontext_editing_mode !== "true" ? "hidden" : ""
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-carbon hover:bg-magnesium rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-rhodium/30"
          aria-label="Toggle analytics dashboard"
        >
          <svg
            className="w-5 h-5 text-rhodium"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </button>
      </div>

      {/* Analytics Dashboard */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-40 w-96 bg-carbon rounded-xl shadow-2xl border border-rhodium/30 animate-in slide-in-from-top-2 duration-300">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-rhodium tracking-wide">
                Page Analytics
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-rhodium/60 hover:text-rhodium transition-colors"
                aria-label="Close analytics"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400">
                  {formatNumber(analytics.pageViews.combined)}
                </div>
                <div className="text-xs text-rhodium uppercase tracking-wide">
                  Page Views
                </div>
                <div className="text-xs text-rhodium/60 mt-1">
                  {analytics.pageViews.recent > 0 &&
                    `${analytics.pageViews.recent} (7d)`}
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-emerald-400">
                  {formatTime(analytics.avgTimeMinutes)}
                </div>
                <div className="text-xs text-rhodium uppercase tracking-wide">
                  Avg. Time
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-rose-400">
                  {formatNumber(analytics.shares)}
                </div>
                <div className="text-xs text-rhodium uppercase tracking-wide">
                  Shares
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-amber-400">
                  {formatNumber(analytics.formSubmissions)}
                </div>
                <div className="text-xs text-rhodium uppercase tracking-wide">
                  Forms
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">
                  {formatNumber(analytics.personalizations)}
                </div>
                <div className="text-xs text-rhodium uppercase tracking-wide">
                  Personalizations
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-violet-400">
                  {formatNumber(analytics.campaignClicks)}
                </div>
                <div className="text-xs text-rhodium uppercase tracking-wide">
                  Campaigns
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-rhodium/20">
              <div className="text-xs text-rhodium/60 space-y-1">
                <div className="truncate">PATH: {path}</div>
                {lastUpdate && (
                  <div>Updated: {lastUpdate.toLocaleTimeString()}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Analytics;
