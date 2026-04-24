import { useRef } from 'react'

const SIZES = {
  sm: {
    btn: { width: 26, height: 26, fontSize: 15 },
    label: { fontSize: 12, minWidth: 40 },
    gap: 'gap-0.5',
  },
  md: {
    btn: { width: 36, height: 36, fontSize: 20 },
    label: { fontSize: 16, minWidth: 52 },
    gap: 'gap-1',
  },
}

export default function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 300,
  step = 5,
  unit = 'm',
  size = 'md',
}) {
  const holdTimer = useRef(null)
  const holdInterval = useRef(null)
  const valueRef = useRef(value)
  valueRef.current = value

  const s = SIZES[size]

  function startHold(delta) {
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => {
        onChange(Math.min(max, Math.max(min, valueRef.current + delta)))
      }, 120)
    }, 400)
  }

  function stopHold() {
    clearTimeout(holdTimer.current)
    clearInterval(holdInterval.current)
  }

  return (
    <div className={`flex items-center ${s.gap} flex-shrink-0`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        onMouseDown={() => startHold(-step)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(-step)}
        onTouchEnd={stopHold}
        className="flex items-center justify-center rounded-btn bg-bg-secondary border border-border active:scale-95 transition-transform select-none"
        style={{ ...s.btn, fontWeight: 700, color: '#5A5A5A', lineHeight: 1 }}
      >
        −
      </button>
      <span className="font-bold text-title text-center" style={s.label}>
        {value} {unit}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        onMouseDown={() => startHold(step)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(step)}
        onTouchEnd={stopHold}
        className="flex items-center justify-center rounded-btn bg-bg-secondary border border-border active:scale-95 transition-transform select-none"
        style={{ ...s.btn, fontWeight: 700, color: '#5A5A5A', lineHeight: 1 }}
      >
        +
      </button>
    </div>
  )
}
