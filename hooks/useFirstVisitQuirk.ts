import { useEffect } from "react";
import { useUniformContext } from "@uniformdev/context-react";

export function useFirstVisitQuirk() {
  const { context } = useUniformContext({ throwOnMissingProvider: false });
  useEffect(() => {
    // Only set it on the *very first* pass when there's no quirk yet:
    console.log("Setting firstVisit quirk to false", context.quirks);
    if (context && (context.quirks as Record<string, any>)?.firstVisit) {
      // context.update({ quirks: { firstVisit: "1" } });
    } else {
      context?.update({
        quirks: {
          firstVisit: "1",
        },
      });
    }

    context?.update({
      quirks: {
        firstVisit: "1",
      },
    });
  }, [context]);
}
