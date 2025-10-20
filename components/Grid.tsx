import {
  registerUniformComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";

export default function Grid() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
      <UniformSlot name="gridItems" />
    </ul>
  );
}

registerUniformComponent({ type: "grid", component: Grid });
