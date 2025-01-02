/* @jsxImportSource @emotion/react */

const backdropStyle = {
  position: "absolute",
  zIndex: "var(--player-ui-panel-z-index, 3)",
  top: 0,
  left: 0,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  alignContent: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  minWidth: "0",
  backgroundColor: "rgba(0, 0, 0, 0)",
  color: "white",
  transform: "translateX(-100%)",
  transition: "background-color 0.5s ease, transform 0s 0.5s",
};

const backdropOpenStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  transform: "translateY(0)",
  transition: "background-color 0.5s ease",
  "~ .overlay-backdrop": {
    display: "none",
  },
};

const Backdrop = ({ open, style, renderAt, children, onClick, ...rest }) => (
  <div
    css={[backdropStyle, open && backdropOpenStyle, style]}
    className="overlay-backdrop"
    onClick={(event) => {
      if (event.target === event.currentTarget) {
        onClick?.(event);
      }
    }}
    {...rest}
  >
    {(renderAt === "always" || open) && children}
  </div>
);

export default Backdrop;
