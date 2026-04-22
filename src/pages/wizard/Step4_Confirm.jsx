import { useNavigate } from 'react-router-dom'
import {
  Check,
  Clock,
  Battery,
  ArrowUp,
  Camera,
  Layers,
  AlertTriangle,
  Pencil,
  RotateCcw,
} from 'lucide-react'
import WizardBar from '../../components/WizardBar'
import MapPlaceholder from '../../components/MapPlaceholder'
import { useWizard } from '../../hooks/useWizard'
import { useMissions } from '../../hooks/useMissions'
import { calcMetrics } from '../../constants'
import { qualityLabel } from '../../utils/qualityUtils'
import { buildMission, buildMissionUpdate } from '../../services/missionService'

function InfoRow({ icon, label, value, error }) {
  return (
    <div
      className="flex items-center gap-2.5 px-3"
      style={{ height: 34, borderBottom: '1px solid #F0F0F0' }}
    >
      <span style={{ color: '#C0C0C0', flexShrink: 0 }}>{icon}</span>
      <span className="flex-1" style={{ fontSize: 12, color: '#5A5A5A', fontWeight: 500 }}>
        {label}
      </span>
      <span style={{ fontSize: 12, fontWeight: 700, color: error ? '#E0515F' : '#23262F' }}>
        {value}
      </span>
    </div>
  )
}

export default function Step4Confirm() {
  const navigate = useNavigate()
  const { wizard, isEdit, updateWizard } = useWizard()
  const { addMission, updateMission, setLastMissionName } = useMissions()

  const { flightTime, flightHeight, batteryNeed, feasible } = calcMetrics(
    wizard.quality,
    wizard.highestPointMeters,
  )
  const canSubmit = wizard.name.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    const name = wizard.name.trim()
    setLastMissionName(name)

    if (isEdit && wizard.editingMission) {
      updateMission(wizard.editingMission.id, buildMissionUpdate(wizard))
    } else {
      addMission(buildMission(wizard))
    }

    navigate('/wizard/ready')
  }

  return (
    <div className="w-full h-full flex flex-col">
      <WizardBar />

      <div className="flex flex-1 min-h-0">
        {/* Map — 55% */}
        <div className="relative" style={{ width: '55%' }}>
          <MapPlaceholder mode="confirm" className="absolute inset-0" />
          {!isEdit && (
            <button
              type="button"
              onClick={() => navigate('/wizard/step2')}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 rounded-btn shadow border border-border active:scale-95 transition-transform"
              style={{ padding: '6px 10px' }}
            >
              <RotateCcw size={12} color="#5A5A5A" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#5A5A5A' }}>Redraw area</span>
            </button>
          )}
        </div>

        {/* Right panel — 45% */}
        <div className="flex flex-col bg-white border-l border-border" style={{ width: '45%' }}>
          {/* Name input */}
          <div className="flex-shrink-0 px-3 pt-3 pb-2">
            <div
              className="flex items-center gap-2 rounded-btn px-2.5"
              style={{
                border: '1.5px solid #3D5AF2',
                background: 'rgba(61,90,242,0.04)',
                height: 36,
              }}
            >
              <Pencil size={12} color="#3D5AF2" className="flex-shrink-0" />
              <input
                type="text"
                value={wizard.name}
                onChange={(e) => updateWizard({ name: e.target.value })}
                placeholder="Type the mission name here…"
                className="flex-1 outline-none bg-transparent font-semibold"
                style={{ fontSize: 12, color: '#23262F' }}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Info rows */}
          <div className="flex-1 overflow-y-auto min-h-0 border-t border-border">
            <InfoRow
              icon={<Clock size={13} />}
              label="Flight duration"
              value={`${flightTime} min`}
            />
            <InfoRow
              icon={<ArrowUp size={13} />}
              label="Flight altitude"
              value={`${flightHeight} m`}
            />
            <InfoRow
              icon={<Battery size={13} />}
              label="Battery"
              value={
                <span className="flex items-center gap-1">
                  {!feasible && <AlertTriangle size={11} color="#E0515F" />}-{batteryNeed}%
                </span>
              }
              error={!feasible}
            />
            <InfoRow
              icon={<Camera size={13} />}
              label="Quality"
              value={qualityLabel(wizard.quality)}
            />
            <InfoRow icon={<Layers size={13} />} label="Application" value={wizard.app} />
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0 px-6 pt-2 pb-3 flex flex-col gap-2">
            {canSubmit ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full max-w-[560px] mx-auto rounded-btn bg-primary flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
                style={{ height: 44 }}
              >
                <Check size={17} color="white" strokeWidth={3} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Save Mission</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full max-w-[560px] mx-auto rounded-btn flex items-center justify-center gap-2"
                style={{ height: 44, background: '#E0E0E0' }}
              >
                <Check size={17} color="#AAAAAA" strokeWidth={3} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#AAAAAA' }}>
                  Save Mission
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
