interface BigSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function BigSlider({ value, onChange, min = 0, max = 100 }: BigSliderProps) {
  const percent = ((value - min) / (max - min)) * 100
  const pad = 24 // half of thumb width — keeps thumb fully visible at extremes

  return (
    <div style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center', paddingInline: pad }}>
      {/* Track */}
      <div style={{ position: 'relative', width: '100%', height: 14, borderRadius: 7, background: '#E0E0E0' }}>
        {/* Fill */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${percent}%`,
          borderRadius: 7,
          background: '#3D5AF2',
        }} />
        {/* Thumb */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${percent}%`,
          transform: 'translate(-50%, -50%)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#3D5AF2',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(61,90,242,0.45)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      </div>
      {/* Invisible native input aligned to the same padded area */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: pad,
          right: pad,
          width: `calc(100% - ${pad * 2}px)`,
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          margin: 0,
          zIndex: 2,
        }}
      />
    </div>
  )
}
