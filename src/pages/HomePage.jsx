import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, Play, History } from 'lucide-react'
import logo from '../assets/logo.png'
import { useMissions } from '../hooks/useMissions'
import { useWizard } from '../hooks/useWizard'

const BLUE = '#3D5AF2'
const DARK = '#23262F'

const DRONE_CONNECTED = true
const DRONE_BATTERY = 65

export default function HomePage() {
  const navigate = useNavigate()
  const { missions, completedMissions } = useMissions()
  const { startNewWizard } = useWizard()

  function handleNewMission() {
    startNewWizard()
    navigate('/wizard/step1')
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      {/* Header */}
      <div
        className="flex items-center bg-white border-b border-border px-4 flex-shrink-0"
        style={{ height: '50px' }}
      >
        <img
          src={logo}
          alt="MRR Drones"
          style={{ width: '40px', height: '40px', borderRadius: '9px', marginTop: '-1px' }}
        />
        <span className="font-bold text-title ml-1" style={{ fontSize: '15px' }}>
          MRR Drones
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: DRONE_CONNECTED ? '#22C55E' : '#CBCBCB',
              }}
            />
            <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>
              {DRONE_CONNECTED ? 'Drone Connected' : 'No drone'}
            </span>
          </div>
          {DRONE_CONNECTED && (
            <div style={{ width: '1px', height: '14px', background: '#E0E0E0', margin: '0 6px' }} />
          )}
          {DRONE_CONNECTED && (
            <div className="flex items-center gap-1.5">
              <svg width="22" height="9" viewBox="0 0 22 9" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="18"
                  height="8"
                  rx="1.5"
                  stroke="#D0D0D0"
                  strokeWidth="1"
                />
                <rect x="19" y="2.5" width="2.5" height="4" rx="1" fill="#D0D0D0" />
                <rect
                  x="2"
                  y="2"
                  width={Math.round((DRONE_BATTERY / 100) * 14)}
                  height="5"
                  rx="0.5"
                  fill={DRONE_BATTERY <= 20 ? '#E0515F' : '#22C55E'}
                />
              </svg>
              <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>
                {DRONE_BATTERY}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 min-h-0">
        <div className="flex flex-col gap-2.5 w-full max-w-[560px]">
          {/* 1 — Start a Flight (blue, full width) */}
          <button
            type="button"
            onClick={() => navigate('/missions')}
            className="flex items-center gap-4 rounded-card active:scale-[0.98] transition-transform select-none w-full"
            style={{
              background: BLUE,
              padding: '14px 16px',
              boxShadow: '0 3px 14px rgba(61,90,242,0.28)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-btn flex-shrink-0"
              style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.16)' }}
            >
              <Play size={19} color="white" fill="white" strokeWidth={0} />
            </div>
            <div className="text-left">
              <div className="font-bold text-white" style={{ fontSize: '15px' }}>
                Start a Flight
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
                Select and launch an existing mission
              </div>
            </div>
          </button>

          {/* 2 — Create a new Flight */}
          <button
            type="button"
            onClick={handleNewMission}
            className="flex items-center gap-4 rounded-card active:scale-[0.98] transition-transform select-none w-full bg-white border border-border"
            style={{ padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <div
              className="flex items-center justify-center rounded-btn flex-shrink-0"
              style={{ width: '40px', height: '40px', background: 'rgba(61,90,242,0.10)' }}
            >
              <Plus size={22} color={BLUE} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="font-bold text-title" style={{ fontSize: '15px' }}>
                Create a new Mission
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                Set up step by step
              </div>
            </div>
          </button>

          {/* 3 — My Missions + Flightlog (white, half width each) */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/missions')}
              className="flex items-center gap-4 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border"
              style={{ padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0 relative"
                style={{ width: '40px', height: '40px', background: '#F0F0F0' }}
              >
                <FolderOpen size={19} color={DARK} strokeWidth={1.75} />
                {missions.length > 0 && (
                  <span
                    className="absolute font-bold rounded-full"
                    style={{
                      top: '-5px',
                      right: '-5px',
                      width: '16px',
                      height: '16px',
                      fontSize: '8.5px',
                      background: BLUE,
                      color: 'white',
                      display: 'grid',
                      placeItems: 'center',
                      lineHeight: '1',
                    }}
                  >
                    {missions.length}
                  </span>
                )}
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-title truncate" style={{ fontSize: '15px' }}>
                  My Missions
                </div>
                <div
                  className="truncate"
                  style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}
                >
                  Edit &amp; manage
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/flightlog')}
              className="flex items-center gap-4 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border"
              style={{ padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0 relative"
                style={{ width: '40px', height: '40px', background: '#F0F0F0' }}
              >
                <History size={19} color={DARK} strokeWidth={1.75} />
                {completedMissions.length > 0 && (
                  <span
                    className="absolute font-bold rounded-full"
                    style={{
                      top: '-5px',
                      right: '-5px',
                      width: '16px',
                      height: '16px',
                      fontSize: '8.5px',
                      background: '#5A5A5A',
                      color: 'white',
                      display: 'grid',
                      placeItems: 'center',
                      lineHeight: '1',
                    }}
                  >
                    {completedMissions.length}
                  </span>
                )}
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-title truncate" style={{ fontSize: '15px' }}>
                  Flightlog
                </div>
                <div
                  className="truncate"
                  style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}
                >
                  Completed flights
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
