import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  Signal,
  Layers,
  ChevronRight,
  Check,
  Clock,
  Battery,
} from 'lucide-react'
import Toggle from '../components/Toggle'
import NumberStepper from '../components/NumberStepper'
import MapPlaceholder from '../components/MapPlaceholder'
import PageHeader from '../components/PageHeader'
import QualityScreen from '../components/QualityScreen'
import useWizard from '../hooks/useWizard'
import useMissions from '../hooks/useMissions'
import useAppPrefs from '../hooks/useAppPrefs'
import { BLUE, calcMetrics } from '../constants'
import qualityLabel from '../utils/qualityUtils'

export default function EditMissionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { wizard, updateWizard, resetWizard } = useWizard()
  const { updateMission } = useMissions()
  const { hintsVisible } = useAppPrefs()
  const [showQualityScreen, setShowQualityScreen] = useState(false)

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

  const saveButton = (
    <button
      type="button"
      onClick={handleSave}
      className="flex items-center gap-1.5 rounded-btn bg-primary active:scale-95 transition-transform"
      style={{ padding: '6px 12px' }}
    >
      <Check size={13} color="white" strokeWidth={3} />
      <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Save</span>
    </button>
  )

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary relative overflow-hidden">
      <PageHeader title="Edit Mission" onBack={() => handleBack()} right={saveButton} height={48} />

      <div className="flex-1 flex min-h-0">
        {/* Left: options panel */}
        <div
          className="flex-shrink-0 overflow-y-auto border-r border-border bg-white flex flex-col"
          style={{ width: 232 }}
        >
          {/* Name */}
          <div className="px-3 flex items-center flex-1" style={{ minHeight: 48, maxHeight: 72 }}>
            <input
              type="text"
              value={wizard.name}
              onChange={(e) => updateWizard({ name: e.target.value })}
              placeholder="Mission name..."
              className="w-full rounded-btn border border-border bg-bg-secondary font-semibold text-title focus:outline-none focus:border-primary transition-colors"
              style={{ fontSize: 13, padding: '5px 8px' }}
            />
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* Quality */}
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 px-3 hover:bg-bg-secondary transition-colors flex-1 cursor-pointer"
            style={{ minHeight: 48, maxHeight: 72 }}
            onClick={() => setShowQualityScreen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setShowQualityScreen(true)}
          >
            <Camera size={15} color={BLUE} className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 12 }}>
              Quality
            </span>
            <div className="ml-auto flex items-center gap-1">
              <span style={{ fontSize: 12, color: '#5A5A5A', fontWeight: 400 }}>
                {qualityLabel(wizard.quality)}
              </span>
              <ChevronRight size={14} color="#C0C0C0" className="flex-shrink-0" />
            </div>
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* Application */}
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 px-3 hover:bg-bg-secondary transition-colors flex-1 cursor-pointer"
            style={{ minHeight: 48, maxHeight: 72 }}
            onKeyDown={(e) => e.key === 'Enter' && null}
          >
            <Layers size={15} color={BLUE} className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 12 }}>
              Application
            </span>
            <div className="ml-auto flex items-center gap-1">
              <span style={{ fontSize: 12, color: '#5A5A5A', fontWeight: 400 }}>{wizard.app}</span>
              <ChevronRight size={14} color="#C0C0C0" className="flex-shrink-0" />
            </div>
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* Max. height */}
          <div
            className="px-3 flex items-center gap-2.5 flex-1"
            style={{ minHeight: 48, maxHeight: 72 }}
          >
            <ArrowRight
              size={15}
              color={BLUE}
              className="flex-shrink-0"
              style={{ transform: 'rotate(90deg)' }}
            />
            <span
              className="font-semibold text-title flex-1 min-w-0 truncate"
              style={{ fontSize: 12 }}
            >
              Max. height
            </span>
            <NumberStepper
              value={wizard.highestPointMeters}
              onChange={(val) => updateWizard({ highestPointMeters: val })}
              size="sm"
            />
          </div>

          <div className="h-px bg-border flex-shrink-0" />

          {/* RTK Precision */}
          <div
            className="px-3 flex items-center gap-2.5 flex-1"
            style={{ minHeight: 48, maxHeight: 72 }}
          >
            <Signal
              size={15}
              color={wizard.rtkEnabled ? BLUE : '#C0C0C0'}
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="font-semibold text-title" style={{ fontSize: 12 }}>
                RTK Precision
              </span>
              <span style={{ fontSize: 10, color: '#9A9A9A', lineHeight: 1.2 }}>MRR Pro only</span>
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
        <ArrowRight size={12} color={BLUE} style={{ transform: 'rotate(90deg)', flexShrink: 0 }} />
        <span className="font-semibold text-title" style={{ fontSize: 12 }}>
          {m.flightHeight}m
        </span>
      </div>
      <div style={{ width: 1, height: 16, background: '#E0E0E0' }} />
      <div className="flex items-center gap-1.5 px-3">
        <Clock size={12} color={BLUE} style={{ flexShrink: 0 }} />
        <span className="font-semibold text-title" style={{ fontSize: 12 }}>
          {m.flightTime}min
        </span>
      </div>
      <div style={{ width: 1, height: 16, background: '#E0E0E0' }} />
      <div className="flex items-center gap-1.5 px-3">
        <Battery size={12} color={m.feasible ? BLUE : batteryColor} style={{ flexShrink: 0 }} />
        <span className="font-semibold" style={{ fontSize: 12, color: batteryColor }}>
          -{m.batteryNeed}%
        </span>
      </div>
    </div>
  )
}
