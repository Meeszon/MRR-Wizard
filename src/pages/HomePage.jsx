import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, History, Joystick } from 'lucide-react'
import logo from '../assets/logo.png'
import useMissions from '../hooks/useMissions'
import useWizard from '../hooks/useWizard'
import { BLUE, DARK, GREEN, CURRENT_BATTERY } from '../constants'

const DRONE_CONNECTED = true

function StatusCards() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1" style={{ background: '#F4F5F8' }}>
        <div
          className={DRONE_CONNECTED ? 'pulse-soft' : ''}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: DRONE_CONNECTED ? GREEN : '#CBCBCB',
            flexShrink: 0,
            boxShadow: DRONE_CONNECTED ? '0 0 0 3px rgba(34,197,94,0.18)' : 'none',
          }}
        />
        <span style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>
          {DRONE_CONNECTED ? 'MRR Pro · Connected' : 'No drone'}
        </span>
      </div>

      {DRONE_CONNECTED && (
        <div className="flex items-center gap-1.5 px-2.5 py-1" style={{ background: '#F4F5F8' }}>
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
            <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="#B8B8B8" />
            <rect x="19.5" y="3" width="2" height="5" rx="1" fill="#B8B8B8" />
            <rect
              x="2"
              y="2"
              width={Math.round((CURRENT_BATTERY / 100) * 15)}
              height="7"
              rx="1"
              fill={CURRENT_BATTERY <= 20 ? '#E0515F' : GREEN}
            />
          </svg>
          <span style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>{CURRENT_BATTERY}%</span>
        </div>
      )}
    </div>
  )
}

function LangToggle() {
  const [lang, setLang] = useState('EN')
  return (
    <div className="flex items-center" style={{ background: '#F4F5F8', padding: 2, gap: 2 }}>
      {['EN', 'NL'].map((l) => {
        const active = lang === l
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className="transition-colors"
            style={{
              padding: '3px 9px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: active ? '#fff' : '#5A5A5A',
              background: active ? BLUE : 'transparent',
            }}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}

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
          style={{ width: '40px', height: '40px', marginTop: '-1px' }}
        />
        <span className="font-bold text-title ml-1" style={{ fontSize: '15px' }}>
          MRR Drones
        </span>

        <div className="ml-auto flex items-center gap-3">
          <StatusCards />
          <div style={{ width: '1px', height: '22px', background: '#E0E0E0' }} />
          <LangToggle />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 min-h-0">
        <div className="flex gap-2.5 w-full max-w-[560px]" style={{ height: '218px' }}>
          {/* Left column: 3 secondary buttons */}
          <div className="flex flex-col gap-2.5 h-full" style={{ width: '168px' }}>
            <button
              type="button"
              onClick={() => navigate('/missions')}
              className="flex-1 flex items-center gap-3 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border text-left"
              style={{ padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div
                className="relative flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '36px', height: '36px', background: '#F0F1F5' }}
              >
                <FolderOpen size={16} color={DARK} strokeWidth={1.75} />
                {missions.length > 0 && (
                  <span
                    className="absolute font-bold rounded-full"
                    style={{
                      top: '-5px',
                      right: '-5px',
                      minWidth: '16px',
                      height: '16px',
                      padding: '0 4px',
                      fontSize: '9px',
                      background: BLUE,
                      color: 'white',
                      display: 'grid',
                      placeItems: 'center',
                      border: '1.5px solid white',
                    }}
                  >
                    {missions.length}
                  </span>
                )}
              </div>
              <span className="font-semibold text-title truncate" style={{ fontSize: '13.5px' }}>
                Missions
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/flightlog')}
              className="flex-1 flex items-center gap-3 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border text-left"
              style={{ padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '36px', height: '36px', background: '#F0F1F5' }}
              >
                <History size={16} color={DARK} strokeWidth={1.75} />
              </div>
              <span className="font-semibold text-title truncate" style={{ fontSize: '13.5px' }}>
                Flightlog
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/manual-flight')}
              className="flex-1 flex items-center gap-3 rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border text-left"
              style={{ padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div
                className="flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '36px', height: '36px', background: '#F0F1F5' }}
              >
                <Joystick size={16} color={DARK} strokeWidth={1.75} />
              </div>
              <span className="font-semibold text-title truncate" style={{ fontSize: '13.5px' }}>
                Manual
              </span>
            </button>
          </div>

          {/* Right column: 2 primary buttons */}
          <div className="flex flex-col gap-2.5 flex-1 h-full">
            {/* Start Flight */}
            <button
              type="button"
              onClick={() => navigate('/start-flight')}
              className="flex-1 flex items-center rounded-card active:scale-[0.98] transition-transform select-none relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3D5AF2 0%, #4560F3 60%, #4D65F4 100%)',
                paddingLeft: '25px',
                paddingRight: '16px',
                gap: '14px',
                boxShadow: '0 6px 22px rgba(61,90,242,0.28)',
                border: '1px solid #4259EE',
              }}
            >
              {/* Faded grid overlay */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                  maskImage: 'radial-gradient(circle at 90% 10%, black, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle at 90% 10%, black, transparent 70%)',
                }}
              />
              <div
                className="relative flex items-center justify-center rounded-btn flex-shrink-0"
                style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.18)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <div
                className="relative text-left flex-1 min-w-0"
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
              className="flex-1 flex items-center rounded-card active:scale-[0.98] transition-transform select-none bg-white border border-border relative"
              style={{
                paddingLeft: '25px',
                paddingRight: '16px',
                gap: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
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
