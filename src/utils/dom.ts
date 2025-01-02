const getPopoverPosition = (
  rect: DOMRect,
  target: DOMRect,
  boundary: DOMRect
) => {
  const rectX = rect.x || rect.left;
  const boundaryX = boundary.x || boundary.left;
  const maxLeft = boundary.width - rect.width;
  const targetCenter = (target.left + target.right) / 2 - boundaryX;
  const center = rectX + rect.width / 2 - boundaryX;
  const alignLeft = rectX + (targetCenter - center) - boundaryX;

  return {
    left: Math.max(0, Math.min(alignLeft, maxLeft)),
    top: target.top - rect.height,
  };
};

const vendors = {
  change: ["fullscreenchange", "webkitfullscreenchange", "MSFullscreenChange"],
  element: [
    "fullscreenElement",
    "webkitFullscreenElement",
    "msFullscreenElement",
  ],
  request: [
    "requestFullscreen",
    "webkitRequestFullScreen",
    "msRequestFullscreen",
  ],
  exit: ["exitFullscreen", "webkitExitFullscreen", "msExitFullscreen"],
};

const getName = (object: object, nameList: string[]) =>
  nameList.find((name) => name in object)!;

const getTopElement = () =>
  (document as unknown as { [key: string]: HTMLElement })[
    getName(document, vendors.element)
  ]! || document.body;

// Some touch devices with a mouse can't be distinguished, assume no mouse
// IE is no loger supported, so no special queries for it
const havePointer = Object.assign(() => {
  if (havePointer.memo != null) {
    return havePointer.memo;
  }
  havePointer.memo =
    typeof window !== "undefined" &&
    [
      "(hover: hover) and (pointer: fine)",
      "not all and (any-pointer: coarse)",
    ].every((query) => window.matchMedia(query).matches);
  return havePointer.memo;
}, {} as { memo?: boolean });

const isDesktop = () => true;

const openShare = ({
  data = { url: window.location.href },
  fallback = () => {},
}) => {
  if (!isDesktop() && navigator.share) {
    // TODO more info?
    return navigator.share(data);
  }
  fallback?.();
};

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.platform) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export { getPopoverPosition, getTopElement, havePointer, isDesktop, isIOS, openShare };
