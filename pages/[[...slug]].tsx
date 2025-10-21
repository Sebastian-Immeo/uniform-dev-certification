import PageComposition from "@/components/PageComposition";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { getCompositionsForNavigation } from "@/lib/uniform/canvasClient";

export const getServerSideProps = withUniformGetServerSideProps({
  // fetching draft composition in dev mode for convenience
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
  handleComposition: async ({ compositionApiResponse }, { preview }, _defaultHandler) => {
    const { composition } = compositionApiResponse || {};
    const navLinks = await getCompositionsForNavigation(preview);
    return {
      props: {
        data: composition,
        navLinks,
      },
    };
  },
});

export default PageComposition;
