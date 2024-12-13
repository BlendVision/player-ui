/* @jsxImportSource @emotion/react */
import icon from "./icons";

const Icon = ({ type, ...others }) => (
  <div
    css={{
      width: "1em",
      height: "1em",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundImage: `var(--icon-${type}, url(${icon[type]}))`,
      pointerEvents: "none",
      touchAction: "none",
    }}
    aria-label={type}
    {...others}
  />
);

export default Icon;
