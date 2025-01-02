/* @jsxImportSource @emotion/react */

const segmentedTrackStyle = {
  position: 'relative',
  margin: '0 2px',
  borderTop: '10px solid transparent',
  borderBottom: '10px solid transparent',
  background: 'transparent',
  '&:hover > div': {
    transform: 'scale(1, 1.5)',
  },
  '> div': {
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:not(:first-of-type)': {
      position: 'absolute',
      top: '0',
    },
  },
  '> div:nth-of-type(2)': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  '> div:nth-of-type(3)': {
    backgroundColor: 'var(--theme-color, red)',
  },
}

const SeekbarTrack = ({segments, style}) =>
  segments.map(({length, current, buffered}) => (
    <div
      css={[style, segmentedTrackStyle]}
      style={{
        flex: `0 ${length * 100}%`,
        width: `calc(${length * 100}% - 4px)`,
      }}
    >
      <div style={{width: '100%'}} />
      <div style={{width: `${buffered * 100}%`}} />
      <div style={{width: `${current * 100}%`}} />
    </div>
  ))

export default SeekbarTrack
