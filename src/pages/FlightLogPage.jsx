import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, FolderOpen, RotateCcw, CheckCircle2, XCircle, Camera, Cpu } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import useMissions from '../hooks/useMissions'
import { calcMetrics, BLUE, RED } from '../constants'

const PAGE_SIZE = 7

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div
      className="flex items-center justify-between border-t border-border px-4"
      style={{ height: 48, background: 'white' }}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center rounded-btn transition-colors hover:bg-[#F4F5F8]"
        style={{
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 600,
          color: page === 1 ? '#C8C8C8' : '#5A5A5A',
          background: 'white',
          border: '1px solid #E0E0E0',
          cursor: page === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        Previous
      </button>
      <span style={{ fontSize: 12, color: '#9A9AB0', fontWeight: 500 }}>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center rounded-btn transition-colors hover:bg-[#F4F5F8]"
        style={{
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 600,
          color: page === totalPages ? '#C8C8C8' : '#5A5A5A',
          background: 'white',
          border: '1px solid #E0E0E0',
          cursor: page === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        Next
      </button>
    </div>
  )
}

/* ─── Desktop row ─── */
function DesktopFlightRow({ mission, photos, isLast, onResults, onRefly }) {
  const aborted = mission.status === 'aborted'

  return (
    <div
      className="grid items-center gap-4 px-5 hover:bg-[#FAFBFF] transition-colors"
      style={{
        gridTemplateColumns: 'minmax(0,3fr) 110px minmax(0,1.4fr) 80px 220px',
        borderBottom: isLast ? 'none' : '1px solid #F0F0F4',
        minHeight: 72,
      }}
    >
      {/* Name + status */}
      <div className="flex items-center gap-3 min-w-0 py-4">
        {aborted ? (
          <XCircle size={20} color={RED} strokeWidth={1.75} className="flex-shrink-0" />
        ) : (
          <CheckCircle2 size={20} color="#16A34A" strokeWidth={1.75} className="flex-shrink-0" />
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-title truncate" style={{ fontSize: 13.5 }}>
            {mission.name}
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: aborted ? RED : '#9A9AB0',
              marginTop: 3,
              fontWeight: aborted ? 600 : 400,
            }}
          >
            {aborted ? 'Aborted' : 'Complete'}
          </span>
        </div>
      </div>

      {/* Date */}
      <span style={{ fontSize: 12.5, color: '#5A5A5A' }}>{formatDate(mission.completedAt)}</span>

      {/* Processing tool */}
      <div className="flex items-center gap-1.5 min-w-0">
        <Cpu size={12} color="#AAAAAA" strokeWidth={2} className="flex-shrink-0" />
        <span className="truncate" style={{ fontSize: 12.5, color: '#5A5A5A' }}>
          {mission.app}
        </span>
      </div>

      {/* Photos */}
      <div className="flex items-center gap-1.5">
        <Camera size={12} color="#AAAAAA" strokeWidth={2} />
        <span style={{ fontSize: 12.5, color: '#5A5A5A', fontFamily: 'monospace' }}>
          {aborted ? '—' : photos}
        </span>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-2 justify-end flex-shrink-0"
        style={{ paddingLeft: 16 }}
      >
        <button
          type="button"
          onClick={onRefly}
          className="flex items-center gap-1.5 rounded-btn transition-colors hover:bg-[#EBEBEB]"
          style={{
            padding: '7px 16px',
            fontSize: 12,
            fontWeight: 600,
            color: '#5A5A5A',
            background: '#F4F5F8',
            border: '1px solid #E0E0E0',
          }}
        >
          <RotateCcw size={11} strokeWidth={2.5} />
          Refly
        </button>
        <button
          type="button"
          onClick={onResults}
          disabled={aborted}
          className="flex items-center gap-1.5 rounded-btn transition-colors"
          style={{
            padding: '7px 18px',
            fontSize: 12,
            fontWeight: 700,
            color: aborted ? '#AAAAAA' : 'white',
            background: aborted ? '#EBEBEB' : BLUE,
            border: aborted ? '1px solid #D8D8D8' : '1px solid #2D47D9',
            boxShadow: aborted ? 'none' : '0 2px 8px rgba(61,90,242,0.22)',
            cursor: aborted ? 'not-allowed' : 'pointer',
          }}
        >
          <FolderOpen size={12} strokeWidth={2} />
          Results
        </button>
      </div>
    </div>
  )
}

/* ─── Remote / mobile card ─── */
function RemoteFlightCard({ mission, photos, onResults, onRefly }) {
  const aborted = mission.status === 'aborted'

  return (
    <div
      className="bg-white rounded-card border border-border w-full max-w-[560px] mx-auto flex items-center gap-3 px-4 flex-shrink-0"
      style={{ minHeight: 64, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {aborted ? (
        <XCircle size={20} color={RED} strokeWidth={1.75} className="flex-shrink-0" />
      ) : (
        <CheckCircle2 size={20} color="#16A34A" strokeWidth={1.75} className="flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0 py-3.5">
        <span className="font-bold text-title block truncate" style={{ fontSize: 13.5 }}>
          {mission.name}
        </span>
        <span style={{ fontSize: 10.5, color: '#9A9AB0', marginTop: 2, display: 'block' }}>
          {formatDate(mission.completedAt)} ·{' '}
          <span style={{ color: aborted ? RED : '#9A9AB0', fontWeight: aborted ? 600 : 400 }}>
            {aborted ? 'Aborted' : `${photos} photos`}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={onRefly}
          className="flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform"
          style={{
            padding: '7px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#5A5A5A',
            background: '#F4F5F8',
            border: '1px solid #E0E0E0',
          }}
        >
          <RotateCcw size={11} strokeWidth={2.5} />
          Refly
        </button>
        <button
          type="button"
          onClick={onResults}
          disabled={aborted}
          className="flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform"
          style={{
            padding: '7px 13px',
            fontSize: 12,
            fontWeight: 700,
            color: aborted ? '#AAAAAA' : 'white',
            background: aborted ? '#EBEBEB' : BLUE,
            border: aborted ? '1px solid #D8D8D8' : '1px solid #2D47D9',
            boxShadow: aborted ? 'none' : '0 2px 8px rgba(61,90,242,0.25)',
            cursor: aborted ? 'not-allowed' : 'pointer',
          }}
        >
          <FolderOpen size={12} strokeWidth={2} />
          Results
        </button>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function FlightLogPage() {
  const navigate = useNavigate()
  const { completedMissions } = useMissions()
  const [desktopPage, setDesktopPage] = useState(1)
  const [remoteVisible, setRemoteVisible] = useState(PAGE_SIZE)

  const sorted = [...completedMissions].sort((a, b) => b.completedAt.localeCompare(a.completedAt))
  const count = sorted.length

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const safePage = Math.min(desktopPage, totalPages)
  const pagedFlights = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const visibleFlights = sorted.slice(0, remoteVisible)
  const hasMoreRemote = remoteVisible < count

  function handleResults() {
    // wire to results page when available
  }

  function handleRefly() {
    // wire to wizard/ready when available
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      {/* ══ Remote / small-screen ══ */}
      <div className="lg:hidden flex-shrink-0">
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

      <div className="lg:hidden flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-2.5 min-h-0">
        {count === 0 ? (
          <EmptyState
            icon={<History size={22} color="#AAAAAA" strokeWidth={1.75} />}
            message="No completed flights yet"
          />
        ) : (
          <>
            {visibleFlights.map((mission) => {
              const { photos } = calcMetrics(mission.quality, mission.highestPointMeters)
              return (
                <RemoteFlightCard
                  key={mission.id}
                  mission={mission}
                  photos={photos}
                  onResults={() => handleResults(mission)}
                  onRefly={() => handleRefly(mission)}
                />
              )
            })}
            {hasMoreRemote && (
              <button
                type="button"
                onClick={() => setRemoteVisible((v) => v + PAGE_SIZE)}
                className="w-full max-w-[560px] mx-auto rounded-card active:scale-[0.98] transition-transform flex-shrink-0"
                style={{
                  padding: '11px',
                  border: '1px solid #E0E0E0',
                  background: 'white',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#5A5A5A',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                Load more ({count - remoteVisible} remaining)
              </button>
            )}
          </>
        )}
      </div>

      {/* ══ Desktop ══ */}
      <div className="hidden lg:flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto" style={{ maxWidth: 1180, padding: '40px 32px 56px' }}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h1
                  className="text-title font-bold"
                  style={{
                    fontSize: 28,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.2,
                    margin: '6px 0 0',
                  }}
                >
                  Flight Log
                </h1>
                <p style={{ fontSize: 13.5, color: '#5A5A5A', margin: '5px 0 0' }}>
                  {count > 0
                    ? `${count} flight${count > 1 ? 's' : ''} recorded`
                    : 'No completed flights yet'}
                </p>
              </div>
            </div>

            {count === 0 ? (
              <div
                className="bg-white rounded-card border border-border flex items-center justify-center"
                style={{ minHeight: 220, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <EmptyState
                  icon={<History size={24} color="#AAAAAA" strokeWidth={1.75} />}
                  message="No completed flights yet"
                />
              </div>
            ) : (
              <div
                className="bg-white rounded-card border border-border overflow-hidden"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="grid gap-4 px-5 py-2.5 border-b border-border"
                  style={{
                    gridTemplateColumns: 'minmax(0,3fr) 110px minmax(0,1.4fr) 80px 220px',
                    background: '#FAFAFC',
                  }}
                >
                  {['Flight', 'Date', 'Processing', 'Photos', ''].map((h) => (
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

                {pagedFlights.map((mission, i) => {
                  const { photos } = calcMetrics(mission.quality, mission.highestPointMeters)
                  return (
                    <DesktopFlightRow
                      key={mission.id}
                      mission={mission}
                      photos={photos}
                      isLast={i === pagedFlights.length - 1}
                      onResults={() => handleResults(mission)}
                      onRefly={() => handleRefly(mission)}
                    />
                  )
                })}
                <Pagination page={safePage} totalPages={totalPages} onChange={setDesktopPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
