/* @jsxImportSource @emotion/react */
import { useState, useEffect, useRef, cloneElement } from "react";
import { createPortal } from "react-dom";

import {
  getPopoverPosition,
  getTopElement,
  havePointer,
  isDesktop,
} from "./utils/dom";
import { FormattedMessage, useIntl } from "./intl";
import Icon from "./Icon";

const styles = {
  // TODO keep only necessary
  border: "none",
  outline: "none",
  cursor: "pointer",
  padding: 0,
  flexShrink: 0,
  color: "inherit",
  backgroundColor: "transparent",
  userSelect: "none",
  "> span": {
    width: "100%",
    height: "100%",
  },
};

const variants = {
  outlined: {
    width: "8em",
    height: "2em",
    border: "1px solid var(--theme-color)",
    borderRadius: "4px",
    background: "none",
    color: "var(--theme-color)",
    opacity: 0.8,
  },
  text: { color: "var(--theme-color)" },
  contained: { color: "#fff", backgroundColor: "var(--theme-color)" },
};

const tooltipStyle = {
  zIndex: 7,
  position: "fixed",
  padding: "4px",
  textAlign: "center",
  color: "white",
  background: "var(--panel-background, #161C24)",
};

const isOverflowing = (element) => element.scrollWidth > element.clientWidth;

const Tooltip = ({
  title,
  placement,
  overflowOnly,
  disabled,
  children,
  container,
}) => {
  const tooltipRef = useRef();
  const boxes = useRef();
  const defaultContainer = useRef();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(() => ({ left: "100%" }));
  const shiftDistance = placement === "top" ? "-4.5em" : "2em";

  const childProps = {
    onMouseEnter: (event) => {
      if (!overflowOnly || isOverflowing(event.currentTarget)) {
        boxes.current = [
          event.currentTarget.getBoundingClientRect(),
          document.body.getBoundingClientRect(),
        ];
        defaultContainer.current = getTopElement();
        setOpen(true);
      }
    },
    onMouseLeave: () => {
      setPosition({ left: "100%" });
      setOpen(false);
    },
  };
  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (open) {
      const targetPosition = getPopoverPosition(
        tooltipRef.current.getBoundingClientRect(),
        ...boxes.current
      );
      targetPosition.left !== position.left && setPosition(targetPosition);
    }
  }, [open, position.left]);

  return !title || !isDesktop() || !havePointer() ? (
    children
  ) : (
    <>
      {cloneElement(children, childProps)}
      {open &&
        createPortal(
          <div
            style={{
              ...tooltipStyle,
              ...position,
              top: `calc(${position.top}px - ${shiftDistance})`,
            }}
            ref={tooltipRef}
          >
            <FormattedMessage id={title} />
          </div>,
          container || defaultContainer.current
        )}
    </>
  );
};

const Button = ({
  startIcon,
  variant,
  style,
  title,
  children,
  placement = "bottom",
  ...rest
}) => (
  <Tooltip title={title} placement={placement} disabled={rest.disabled}>
    <button type="button" css={[styles, variants[variant], style]} {...rest}>
      {typeof startIcon === "string" ? <Icon type={startIcon} /> : startIcon}
      {children}
    </button>
  </Tooltip>
);

const liveButtonStyle = {
  margin: "0 0.5rem 0 1rem",
  padding: "0 0.5em !important",
  height: "2.2em",
  border: "solid 1px",
  borderRadius: "4px",
  color: "#FFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  fontSize: "0.66em !important",
  lineHeight: "1.5",
  svg: {
    marginRight: "0.5em",
    width: "1.5em",
    height: "1em",
    color: "#E93817",
  },
};

const startOverStyle = { svg: { color: "#BDBDBD" } };

const LiveIcon = () => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M3.50071 0.00164345C3.20221 0.0180071 2.90947 0.156604 2.70384 0.408604C1.01511 2.47697 0 5.11508 0 7.98744C0 10.8598 1.01511 13.4979 2.70384 15.5663C3.1162 16.0703 3.87344 16.1161 4.33381 15.6558C4.72544 15.2641 4.76392 14.6388 4.41264 14.2112C3.01955 12.5148 2.18182 10.3471 2.18182 7.98744C2.18182 5.6278 3.01955 3.46112 4.41264 1.76585C4.76392 1.33821 4.72544 0.712882 4.33381 0.321246C4.10363 0.0910639 3.79921 -0.0147202 3.50071 0.00164345ZM20.4993 0.00164345C20.2008 -0.0147202 19.8964 0.0910639 19.6662 0.321246C19.2746 0.712882 19.2361 1.33821 19.5874 1.76585C20.9804 3.46112 21.8182 5.6278 21.8182 7.98744C21.8182 10.3471 20.9804 12.5138 19.5874 14.209C19.2361 14.6367 19.2746 15.262 19.6662 15.6536C20.1266 16.114 20.8849 16.0714 21.2962 15.5663C22.9849 13.499 24 10.8598 24 7.98744C24 5.11508 22.9849 2.47697 21.2962 0.408604C21.0905 0.156604 20.7978 0.0180071 20.4993 0.00164345ZM6.59233 3.10392C6.28974 3.12083 5.99652 3.26174 5.80398 3.52792C4.89852 4.78356 4.36364 6.32489 4.36364 7.98744C4.36364 9.64998 4.89852 11.1913 5.80398 12.447C6.18907 12.9793 6.97348 13.014 7.43821 12.5492L7.44247 12.545C7.82538 12.1621 7.85357 11.5678 7.54048 11.1259C6.9143 10.2379 6.54545 9.15471 6.54545 7.98744C6.54545 6.82017 6.9143 5.73694 7.54048 4.84894C7.85248 4.40604 7.82538 3.81282 7.44247 3.42991L7.43821 3.42565C7.20585 3.19329 6.89492 3.08701 6.59233 3.10392ZM17.4077 3.10392C17.1051 3.08701 16.7942 3.19329 16.5618 3.42565L16.5575 3.42991C16.1746 3.81282 16.1464 4.40713 16.4595 4.84894C17.0857 5.73694 17.4545 6.82017 17.4545 7.98744C17.4545 9.15471 17.0857 10.2379 16.4595 11.1259C16.1475 11.5688 16.1746 12.1621 16.5575 12.545L16.5618 12.5492C17.0265 13.014 17.812 12.9793 18.196 12.447C19.1026 11.1924 19.6364 9.64998 19.6364 7.98744C19.6364 6.32489 19.1015 4.78356 18.196 3.52792C18.0035 3.26174 17.7103 3.12083 17.4077 3.10392ZM12 4.71471C11.132 4.71471 10.2996 5.05952 9.68583 5.67327C9.07208 6.28703 8.72727 7.11946 8.72727 7.98744C8.72727 8.85542 9.07208 9.68785 9.68583 10.3016C10.2996 10.9154 11.132 11.2602 12 11.2602C12.868 11.2602 13.7004 10.9154 14.3142 10.3016C14.9279 9.68785 15.2727 8.85542 15.2727 7.98744C15.2727 7.11946 14.9279 6.28703 14.3142 5.67327C13.7004 5.05952 12.868 4.71471 12 4.71471Z"
    />
  </svg>
);

const LiveButton = ({ usingStartOver, ...rest }) => (
  <Button
    css={[liveButtonStyle, usingStartOver && startOverStyle]}
    startIcon={<LiveIcon />}
    {...rest}
  >
    <FormattedMessage id="LIVE" />
  </Button>
);

const PlayButton = ({
  playbackState,
  ended,
  hidden,
  variant,
  onClick,
  ...rest
}) => (
  <Button
    className="play-button"
    startIcon={
      variant ||
      (ended ? "replay" : playbackState === "playing" ? "pause" : "play")
    }
    title={`KKS.PLAYER.${
      ended ? "REPLAY" : playbackState === "playing" ? "PAUSE" : "PLAY"
    }`}
    onClick={onClick}
    {...rest}
    style={{ ...(hidden && { opacity: 0 }), ...rest.style }}
  />
);

const ForwardButton = ({
  startIcon = "forward10",
  title = "KKS.PLAYER.FORWARD",
  onClick,
  ...rest
}) => (
  <Button
    style={rest.disabled && { opacity: 0.2, display: "block" }}
    startIcon={startIcon}
    title={title}
    onClick={onClick}
    {...rest}
  />
);

const RewindButton = ({
  startIcon = "rewind10",
  title = "KKS.PLAYER.REWIND",
  onClick,
  ...rest
}) => (
  <Button
    style={rest.disabled && { opacity: 0.2, display: "block" }}
    startIcon={startIcon}
    title={title}
    onClick={onClick}
    {...rest}
  />
);

const NextEpisodeButton = ({
  startIcon = "next",
  title = "KKS.PLAYER.NEXT",
  ...rest
}) => (
  <Button
    style={rest.disabled && { display: "null" }}
    startIcon={startIcon}
    title={title}
    {...rest}
  />
);

const PreviousEpisodeButton = ({
  startIcon = "previous",
  title = "KKS.PLAYER.PREVIOUS",
  ...rest
}) => (
  <Button
    style={rest.disabled && { display: "null" }}
    startIcon={startIcon}
    title={title}
    {...rest}
  />
);

const FullscreenButton = ({ viewMode, onClick }) => {
  const icon = viewMode === "fullscreen" ? "exit-fullscreen" : "fullscreen";
  const text = useIntl().formatMessage(
    viewMode === "fullscreen"
      ? "KKS.PLAYER.FULLSCREEN.EXIT"
      : "KKS.PLAYER.FULLSCREEN"
  );

  return (
    <Button
      startIcon={icon}
      title={text}
      style={
        !isDesktop() && { order: "var(--fullscreen-button-order, initial)" }
      }
      onClick={onClick}
    />
  );
};

const PictureInPictureButton = ({ onClick }) => {
  const icon = document.pictureInPictureElement ? "exit-pip" : "pip";
  const text = useIntl().formatMessage(
    document.pictureInPictureElement ? "KKS.PLAYER.PIP.EXIT" : "KKS.PLAYER.PIP"
  );

  if (document.pictureInPictureEnabled) {
    return <Button startIcon={icon} title={text} onClick={onClick} />;
  }
  return null;
};

const skipStyles = {
  display: "flex",
  alignItems: "center",
  padding: "0.5rem",
  border: "1px solid #fff",
  color: "#fff",
  background: "rgba(0, 0, 0, 0.4)",
  fontSize: "24px",
  opacity: 0.8,
  "&:disabled": {
    opacity: 0.5,
  },
  "> div": {
    marginLeft: "0.5rem",
    width: "1.5rem",
    height: "1.5rem",
  },
};

const SkipButton = ({ waitTime, onClick }) => (
  <button
    type="button"
    css={skipStyles}
    disabled={waitTime > 0}
    onClick={onClick}
  >
    {waitTime > 0 ? (
      <>
        {Math.ceil(waitTime)} <FormattedMessage id="KKS.SSAI.SECONDS" />
      </>
    ) : (
      <FormattedMessage id="KKS.SSAI.SKIP.AD" />
    )}
    <Icon type="nextEpisode" />
  </button>
);

const ShareButton = ({ title, onClick }) => (
  <Button
    startIcon="share"
    title="KKS.PLAYER.SHARE"
    onClick={async () => {
      if (isDesktop()) {
        return;
      }

      onClick();
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            url: window.location.href,
          });
        } catch (error) {
          console.debug(error);
        }
      }
    }}
  />
);

const switchStyle = {
  padding: "0 0.2rem",
  width: "2.4em",
  height: "1.2em",
  display: "flex",
  alignItems: "center",
  background: "#555",
  borderRadius: "1rem",
  transition: "background 0.5s ease-in-out",
};

const switchCheckedStyle = {
  background: "var(--theme-color, #0E78F4)",
  "> div": {
    transform: "translateX(1rem)",
  },
};

const thumbStyle = {
  width: "1rem",
  height: "1rem",
  display: "flex",
  background: "#F9FAFB",
  borderRadius: "1rem",
  transition: "transform 0.2s ease-in-out",
};

const Switch = ({ checked, ...rest }) => (
  <div css={[switchStyle, checked && switchCheckedStyle]} {...rest}>
    <div css={thumbStyle} />
  </div>
);

const checkboxStyle = {
  padding: "0",
  flex: "0 0 1.5em",
  width: "1.5em",
  height: "1.5em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #929eaa",
  borderRadius: "0.3em",
  color: "var(--panel-background, #161C24)",
  background: "transparent",
  transition: "background 0.2s ease-in-out, border-color 0.2s ease-in-out",
  svg: {
    flex: "0 48%",
    height: "36%",
    path: {
      strokeDashoffset: "22",
      strokeDasharray: "22",
    },
  },
};

const checkboxCheckedStyle = {
  background: "var(--theme-color, #0E78F4)",
  borderColor: "var(--theme-color, #0E78F4)",

  "svg path": {
    strokeDashoffset: "0",
    transition: "stroke-dashoffset 0.3s ease-in",
  },
};

const Checkbox = ({ checked, indeterminate, children, ...rest }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    css={[checkboxStyle, (checked || indeterminate) && checkboxCheckedStyle]}
    {...rest}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 13">
      <path
        stroke="currentColor"
        strokeLineCap="round"
        strokeWidth="2.5"
        d={indeterminate ? "m1 6.5h16" : "m1 6.7 5 5.5L15.3 2"}
      />
    </svg>
  </button>
);

const Close = ({ ...rest }) => <Button startIcon="close" {...rest} />;

const btnStyle = {
  width: "4em",
  height: "2em",
  borderRadius: "8px",
};

const Copy = ({ ...rest }) => (
  <Button style={btnStyle} {...rest}>
    Copy
  </Button>
);

export {
  Button,
  PlayButton,
  FullscreenButton,
  PictureInPictureButton,
  SkipButton,
  ShareButton,
  ForwardButton,
  RewindButton,
  NextEpisodeButton,
  PreviousEpisodeButton,
  LiveButton,
  Switch,
  Checkbox,
  Close,
  Copy,
  Tooltip,
};
