import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, Play, History, Joystick } from 'lucide-react'
import logo from '../assets/logo.png'
import { useMissions } from '../hooks/useMissions'
import { useWizard } from '../hooks/useWizard'
import { BLUE, DARK, GREEN } from '../constants'

const DRONE_CONNECTED = true
const DRONE_BATTERY = 65

export default function HomePage() {
  const navigate = useNavigate()
  const { missions } = useMissions()
  const { startNewWizard } = useWizard()

  function handleNewMission() {
    startNewWizard()
    navigate('/wizard/step1')
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      {/* Header */}
      <div
        className="flex items-center bg-white border-b border-border px-6 flex-shrink-0"
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
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: DRONE_CONNECTED ? GREEN : '#CBCBCB',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 500 }}>
              {DRONE_CONNECTED ? 'Drone Connected' : 'No drone'}
            </span>
          </div>
          {DRONE_CONNECTED && (
            <>
              <div style={{ width: '1px', height: '12px', background: '#E0E0E0' }} />
              <div className="flex items-center gap-1.5">
                <svg width="18" height="8" viewBox="0 0 18 8" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="0.5" y="0.5" width="14" height="7" rx="1.5" stroke="#C0C0C0" />
                  <rect x="15" y="2" width="2" height="4" rx="0.75" fill="#C0C0C0" />
                  <rect
                    x="1.5"
                    y="1.5"
                    width={Math.round((DRONE_BATTERY / 100) * 11)}
                    height="5"
                    rx="0.5"
                    fill={DRONE_BATTERY <= 20 ? '#E0515F' : GREEN}
                  />
                </svg>
                <span style={{ fontSize: '11px', color: '#888', fontWeight: 500 }}>
                  {DRONE_BATTERY}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 min-h-0">
        <div className="flex gap-2.5 w-full max-w-[560px]" style={{ height: '210px' }}>
          {/* Left column: 3 secondary buttons */}
          <div className="flex flex-col gap-2.5" style={{ width: '168px' }}>
            <button
              type="button"
              onClick={() => navigate('/missions')}
              className="flex-1 flex items-center gap-3 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border text-left"
              style={{ padding: '10px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div
                className="relative flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '32px', height: '32px', background: '#F0F0F0' }}
              >
                <FolderOpen size={16} color={DARK} strokeWidth={1.75} />
                {missions.length > 0 && (
                  <span
                    className="absolute font-bold rounded-full"
                    style={{
                      top: '-5px',
                      right: '-5px',
                      width: '15px',
                      height: '15px',
                      fontSize: '8px',
                      background: BLUE,
                      color: 'white',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {missions.length}
                  </span>
                )}
              </div>
              <span className="font-semibold text-title truncate" style={{ fontSize: '13px' }}>
                Missions
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/flightlog')}
              className="flex-1 flex items-center gap-3 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border text-left"
              style={{ padding: '10px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '32px', height: '32px', background: '#F0F0F0' }}
              >
                <History size={16} color={DARK} strokeWidth={1.75} />
              </div>
              <span className="font-semibold text-title truncate" style={{ fontSize: '13px' }}>
                Flightlog
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/manual-flight')}
              className="flex-1 flex items-center gap-3 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border text-left"
              style={{ padding: '10px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '32px', height: '32px', background: '#F0F0F0' }}
              >
                <Joystick size={16} color={DARK} strokeWidth={1.75} />
              </div>
              <span className="font-semibold text-title truncate" style={{ fontSize: '13px' }}>
                Manual
              </span>
            </button>
          </div>

          {/* Right column: 2 primary buttons */}
          <div className="flex flex-col gap-2.5 flex-1">
            {/* Start Flight */}
            <button
              type="button"
              onClick={() => navigate('/start-flight')}
              className="flex-1 flex items-center rounded-card active:scale-[0.98] transition-transform select-none overflow-hidden relative"
              style={{
                background: BLUE,
                paddingLeft: '25px',
                paddingRight: '16px',
                gap: '14px',
                boxShadow: '0 3px 14px rgba(61,90,242,0.28)',
              }}
            >
              <svg
                aria-hidden="true"
                style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.12 }}
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
              >
                <circle cx="90" cy="90" r="60" stroke="white" strokeWidth="18" fill="none" />
              </svg>
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.18)' }}
              >
                <Play size={16} color="white" fill="white" strokeWidth={0} />
              </div>
              <div
                className="text-left flex-1 min-w-0"
                style={{
                  height: '38px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-bold text-white"
                  style={{ fontSize: '15px', lineHeight: '1.2' }}
                >
                  Start Flight
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.60)',
                    marginTop: '3px',
                    lineHeight: '1.3',
                  }}
                >
                  Pick a saved mission and send it to the drone
                </div>
              </div>
            </button>

            {/* Create Mission */}
            <button
              type="button"
              onClick={handleNewMission}
              className="flex-1 flex items-center rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border overflow-hidden relative"
              style={{
                paddingLeft: '25px',
                paddingRight: '16px',
                gap: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <svg
                aria-hidden="true"
                style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.07 }}
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
              >
                <circle cx="90" cy="90" r="60" stroke={BLUE} strokeWidth="18" fill="none" />
              </svg>
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '38px', height: '38px', background: 'rgba(61,90,242,0.10)' }}
              >
                <Plus size={18} color={BLUE} strokeWidth={2.5} />
              </div>
              <div
                className="text-left flex-1 min-w-0"
                style={{
                  height: '38px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-bold text-title"
                  style={{ fontSize: '15px', lineHeight: '1.2' }}
                >
                  Create Mission
                </div>
                <div
                  style={{ fontSize: '12px', color: '#888', marginTop: '3px', lineHeight: '1.3' }}
                >
                  Plan a new flight area step by step
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
