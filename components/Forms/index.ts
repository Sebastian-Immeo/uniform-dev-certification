import { registerUniformComponent } from "@uniformdev/canvas-react";
import { ContactOverlay } from "./Form Popover/C.20 ContactFloating";
import { PopoverForm } from "./Form Popover/C.21 PopoverForm";
import InlineFormSection from "./Form Section/C.21B FormSection";

registerUniformComponent({
  type: "employeeDataContainer",
  component: ContactOverlay,
});

registerUniformComponent({
  type: "c21SignUpFormulars",
  component: PopoverForm,
});

registerUniformComponent({
  type: "dynamicForm",
  component: InlineFormSection,
});
