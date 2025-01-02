/* @jsxImportSource @emotion/react */
import { useState, useRef } from "react";

import { getPointerData } from "./utils/gestures";

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  userSelect: "none",
  touchAction: "none",
};

const disabledStyle = {
  pointerEvents: "none",
};

const railStyle = {
  flex: "100%",
  background: "rgba(255, 255, 255, 0.2)",
};

const trackStyle = {
  position: "absolute",
  width: "4px",
  height: "100%",
  backgroundColor: "var(--sender-seekbar-background, #fff)",
};

const markStyle = {
  position: "absolute",
  height: railStyle.height,
  width: "4px",
  transform: "translateX(-50%)",
  backgroundColor: "#ff9835",
};

const thumbStyle = {
  position: "absolute",
  height: "0.66em",
  width: "0.66em",
  borderRadius: "100%",
  backgroundColor: "#fff",
  boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.5)",
  transform: "translateY(calc(var(--slider-thumb-y) - 0.35em))",
};

const getPointerValue = ({ orientation, x, y, left, bottom, height, width }) =>
  Math.max(
    0,
    orientation === "vertical"
      ? Math.min((bottom - y) / height, 1)
      : Math.min((x - left) / width, 1)
  );

const debouncedPointerHandlers = ({ state, onMove, onLeave }) => {
  const emit = () => { // TODO gesture handling with no React
    if (!state.scheduled) {
      return;
    }
    if (state.type === "leave") {
      onLeave?.(state.event, state);
    } else {
      onMove(state.event, state);
    }
    state.scheduled = false;
  };
  const schedule = () => {
    if (state.scheduled) {
      return;
    }
    state.scheduled = true;
    requestAnimationFrame(emit);
  };

  return {
    onPointerMove: (event) => {
      const type =
        event.buttons > 0 || event.touches?.length > 0 ? "change" : "move";
      Object.assign(state, { event, type, ...getPointerData(event) });
      schedule();
    },
    onPointerLeave: (event) => {
      const type = "leave";
      Object.assign(state, { event, type });
      schedule();
    },
    emit,
  };
};

const eventHandlers = ({
  onPointerDown,
  onPointerMove,
  onPointerLeave,
  onPointerUp,
}) => ({
  onPointerDown,
  onPointerMove,
  onPointerLeave,
  onPointerUp,
  onTouchStart: onPointerDown,
  onTouchMove: onPointerMove,
  onTouchEnd: (event) => {
    onPointerLeave(event);
    onPointerUp(event);
  },
});

const SliderRail = ({ orientation, style, ...rest }) => (
  <div
    css={[
      style,
      orientation !== "horizontal" && {
        borderRadius: "0.2em",
        alignSelf: "normal",
      },
    ]}
    {...rest}
  />
);

const SliderTrack = ({ value, orientation, style, ...rest }) => (
  <div
    css={[
      style,
      orientation === "vertical"
        ? { bottom: "0", height: `${value * 100}%` }
        : { width: `${value * 100}%` },
    ]}
    {...rest}
  />
);

const defaultSlots = {
  Rail: SliderRail,
  Track: SliderTrack,
};

// TODO align with material ui more, move special handling of pointer events
const SimpleSlider = ({
  min = 0,
  max = 100,
  value,
  secondaryTrackValue, // TODO a better name
  marks = [],
  className = "",
  classes = {},
  disabled,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onChange,
  onChangeCommitted,
  orientation = "horizontal",
  slots = defaultSlots,
  slotProps = {},
}) => {
  const pointerState = useRef({});
  const [focusValue, setFocusValue] = useState(-Infinity);
  const thumbPosition =
    ((focusValue >= min ? focusValue : value) - min) / (max - min);
  const subTrackPosition = (secondaryTrackValue - min) / (max - min);
  const pointerHandlers = debouncedPointerHandlers({
    state: pointerState.current,
    onMove: (event, { type, x, y, width, left, height, bottom }) => {
      const pointerData = { orientation, x, y, left, bottom, width, height };
      const pointerValue = min + (max - min) * getPointerValue(pointerData);

      onPointerMove?.(event, { value: pointerValue, x, y });
      if (type === "change") {
        setFocusValue(pointerValue);
        onChange?.(event, { value: pointerValue, x, y });
      }
    },
    onLeave: () => onPointerLeave?.(),
  });
  const handlePointerUp = (event) => {
    if (event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const { x, y, width, left, height, bottom } = getPointerData(event);
    const pointerValue =
      min +
      (max - min) *
        getPointerValue({ orientation, x, y, left, bottom, width, height });

    pointerHandlers.emit();
    onChangeCommitted?.(event, { value: pointerValue });
    setFocusValue();
  };

  const thumbPositionStyle = {
    bottom: `calc(var(--slider-thumb-y) - 0.35em)`,
    left: `calc(var(--slider-thumb-x) - 0.25em)`,
  };

  return (
    <div
      className={className}
      css={[containerStyle, disabled && disabledStyle]}
      style={{
        ...(orientation === "vertical" && {
          flexDirection: "column",
          "--slider-thumb-y": `${thumbPosition * 100}%`,
        }),
        ...(orientation === "horizontal" && {
          "--slider-thumb-x": `${thumbPosition * 100}%`,
        }),
      }}
      onClick={(event) => event.stopPropagation()}
      {...eventHandlers({
        onPointerDown: (event) => {
          if (event.type === "pointerdown") {
            event.currentTarget.setPointerCapture(event.pointerId);
            onPointerDown?.();
          }
          pointerHandlers.onPointerMove(event);
        },
        ...pointerHandlers,
        onPointerUp: handlePointerUp,
      })}
    >
      <slots.Rail
        style={railStyle}
        className={classes.rail}
        {...slotProps.rail}
      />
      {secondaryTrackValue && (
        <slots.Track
          style={{ ...trackStyle, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          orientation={orientation}
          value={subTrackPosition}
          {...slotProps.track}
        />
      )}
      <slots.Track
        className={classes.track}
        style={trackStyle}
        orientation={orientation}
        value={thumbPosition}
        {...slotProps.track}
      />
      {marks.map((position) => (
        <div
          key={position}
          css={markStyle}
          className={classes.marked}
          style={{ left: `${(position / max) * 100}%` }}
        />
      ))}
      {onChange && !disabled ? (
        <div
          css={thumbStyle}
          className={classes.thumb}
          style={thumbPositionStyle}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default SimpleSlider;
