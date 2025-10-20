import { UniformDeployedPreviewBanner } from "@/components/UniformDeployedPreviewBanner";
import { useSetViewportQuirk } from "@/hooks/useSetViewportQuirk";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";
import Head from "next/head";
import Footer from "./Footer";
import Navigation, { NavLink } from "./Navigation";
import Script from "next/script";

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

  console.log("composition", composition);

  const pageId = composition?._name || "unknown-page-id";

  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const loadGTM = GTM_ID;

  const pageTags = {
    poc: "We have contact to dataLayer from here",
    event: "pageView",
    pageId: pageId,
    pageTitle: metaTitle?.value || "Untitled Page",
    pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
  };

  return (
    <>
      <Head>
        <title>{metaTitle?.value as string}</title>

        {loadGTM && (
          <>
            <Script
              id={`gtm-datalayer-${pageId}`}
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                window.currentPagePushed = window.currentPagePushed || null;
                
                const pageId = "${pageId}";
                if (window.currentPagePushed !== pageId) {
                  window.dataLayer.push(${JSON.stringify(pageTags)});
                  window.currentPagePushed = pageId;
                }
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
      </Head>
      <UniformDeployedPreviewBanner />
      <main className="main">
        <Navigation navLinks={navLinks} />

        <UniformComposition data={composition} />
        <Footer />
      </main>
    </>
  );
}
