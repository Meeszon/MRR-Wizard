import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Camera,
  Mountain,
  Signal,
  Layers,
  ChevronRight,
  Clock,
  Battery,
} from 'lucide-react'
import Toggle from '../components/Toggle'
import BigSlider from '../components/BigSlider'
import MapPlaceholder from '../components/MapPlaceholder'
import { useWizard } from '../hooks/useWizard'
import { useMissions } from '../hooks/useMissions'
import { useAppPrefs } from '../hooks/useAppPrefs'
import { CURRENT_BATTERY, calcMetrics } from '../constants'
import { qualityLabel } from '../utils/qualityUtils'

export default function EditMissionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { wizard, updateWizard, resetWizard } = useWizard()
  const { updateMission } = useMissions()
  const { hintsVisible } = useAppPrefs()
  const [showQualityScreen, setShowQualityScreen] = useState(false)

  const holdTimer = useRef(null)
  const holdInterval = useRef(null)
  const heightRef = useRef(wizard.highestPointMeters)
  heightRef.current = wizard.highestPointMeters

  function startHold(delta) {
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => {
        const next = Math.min(300, Math.max(0, heightRef.current + delta))
        updateWizard({ highestPointMeters: next })
      }, 120)
    }, 400)
  }

  function stopHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (holdInterval.current) clearInterval(holdInterval.current)
  }

  function handleSave() {
    if (!wizard.editingMission) return
    updateMission(wizard.editingMission.id, {
      name: wizard.name,
      quality: wizard.quality,
      app: wizard.app,
      rtkEnabled: wizard.rtkEnabled,
      highestPointMeters: wizard.highestPointMeters,
    })
    resetWizard()
    navigate(location.state?.from ?? '/missions', {
      state: { selectedMissionId: wizard.editingMission?.id },
    })
  }

  function handleBack() {
    resetWizard()
    navigate(location.state?.from ?? '/missions')
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary relative overflow-hidden">
      {/* Header */}
      <div
        className="relative flex items-center bg-white border-b border-border px-3 flex-shrink-0"
        style={{ height: 48 }}
      >
        <button
          type="button"
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
        >
          <ArrowLeft size={18} color="#5A5A5A" />
        </button>

        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
          style={{ fontSize: 14 }}
        >
          Missie Bewerken
        </span>

        <button
          type="button"
          onClick={handleSave}
          className="ml-auto flex items-center gap-1.5 rounded-btn bg-primary active:scale-95 transition-transform"
          style={{ padding: '6px 12px' }}
        >
          <Check size={13} color="white" strokeWidth={3} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Opslaan</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Left: options panel */}
        <div
          className="flex-shrink-0 overflow-y-auto border-r border-border bg-white flex flex-col"
          style={{ width: 232 }}
        >
          {/* Naam */}
          <div className="px-3 flex items-center flex-1" style={{ minHeight: 48, maxHeight: 72 }}>
            <input
              type="text"
              value={wizard.name}
              onChange={(e) => updateWizard({ name: e.target.value })}
              placeholder="Missienaam..."
              className="w-full rounded-btn border border-border bg-bg-secondary font-semibold text-title focus:outline-none focus:border-primary transition-colors"
              style={{ fontSize: 13, padding: '5px 8px' }}
            />
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* Kwaliteit */}
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 px-3 hover:bg-bg-secondary transition-colors flex-1 cursor-pointer"
            style={{ minHeight: 48, maxHeight: 72 }}
            onClick={() => setShowQualityScreen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setShowQualityScreen(true)}
          >
            <Camera size={15} color="#3D5AF2" className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 12 }}>
              Kwaliteit
            </span>
            <div className="ml-auto flex items-center gap-1">
              <span style={{ fontSize: 12, color: '#5A5A5A', fontWeight: 400 }}>
                {qualityLabel(wizard.quality)}
              </span>
              <ChevronRight size={14} color="#C0C0C0" className="flex-shrink-0" />
            </div>
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* Applicatie */}
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 px-3 hover:bg-bg-secondary transition-colors flex-1 cursor-pointer"
            style={{ minHeight: 48, maxHeight: 72 }}
            onKeyDown={(e) => e.key === 'Enter' && null}
          >
            <Layers size={15} color="#3D5AF2" className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 12 }}>
              Applicatie
            </span>
            <div className="ml-auto flex items-center gap-1">
              <span style={{ fontSize: 12, color: '#5A5A5A', fontWeight: 400 }}>{wizard.app}</span>
              <ChevronRight size={14} color="#C0C0C0" className="flex-shrink-0" />
            </div>
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* Max. hoogte */}
          <div
            className="px-3 flex items-center gap-2.5 flex-1"
            style={{ minHeight: 48, maxHeight: 72 }}
          >
            <Mountain size={15} color="#3D5AF2" className="flex-shrink-0" />
            <span
              className="font-semibold text-title flex-1 min-w-0 truncate"
              style={{ fontSize: 12 }}
            >
              Max. hoogte
            </span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                type="button"
                onClick={() =>
                  updateWizard({ highestPointMeters: Math.max(0, wizard.highestPointMeters - 5) })
                }
                onMouseDown={() => startHold(-5)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(-5)}
                onTouchEnd={stopHold}
                className="flex items-center justify-center rounded-btn bg-bg-secondary border border-border active:scale-95 transition-transform select-none"
                style={{
                  width: 26,
                  height: 26,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#5A5A5A',
                  lineHeight: 1,
                }}
              >
                −
              </button>
              <span
                className="font-bold text-title text-center"
                style={{ fontSize: 12, minWidth: 40 }}
              >
                {wizard.highestPointMeters}m
              </span>
              <button
                type="button"
                onClick={() =>
                  updateWizard({ highestPointMeters: Math.min(300, wizard.highestPointMeters + 5) })
                }
                onMouseDown={() => startHold(5)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(5)}
                onTouchEnd={stopHold}
                className="flex items-center justify-center rounded-btn bg-bg-secondary border border-border active:scale-95 transition-transform select-none"
                style={{
                  width: 26,
                  height: 26,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#5A5A5A',
                  lineHeight: 1,
                }}
              >
                +
              </button>
            </div>
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* RTK Precisie */}
          <div
            className="px-3 flex items-center gap-2.5 flex-1"
            style={{ minHeight: 48, maxHeight: 72 }}
          >
            <Signal
              size={15}
              color={wizard.rtkEnabled ? '#3D5AF2' : '#C0C0C0'}
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="font-semibold text-title" style={{ fontSize: 12 }}>
                RTK Precisie
              </span>
              <span style={{ fontSize: 10, color: '#9A9A9A', lineHeight: 1.2 }}>
                Alleen MRR Pro
              </span>
            </div>
            <div className="flex-shrink-0">
              <Toggle
                enabled={wizard.rtkEnabled}
                onChange={(val) => updateWizard({ rtkEnabled: val })}
              />
            </div>
          </div>
        </div>

        {/* Right: map */}
        <div className="flex-1 min-w-0 relative">
          <MapPlaceholder mode="edit" className="w-full h-full" />
          <StatsOverlay wizard={wizard} />
        </div>
      </div>

      {/* Quality overlay */}
      {showQualityScreen && (
        <QualityScreen
          wizard={wizard}
          updateWizard={updateWizard}
          hintsVisible={hintsVisible}
          onClose={() => setShowQualityScreen(false)}
        />
      )}
    </div>
  )
}

function StatsOverlay({ wizard }) {
  const m = calcMetrics(wizard.quality, wizard.highestPointMeters)
  const batteryColor = m.feasible ? '#23262F' : '#E0515F'

  return (
    <div
      className="absolute bottom-0 right-0 bg-white flex items-center"
      style={{ height: 35, borderTopLeftRadius: 8 }}
    >
      <div className="flex items-center gap-1.5 px-3">
        <ArrowRight
          size={12}
          color="#3D5AF2"
          style={{ transform: 'rotate(90deg)', flexShrink: 0 }}
        />
        <span className="font-semibold text-title" style={{ fontSize: 12 }}>
          {m.flightHeight}m
        </span>
      </div>
      <div style={{ width: 1, height: 16, background: '#E0E0E0' }} />
      <div className="flex items-center gap-1.5 px-3">
        <Clock size={12} color="#3D5AF2" style={{ flexShrink: 0 }} />
        <span className="font-semibold text-title" style={{ fontSize: 12 }}>
          {m.flightTime}min
        </span>
      </div>
      <div style={{ width: 1, height: 16, background: '#E0E0E0' }} />
      <div className="flex items-center gap-1.5 px-3">
        <Battery
          size={12}
          color={m.feasible ? '#3D5AF2' : batteryColor}
          style={{ flexShrink: 0 }}
        />
        <span className="font-semibold" style={{ fontSize: 12, color: batteryColor }}>
          -{m.batteryNeed}%
        </span>
      </div>
    </div>
  )
}

function QualityScreen({ wizard, updateWizard, hintsVisible, onClose }) {
  const m = calcMetrics(wizard.quality)

  return (
    <div className="absolute inset-0 bg-bg-secondary flex flex-col z-10 overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center bg-white border-b border-border px-4 py-3 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0 relative z-10"
        >
          <ArrowLeft size={20} color="#5A5A5A" />
        </button>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
          style={{ fontSize: 15 }}
        >
          Kwaliteit
        </span>
        {m.feasible ? (
          <div
            className="flex-shrink-0 rounded-full px-3 py-1 ml-auto relative z-10 flex items-center gap-1.5"
            style={{
              background: 'rgba(103,215,163,0.15)',
              border: '1px solid rgba(103,215,163,0.5)',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#2a9d6e',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#2a9d6e' }}>Vlucht mogelijk</span>
          </div>
        ) : (
          <div
            className="flex-shrink-0 rounded-full px-3 py-1 ml-auto relative z-10 flex items-center gap-1.5"
            style={{ background: 'rgba(224,81,95,0.12)', border: '1px solid rgba(224,81,95,0.5)' }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#E0515F',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#E0515F' }}>Vlucht te lang</span>
          </div>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[560px] mx-auto w-full">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 px-4 py-4 min-[480px]:grid-cols-4">
            <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
              <Clock size={16} color="#3D5AF2" />
              <span className="font-bold text-title" style={{ fontSize: 22, lineHeight: 1.1 }}>
                {m.flightTime}
              </span>
              <span style={{ fontSize: 10, color: '#5A5A5A' }}>min</span>
            </div>
            <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
              <ArrowRight size={16} color="#3D5AF2" style={{ transform: 'rotate(90deg)' }} />
              <span className="font-bold text-title" style={{ fontSize: 22, lineHeight: 1.1 }}>
                {m.flightHeight}
              </span>
              <span style={{ fontSize: 10, color: '#5A5A5A' }}>m hoogte</span>
            </div>
            <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
              <Camera size={16} color="#3D5AF2" />
              <span className="font-bold text-title" style={{ fontSize: 22, lineHeight: 1.1 }}>
                {m.photos}
              </span>
              <span style={{ fontSize: 10, color: '#5A5A5A' }}>foto&apos;s</span>
            </div>
            <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
              <Battery size={16} color={m.feasible ? '#3D5AF2' : '#E0515F'} />
              <span
                className="font-bold"
                style={{ fontSize: 22, lineHeight: 1.1, color: m.feasible ? '#23262F' : '#E0515F' }}
              >
                -{m.batteryNeed}%
              </span>
              <span style={{ fontSize: 10, color: '#9A9A9A' }}>Huidig: {CURRENT_BATTERY}%</span>
            </div>
          </div>

          {/* Slider */}
          <div className="px-4 pb-4">
            <div className="bg-white rounded-card border border-border px-5 py-4">
              <div className="flex justify-between mb-4">
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5A5A5A' }}>
                  Snel (Minder detail)
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5A5A5A' }}>
                  Traag (Veel detail)
                </span>
              </div>
              <BigSlider
                value={wizard.quality}
                onChange={(val) => updateWizard({ quality: val })}
              />
            </div>
            {hintsVisible && (
              <span className="block text-center mt-3" style={{ fontSize: 11, color: '#5A5A5A' }}>
                Hogere kwaliteit = meer batterij en langzamere vlucht
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
