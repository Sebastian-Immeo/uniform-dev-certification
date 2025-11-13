import {
  ComponentProps,
  registerUniformComponent,
  UniformRichText,
  UniformText,
} from "@uniformdev/canvas-react";

export const TextSection = ({
  component,
  width,
}: ComponentProps<{
  header: string;
  description: string;
  width: "full" | "half";
}>) => {
  const variant = component?.variant || "default";

  return (
    <div className={`w-${width}`}>
      <h3
        className={`text-heading-3 mb-ft-4 ${
          variant === "dark" ? "text-white" : "text-carbon"
        }`}
      >
        <UniformText parameterId="header" />
      </h3>
      <div
        className={`rich-text ${
          variant === "dark" ? "text-white" : "text-carbon"
        }`}
      >
        <UniformRichText parameterId="description" />
      </div>
    </div>
  );
};

registerUniformComponent({
  type: "TextSection",
  component: TextSection,
});
