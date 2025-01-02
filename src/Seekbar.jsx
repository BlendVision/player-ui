/* @jsxImportSource @emotion/react */
import { useReducer, useRef, cloneElement, useEffect } from "react";
import useDimensions from "react-cool-dimensions";
import { FormattedTime } from "./intl";
import SimpleSlider from "./SimpleSlider";
import SeekbarTrack from "./SeekbarTrack";
import { getTimelineSegments } from "./utils/timeline";

const seekbarStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  minWidth: "0",
  height: "24px",
  letterSpacing: "1px",
  color: "#fff",
};

const sliderStyle = {
  minWidth: "0",
  flex: 1,
  "@media (hover: hover), screen and (-ms-high-contrast: active), (-ms-high-contrast: none)":
    {
      "> div:last-of-type": {
        opacity: 0,
        transition: "opacity 0.2s ease-out",
      },
    },
  "> div:last-of-type": {
    background: "var(--theme-color, red)",
  },
  "&:hover > div:last-of-type": {
    opacity: 1,
  },
};

const reducePointer = (state, { type, value, x }) => {
  switch (type) {
    case "move":
      return { ...state, hover: true, value, x };
    case "change":
      return { ...state, focused: true, value };
    case "release":
      return { ...state, focused: false, value };
    case "leave":
      return { ...state, hover: false };
    default:
      return state;
  }
};

const SeekbarRail = () => "";

// TODO use className instead of classes ?
const Seekbar = ({
  style,
  classes,
  startTime = 0,
  currentTime,
  bufferTime,
  duration,
  marks,
  timeDisplay = false, // TODO more scalable way?
  focusValue,
  metadata = {},
  slots = {},
  slotProps = {},
  onChange,
  onChangeCommitted,
  children,
  getSceneTitle, // to display second line for tag names, but now moved to clips, may remove if no long needed
  ...rest
}) => {
  const components = { SeekbarRail, SeekbarTrack, ...slots };
  const [pointerState, dispatchPointer] = useReducer(reducePointer, {});
  const pointerActive = pointerState.hover || pointerState.focused;
  // to reflect boundary when container resized
  const { observe } = useDimensions();
  const ref = useRef();
  const rect = ref.current?.getBoundingClientRect();
  const handlers = onChangeCommitted && {
    onPointerMove: (_, { value, x }) =>
      dispatchPointer({ type: "move", value, x }),
    onPointerLeave: () => dispatchPointer({ type: "leave" }),
    onChange: (_, { value }) => {
      onChange?.(value);
      dispatchPointer({ type: "change", value });
    },
    onChangeCommitted: (_, { value }) => {
      dispatchPointer({ type: "release", value });
      onChangeCommitted?.(value);
    },
  };
  const endTime = startTime + duration;
  useEffect(() => {
    if (focusValue > 0) {
      dispatchPointer({ type: "move", value: focusValue, x: 123 });
    }
  }, [focusValue]);
  const segments = getTimelineSegments(metadata.chapters, {
    startTime,
    current: pointerState.focused ? pointerState.value : currentTime,
    buffered: bufferTime,
    duration,
  });

  return (
    <div
      ref={(element) => {
        observe(element);
        ref.current = element;
      }}
      css={[
        seekbarStyle,
        metadata.clips?.length && {
          "&:hover": {
            // stack seekbar addons on other UI
            "~ button, ~div": {
              position: "relative",
              zIndex: "-1 !important",
            },
          },
        },
        style,
      ]}
      style={
        rect && {
          "--seekbar-left": `${rect.left}px`,
          "--seekbar-right": `${rect.right}px`,
          "--pointer-x": `${pointerState.x}px`,
        }
      }
    >
      {!timeDisplay ? (
        ""
      ) : pointerActive ? (
        <FormattedTime time={pointerState.value} />
      ) : (
        <FormattedTime time={currentTime} />
      )}
      <SimpleSlider
        css={[sliderStyle, timeDisplay && { margin: "0 1em" }]}
        classes={classes}
        disabled={!onChangeCommitted}
        // display filled when seek handler is not provided, from PlayBoy behavior
        value={onChangeCommitted ? currentTime : endTime}
        min={startTime}
        max={endTime}
        marks={marks}
        {...handlers}
        {...rest}
        slots={{ Rail: components.SeekbarRail, Track: components.SeekbarTrack }}
        slotProps={{
          track: {
            segments,
            startTime,
            duration,
            metadata,
            ...slotProps.seekbarTrack,
          },
        }}
      />
      {timeDisplay && <FormattedTime time={duration} />}
      {children &&
        [].concat(children).map((child) =>
          cloneElement(child, {
            title: getSceneTitle?.(chapters, currentTime),
            time: pointerActive && pointerState.value,
          })
        )}
    </div>
  );
};

export default Seekbar;
