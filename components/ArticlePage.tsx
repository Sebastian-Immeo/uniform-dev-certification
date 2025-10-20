import {
  registerUniformComponent,
  UniformRichText,
  UniformText,
} from "@uniformdev/canvas-react";
import Image from "next/image";
import { useUniformContext } from "@uniformdev/context-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type ArticlePageProps = {
  image: string;
};

const ArticlePage = (props: ArticlePageProps) => {
  const { context } = useUniformContext();
  // This is deprecated.
  console.log("UNIFORM CONTEXT:", useUniformContext());
  const test = context.events;
  const router = useRouter();
  const slug = Array.isArray(router.query.sub)
    ? router.query.sub[1]
    : undefined;

  // useEffect(() => {
  //   console.log("ArticlePage slug:", slug);
  //   if (!slug) return;
  //   const key = `articleRead:${slug}`;
  //   if (!sessionStorage.getItem(key)) {
  //     context.update({
  //       events: {
  //         trackSignal: (signalName, data) => {
  //           console.log(`Tracking signal: ${signalName}`, data);
  //           test.trackSignal(signalName, data);
  //         },
  //       },
  //     });

  //     sessionStorage.setItem(key, "1");
  //   }
  // }, [slug]);

  return (
    <div className="min-h-[70dvh] max-w-[1200px] mx-auto py-12">
      <div className="relative z-10 mb-2">
        <Image
          src={props.image || "/placeholder.svg"}
          alt="Article image"
          className="mx-auto w-full h-auto rounded-lg shadow-md aspect-video"
          data-test-id="hero-image"
          width={800}
          height={400}
        />
      </div>

      <div className="w-full flex justify-between items-center">
        <UniformText
          parameterId="authorRef"
          as="span"
          className="text-sm gray-500"
          data-test-id="author-ref"
          placeholder="categories go here"
        />
        <button className="bg-carbon py-1 px-2 rounded-md flex items-center">
          <span className="text-xs text-white">
            #{" "}
            <UniformText
              parameterId="categories"
              as="span"
              className="text-xs text-white"
              data-test-id="categories"
              placeholder="categories go here"
            />
          </span>
        </button>
      </div>

      <UniformText
        parameterId="title"
        as="h1"
        className="text-4xl font-extrabold text-gray-900 mt-8"
        data-test-id="hero-title"
        placeholder="Hero title goes here"
      />

      <UniformRichText
        parameterId="description"
        className="mt-4 text-lg leading-relaxed text-gray-700"
        placeholder="Hero description goes here"
        data-test-id="hero-description"
      />
    </div>
  );
};

registerUniformComponent({
  type: "articlePage",
  component: ArticlePage,
});

export default ArticlePage;
