import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Clock, Battery, Radio, Info, ChevronUp, Pencil, Play } from 'lucide-react'
import MapPlaceholder from '../components/MapPlaceholder'
import { useMissions } from '../hooks/useMissions'
import { useWizard } from '../hooks/useWizard'
import { calcMetrics } from '../constants'
import { mockDrones } from '../data/mockDrones'

const BLUE = '#3D5AF2'
const RED = '#E0515F'
const GREEN = '#22C55E'

export default function StartFlightPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { missions, setLastMissionName } = useMissions()
  const { startEditWizard } = useWizard()

  const [selectedMissionId, setSelectedMissionId] = useState(
    location.state?.selectedMissionId ?? null,
  )
  const [selectedDroneId, setSelectedDroneId] = useState(null)
  const [openDetailId, setOpenDetailId] = useState(null)

  useEffect(() => {
    const connected = mockDrones.filter((d) => d.connected)
    if (connected.length === 1) setSelectedDroneId(connected[0].id)
  }, [])

  const selectedMission = missions.find((m) => m.id === selectedMissionId) ?? null
  const canStart = selectedMissionId !== null && selectedDroneId !== null

  function handleEditMission(mission) {
    startEditWizard(mission)
    navigate('/missions/edit', {
      state: { from: '/start-flight', missionId: mission.id },
    })
  }

  function handleStart() {
    if (!canStart || !selectedMission) return
    setLastMissionName(selectedMission.name)
    navigate('/wizard/ready')
  }

  function toggleDetail(id) {
    setOpenDetailId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      {/* Header */}
      <div
        className="relative flex items-center bg-white border-b border-border px-3 flex-shrink-0"
        style={{ height: 50 }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
        >
          <ArrowLeft size={18} color="#5A5A5A" />
        </button>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
          style={{ fontSize: 14 }}
        >
          Start Flight
        </span>
      </div>

      {/* Scrollable body: drone + missions */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {/* Drone section */}
        <div className="flex-shrink-0 bg-white border-b border-border px-3 py-2">
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#ABABAB',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}
          >
            Drone
          </div>
          <div className="flex gap-2">
            {mockDrones.map((drone) => {
              const sel = drone.id === selectedDroneId
              return (
                <button
                  key={drone.id}
                  type="button"
                  onClick={() => setSelectedDroneId(drone.id)}
                  className="flex items-center gap-2.5 flex-1 rounded-btn transition-all text-left"
                  style={{
                    padding: '8px 12px',
                    background: sel ? '#EEF1FE' : '#F4F4F4',
                    border: `1.5px solid ${sel ? BLUE : '#E4E4E4'}`,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: drone.connected ? GREEN : '#CBCBCB',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="font-semibold text-title flex-1 truncate"
                    style={{ fontSize: 13 }}
                  >
                    {drone.name}
                  </span>
                  <span
                    className="flex items-center gap-1 flex-shrink-0"
                    style={{ fontSize: 12, color: '#5A5A5A' }}
                  >
                    <Battery size={12} color="#5A5A5A" />
                    {drone.droneBattery}%
                  </span>
                  <span
                    className="flex items-center gap-1 flex-shrink-0"
                    style={{ fontSize: 12, color: '#5A5A5A' }}
                  >
                    <Radio size={12} color="#5A5A5A" />
                    {drone.remoteBattery}%
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Missions section */}
        <div className="px-3 py-2.5">
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#ABABAB',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}
          >
            Mission
          </div>

          <div className="flex flex-col gap-1.5">
            {missions.map((mission) => {
              const m = calcMetrics(mission.quality, mission.highestPointMeters)
              const selected = mission.id === selectedMissionId
              const detailOpen = mission.id === openDetailId

              return (
                <div
                  key={mission.id}
                  className="rounded-card overflow-hidden"
                  style={{
                    border: `1.5px solid ${selected ? BLUE : '#E4E4E4'}`,
                    boxShadow: selected
                      ? '0 1px 8px rgba(61,90,242,0.12)'
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    background: 'white',
                  }}
                >
                  {/* Main row */}
                  <div className="flex items-stretch">
                    {/* Selection area */}
                    <button
                      type="button"
                      onClick={() => setSelectedMissionId(mission.id)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left transition-colors"
                      style={{
                        padding: '13px 12px',
                        background: selected ? '#EEF1FE' : 'transparent',
                      }}
                    >
                      {/* Radio indicator */}
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: `2px solid ${selected ? BLUE : '#D0D0D0'}`,
                          background: selected ? BLUE : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.15s',
                        }}
                      />

                      <span
                        className="font-bold text-title truncate flex-1"
                        style={{ fontSize: 14 }}
                      >
                        {mission.name}
                      </span>

                      {/* Stats — always visible */}
                      <span
                        className="flex items-center gap-1 flex-shrink-0"
                        style={{ fontSize: 12, color: '#5A5A5A' }}
                      >
                        <Clock size={13} color="#888" />
                        {m.flightTime} min
                      </span>
                      <span style={{ fontSize: 12, color: '#D8D8D8', flexShrink: 0 }}>·</span>
                      <span
                        className="flex items-center gap-1 flex-shrink-0 font-semibold"
                        style={{ fontSize: 12, color: m.feasible ? '#5A5A5A' : RED }}
                      >
                        <Battery size={13} color={m.feasible ? '#888' : RED} />-{m.batteryNeed}%
                      </span>
                    </button>

                    {/* Detail toggle */}
                    <button
                      type="button"
                      onClick={() => toggleDetail(mission.id)}
                      className="flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{
                        width: 50,
                        borderLeft: `1px solid ${selected ? 'rgba(61,90,242,0.15)' : '#F0F0F0'}`,
                        background: detailOpen
                          ? 'rgba(61,90,242,0.06)'
                          : selected
                            ? '#EEF1FE'
                            : 'transparent',
                        color: detailOpen ? BLUE : '#ABABAB',
                      }}
                    >
                      {detailOpen ? <ChevronUp size={17} /> : <Info size={17} />}
                    </button>
                  </div>

                  {/* Expanded detail panel */}
                  {detailOpen && (
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height: 150,
                        borderTop: `1px solid ${selected ? 'rgba(61,90,242,0.12)' : '#F0F0F0'}`,
                      }}
                    >
                      <MapPlaceholder mode="edit" className="absolute inset-0" />
                      <button
                        type="button"
                        onClick={() => handleEditMission(mission)}
                        className="absolute flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform"
                        style={{
                          bottom: 8,
                          right: 8,
                          padding: '6px 14px',
                          background: 'white',
                          border: '1.5px solid #D8D8D8',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#23262F',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                        }}
                      >
                        <Pencil size={13} color="#5A5A5A" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* end scrollable body */}

      {/* Footer */}
      <div
        className="flex items-center px-4 bg-white border-t border-border flex-shrink-0"
        style={{ height: 52 }}
      >
        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="w-full max-w-[560px] mx-auto rounded-btn flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            height: 44,
            background: canStart ? BLUE : '#EBEBEB',
            cursor: canStart ? 'pointer' : 'not-allowed',
            boxShadow: canStart ? '0 2px 12px rgba(61,90,242,0.30)' : 'none',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          <Play
            size={17}
            color={canStart ? 'white' : '#B8B8B8'}
            fill={canStart ? 'white' : '#B8B8B8'}
            strokeWidth={0}
          />
          <span style={{ fontSize: 14, fontWeight: 700, color: canStart ? 'white' : '#B8B8B8' }}>
            Start Mission
          </span>
        </button>
      </div>
    </div>
  )
}
