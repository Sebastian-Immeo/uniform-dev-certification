import {
  registerUniformComponent,
  UniformText,
} from "@uniformdev/canvas-react";
import React from "react";

interface LogoProps {
  logoText: string;
}

const Logo: React.FC<LogoProps> = (props: LogoProps) => {
  return <UniformText placeholder="Logo text" parameterId="logoText" as="span" />;
};

export default Logo;

registerUniformComponent({
  type: "logo",
  component: Logo,
});
