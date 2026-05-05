import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  FolderOpen,
  History,
  SlidersHorizontal,
  Joystick,
  ArrowRight,
  Play,
  X,
  ChevronRight,
} from 'lucide-react'
import logo from '../assets/logo.png'
import useMissions from '../hooks/useMissions'
import useWizard from '../hooks/useWizard'
import { BLUE, DARK, GREEN, RED, CURRENT_BATTERY } from '../constants'

const DRONE_CONNECTED = true

const MOCK_FLIGHTS = [
  {
    id: 'f1',
    missionName: 'Quarry Volume Q2',
    flownAt: 'Today · 09:42',
    durationMin: 18,
    photos: 312,
    status: 'complete',
  },
  {
    id: 'f2',
    missionName: 'Construction Site North',
    flownAt: 'Yesterday · 16:08',
    durationMin: 11,
    photos: 184,
    status: 'complete',
  },
  {
    id: 'f3',
    missionName: 'Road Corridor Phase 2',
    flownAt: 'Yesterday · 11:20',
    durationMin: 24,
    photos: 421,
    status: 'complete',
  },
  {
    id: 'f4',
    missionName: 'Construction Site North',
    flownAt: '29 Apr · 14:55',
    durationMin: 9,
    photos: 0,
    status: 'aborted',
  },
]

/* ─── Shared ─── */

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

function StatusPill() {
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
              fill={CURRENT_BATTERY <= 20 ? RED : GREEN}
            />
          </svg>
          <span style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>{CURRENT_BATTERY}%</span>
        </div>
      )}
    </div>
  )
}

function ActionCardPrimary({ title, subtitle, icon, onClick, accent = false }) {
  if (accent) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="hover-lift group relative overflow-hidden rounded-card text-left flex flex-col justify-between"
        style={{
          background: 'linear-gradient(135deg, #3D5AF2 0%, #4E6BF5 60%, #6B7DF7 100%)',
          padding: '22px 24px',
          minHeight: 168,
          boxShadow: '0 6px 22px rgba(61,90,242,0.28)',
          border: '1px solid #2D47D9',
        }}
      >
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
          className="relative flex items-center justify-center rounded-btn"
          style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.18)' }}
        >
          {icon}
        </div>
        <div className="relative flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div
              className="text-white font-bold"
              style={{ fontSize: 22, letterSpacing: '-0.02em' }}
            >
              {title}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', marginTop: 4 }}>
              {subtitle}
            </div>
          </div>
          <ArrowRight
            size={20}
            color="white"
            strokeWidth={2.25}
            className="flex-shrink-0 mb-1 opacity-70 transition-all group-hover:opacity-100 group-hover:translate-x-1"
          />
        </div>
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover-lift group bg-white border border-border rounded-card text-left flex flex-col justify-between"
      style={{ padding: '22px 24px', minHeight: 168, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div
        className="flex items-center justify-center rounded-btn"
        style={{ width: 38, height: 38, background: 'rgba(61,90,242,0.10)' }}
      >
        {icon}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-title font-bold" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{subtitle}</div>
        </div>
        <ArrowRight
          size={20}
          color="#9AA0AB"
          strokeWidth={2.25}
          className="flex-shrink-0 mb-1 transition-all group-hover:translate-x-1"
        />
      </div>
    </button>
  )
}

function SecondaryCard({ icon, label, badge, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hover-lift bg-white border border-border rounded-card flex items-center gap-3 text-left ${className}`}
      style={{ padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div
        className="relative flex items-center justify-center rounded-btn flex-shrink-0"
        style={{ width: 36, height: 36, background: '#F0F1F5' }}
      >
        {icon}
        {badge != null && (
          <span
            className="absolute font-bold rounded-full"
            style={{
              top: -5,
              right: -5,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              fontSize: 9,
              background: BLUE,
              color: 'white',
              display: 'grid',
              placeItems: 'center',
              border: '1.5px solid white',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <span className="font-semibold text-title truncate" style={{ fontSize: 13.5 }}>
        {label}
      </span>
    </button>
  )
}

function FlightRow({ flight }) {
  const aborted = flight.status === 'aborted'
  return (
    <button
      type="button"
      className="w-full grid items-center gap-4 py-3 px-4 text-left hover:bg-[#F8F8F8] transition-colors"
      style={{ gridTemplateColumns: 'minmax(0,1fr) 130px 90px 90px 28px' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          style={{
            width: 30,
            height: 30,
            background: aborted ? 'rgba(224,81,95,0.10)' : 'rgba(61,90,242,0.10)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {aborted ? (
            <X size={13} color={RED} strokeWidth={2.25} />
          ) : (
            <Play size={11} fill={BLUE} color={BLUE} />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-title truncate" style={{ fontSize: 13.5 }}>
            {flight.missionName}
          </span>
          <span
            style={{
              fontSize: 11,
              color: aborted ? RED : '#999',
              marginTop: 1,
              fontWeight: aborted ? 600 : 400,
            }}
          >
            {aborted ? 'Aborted' : 'Complete'}
          </span>
        </div>
      </div>
      <span style={{ fontSize: 12, color: '#999' }}>{flight.flownAt}</span>
      <span style={{ fontSize: 12, color: '#5A5A5A', fontFamily: 'monospace' }}>
        {flight.durationMin} min
      </span>
      <span style={{ fontSize: 12, color: '#5A5A5A', fontFamily: 'monospace' }}>
        {flight.photos > 0 ? `${flight.photos} photos` : '—'}
      </span>
      <ChevronRight size={14} color="#C0C0C0" strokeWidth={2} />
    </button>
  )
}

/* ─── Page ─── */

export default function HomePage() {
  const navigate = useNavigate()
  const { missions } = useMissions()
  const { startNewWizard } = useWizard()

  function handleNewMission() {
    startNewWizard()
    navigate('/wizard/step1')
  }

  return (
    <>
      {/* ══ Small-screen layout (DJI Remote, < 1024px) ══ */}
      <div className="w-full h-full flex flex-col bg-bg-secondary lg:hidden">
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
            <StatusPill />
            <div style={{ width: '1px', height: '22px', background: '#E0E0E0' }} />
            <LangToggle />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-8 min-h-0">
          <div className="flex gap-2.5 w-full max-w-[560px]" style={{ height: '218px' }}>
            {/* Left column: 3 secondary buttons */}
            <div className="flex flex-col gap-2.5 h-full" style={{ width: '168px' }}>
              <SecondaryCard
                className="flex-1"
                icon={<FolderOpen size={16} color={DARK} strokeWidth={1.75} />}
                label="Missions"
                badge={missions.length > 0 ? missions.length : null}
                onClick={() => navigate('/missions')}
              />
              <SecondaryCard
                className="flex-1"
                icon={<History size={16} color={DARK} strokeWidth={1.75} />}
                label="Flightlog"
                onClick={() => navigate('/flightlog')}
              />
              <SecondaryCard
                className="flex-1"
                icon={<Joystick size={16} color={DARK} strokeWidth={1.75} />}
                label="Manual"
                onClick={() => navigate('/manual-flight')}
              />
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
                onClick={() => handleNewMission()}
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

      {/* ══ Desktop layout (≥ 1024px) ══ */}
      <div className="w-full h-full bg-bg-secondary hidden lg:flex flex-col">
        {/* Header */}
        <header
          className="flex items-center bg-white border-b border-border flex-shrink-0"
          style={{ height: 60, paddingInline: 24 }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 mr-7"
          >
            <img src={logo} alt="MRR Drones" style={{ width: 32, height: 32 }} />
            <span
              className="font-bold text-title"
              style={{ fontSize: 15, letterSpacing: '-0.01em' }}
            >
              MRR Drones
            </span>
          </button>

          <nav className="flex items-stretch h-full">
            {[
              { key: '/', label: 'Home', active: true },
              { key: '/missions', label: 'Missions', active: false },
              { key: '/flightlog', label: 'Flightlog', active: false },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key)}
                className={`nav-item flex items-center px-3.5 ${item.active ? 'active' : ''}`}
                style={{
                  fontSize: 13,
                  fontWeight: item.active ? 700 : 500,
                  color: item.active ? BLUE : '#5A5A5A',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <StatusPill />
            <div style={{ width: 1, height: 22, background: '#E0E0E0' }} />
            <LangToggle />
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto" style={{ maxWidth: 1180, padding: '48px 32px 64px' }}>
            {/* Title row */}
            <div className="mb-7">
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  color: BLUE,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                MISSION PLANNER
              </div>
              <h1
                className="text-title font-bold"
                style={{
                  fontSize: 30,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                  margin: '6px 0 0',
                }}
              >
                Ready to Fly.
              </h1>
              <p style={{ fontSize: 14, color: '#5A5A5A', margin: '6px 0 0', maxWidth: 620 }}>
                Your MRR Pro is connected. Pick a mission or plan a new one.
              </p>
            </div>

            {/* Primary action grid */}
            <div className="grid gap-3.5 mb-3.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <ActionCardPrimary
                accent
                title="Start Flight"
                subtitle="Pick a saved mission and send it to the drone"
                icon={<Play size={16} fill="white" color="white" />}
                onClick={() => navigate('/start-flight')}
              />
              <ActionCardPrimary
                title="Create Mission"
                subtitle="Plan a new flight area on the map and configure capture settings"
                icon={<Plus size={20} color={BLUE} strokeWidth={2.5} />}
                onClick={() => handleNewMission()}
              />
            </div>

            {/* Secondary actions */}
            <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <SecondaryCard
                icon={<FolderOpen size={16} color={DARK} strokeWidth={1.75} />}
                label="Missions"
                badge={missions.length > 0 ? missions.length : null}
                onClick={() => navigate('/missions')}
              />
              <SecondaryCard
                icon={<History size={16} color={DARK} strokeWidth={1.75} />}
                label="Flightlog"
                onClick={() => navigate('/flightlog')}
              />
              <SecondaryCard
                icon={<SlidersHorizontal size={16} color={DARK} strokeWidth={1.75} />}
                label="Processing Tools"
              />
            </div>

            {/* Recent flights */}
            <div className="mt-9">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h2
                    className="text-title font-bold"
                    style={{ fontSize: 17, letterSpacing: '-0.01em' }}
                  >
                    Recent flights
                  </h2>
                  <p style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>
                    Re-fly any of these missions or review the captures
                  </p>
                </div>
                <button
                  type="button"
                  className="font-semibold hover:underline"
                  style={{ fontSize: 12.5, color: BLUE }}
                  onClick={() => navigate('/flightlog')}
                >
                  View flightlog →
                </button>
              </div>
              <div
                className="bg-white border border-border rounded-card overflow-hidden"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="grid gap-4 px-4 py-2.5 border-b border-border"
                  style={{
                    gridTemplateColumns: 'minmax(0,1fr) 130px 90px 90px 28px',
                    background: '#FAFAFC',
                  }}
                >
                  {['Mission', 'Flown', 'Duration', 'Captures', ''].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#9A9AB0',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {MOCK_FLIGHTS.map((f) => (
                  <div key={f.id} className="border-b border-border last:border-b-0">
                    <FlightRow flight={f} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
