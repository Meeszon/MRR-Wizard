import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, LayoutGroup } from 'framer-motion'
import logo from '../assets/logo.png'
import { BLUE, GREEN, RED, CURRENT_BATTERY } from '../constants'

const DRONE_CONNECTED = true

function LangToggle() {
  const [lang, setLang] = useState('EN')
  return (
    <LayoutGroup>
      <div
        className="flex items-center rounded-btn"
        style={{ background: '#F4F5F8', padding: 2, gap: 2 }}
      >
        {['EN', 'NL'].map((l) => {
          const active = lang === l
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className="relative rounded-btn"
              style={{
                padding: '3px 9px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              {active && (
                <motion.div
                  layoutId="lang-pill-desktop"
                  className="absolute inset-0 rounded-btn"
                  style={{ background: BLUE }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <motion.span
                className="relative z-10"
                animate={{ color: active ? '#ffffff' : '#5A5A5A' }}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              >
                {l}
              </motion.span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

function StatusPill() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-btn"
        style={{ background: '#F4F5F8' }}
      >
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
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-btn"
          style={{ background: '#F4F5F8' }}
        >
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

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/missions', label: 'Missions' },
  { path: '/flightlog', label: 'Flightlog' },
]

function getActiveKey(pathname) {
  if (pathname.startsWith('/missions') || pathname.startsWith('/wizard')) return '/missions'
  if (pathname.startsWith('/flightlog')) return '/flightlog'
  return '/'
}

export default function DesktopNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeKey = getActiveKey(pathname)

  return (
    <header
      className="flex items-center bg-white border-b border-border flex-shrink-0"
      style={{ height: 60, paddingInline: 24 }}
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 mr-7"
      >
        <img src={logo} alt="MRR Drones" style={{ width: 40, height: 40 }} />
        <span className="font-bold text-title" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>
          MRR Drones
        </span>
      </button>

      <nav className="flex items-stretch h-full">
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.path
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`nav-item flex items-center px-3.5${isActive ? ' active' : ''}`}
              style={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? BLUE : '#5A5A5A',
              }}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <StatusPill />
        <div style={{ width: 1, height: 22, background: '#E0E0E0' }} />
        <LangToggle />
      </div>
    </header>
  )
}
