type MapMode = 'location' | 'draw' | 'confirm'

interface MapPlaceholderProps {
  mode: MapMode
  className?: string
}

export default function MapPlaceholder({ mode, className = '' }: MapPlaceholderProps) {
  return (
    <div className={['relative w-full h-full overflow-hidden bg-[#e8f0e4]', className].join(' ')}>
      {/* Grid background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4a7c59" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Fake terrain / roads */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 0 L 80 360" stroke="#888" strokeWidth="6" fill="none" />
        <path d="M 0 120 L 640 100" stroke="#888" strokeWidth="4" fill="none" />
        <rect x="120" y="60" width="80" height="60" fill="#c9b99a" opacity="0.6" />
        <rect x="240" y="140" width="60" height="50" fill="#c9b99a" opacity="0.6" />
        <rect x="340" y="80" width="100" height="70" fill="#c9b99a" opacity="0.6" />
        <ellipse cx="450" cy="260" rx="60" ry="40" fill="#7db87d" opacity="0.5" />
        <ellipse cx="180" cy="280" rx="40" ry="30" fill="#7db87d" opacity="0.5" />
      </svg>

      {/* Mode-specific overlays */}
      {mode === 'location' && (
        <div className="absolute inset-0 flex items-start justify-center" style={{ paddingTop: 60 }}>
          <svg width="40" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2C11.163 2 4 9.163 4 18c0 11.25 16 32 16 32s16-20.75 16-32C36 9.163 28.837 2 20 2z" fill="#3D5AF2" />
            <circle cx="20" cy="18" r="6" fill="white" />
          </svg>
        </div>
      )}

      {mode === 'draw' && (
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="222,62 400,52 418,152 358,210 208,203"
              fill="rgba(61,90,242,0.08)"
              stroke="#3D5AF2"
              strokeWidth="2.5"
              strokeDasharray="10 6"
            />
            {[
              [222, 62],
              [400, 52],
              [418, 152],
              [358, 210],
              [208, 203],
            ].map(([x, y]) => (
              <circle key={`${x},${y}`} cx={x} cy={y} r="6" fill="#3D5AF2" stroke="white" strokeWidth="2" />
            ))}
          </svg>
        </div>
      )}

      {mode === 'confirm' && (
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="222,62 400,52 418,152 358,210 208,203"
              fill="rgba(61,90,242,0.15)"
              stroke="#3D5AF2"
              strokeWidth="2.5"
            />
            {[
              [222, 62],
              [400, 52],
              [418, 152],
              [358, 210],
              [208, 203],
            ].map(([x, y]) => (
              <circle key={`${x},${y}`} cx={x} cy={y} r="5" fill="#3D5AF2" stroke="white" strokeWidth="2" />
            ))}
          </svg>
        </div>
      )}
    </div>
  )
}
