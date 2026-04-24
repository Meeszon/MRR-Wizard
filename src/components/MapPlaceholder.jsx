export default function MapPlaceholder({ mode, className = '' }) {
  return (
    <div className={['relative w-full h-full overflow-hidden bg-[#e8f0e4]', className].join(' ')}>
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4a7c59" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Fake terrain / roads */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 640 360"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
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
        <div
          className="absolute inset-0 flex items-start justify-center"
          style={{ paddingTop: 60 }}
        >
          <svg
            width="40"
            height="52"
            viewBox="0 0 40 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2C11.163 2 4 9.163 4 18c0 11.25 16 32 16 32s16-20.75 16-32C36 9.163 28.837 2 20 2z"
              fill="#3D5AF2"
            />
            <circle cx="20" cy="18" r="6" fill="white" />
          </svg>
        </div>
      )}

      {(mode === 'draw' || mode === 'confirm' || mode === 'edit') && (
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 640 360"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="222,62 400,52 418,152 358,210 208,203"
              fill={mode === 'confirm' ? 'rgba(61,90,242,0.15)' : 'rgba(61,90,242,0.08)'}
              stroke="#3D5AF2"
              strokeWidth="2.5"
              strokeDasharray={mode === 'draw' ? '10 6' : undefined}
            />
            {[
              [222, 62],
              [400, 52],
              [418, 152],
              [358, 210],
              [208, 203],
            ].map(([x, y]) => (
              <circle
                key={`${x},${y}`}
                cx={x}
                cy={y}
                r={mode === 'confirm' || mode === 'edit' ? 5 : 6}
                fill="#3D5AF2"
                stroke="white"
                strokeWidth="2"
              />
            ))}
            {mode === 'edit' && (
              <>
                {/* Home point marker */}
                <path
                  d="M130 290C130 278.954 138.954 270 150 270C161.046 270 170 278.954 170 290C170 305 150 322 150 322C150 322 130 305 130 290Z"
                  fill="#3D5AF2"
                />
                <circle cx="150" cy="290" r="6" fill="white" />
                {/* Dashed line from home to polygon */}
                <line
                  x1="150"
                  y1="270"
                  x2="215"
                  y2="203"
                  stroke="#3D5AF2"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  opacity="0.4"
                />
              </>
            )}
          </svg>
        </div>
      )}
    </div>
  )
}
