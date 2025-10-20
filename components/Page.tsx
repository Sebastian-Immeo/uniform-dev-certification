import {
  registerUniformComponent,
  UniformSlot,
  type ComponentProps,
} from "@uniformdev/canvas-react";

type PageProps = ComponentProps;

const Page: React.FC<PageProps> = (props) => {
  
  return (
    <div className="min-h-[70dvh] max-w-[1200px] mx-auto py-12">
      <UniformSlot name="pageHero" />
      <UniformSlot name="content" />
    </div>
  );
};

registerUniformComponent({
  type: "page",
  component: Page,
});

export default Page;
