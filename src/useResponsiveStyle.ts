import useDimensions from "react-cool-dimensions";

const breakpoints = {
  default: 0,
  "small-embed": 200,
  embed: 400,
  "tablet-portrait": 600,
  "tablet-landscape": 900,
  desktop: 1200,
  "big-desktop": 1800,
};

const responsiveStyles: { [key: string]: object } = {
  default: { fontSize: "12px" },
  "small-embed": { fontSize: "16px" },
  embed: { fontSize: "16px" },
  "tablet-portrait": { fontSize: "18px" },
  "tablet-landscape": { fontSize: "18px" },
  desktop: { fontSize: "20px" },
  "big-desktop": { fontSize: "24px" },
};

const useResponsiveStyle = () => {
  const { observe, currentBreakpoint } = useDimensions({ breakpoints });

  return {
    observe,
    currentBreakpoint,
    responsiveStyle: responsiveStyles[currentBreakpoint],
  };
};

export default useResponsiveStyle;
