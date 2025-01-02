const getTimelineSegments = (
  chapters: { startTime: number }[] = [],
  {
    startTime,
    current,
    buffered,
    duration,
  }: { startTime: number; current: number; buffered: number; duration: number }
) =>
  (chapters.length === 0 ? [{ startTime }] : chapters).map((chapter, index) => {
    const length =
      (chapters[index + 1]?.startTime || startTime + duration) -
      chapter.startTime;

    return {
      length: length / duration,
      current: Math.min(Math.max(0, (current - chapter.startTime) / length), 1),
      buffered: Math.min(
        Math.max(0, (buffered - chapter.startTime) / length),
        1
      ),
    };
  });

export { getTimelineSegments };
