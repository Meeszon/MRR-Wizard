import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, X, ChevronRight, History } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import useMissions from '../hooks/useMissions'
import { calcMetrics, BLUE, RED } from '../constants'

const COLS = 'minmax(0,1fr) 88px 80px 90px 20px'

function formatFlownAt(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function FlightRow({ mission }) {
  const aborted = mission.status === 'aborted'
  const { flightTime, photos } = calcMetrics(mission.quality, mission.highestPointMeters)
  return (
    <button
      type="button"
      className="w-full grid items-center gap-3 py-3 px-4 text-left hover:bg-bg-secondary transition-colors"
      style={{ gridTemplateColumns: COLS }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="rounded-btn flex-shrink-0"
          style={{
            width: 28,
            height: 28,
            background: aborted ? 'rgba(224,81,95,0.10)' : 'rgba(61,90,242,0.10)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {aborted ? (
            <X size={12} color={RED} strokeWidth={2.25} />
          ) : (
            <Play size={10} fill={BLUE} stroke={BLUE} />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-title truncate" style={{ fontSize: 13 }}>
            {mission.name}
          </span>
          <span style={{ fontSize: 10.5, color: aborted ? RED : '#999', marginTop: 1 }}>
            {aborted ? 'Aborted' : 'Complete'}
          </span>
        </div>
      </div>
      <span style={{ fontSize: 11.5, color: '#999' }}>{formatFlownAt(mission.completedAt)}</span>
      <span style={{ fontSize: 11.5, color: '#5A5A5A', fontFamily: 'monospace' }}>
        {flightTime} min
      </span>
      <span style={{ fontSize: 11.5, color: '#5A5A5A', fontFamily: 'monospace' }}>
        {!aborted && photos > 0 ? `${photos} photos` : '—'}
      </span>
      <ChevronRight size={13} color="#C0C0C0" strokeWidth={2} />
    </button>
  )
}

export default function FlightLogPage() {
  const navigate = useNavigate()
  const { completedMissions } = useMissions()

  const sorted = [...completedMissions].sort((a, b) => b.completedAt.localeCompare(a.completedAt))
  const count = sorted.length

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      <div className="lg:hidden">
        <PageHeader
          title="Flight Log"
          onBack={() => navigate('/')}
          right={
            count > 0 && (
              <span style={{ fontSize: 12, fontWeight: 600, color: '#AAAAAA' }}>
                {count} {count === 1 ? 'flight' : 'flights'}
              </span>
            )
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0">
        {count === 0 ? (
          <EmptyState
            icon={<History size={22} color="#AAAAAA" strokeWidth={1.75} />}
            message="No completed flights yet"
          />
        ) : (
          <div
            className="bg-white border border-border rounded-card overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            {/* Header row */}
            <div
              className="grid gap-3 px-4 py-2.5 border-b border-border"
              style={{ gridTemplateColumns: COLS, background: '#FAFAFC' }}
            >
              {['Mission', 'Flown', 'Duration', 'Captures', ''].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: 9.5,
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
            {/* Flight rows */}
            {sorted.map((mission) => (
              <div key={mission.id} className="border-b border-border last:border-b-0">
                <FlightRow mission={mission} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
