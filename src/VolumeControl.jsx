/* @jsxImportSource @emotion/react */
import { useRef } from "react";
import { Button } from "./buttons";
import SimpleSlider from "./SimpleSlider";
import { isDesktop, isIOS } from "./utils/dom";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sliderStyles = {
  vertical: {
    position: "absolute",
    padding: "0.2em calc(0.66em - 2px)", // TODO better CSS usage for rail size
    borderTop:
      "0.3em solid var(--setting-ui-background, var(--panel-background, #161C24))",
    borderBottom:
      "0.3em solid var(--setting-ui-background, var(--panel-background, #161C24))",
    borderRadius: "4px",
    display: "none",
    width: "1.33em",
    height: "6.3em",
    justifyContent: "center",
    background:
      "var(--setting-ui-background, var(--panel-background, #161C24))",
    opacity: "0.8",
    "&:before": {
      // space between volume button & slider
      content: '" "',
      position: "absolute",
      bottom: "-1em",
      width: "100%",
      height: "1em",
    },
  },
  horizontal: {
    width: "5em",
    "> div:first-of-type": {
      height: "0.25em",
    },
  },
};

/**
 * @param object
 * @param {true | false | 'horizontal' | 'vertical'} .slider
 */
const VolumeControl = ({ slider = "vertical", value, onChange, ...rest }) => {
  const lastVolume = useRef(0.05);
  // iOS video volume locks to 1, sliders won't work (OTP-1878)
  // TODO: consider the condition in larger screen (in vertical style)
  const sliderOrientation = !isIOS() && isDesktop() ? slider : false;
  const volume = value;
  const muted = volume < 0.01;
  const iconName =
    volume === 0 || muted ? "mute" : volume < 0.5 ? "volumeLow" : "volumeHigh";
  const bottom = "3.25em"; // TODO variant for audio UI

  return (
    <div
      css={[
        style,
        sliderOrientation && {
          "> div":
            sliderOrientation === "vertical"
              ? { ...sliderStyles.vertical, bottom }
              : sliderStyles.horizontal,
        },
        sliderOrientation === "vertical" && {
          "&:hover > div": {
            display: "flex",
          },
        },
      ]}
      {...rest}
    >
      <Button
        startIcon={iconName}
        onClick={() =>
          onChange(muted ? Math.max(lastVolume.current, 0.05) : 0, {
            commit: "mute",
          })
        }
      />
      {sliderOrientation && (
        <SimpleSlider // TODO instant feedback for change volume
          orientation={sliderOrientation}
          value={muted ? 0 : volume}
          max={1}
          onChange={(_, { value }) => {
            lastVolume.current = value;
            onChange(value);
          }}
          onChangeCommitted={(_, { value }) =>
            onChange(value, { commit: true })
          }
        />
      )}
    </div>
  );
};

export default VolumeControl;
