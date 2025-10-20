export function enableGTMDataPlugin() {
  return {
    init: (context) => {
      const updateUniformWithGTMData = () => {
        if (typeof window === "undefined") return;

        // Read from dataLayer
        const dataLayer = window.dataLayer || [];
        let pagesLoaded = 0;

        // Find the most recent pageView event with pagesLoaded
        for (let i = dataLayer.length - 1; i >= 0; i--) {
          if (dataLayer[i].event === "pageView" && dataLayer[i].pagesLoaded) {
            pagesLoaded = dataLayer[i].pagesLoaded;
            break;
          }
        }

        // Fallback: read directly from localStorage
        if (pagesLoaded === 0) {
          try {
            const stored = localStorage.getItem("uniform_pages_loaded");
            pagesLoaded = stored ? parseInt(stored) : 0;
          } catch (e) {
            console.warn("Could not read pagesLoaded from storage");
          }
        }

        // Update Uniform Context
        if (pagesLoaded > 0) {
          context.update({
            quirks: {
              pagesLoaded: pagesLoaded,
            },
          });

          console.log(
            "✅ Uniform Context updated with pagesLoaded:",
            pagesLoaded
          );
        }
      };

      // Initial update after a short delay (let GTM script run first)
      setTimeout(updateUniformWithGTMData, 200);

      // Listen for dataLayer changes
      if (typeof window !== "undefined" && window.dataLayer) {
        const originalPush = window.dataLayer.push;
        window.dataLayer.push = function (...args) {
          originalPush.apply(window.dataLayer, args);
          // Update when pageView events are pushed
          if (args[0]?.event === "pageView") {
            setTimeout(updateUniformWithGTMData, 50);
          }
        };
      }

      return () => {
        // Cleanup if needed
      };
    },
  };
}
