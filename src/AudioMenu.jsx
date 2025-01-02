/* @jsxImportSource @emotion/react */
import { useEffect, useState, useRef } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { FormattedMessage } from "./intl";
import { Button } from "./buttons";
import { MenuContainer, MenuItem, SpeedList } from "./menu";
import ChapterList from "extra/ChapterList";
import ContentDetail from "extra/ContentDetail";
import Share from "extra/Share";
import { openShare } from "./util/dom";

const containerStyle = {
  position: "absolute",
  top: "0",
  width: "100%",
  height: "100%",
  background: "var(--panel-background, #161C24)",
  opacity: "0",
  transform: "translate(0, 100%)",
  transition: "transform 0.5s ease, opacity 0.5s ease",
  overflow: "auto",
  borderRadius: "1rem",
};

const headStyle = {
  padding: "1.0em 1.5em",
  textAlign: "right",
  button: {
    fontSize: "1em",
  },
};

const openStyle = {
  zIndex: "1",
  transform: "translate(0, 0)",
  opacity: "0.92",
};

const desktopContainerStyle = {
  position: "absolute",
  zIndex: "-1",
  width: "auto",
  minWidth: "17em",
  maxWidth: "22em",
  height: "auto",
  maxHeight: "36em",
  overflow: "auto",
  fontSize: "66%",
  transition: "none",
};

const positions = {
  top: { top: "auto", bottom: "6em" },
  bottom: { top: "12em" },
  left: { left: "25em" },
  right: { right: "2em" },
};

const BackButton = (props) => <Button startIcon="chevronLeft" {...props} />;

const AudioMenu = ({
  open,
  currentTime,
  playbackRate,
  size,
  placement,
  metadata: { chapters = [], title, description, share },
  setCurrentTime,
  setPlaybackRate,
  loop,
  setLoop,
  onClose,
}) => {
  const [path, setPath] = useState("");
  const navigate = (next) => requestAnimationFrame(() => setPath(next));
  useEffect(() => {
    navigate(open || "");
  }, [open]);
  const menuRef = useRef();
  useOnclickOutside(
    () => {
      if (size.includes("desktop")) {
        onClose();
      }
    },
    { eventTypes: ["click"], refs: [menuRef] }
  );

  return (
    <div
      ref={menuRef}
      style={
        size.includes("desktop")
          ? {
              ...positions[placement],
              ...(path === "speed" ? positions.left : positions.right),
            }
          : {}
      }
      css={[
        containerStyle,
        size.includes("desktop") && desktopContainerStyle,
        path && openStyle,
      ]}
    >
      {path === "speed" ? (
        <SpeedList
          selected={playbackRate.toString()}
          onChange={setPlaybackRate}
          onClose={onClose}
          slots={{ Container: MenuContainer }}
        />
      ) : path === "chapters" ? (
        <ChapterList
          open
          chapters={chapters}
          currentTime={currentTime}
          slots={{ Container: MenuContainer, BackButton }}
          onClose={() => navigate("/")}
          seek={(time) => {
            setCurrentTime(time);
            onClose();
          }}
        />
      ) : path === "info" ? (
        <ContentDetail
          open
          head={
            <h2>
              <BackButton onClick={() => navigate("/")} />
              <FormattedMessage id="KKS.PLAYER.INFO" />
            </h2>
          }
          title={title}
          slots={{ Container: MenuContainer }}
        >
          {description}
        </ContentDetail>
      ) : path === "share" ? (
        <Share
          open
          style={{ position: "static" }}
          targets={shareTargets}
          slots={{ BackButton }}
          onItemClick={onClose}
          onClose={() => navigate("/")}
        />
      ) : (
        <>
          {!size.includes("desktop") && (
            <div css={headStyle}>
              <Button startIcon="close" onClick={onClose} />
            </div>
          )}
          <MenuItem
            label="KKS.PLAYER.LOOP"
            type="switch"
            checked={loop}
            onClick={() => setLoop(!loop)}
          />
          {description?.length > 0 && (
            <MenuItem
              label="KKS.PLAYER.INFO"
              onClick={() => navigate("info")}
            />
          )}
          {chapters.length > 0 && (
            <MenuItem
              label="KKS.CHAPTERS"
              onClick={() => navigate("chapters")}
            />
          )}
          {shareTargets?.length > 0 && (
            <MenuItem
              label="KKS.PLAYER.SHARE"
              onClick={() => openShare({ fallback: () => navigate("share") })}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AudioMenu;
