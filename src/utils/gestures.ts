/* eslint-disable no-param-reassign */
const getPointerData = (event: PointerEvent & TouchEvent) => {
  const {clientX: x, clientY: y} =
    event.touches?.[0] || event.changedTouches?.[0] || event
  const {width, left, height, bottom} =
    (event.currentTarget! as HTMLElement).getBoundingClientRect()
  const time = performance.now()
  return {x, y, width, left, height, bottom, time}
}

export {getPointerData}
