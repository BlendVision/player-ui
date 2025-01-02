/* @jsxImportSource @emotion/react */
import { useEffect, useState, useRef } from "react";
import { IntlProvider } from "./intl";
import { Button, PlayButton, ForwardButton, RewindButton } from "./buttons";
import { SpeedButton } from "./menu";
import Seekbar from "./Seekbar";
import VolumeControl from "./VolumeControl";
import AudioUiLayout from "./AudioUiLayout";
import Error from "./Error";

const circleButtonStyle = {
  "& > div": {
    backgroundColor: "#454F5B",
    borderRadius: "50%",
    position: "relative",
    "&::before": {
      boxSizing: "border-box",
      content: '""',
      position: "absolute",
      border: "0.20em solid #454F5B",
      borderRadius: "50%",
      width: "100%",
      height: "100%",
      top: "0px",
      left: "0px",
      transform: "scale(1.45)",
    },
  },
};

const AudioPlayerUi = ({
  intl,
  metadata, // title, channelTitle, coverImageUrl, chapters, description, share
  menuPlacement = "auto",
  playbackState = "paused",
  currentTime = 0,
  duration = 1,
  playbackRate = 1,
  errors,
  children = [],
  slots = {},
  onChange,
  ...rest
}) => {
  const components = {
    Seekbar,
    PlayButton,
    ForwardButton,
    RewindButton,
    SpeedButton,
    VolumeControl,
    ...slots,
  };
  // TODO handle active setting menu section
  const containerRef = useRef();

  const [autoPlacement, setAutoPlacement] = useState("top");
  useEffect(() => {
    let schedule = false;
    const handleScroll = () => {
      if (schedule) {
        return;
      }
      schedule = true;
      requestAnimationFrame(() => {
        const { bottom } = containerRef.current.getBoundingClientRect();
        setAutoPlacement(bottom * 2 >= window.innerHeight ? "top" : "bottom");
        schedule = false;
      });
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  return (
    <IntlProvider {...intl}>
      <AudioUiLayout
        {...metadata}
        playButton={
          <components.PlayButton
            style={circleButtonStyle}
            playbackState={playbackState}
            onClick={() => togglePlay()}
          />
        }
        seekbar={
          <components.Seekbar
            currentTime={currentTime}
            duration={duration}
            timeDisplay
            // TODO chapters
            onChange={() => {}}
            onChangeCommitted={(currentTime) => onChange({ currentTime })}
          />
        }
        rewindButton={
          <components.RewindButton
            onClick={() => setTargetTime(currentTime - 10, "rewind")}
          />
        }
        forwardButton={
          <components.ForwardButton
            onClick={() => setTargetTime(currentTime + 10, "forward")}
          />
        }
        // TODO high frequency updates?
        volumeControl={<components.VolumeControl  />}
        speedButton={
          <SpeedButton
            value={playbackRate}
            onClick={() => {
              if (currentPanel !== "speed") {
                requestAnimationFrame(() => setCurrentPanel("speed"));
              }
            }}
          />
        }
        optionsButton={
          <Button
            startIcon="more"
            onClick={() => {
              if (!currentPanel || currentPanel === "speed") {
                // TODO toggle / open options menu
                requestAnimationFrame(() => setCurrentPanel("/"));
              }
            }}
          />
        }
        containerRef={containerRef}
        {...rest}
      >
        {errors && <Error error={errors} />}
        {children /* TODO menu */}
      </AudioUiLayout>
    </IntlProvider>
  );
};

export default AudioPlayerUi;
