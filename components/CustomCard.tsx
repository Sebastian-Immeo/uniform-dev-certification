import {
  ComponentProps,
  registerUniformComponent,
  UniformText,
} from "@uniformdev/canvas-react";
import Image from "next/image";

type CustomCardParameters = {
  title?: string;
  description?: string;
  buttonText?: string;
  background?: { fields: { url: { value: string } } }[];
  url?: { path: string };
};

export default function CustomCard(
  props: ComponentProps<CustomCardParameters>
) {
  const { background, url } = props ?? {};
  const imageUrl = background?.[0]?.fields?.url?.value || "/placeholder.svg";

  return (
    <a
      href={url?.path || "#"}
      className="group relative w-full max-w-md mx-auto flex flex-col rounded-2xl overflow-hidden bg-[#0F1923]
             shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl h-[384px]"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover w-full h-full transform transition-transform duration-500 ease-in-out
                   group-hover:scale-110"
            priority
          />
        </div>
        <div
          className="absolute inset-0 bg-black/40 opacity-60 transition-opacity duration-300 ease-in-out
                    group-hover:opacity-100"
        />
      </div>

      <div className="relative z-10 flex flex-col p-6 space-y-4 h-full">
        <h3
          className="text-white text-3xl font-medium"
          style={{ fontFamily: "Britti Sans" }}
        >
          <UniformText placeholder="Title text here" parameterId="title" />
        </h3>

        <p className="text-white text-base font-medium">
          <UniformText
            placeholder="Type Description Here"
            parameterId="description"
          />
        </p>

        <button
          className="mt-auto ml-auto inline-block bg-white text-black text-base font-medium
                 px-6 py-2 rounded-md shadow transition-all duration-200
                 hover:bg-gray-100 hover:shadow-md hover:-translate-y-1 pointer-events-none"
          style={{ fontFamily: "Britti Sans" }}
        >
          <UniformText
            placeholder="Type Button Text Here"
            parameterId="buttonText"
          />
        </button>
      </div>
    </a>
  );
}

registerUniformComponent({ type: "customCard", component: CustomCard });
