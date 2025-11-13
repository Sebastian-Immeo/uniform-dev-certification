import { registerUniformComponent } from "@uniformdev/canvas-react";
import { ContactOverlay } from "./Forms/Form Popover/C.20 ContactFloating";
import { PopoverForm } from "./Forms/Form Popover/C.21 PopoverForm";
import InlineFormSection from "./Forms/Form Section/C.21B FormSection";

registerUniformComponent({
  type: "employeeDataContainer",
  component: ContactOverlay,
});

registerUniformComponent({
  type: "c21SignUpFormulars",
  component: ContactOverlay,
});

registerUniformComponent({
  type: "dynamicForm",
  component: InlineFormSection,
});
