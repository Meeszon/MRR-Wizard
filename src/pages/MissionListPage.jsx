import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  Settings,
  Plus,
  FolderOpen,
  Clock,
  Battery,
  Trash2,
  Layers,
  AlertCircle,
  X,
  LandPlot,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import useMissions from '../hooks/useMissions'
import useWizard from '../hooks/useWizard'
import { calcMetrics, BLUE, RED } from '../constants'

const PAGE_SIZE = 7

function QualityBar({ quality }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          flex: 1,
          height: 4,
          background: '#EBEBEB',
          borderRadius: 2,
          overflow: 'hidden',
          minWidth: 48,
        }}
      >
        <div
          style={{
            width: `${quality}%`,
            height: '100%',
            background: 'rgba(61,90,242,0.5)',
            borderRadius: 2,
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: '#5A5A5A', minWidth: 28, fontFamily: 'monospace' }}>
        {quality}%
      </span>
    </div>
  )
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
function DesktopMissionRow({
  mission,
  flightTime,
  batteryNeed,
  feasible,
  isConfirming,
  isLast,
  onEdit,
  onStart,
  onDelete,
  onCancelDelete,
}) {
  return (
    <div
      className="grid items-center gap-4 px-5 hover:bg-[#FAFBFF] transition-colors"
      style={{
        gridTemplateColumns: 'minmax(0,3fr) 80px 130px 100px 110px 210px',
        borderBottom: isLast ? 'none' : '1px solid #F0F0F4',
        minHeight: 72,
      }}
    >
      {/* Name + app */}
      <div className="flex items-center gap-3 min-w-0 py-4">
        <LandPlot size={26} color="#C8CDD8" strokeWidth={1.5} className="flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-title truncate" style={{ fontSize: 13.5 }}>
            {mission.name}
          </span>
          <span style={{ fontSize: 10.5, color: '#9A9AB0', marginTop: 3 }}>
            {mission.app}
            {mission.rtkEnabled ? ' · RTK' : ''}
          </span>
        </div>
      </div>

      {/* Area */}
      <div className="flex items-center gap-1">
        <Layers size={12} color="#AAAAAA" strokeWidth={2} />
        <span style={{ fontSize: 12.5, color: '#5A5A5A', fontFamily: 'monospace' }}>
          {mission.areaHectares} ha
        </span>
      </div>

      {/* Quality */}
      <QualityBar quality={mission.quality} />

      {/* Flight time */}
      <div className="flex items-center gap-1.5">
        <Clock size={12} color="#AAAAAA" strokeWidth={2} />
        <span style={{ fontSize: 12.5, color: '#5A5A5A', fontFamily: 'monospace' }}>
          {flightTime} min
        </span>
      </div>

      {/* Battery */}
      <div className="flex items-center gap-1.5">
        <Battery size={12} color={feasible ? '#AAAAAA' : RED} strokeWidth={2} />
        <span
          style={{
            fontSize: 12.5,
            color: feasible ? '#5A5A5A' : RED,
            fontFamily: 'monospace',
            fontWeight: feasible ? 400 : 600,
          }}
        >
          -{batteryNeed}%
        </span>
        {!feasible && (
          <AlertCircle size={12} color={RED} strokeWidth={2} className="flex-shrink-0" />
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-2 justify-end flex-shrink-0"
        style={{ paddingLeft: 24 }}
      >
        {isConfirming ? (
          <>
            <button
              type="button"
              onClick={onCancelDelete}
              className="flex items-center gap-1 rounded-btn transition-colors"
              style={{
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: '#5A5A5A',
                background: '#F4F4F4',
                border: '1px solid #E0E0E0',
              }}
            >
              <X size={11} strokeWidth={2.5} />
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1 rounded-btn transition-colors"
              style={{
                padding: '6px 11px',
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
                background: RED,
                border: `1px solid #C93E4A`,
              }}
            >
              <Trash2 size={11} strokeWidth={2.5} />
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center justify-center rounded-btn transition-colors hover:bg-[#FFF0F1] hover:border-[#F0C0C4]"
              style={{
                width: 34,
                height: 34,
                color: '#C0C0C0',
                border: '1px solid #E8E8E8',
                background: '#FAFAFA',
                flexShrink: 0,
              }}
              title="Delete mission"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={onEdit}
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
              <Settings size={12} strokeWidth={2} />
              Edit
            </button>
            <button
              type="button"
              onClick={onStart}
              disabled={!feasible}
              className="flex items-center gap-1.5 rounded-btn transition-colors"
              style={{
                padding: '7px 18px',
                fontSize: 12,
                fontWeight: 700,
                color: feasible ? 'white' : '#AAAAAA',
                background: feasible ? BLUE : '#EBEBEB',
                border: feasible ? '1px solid #2D47D9' : '1px solid #D8D8D8',
                boxShadow: feasible ? '0 2px 8px rgba(61,90,242,0.22)' : 'none',
                cursor: feasible ? 'pointer' : 'not-allowed',
              }}
            >
              <Play size={11} fill={feasible ? 'white' : '#AAAAAA'} strokeWidth={0} />
              Start
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Mobile/Remote row ─── */
function RemoteMissionRow({
  mission,
  flightTime,
  batteryNeed,
  feasible,
  isConfirming,
  onEdit,
  onStart,
  onDelete,
  onCancelDelete,
}) {
  return (
    <div
      className="bg-white rounded-card border border-border w-full max-w-[560px] mx-auto flex items-center gap-3 px-4 flex-shrink-0"
      style={{ minHeight: 64, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <LandPlot size={26} color="#C8CDD8" strokeWidth={1.5} className="flex-shrink-0" />
      <div className="flex-1 min-w-0 py-3.5">
        <span className="font-bold text-title block truncate" style={{ fontSize: 13.5 }}>
          {mission.name}
        </span>
        <span style={{ fontSize: 10.5, color: '#9A9AB0', marginTop: 3, display: 'block' }}>
          {mission.rtkEnabled ? 'RTK' : 'No RTK'} · {flightTime} min ·{' '}
          <span style={{ color: feasible ? '#9A9AB0' : RED, fontWeight: feasible ? 400 : 600 }}>
            -{batteryNeed}%{!feasible ? ' · Insufficient' : ''}
          </span>
        </span>
      </div>

      {isConfirming ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onCancelDelete}
            className="flex items-center gap-1 rounded-btn"
            style={{
              padding: '7px 10px',
              fontSize: 11.5,
              fontWeight: 600,
              color: '#5A5A5A',
              background: '#F4F4F4',
              border: '1px solid #E0E0E0',
            }}
          >
            <X size={11} strokeWidth={2.5} />
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 rounded-btn"
            style={{
              padding: '7px 11px',
              fontSize: 11.5,
              fontWeight: 700,
              color: 'white',
              background: RED,
              border: `1px solid #C93E4A`,
            }}
          >
            <Trash2 size={11} strokeWidth={2.5} />
            Delete
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center rounded-btn active:scale-95 transition-transform"
            style={{
              width: 32,
              height: 32,
              background: '#FAFAFA',
              border: '1px solid #E8E8E8',
              color: '#C0C0C0',
              flexShrink: 0,
            }}
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onEdit}
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
            <Settings size={12} strokeWidth={2} />
            Edit
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={!feasible}
            className="flex items-center gap-1.5 rounded-btn transition-transform select-none"
            style={{
              padding: '7px 13px',
              fontSize: 12,
              fontWeight: 700,
              color: feasible ? 'white' : '#AAAAAA',
              background: feasible ? BLUE : '#EBEBEB',
              border: feasible ? '1px solid #2D47D9' : '1px solid #D8D8D8',
              boxShadow: feasible ? '0 2px 8px rgba(61,90,242,0.25)' : 'none',
              cursor: feasible ? 'pointer' : 'not-allowed',
            }}
          >
            <Play size={11} fill={feasible ? 'white' : '#AAAAAA'} strokeWidth={0} />
            Start
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── New mission card ─── */
function NewMissionCard({ onNew }) {
  return (
    <button
      type="button"
      onClick={onNew}
      className="flex items-center gap-3 w-full max-w-[560px] mx-auto rounded-card active:scale-[0.98] transition-transform select-none bg-white flex-shrink-0"
      style={{
        padding: '11px 13px',
        border: `1.5px solid rgba(61, 91, 242, 0.32)`,
        boxShadow: '0 2px 10px rgba(61, 91, 242, 0.05)',
      }}
    >
      <div
        className="flex items-center justify-center rounded-btn flex-shrink-0"
        style={{ width: 32, height: 32, background: 'rgba(61,90,242,0.10)' }}
      >
        <Plus size={16} color={BLUE} strokeWidth={2.5} />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: BLUE }}>New Mission</span>
    </button>
  )
}

/* ─── Page ─── */
export default function MissionListPage() {
  const navigate = useNavigate()
  const { missions, setLastMissionName, deleteMission } = useMissions()
  const { startEditWizard, startNewWizard } = useWizard()
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [desktopPage, setDesktopPage] = useState(1)
  const [remoteVisible, setRemoteVisible] = useState(PAGE_SIZE)

  const totalPages = Math.max(1, Math.ceil(missions.length / PAGE_SIZE))
  const safePage = Math.min(desktopPage, totalPages)
  const pagedMissions = missions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const visibleMissions = missions.slice(0, remoteVisible)
  const hasMoreRemote = remoteVisible < missions.length

  useEffect(() => {
    if (confirmDeleteId == null) return undefined
    const t = setTimeout(() => setConfirmDeleteId(null), 3500)
    return () => clearTimeout(t)
  }, [confirmDeleteId])

  useEffect(() => {
    if (safePage !== desktopPage) setDesktopPage(safePage)
  }, [safePage, desktopPage])

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

  function handleDeleteClick(id) {
    if (confirmDeleteId === id) {
      deleteMission(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
    }
  }

  const count = missions.length

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      {/* ══ Remote / small-screen ══ */}
      <div className="lg:hidden flex-shrink-0">
        <PageHeader
          title="Missions"
          onBack={() => navigate('/')}
          right={
            count > 0 && (
              <span style={{ fontSize: 12, fontWeight: 600, color: '#AAAAAA' }}>
                {count} {count === 1 ? 'mission' : 'missions'}
              </span>
            )
          }
        />
      </div>

      <div className="lg:hidden flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-2.5 min-h-0">
        <NewMissionCard onNew={() => handleNewMission()} />
        {count === 0 ? (
          <EmptyState
            icon={<FolderOpen size={22} color="#AAAAAA" strokeWidth={1.75} />}
            message="No missions created yet"
          />
        ) : (
          <>
            {visibleMissions.map((mission) => {
              const { flightTime, batteryNeed, feasible } = calcMetrics(
                mission.quality,
                mission.highestPointMeters,
              )
              return (
                <RemoteMissionRow
                  key={mission.id}
                  mission={mission}
                  flightTime={flightTime}
                  batteryNeed={batteryNeed}
                  feasible={feasible}
                  isConfirming={confirmDeleteId === mission.id}
                  onEdit={() => handleEdit(mission)}
                  onStart={() => feasible && handleStart(mission)}
                  onDelete={() => handleDeleteClick(mission.id)}
                  onCancelDelete={() => setConfirmDeleteId(null)}
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
            {/* Page header */}
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
                  Saved Missions
                </h1>
                <p style={{ fontSize: 13.5, color: '#5A5A5A', margin: '5px 0 0' }}>
                  {count > 0
                    ? `${count} mission${count > 1 ? 's' : ''} ready to plan or fly`
                    : 'No missions created yet'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNewMission}
                className="flex items-center gap-2 rounded-btn hover-lift"
                style={{
                  padding: '10px 18px',
                  background: BLUE,
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: '0 2px 10px rgba(61,90,242,0.28)',
                  border: '1px solid #2D47D9',
                }}
              >
                <Plus size={15} strokeWidth={2.5} />
                New Mission
              </button>
            </div>

            {count === 0 ? (
              <div
                className="bg-white rounded-card border border-border flex items-center justify-center"
                style={{ minHeight: 220, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <EmptyState
                  icon={<FolderOpen size={24} color="#AAAAAA" strokeWidth={1.75} />}
                  message="No missions created yet"
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
                    gridTemplateColumns: 'minmax(0,3fr) 80px 130px 100px 110px 210px',
                    background: '#FAFAFC',
                  }}
                >
                  {['Mission', 'Area', 'Quality', 'Est. time', 'Battery', ''].map((h) => (
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
                {pagedMissions.map((mission, i) => {
                  const { flightTime, batteryNeed, feasible } = calcMetrics(
                    mission.quality,
                    mission.highestPointMeters,
                  )
                  return (
                    <DesktopMissionRow
                      key={mission.id}
                      mission={mission}
                      flightTime={flightTime}
                      batteryNeed={batteryNeed}
                      feasible={feasible}
                      isConfirming={confirmDeleteId === mission.id}
                      isLast={i === pagedMissions.length - 1}
                      onEdit={() => handleEdit(mission)}
                      onStart={() => feasible && handleStart(mission)}
                      onDelete={() => handleDeleteClick(mission.id)}
                      onCancelDelete={() => setConfirmDeleteId(null)}
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
