import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Settings, Plus, FolderOpen, Locate, Clock, Battery } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import useMissions from '../hooks/useMissions'
import useWizard from '../hooks/useWizard'
import { calcMetrics, BLUE } from '../constants'

export default function MissionListPage() {
  const navigate = useNavigate()
  const { missions, setLastMissionName } = useMissions()
  const { startEditWizard, startNewWizard } = useWizard()

  function handleEdit(mission) {
    startEditWizard(mission)
    navigate('/missions/edit')
  }

  function handleStart(mission) {
    setLastMissionName(mission.name)
    navigate('/wizard/ready')
  }

  function handleNewMission() {
    startNewWizard()
    navigate('/wizard/step1')
  }

  const count = missions.length

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      <PageHeader
        title="My Missions"
        onBack={() => navigate('/')}
        right={
          count > 0 && (
            <span style={{ fontSize: 12, fontWeight: 600, color: '#AAAAAA' }}>
              {count} {count === 1 ? 'mission' : 'missions'}
            </span>
          )
        }
      />

      <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-2.5 min-h-0">
        <NewMissionCard onNew={() => handleNewMission()} />
        {count === 0 ? (
          <EmptyState
            icon={<FolderOpen size={22} color="#AAAAAA" strokeWidth={1.75} />}
            message="No missions created yet"
          />
        ) : (
          missions.map((mission) => {
            const { flightTime, batteryNeed, feasible } = calcMetrics(
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
                    <Locate size={13} color={BLUE} strokeWidth={2} className="flex-shrink-0" />
                    <span className="font-bold text-title truncate" style={{ fontSize: '14px' }}>
                      {mission.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Clock size={12} color="#888" strokeWidth={2} />
                      <span style={{ fontSize: '12px', color: '#888' }}>{flightTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Battery size={12} color={feasible ? '#888' : '#E0515F'} strokeWidth={2} />
                      <span
                        style={{
                          fontSize: '12px',
                          color: feasible ? '#888' : '#E0515F',
                          fontWeight: feasible ? 400 : 600,
                        }}
                      >
                        -{batteryNeed}%
                      </span>
                      {!feasible && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#E0515F',
                            background: 'rgba(224,81,95,0.1)',
                            border: '1px solid rgba(224,81,95,0.25)',
                            borderRadius: '4px',
                            padding: '1px 5px',
                          }}
                        >
                          Insufficient
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(mission)}
                    className="flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform select-none bg-bg-secondary border border-border"
                    style={{
                      padding: '7px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#5A5A5A',
                    }}
                  >
                    <Settings size={13} strokeWidth={2} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => feasible && handleStart(mission)}
                    disabled={!feasible}
                    className="flex items-center gap-1.5 rounded-btn transition-transform select-none"
                    style={{
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: feasible ? 'white' : '#AAAAAA',
                      background: feasible ? BLUE : '#EBEBEB',
                      border: feasible ? '1px solid #2D47D9' : '1px solid #D8D8D8',
                      boxShadow: feasible ? '0 2px 8px rgba(61,90,242,0.25)' : 'none',
                      cursor: feasible ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Play size={12} fill={feasible ? 'white' : '#AAAAAA'} strokeWidth={0} />
                    Start
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function NewMissionCard({ onNew }) {
  return (
    <button
      type="button"
      onClick={onNew}
      className="flex items-center gap-3 w-full max-w-[560px] mx-auto rounded-card active:scale-[0.98] transition-transform select-none bg-white"
      style={{
        padding: '12px 14px',
        border: `1.5px solid rgba(61, 91, 242, 0.36)`,
        boxShadow: '0 2px 10px rgba(61, 91, 242, 0.05)',
      }}
    >
      <div
        className="flex items-center justify-center rounded-btn flex-shrink-0"
        style={{ width: '32px', height: '32px', background: 'rgba(61,90,242,0.10)' }}
      >
        <Plus size={17} color={BLUE} strokeWidth={2.5} />
      </div>
      <span style={{ fontSize: '14px', fontWeight: 700, color: BLUE }}>New Mission</span>
    </button>
  )
}
