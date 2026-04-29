import React, { useRef, useState, useEffect } from 'react'
import {
  Battery,
  ArrowUp,
  Clock,
  Camera,
  Signal,
  Layers,
  Mountain,
  Check,
  ChevronRight,
  ChevronDown,
  Pencil,
} from 'lucide-react'
import BigSlider from './BigSlider'
import NumberStepper from './NumberStepper'
import Toggle from './Toggle'
import { BLUE, RED, CURRENT_BATTERY, APPLICATION_OPTIONS } from '../constants'
import qualityLabel from '../utils/qualityUtils'

function MetricCell({ icon, value, label, valueColor }) {
  return (
    <div className="flex-1 flex flex-col items-center py-3 gap-0.5">
      {icon}
      <span
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: valueColor || '#23262F',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          marginTop: 2,
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 10, fontWeight: 500, color: '#9A9AB0', letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  )
}

export default function SettingsPanel({ metrics, wizard, updateWizard, isCreate }) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const nameInputRef = useRef()

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus()
  }, [isEditingName])

  function openNameEdit() {
    setNameInput(wizard.name || '')
    setIsEditingName(true)
  }

  function confirmName() {
    if (nameInput.trim() !== (wizard.name || '')) {
      updateWizard({ name: nameInput.trim() })
    }
    setIsEditingName(false)
  }

  return (
    <div className="h-full overflow-y-auto" style={{ width: '50%' }}>
      <div className="px-4 pt-3 pb-4 max-w-[560px] mx-auto">
        {/* Infeasibility warning */}
        {!metrics.feasible && (
          <div
            className="flex items-center gap-2 mb-3 px-3 py-2 rounded-btn"
            style={{
              background: 'rgba(224,81,95,0.08)',
              border: '1px solid rgba(224,81,95,0.25)',
            }}
          >
            <Battery size={13} color={RED} />
            <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>
              Battery insufficient — reduce quality
            </span>
          </div>
        )}

        {/* Metrics strip */}
        <div
          className="rounded-card mb-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ECEFFE 0%, #F5F7FF 100%)',
            border: '1px solid rgba(61,90,242,0.15)',
          }}
        >
          <div className="flex">
            <MetricCell
              icon={<ArrowUp size={14} color={BLUE} />}
              value={`${metrics.flightHeight}m`}
              label="altitude"
            />
            <div style={{ width: 1, background: 'rgba(61,90,242,0.12)', margin: '10px 0' }} />
            <MetricCell
              icon={<Clock size={14} color={BLUE} />}
              value={`${metrics.flightTime} min`}
              label="flight time"
            />
            <div style={{ width: 1, background: 'rgba(61,90,242,0.12)', margin: '10px 0' }} />
            <MetricCell
              icon={<Battery size={14} color={metrics.feasible ? BLUE : RED} />}
              value={`-${metrics.batteryNeed}%`}
              label={`of ${CURRENT_BATTERY}%`}
              valueColor={metrics.feasible ? undefined : RED}
            />
          </div>
        </div>

        {/* Settings list */}
        <div className="bg-white rounded-card border border-border overflow-hidden">
          {/* Quality */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-3">
              <Camera size={15} color={BLUE} className="flex-shrink-0" />
              <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                Quality
              </span>
              <span className="ml-auto font-semibold" style={{ fontSize: 13, color: '#5A5A5A' }}>
                {qualityLabel(wizard.quality)}
              </span>
            </div>
            <BigSlider
              value={wizard.quality}
              onChange={(val) => updateWizard({ quality: val })}
              trackHeight={8}
              thumbSize={28}
            />
          </div>

          <div className="h-px bg-border" />

          {/* Highest point */}
          <div className="px-4 flex items-center gap-3" style={{ minHeight: 52, paddingBlock: 12 }}>
            <Mountain size={15} color={BLUE} className="flex-shrink-0" />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                Highest point
              </span>
              <span style={{ fontSize: 11, color: '#9A9A9A', lineHeight: 1.3 }}>
                The height of the tallest object in the flight area
              </span>
            </div>
            <NumberStepper
              value={wizard.highestPointMeters}
              onChange={(val) => updateWizard({ highestPointMeters: val })}
              size="sm"
            />
          </div>

          <div className="h-px bg-border" />

          {/* RTK Precision */}
          <div className="px-4 flex items-center gap-3" style={{ minHeight: 52, paddingBlock: 12 }}>
            <Signal
              size={15}
              color={wizard.rtkEnabled ? BLUE : '#C0C0C0'}
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="font-semibold text-title" style={{ fontSize: 13 }}>
                RTK Precision
              </span>
              <span style={{ fontSize: 11, color: '#9A9A9A', lineHeight: 1.3 }}>
                Only available for the MRR Pro drone
              </span>
            </div>
            <Toggle
              enabled={wizard.rtkEnabled}
              onChange={(val) => updateWizard({ rtkEnabled: val })}
            />
          </div>

          <div className="h-px bg-border" />

          {/* Application */}
          <div className="px-4 flex items-center gap-3" style={{ minHeight: 52, paddingBlock: 12 }}>
            <Layers size={15} color={BLUE} className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 13 }}>
              Application
            </span>
            <div className="ml-auto relative flex-shrink-0">
              <select
                value={wizard.app}
                onChange={(e) => updateWizard({ app: e.target.value })}
                className="appearance-none bg-bg-secondary border border-border rounded-btn outline-none cursor-pointer"
                style={{
                  fontSize: 13,
                  color: '#5A5A5A',
                  fontWeight: 500,
                  padding: '4px 28px 4px 8px',
                }}
              >
                {APPLICATION_OPTIONS.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                color="#9A9A9A"
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          {/* Name row — edit mode only; in create mode the name is set via modal */}
          {!isCreate && (
            <>
              <div className="h-px bg-border" />
              {isEditingName ? (
                <div
                  className="flex items-center gap-2 px-4"
                  style={{ minHeight: 52, paddingBlock: 10 }}
                >
                  <Pencil size={15} color={BLUE} className="flex-shrink-0" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmName()
                    }}
                    onBlur={confirmName}
                    className="flex-1 min-w-0 bg-bg-secondary border border-border rounded-btn outline-none font-medium focus:border-primary transition-colors"
                    style={{ fontSize: 16, color: '#23262F', padding: '6px 10px' }}
                    placeholder="Mission name..."
                  />
                  <button
                    type="button"
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={confirmName}
                    className="flex-shrink-0 flex items-center justify-center rounded-btn active:scale-95 transition-transform"
                    style={{ width: 32, height: 32, background: BLUE }}
                  >
                    <Check size={14} color="white" strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openNameEdit}
                  className="w-full flex items-center gap-3 px-4 active:bg-bg-secondary transition-colors text-left"
                  style={{ minHeight: 52, paddingBlock: 12 }}
                >
                  <Pencil size={15} color={BLUE} className="flex-shrink-0" />
                  <span className="font-semibold text-title flex-shrink-0" style={{ fontSize: 13 }}>
                    Name
                  </span>
                  <span
                    className="ml-auto font-medium truncate"
                    style={{
                      fontSize: 13,
                      color: wizard.name ? '#5A5A5A' : '#C4C4C4',
                      maxWidth: '55%',
                    }}
                  >
                    {wizard.name || 'Add name...'}
                  </span>
                  <ChevronRight size={13} color="#D0D0D0" className="flex-shrink-0" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
