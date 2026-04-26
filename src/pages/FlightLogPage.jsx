import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, CalendarCheck, Clock, Image, BarChart2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import useMissions from '../hooks/useMissions'
import { calcMetrics, BLUE, GREEN } from '../constants'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function FlightLogPage() {
  const navigate = useNavigate()
  const { completedMissions } = useMissions()

  const count = completedMissions.length

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
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

      <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-2.5 min-h-0">
        {count === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={22} color="#AAAAAA" strokeWidth={1.75} />}
            message="No completed flights yet"
          />
        ) : (
          <>
            {completedMissions.map((mission) => {
              const { flightTime, photos } = calcMetrics(
                mission.quality,
                mission.highestPointMeters,
              )
              return (
                <div
                  key={mission.id}
                  className="bg-white rounded-card border border-border flex items-center gap-3 w-full max-w-[560px] mx-auto"
                  style={{ padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <CheckCircle2
                        size={13}
                        color={GREEN}
                        strokeWidth={2.5}
                        className="flex-shrink-0"
                      />
                      <span className="font-bold text-title truncate" style={{ fontSize: '14px' }}>
                        {mission.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <CalendarCheck size={12} color="#888" strokeWidth={2} />
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {formatDate(mission.completedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} color="#888" strokeWidth={2} />
                        <span style={{ fontSize: '12px', color: '#888' }}>{flightTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image size={12} color="#888" strokeWidth={2} />
                        <span style={{ fontSize: '12px', color: '#888' }}>{photos} photos</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform select-none flex-shrink-0"
                    style={{
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'white',
                      background: BLUE,
                      border: '1px solid #2D47D9',
                      boxShadow: '0 2px 8px rgba(61,90,242,0.25)',
                    }}
                  >
                    <BarChart2 size={12} color="white" strokeWidth={2.5} />
                    Results
                  </button>
                </div>
              )
            })}

            <div className="w-full max-w-[560px] mx-auto pt-1 pb-2">
              <button
                type="button"
                disabled
                className="w-full rounded-btn border border-border"
                style={{
                  padding: '9px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#CBCBCB',
                  background: 'white',
                  cursor: 'not-allowed',
                }}
              >
                Load more
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
