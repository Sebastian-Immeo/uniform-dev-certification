import { useUniformContext } from "@uniformdev/context-react";
import { useEffect } from "react";

export default function GTMDataLogger() {
  const { context } = useUniformContext();

  useEffect(() => {
    const quirks = context.quirks;
    console.log("🎯 Current Uniform Quirks:", quirks);

    if (quirks.pagesLoaded) {
      console.log(`🔥 User has loaded ${quirks.pagesLoaded} pages total!`);
    }

    // Listen for context updates using the proper events API
    const handleContextUpdate = (eventData: any) => {
      console.log("📈 Context updated:", eventData);
      const updatedQuirks = context.quirks;
      if (updatedQuirks.pagesLoaded) {
        console.log(
          `📊 Updated pages loaded count: ${updatedQuirks.pagesLoaded}`
        );
      }
    };

    // Subscribe to context events using the proper events API
    context.events.on("*", handleContextUpdate);

    return () => {
      // Unsubscribe from events on cleanup
      context.events.off("*", handleContextUpdate);
    };
  }, [context]);

  return null; // This component doesn't render anything
}
