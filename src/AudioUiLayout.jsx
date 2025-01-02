/* @jsxImportSource @emotion/react */
import { useEffect } from "react";
import useResponsiveStyle from "./useResponsiveStyle";

const containerStyle = {
  "--theme-color": "var(--primary-highlight, #79B5FB)",
  color: "rgba(255, 255, 255, 1)",
  position: "relative",
  width: "100%",
  display: "flex",
  background: "var(--audio-mode-background, #161C24)",
  overflow: "hidden",
  "> div:first-of-type": {
    flex: "1",
    minWidth: "0",
    lineHeight: "1.4",
    padding: "1.5em 0",
  },
  "> div > div:nth-of-type(2)": {
    margin: "0 1.5em",
  },
  "> img": {
    // cover
    flex: "0 0 12em",
    objectFit: "contain",
    maxHeight: "12em",
    maxWidth: "12em",
  },
};

const infoStyle = {
  margin: "0 1.5em 1.5em",
  display: "flex",
  alignItems: "center",
  img: {
    marginRight: "1.33em",
    flex: "0 0 12em",
    objectFit: "contain",
    maxHeight: "12em",
    maxWidth: "12em",
  },
  "> div": {
    minWidth: "0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  h2: {
    margin: "0",
    marginBlockStart: "0",
    marginBlockEnd: "0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
};

const controlStyle = {
  marginTop: "1em",
  padding: "0 0.5em",
  display: "flex",
  justifyContent: "center",
  button: {
    display: "block",
    height: "1em",
    fontSize: "2em",
    margin: "0 0.5em",
  },
  "> div:first-of-type": {
    // speed button left addons
    flex: "1",
  },
  "> div:last-of-type": {
    // scpace before options / more, right addons
    flex: "1",
    order: "2",
    display: "flex",
    justifyContent: "right",
  },
};

const desktopControlStyle = {
  "> div:first-of-type": {
    // speed button left addons
    order: "1",
  },
};

const channelTitleStyle = {
  color: "rgba(196, 205, 213, 1)",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const AudioUiLayout = ({
  coverImageUrl,
  title,
  channelTitle,
  seekbar,
  playButton,
  rewindButton = "",
  forwardButton = "",
  previousEpisodeButton = "",
  nextEpisodeButton = "",
  speedButton = "",
  optionsButton = "",
  volumeControl = "",
  containerRef,
  onFocus,
  onBlur,
  children = "",
}) => {
  const {
    observe,
    responsiveStyle,
    currentBreakpoint: size,
  } = useResponsiveStyle();

  return (
    <div
      css={[
        containerStyle,
        {
          ...responsiveStyle,
          overflow: size.includes("desktop") ? "visible" : "hidden",
        },
      ]}
      ref={(element) => {
        // eslint-disable-next-line no-param-reassign
        containerRef.current = element;
        observe(element);
      }}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {coverImageUrl && size.includes("desktop") && (
        <img alt="cover" src={coverImageUrl} />
      )}
      <div>
        <div
          css={[
            infoStyle,
            coverImageUrl && {
              height: "12em",
              "> div:first-of-type": { minHeight: "3em" },
            },
            size.includes("desktop") && { height: "auto" },
          ]}
        >
          {coverImageUrl && !size.includes("desktop") && (
            <img alt="cover" src={coverImageUrl} />
          )}
          <div>
            <h2>{title}</h2>
            <div css={channelTitleStyle}>{channelTitle}</div>
          </div>
        </div>
        {seekbar}
        <div
          css={[controlStyle, size.includes("desktop") && desktopControlStyle]}
        >
          <div>{speedButton}</div>
          {previousEpisodeButton}
          {rewindButton}
          {playButton}
          {forwardButton}
          {nextEpisodeButton}
          <div>
            {size.includes("desktop") && volumeControl}
            {optionsButton}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AudioUiLayout;
