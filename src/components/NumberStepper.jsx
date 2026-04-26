import React, { useRef, useState } from 'react'

const SIZES = {
  sm: {
    btn: { width: 32, height: 32, fontSize: 16 },
    label: { fontSize: 13, minWidth: 48 },
    gap: 'gap-1',
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

  // draft is null when not editing, string when the input is focused
  const [draft, setDraft] = useState(null)
  const isEditing = draft !== null

  const s = SIZES[size]

  function startHold(delta) {
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => {
        if (delta < 0 && valueRef.current === null) return
        const cur = valueRef.current ?? 0
        onChange(Math.min(max, Math.max(min, cur + delta)))
      }, 120)
    }, 400)
  }

  function stopHold() {
    clearTimeout(holdTimer.current)
    clearInterval(holdInterval.current)
  }

  function handleFocus() {
    setDraft('')
  }

  function handleChange(e) {
    // digits only — no negatives, no decimals
    const raw = e.target.value.replace(/[^\d]/g, '')
    setDraft(raw)
  }

  function handleBlur() {
    if (draft !== '') {
      const n = parseInt(draft, 10)
      onChange(!Number.isNaN(n) ? Math.min(max, Math.max(min, n)) : value)
    }
    setDraft(null)
  }

  const displayValue = isEditing ? draft : value === null ? '' : String(value)
  const showUnit = isEditing ? draft !== '' : value !== null

  return (
    <div className={`flex items-center ${s.gap} flex-shrink-0`}>
      <button
        type="button"
        onClick={() => {
          if (value !== null) onChange(Math.max(min, value - step))
        }}
        onMouseDown={() => startHold(-step)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(-step)}
        onTouchEnd={stopHold}
        className="flex items-center justify-center rounded-btn bg-bg-secondary border border-border active:scale-95 transition-transform select-none"
        style={{
          ...s.btn,
          fontWeight: 700,
          color: value === null ? '#C0C0C0' : '#5A5A5A',
          lineHeight: 1,
        }}
      >
        −
      </button>

      <div
        className="flex items-baseline justify-center"
        style={{ minWidth: s.label.minWidth, gap: 2 }}
      >
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder="—"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          className="font-bold text-title text-center bg-transparent outline-none min-w-0"
          style={{
            fontSize: s.label.fontSize,
            color: showUnit ? '#23262F' : '#BBBBBB',
            width: isEditing ? '4ch' : value === null ? '2ch' : `${String(value).length}ch`,
          }}
        />
        {showUnit && (
          <span className="font-bold text-title" style={{ fontSize: s.label.fontSize }}>
            {unit}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, (value ?? 0) + step))}
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
