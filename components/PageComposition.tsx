import { UniformDeployedPreviewBanner } from "@/components/UniformDeployedPreviewBanner";
import { useSetViewportQuirk } from "@/hooks/useSetViewportQuirk";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";
import Head from "next/head";
import Footer from "./Footer";
import Navigation, { NavLink } from "./Navigation";
import Script from "next/script";
import GTMDataLogger from "../components/GTMDataLogger";

export interface PageCompositionProps {
  data: RootComponentInstance;
  navLinks: Array<NavLink>;
}

export default function PageComposition({
  data: composition,
  navLinks,
}: PageCompositionProps) {
  const { metaTitle } = composition?.parameters || {};
  // set initial viewport quirk
  useSetViewportQuirk();

  const pageId = composition?._name || "unknown-page-id";

  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const loadGTM = !!GTM_ID;

  const pageTags = {
    poc: "We have contact to dataLayer from here",
    event: "pageView",
    pageId: pageId,
    pageTitle: metaTitle?.value || "Untitled Page",
    pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
  };

  return (
    <>
      {loadGTM && (
        <>
          {/* Page tracking script */}
          <Script
            id={`pages-loaded-tracker-${pageId}`}
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                  (function() {
                    var trackerId = 'tracker_${pageId.replace(
                      /[^a-zA-Z0-9]/g,
                      "_"
                    )}';
                    
                    // Prevent duplicate execution for this specific page
                    if (window[trackerId + '_executed']) {
                      console.log('📊 GTM: Page tracker already executed for ${pageId}, skipping...');
                      return;
                    }
                    window[trackerId + '_executed'] = true;
                    
                    console.log('📊 GTM: Initializing pages loaded tracker for pageId: ${pageId}');
                    
                    window.currentPagePushed = window.currentPagePushed || null;
                    
                    // Track pages loaded across sessions with unique variable names
                    var storageKey_${pageId.replace(
                      /[^a-zA-Z0-9]/g,
                      "_"
                    )} = 'uniform_pages_loaded';
                    var pagesLoaded_${pageId.replace(/[^a-zA-Z0-9]/g, "_")} = 1;
                    
                    try {
                      var stored_${pageId.replace(
                        /[^a-zA-Z0-9]/g,
                        "_"
                      )} = localStorage.getItem(storageKey_${pageId.replace(
                /[^a-zA-Z0-9]/g,
                "_"
              )});
                      pagesLoaded_${pageId.replace(
                        /[^a-zA-Z0-9]/g,
                        "_"
                      )} = stored_${pageId.replace(
                /[^a-zA-Z0-9]/g,
                "_"
              )} ? parseInt(stored_${pageId.replace(
                /[^a-zA-Z0-9]/g,
                "_"
              )}) + 1 : 1;
                      localStorage.setItem(storageKey_${pageId.replace(
                        /[^a-zA-Z0-9]/g,
                        "_"
                      )}, pagesLoaded_${pageId.replace(
                /[^a-zA-Z0-9]/g,
                "_"
              )}.toString());
                    } catch (e) {
                      console.warn('Could not access localStorage for pages tracking');
                    }
                    
                    var currentPageId = "${pageId}";
                    if (window.currentPagePushed !== currentPageId) {
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({
                        ...${JSON.stringify(pageTags)},
                        pagesLoaded: pagesLoaded_${pageId.replace(
                          /[^a-zA-Z0-9]/g,
                          "_"
                        )}
                      });
                      window.currentPagePushed = currentPageId;
                      
                      console.log('📊 GTM: Pages loaded count:', pagesLoaded_${pageId.replace(
                        /[^a-zA-Z0-9]/g,
                        "_"
                      )});
                      console.log('📊 GTM: DataLayer pushed:', window.dataLayer);
                    }
                  })();
                `,
            }}
          />

          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />

          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      <UniformDeployedPreviewBanner />
      <main className="main">
        <Navigation navLinks={navLinks} />

        <GTMDataLogger />
        <UniformComposition data={composition} />
        <Footer />
      </main>
    </>
  );
}
